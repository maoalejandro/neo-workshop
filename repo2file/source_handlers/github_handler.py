import os
import fnmatch
from typing import List, Dict
from github import Github
from github.GithubException import GithubException
from .base_handler import BaseSourceHandler
from utils import logger, decode_file_content


class GitHubRepositoryHandler(BaseSourceHandler):
    def __init__(self, repo_url: str):
        self.repo_url = repo_url
        self.github_token = os.getenv("GITHUB_TOKEN")
        self.github = Github(self.github_token)
        self.repo = self._get_repo()

    def _get_repo(self):
        try:
            return self.github.get_repo('/'.join(self.repo_url.split('/')[-2:]))
        except GithubException as e:
            logger.error(f"Error accessing GitHub repository: {e}")
            raise

    def get_structure(self, ignore_patterns: List[str], ignore_folders: List[str],
                      include_extensions: List[str]) -> str:
        """
        Generate a string representation of the repository structure.

        Args:
            ignore_patterns (List[str]): List of file patterns to ignore.
            ignore_folders (List[str]): List of folder names to ignore.
            include_extensions (List[str]): List of file extensions to include.

        Returns:
            str: A string representation of the repository structure.
        """
        return self._print_repo_structure("", 0, ignore_patterns, ignore_folders, include_extensions)

    def get_files_info(self, ignore_patterns: List[str], ignore_folders: List[str], include_extensions: List[str]) -> \
    List[Dict]:
        """
        Collect information about files in the repository.

        Args:
            ignore_patterns (List[str]): List of file patterns to ignore.
            ignore_folders (List[str]): List of folder names to ignore.
            include_extensions (List[str]): List of file extensions to include.

        Returns:
            List[Dict]: A list of dictionaries, each containing information about a file.
        """
        files_info = []
        self._traverse_repo_contents("", ignore_patterns, ignore_folders, include_extensions, files_info)
        return files_info

    def _print_repo_structure(self, path: str, level: int, ignore_patterns: List[str], ignore_folders: List[str],
                              include_extensions: List[str]) -> str:
        """
        Recursively print the repository structure.

        Args:
            path (str): The current path in the repository.
            level (int): The current depth level in the tree (used for indentation).
            ignore_patterns (List[str]): List of file patterns to ignore.
            ignore_folders (List[str]): List of folder names to ignore.
            include_extensions (List[str]): List of file extensions to include.

        Returns:
            str: A string representation of the repository structure.
        """
        tree_structure = ""
        try:
            contents = self.repo.get_contents(path)
        except GithubException as e:
            logger.error(f"Error accessing repository contents: {e}")
            return tree_structure

        filtered_contents = [
            content for content in contents
            if not any(fnmatch.fnmatch(content.name, pattern) for pattern in ignore_patterns)
               and content.name not in ignore_folders
        ]

        for index, content in enumerate(filtered_contents):
            is_last = index == len(filtered_contents) - 1
            prefix = "└── " if is_last else "├── "
            indent = "    " * level

            if content.type == 'file':
                if not include_extensions or any(content.name.endswith(ext) for ext in include_extensions):
                    tree_structure += f"{indent}{prefix}{content.name}\n"
            elif content.type == 'dir':
                tree_structure += f"{indent}{prefix}📂 {content.name}\n"
                tree_structure += self._print_repo_structure(content.path, level + 1, ignore_patterns, ignore_folders,
                                                             include_extensions)

        return tree_structure

    def _traverse_repo_contents(self, path: str, ignore_patterns: List[str], ignore_folders: List[str],
                                include_extensions: List[str], files_info: List[Dict]):
        """
        Recursively traverse the repository contents and collect file information.

        Args:
            path (str): The current path in the repository.
            ignore_patterns (List[str]): List of file patterns to ignore.
            ignore_folders (List[str]): List of folder names to ignore.
            include_extensions (List[str]): List of file extensions to include.
            files_info (List[Dict]): List to store file information.
        """
        try:
            contents = self.repo.get_contents(path)
        except GithubException as e:
            logger.error(f"Error accessing repository contents: {e}")
            return

        for content in contents:
            if content.type == 'dir' and content.name not in ignore_folders:
                self._traverse_repo_contents(content.path, ignore_patterns, ignore_folders, include_extensions,
                                             files_info)
            elif content.type == 'file' and not any(
                    fnmatch.fnmatch(content.name, pattern) for pattern in ignore_patterns):
                file_extension = os.path.splitext(content.name)[1]
                if not include_extensions or file_extension in include_extensions:
                    file_content = decode_file_content(content.content)
                    if file_content:
                        files_info.append({
                            'path': content.path,
                            'code': file_content,
                            'file_extension': file_extension[1:]  # Remove the leading dot
                        })
