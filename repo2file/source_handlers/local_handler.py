import os
import fnmatch
from typing import List, Dict
from .base_handler import BaseSourceHandler
from utils import logger


class LocalDirectoryHandler(BaseSourceHandler):
    def __init__(self, directory: str):
        self.directory = os.path.abspath(directory)

    def get_structure(self, ignore_patterns: List[str], ignore_folders: List[str],
                      include_extensions: List[str]) -> str:
        """
        Generate a string representation of the directory structure.

        Args:
            ignore_patterns (List[str]): List of file patterns to ignore.
            ignore_folders (List[str]): List of folder names to ignore.
            include_extensions (List[str]): List of file extensions to include.

        Returns:
            str: A string representation of the directory structure.
        """
        return self._print_directory_structure(self.directory, ignore_patterns, ignore_folders, include_extensions)

    def get_files_info(self, ignore_patterns: List[str], ignore_folders: List[str], include_extensions: List[str]) -> \
    List[Dict]:
        """
        Collect information about files in the directory.

        Args:
            ignore_patterns (List[str]): List of file patterns to ignore.
            ignore_folders (List[str]): List of folder names to ignore.
            include_extensions (List[str]): List of file extensions to include.

        Returns:
            List[Dict]: A list of dictionaries, each containing information about a file.
        """
        files_info = []

        for root, dirs, files in os.walk(self.directory):
            # Modify dirs in-place to ignore specified folders
            dirs[:] = [d for d in dirs if d not in ignore_folders]

            for file in files:
                if not any(fnmatch.fnmatch(file, pattern) for pattern in ignore_patterns):
                    file_path = os.path.join(root, file)
                    file_extension = os.path.splitext(file)[1]

                    if include_extensions and file_extension not in include_extensions:
                        continue

                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            code = f.read()
                            files_info.append({
                                'path': os.path.relpath(file_path, self.directory),
                                'code': code,
                                'file_extension': file_extension[1:]  # Remove the leading dot
                            })
                    except UnicodeDecodeError:
                        logger.error(f"Error decoding file: {file_path}")
                        continue

        return files_info

    def _print_directory_structure(self, directory: str, ignore_patterns: List[str], ignore_folders: List[str],
                                   include_extensions: List[str], level: int = 0) -> str:
        """
        Recursively print the directory structure.

        Args:
            directory (str): The current directory being processed.
            ignore_patterns (List[str]): List of file patterns to ignore.
            ignore_folders (List[str]): List of folder names to ignore.
            include_extensions (List[str]): List of file extensions to include.
            level (int): The current depth level in the tree (used for indentation).

        Returns:
            str: A string representation of the directory structure.
        """
        tree_structure = ""
        entries = list(os.scandir(directory))

        filtered_entries = [
            entry for entry in entries
            if not any(fnmatch.fnmatch(entry.name, pattern) for pattern in ignore_patterns)
               and entry.name not in ignore_folders
        ]

        for index, entry in enumerate(filtered_entries):
            is_last = index == len(filtered_entries) - 1
            prefix = "└── " if is_last else "├── "
            indent = "    " * level

            if entry.is_file():
                if not include_extensions or os.path.splitext(entry.name)[1] in include_extensions:
                    tree_structure += f"{indent}{prefix}{entry.name}\n"
            elif entry.is_dir():
                tree_structure += f"{indent}{prefix}📂 {entry.name}\n"
                tree_structure += self._print_directory_structure(entry.path, ignore_patterns, ignore_folders,
                                                                  include_extensions, level + 1)

        return tree_structure
