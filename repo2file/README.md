# Project Structure Generator

A powerful Python tool to generate a comprehensive markdown file of your project structure, including file contents and various customization options. It supports both local directories and GitHub repositories.

## 🚀 Features

- 📂 Generate a tree-like structure of your project directory or GitHub repository
- 📄 Include file contents in the output
- 🚫 Ignore specific files, patterns, and folders
- 📎 Copy output to clipboard
- 🔢 Count tokens in the generated output
- ☁️ Upload the generated file to a MagnifAI server
- 🔍 Filter files by extension
- 🐙 Support for GitHub repositories

## 📋 Prerequisites

- Python 3.7 or higher
- Dependencies listed in `requirements.txt`

## 🛠️ Installation

1. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Set up environment variables:
   - Create a `.env` file in the project root
   - Add the following variables:
     ```
     USER_TEST=your_magnifai_username
     PASS=your_magnifai_password
     GITHUB_TOKEN=your_github_token
     ```

## 🔑 Environment Variables

- `USER_TEST` and `PASS`: These are your MagnifAI credentials used for authentication when uploading files to the MagnifAI server. Contact your MagnifAI administrator if you don't have these credentials.
- `GITHUB_TOKEN`: This is used for authenticating with GitHub when accessing private repositories or to increase API rate limits.

### How to obtain a GitHub token:

1. Go to your GitHub account settings.
2. Click on "Developer settings" in the left sidebar.
3. Click on "Personal access tokens" and then "Tokens (classic)".
4. Click "Generate new token" and select "Generate new token (classic)".
5. Give your token a descriptive name and select the necessary scopes (at least `repo` for private repositories).
6. Click "Generate token" at the bottom of the page.
7. Copy the generated token and add it to your `.env` file as `GITHUB_TOKEN=your_token_here`.

**Note**: Keep your GitHub token and MagnifAI credentials secret. Never share them or commit them to version control.

## 🖥️ Usage

The project now uses a single command-line interface for both local directories and GitHub repositories.

Basic usage:

```
python repo2file.py /path/to/your/project
```

or

```
python repo2file.py https://github.com/username/repo
```

Advanced usage with options:

```
python repo2file.py /path/to/your/project --ignore "*.pyc,*.log" --ignore-folders "node_modules,dist" --output "project_structure.txt" --clipboard --count-tokens --include ".py,.js,.html" --upload
```

### 🎛️ Command-line Options

- `source`: The project directory path or GitHub repository URL to analyze (required)
- `--ignore`: File patterns to ignore, separated by commas
- `--ignore-file`: Path to a file containing patterns to ignore, one per line
- `--ignore-folders`: Folder names to ignore, separated by commas
- `--output`: Output file path (default: 'project_structure.md')
- `--clipboard`: Copy the result to the clipboard
- `--count-tokens`: Count the number of tokens in the output
- `--upload`: Upload the generated file to the MagnifAI server (requires `USER` and `PASS` env variables)
- `--include`: File extensions to include, separated by commas

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/project-structure-generator/issues).

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgements

- [pybars](https://github.com/wbond/pybars3) for Handlebars templating in Python
- [tiktoken](https://github.com/openai/tiktoken) for token counting
- [pyperclip](https://github.com/asweigart/pyperclip) for clipboard operations
- [PyGithub](https://github.com/PyGithub/PyGithub) for GitHub API interactions

---

Made with ❤️ by the MagnifAI Team