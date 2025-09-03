import argparse
import os
from typing import List
from dotenv import load_dotenv
from source_handlers.local_handler import LocalDirectoryHandler
from source_handlers.github_handler import GitHubRepositoryHandler
from utils import generate_markdown, logger, read_ignore_patterns_from_file

# Load environment variables
load_dotenv()


def main():
    parser = argparse.ArgumentParser(
        description="Generate a markdown file with the project structure and file contents from a local directory or GitHub repository."
    )
    parser.add_argument('source', type=str, help="Local directory path or GitHub repository URL")
    parser.add_argument('--ignore', type=str,
                        help="File patterns to ignore, separated by commas. Example: '*.class,*.py'")
    parser.add_argument('--ignore-file', type=str, help="Path to a file containing patterns to ignore, one per line.")
    parser.add_argument('--ignore-folders', type=str,
                        help="Folder names to ignore, separated by commas. Example: 'node_modules,dist'")
    parser.add_argument('--output', type=str, default='project_structure.txt',
                        help="Output file path. Default is 'project_structure.txt'.")
    parser.add_argument('--clipboard', action='store_true', help="Copy the result to the clipboard.")
    parser.add_argument('--count-tokens', action='store_true', help="Count the number of tokens in the output.")
    parser.add_argument('--upload', action='store_true', help="Upload the generated file to the MagnifAI server.")
    parser.add_argument('--include', type=str,
                        help="File extensions to include, separated by commas. Example: '.java,.py,.txt'")

    args = parser.parse_args()

    # Process ignore patterns and folders
    ignore_patterns: List[str] = args.ignore.split(',') if args.ignore else []
    ignore_patterns.extend(read_ignore_patterns_from_file(args.ignore_file))
    ignore_folders: List[str] = args.ignore_folders.split(',') if args.ignore_folders else []
    include_extensions: List[str] = args.include.split(',') if args.include else []

    # Determine the appropriate handler based on the source
    if args.source.startswith(('https://github.com', 'http://github.com')):
        handler = GitHubRepositoryHandler(args.source)
        project_name = '/'.join(args.source.split('/')[-2:])
    else:
        handler = LocalDirectoryHandler(args.source)
        project_name = os.path.basename(os.path.abspath(args.source))

    try:
        source_tree = handler.get_structure(ignore_patterns, ignore_folders, include_extensions)
        files_info = handler.get_files_info(ignore_patterns, ignore_folders, include_extensions)
    except Exception as e:
        logger.error(f"Error processing the source: {e}")
        return

    generate_markdown(project_name, source_tree, files_info, args.output, args.clipboard, args.count_tokens,
                      args.upload)


if __name__ == "__main__":
    main()
