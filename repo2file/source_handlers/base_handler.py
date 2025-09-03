from abc import ABC, abstractmethod
from typing import List, Dict


class BaseSourceHandler(ABC):
    """
    Abstract base class for source handlers.

    This class defines the interface that all source handlers must implement.
    It provides abstract methods for getting the structure of a source
    and retrieving information about the files within that source.
    """

    @abstractmethod
    def get_structure(self, ignore_patterns: List[str], ignore_folders: List[str],
                      include_extensions: List[str]) -> str:
        """
        Generate a string representation of the source structure.

        Args:
            ignore_patterns (List[str]): List of file patterns to ignore.
            ignore_folders (List[str]): List of folder names to ignore.
            include_extensions (List[str]): List of file extensions to include.

        Returns:
            str: A string representation of the source structure.
        """
        pass

    @abstractmethod
    def get_files_info(self, ignore_patterns: List[str], ignore_folders: List[str], include_extensions: List[str]) -> \
            List[Dict]:
        """
        Collect information about files in the source.

        Args:
            ignore_patterns (List[str]): List of file patterns to ignore.
            ignore_folders (List[str]): List of folder names to ignore.
            include_extensions (List[str]): List of file extensions to include.

        Returns:
            List[Dict]: A list of dictionaries, each containing information about a file.
                        Each dictionary should have the following keys:
                        - 'path': The path of the file relative to the source root.
                        - 'code': The content of the file.
                        - 'file_extension': The extension of the file (without the leading dot).
        """
        pass
