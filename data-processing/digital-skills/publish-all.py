import os
import shutil

# Publish all datasets on public web app
########################################

# Get the public folder from the current directory
#
CURRENT_DIRPATH = os.path.dirname(__file__)
RELATIVE_PATH = "../../web-application/public/datasets/digital-skills"
PUBLIC_FOLDER = os.path.join(CURRENT_DIRPATH, RELATIVE_PATH)

# Get the folder and the processed datasets path to copy
#
PROCESSED_DATASETS_FOLDER = os.path.join(CURRENT_DIRPATH, "processed_datasets")
PROCESSED_DATASETS_NAMES = [
    processed_dataset_name
    for processed_dataset_name in os.listdir(PROCESSED_DATASETS_FOLDER)
    if processed_dataset_name.endswith(".csv")
]

# Copy all the processed datasets to the public folder
#
for processed_dataset_name in PROCESSED_DATASETS_NAMES:
    new_dataset_path = os.path.join(PUBLIC_FOLDER, processed_dataset_name)
    processed_dataset_path = os.path.join(
        PROCESSED_DATASETS_FOLDER, processed_dataset_name
    )

    shutil.copy(processed_dataset_path, new_dataset_path)
