import os
import os.path as p


def create_and_check_dir(dir_path: str):
    """
    Create a directory from the given path.

    If the directory does not exists it creates it.
    If the path exists check that it is a direcotry, if not raise ValueError.

    :param dir_path: The path for the direcotry to be created and/or checked
    """

    # Chekc if the path does not exists, if not create it
    # Otherwise check that the given path is a direcotry
    if not p.exists(dir_path):
        os.makedirs(dir_path, exist_ok=True)
    elif not p.isdir(dir_path):
        raise ValueError(f"`{dir_path}` must be a folder")
