import base64
import html
import logging
import os
from typing import List, Dict

import pybars
import pyperclip
import requests
import tiktoken
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

TEMPLATE = """
# 📂 Project: {{ project_name }}

## 🌳 Source Tree:

{{ source_tree }}

## 📁 Files:

{{#each files}} 
{{#if code}} 
### 📜 File: `{{path}}`:

```{{file_extension}}
{{code}}
```
---
{{/if}}
{{/each}}
"""

BASE_URL = "cloud.magnifai.es"


def generate_markdown(project_name: str, source_tree: str, files_info: List[Dict],
                      output_file: str, copy_to_clipboard: bool, count_tokens: bool,
                      upload_to_server: bool) -> None:
    """
    Generate a markdown file containing the project structure and file contents.

    Args:
        project_name (str): The name of the project.
        source_tree (str): A string representation of the project's directory structure.
        files_info (List[Dict]): A list of dictionaries containing file information.
        output_file (str): The path where the generated markdown file will be saved.
        copy_to_clipboard (bool): Whether to copy the generated markdown to the clipboard.
        count_tokens (bool): Whether to count and display the number of tokens in the generated markdown.
        upload_to_server (bool): Whether to upload the generated file to the server.
    """
    data = {
        'project_name': project_name,
        'source_tree': source_tree,
        'files': files_info
    }

    compiler = pybars.Compiler()
    compiled_template = compiler.compile(TEMPLATE)
    result = compiled_template(data)
    result = html.unescape(result)

    save_markdown_to_file(result, output_file)

    if copy_to_clipboard:
        copy_markdown_to_clipboard(result, output_file)

    if count_tokens:
        display_token_count(result)

    if upload_to_server:
        auth_token = get_auth_token()
        if auth_token:
            upload_file_to_server(output_file, auth_token)
        else:
            logger.error("Failed to obtain auth token. File upload aborted.")


def save_markdown_to_file(markdown: str, output_file: str) -> None:
    """
    Save the generated markdown content to a file.

    Args:
        markdown (str): The markdown content to save.
        output_file (str): The path of the file to save the content to.
    """
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(markdown)
    logger.info(f"The result has been saved in {output_file}")


def copy_markdown_to_clipboard(markdown: str, output_file: str) -> None:
    """
    Copy the generated markdown content to the clipboard.

    Args:
        markdown (str): The markdown content to copy.
        output_file (str): The path of the file where the content was saved (for logging purposes).
    """
    pyperclip.copy(markdown)
    logger.info(f"The result has been copied to the clipboard and saved in {output_file}")


def display_token_count(markdown: str) -> None:
    """
    Display the token count of the generated markdown content.

    Args:
        markdown (str): The markdown content to count tokens for.
    """
    encoding = tiktoken.get_encoding("cl100k_base")
    token_count = len(encoding.encode(markdown))
    logger.info(f"Token Count: {token_count}")


def get_auth_token() -> str:
    """
    Obtain an authentication token using environment variables.

    Returns:
        str: The authentication token if successful, None otherwise.

    Raises:
        requests.RequestException: If there's an error in the HTTP request.
    """
    user = os.getenv('USER_TEST')
    password = os.getenv('PASS')

    print(f'USER = {user}')
    print (f'PASS = {password}')

    if not all([user, password]):
        logger.error("Missing required environment variables")
        return None

    url = f"https://auth-{BASE_URL}/realms/aut/protocol/openid-connect/token"
    data = {
        'client_id': 'aut-sdk',
        'username': user,
        'password': password,
        'grant_type': 'password'
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    try:
        response = requests.post(url, data=data, headers=headers)
        response.raise_for_status()
        return response.json()['access_token']
    except requests.RequestException as error:
        logger.error(f"Error obtaining auth token: {error}")
        return None


def upload_file_to_server(file_path: str, auth_token: str) -> None:
    """
    Upload a file to the server using the provided authentication token.

    Args:
        file_path (str): The path of the file to upload.
        auth_token (str): The authentication token for the server.

    Raises:
        requests.RequestException: If there's an error in the HTTP request.
    """
    url = f'https://{BASE_URL}/aut-foundations-api/documents/search/profile/Assistant/document'
    headers = {
        'accept': 'application/json, text/plain, */*',
        'authorization': f'Bearer {auth_token}',
        'origin': f'https://{BASE_URL}',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    }

    with open(file_path, 'rb') as file:
        files = {'file': (file_path, file, 'text/plain')}
        response = requests.post(url, headers=headers, files=files)

    if response.status_code == 200:
        logger.info(f"File uploaded successfully to {url}")
    else:
        logger.error(f"Failed to upload file. Status code: {response.status_code}")
        logger.error(f"Response: {response.text}")


def read_ignore_patterns_from_file(file_path: str) -> List[str]:
    """
    Read ignore patterns from a file.

    Args:
        file_path (str): The path to the file containing ignore patterns.

    Returns:
        List[str]: A list of ignore patterns read from the file.

    Raises:
        IOError: If there's an error reading the file.
    """
    if not file_path:
        return []

    try:
        with open(file_path, 'r') as file:
            return [line.strip() for line in file if line.strip()]
    except IOError as e:
        logger.error(f"Error reading ignore file: {e}")
        return []


def decode_file_content(content: str) -> str:
    """
    Decode base64 encoded file content.

    Args:
        content (str): The base64 encoded content of a file.

    Returns:
        str: The decoded file content as a string.

    Raises:
        UnicodeDecodeError: If there's an error decoding the content.
    """
    try:
        return base64.b64decode(content).decode('utf-8')
    except UnicodeDecodeError:
        logger.error(f"Error decoding file content")
        return ""
