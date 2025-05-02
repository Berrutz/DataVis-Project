import os

import pandas as pd
from data_processing.filter import remove_non_eu_countires

# Read the dataset
DATASET_NAME = "employed-persons-with-ict-education-by-sex.csv"
DATASET_PATH = os.path.join(os.path.dirname(__file__), DATASET_NAME)
PROCESSED_DATASET_PATH = os.path.join(
    os.path.dirname(__file__), f"../processed_datasets/{DATASET_NAME}"
)

df = pd.read_csv(DATASET_PATH)

# Rename the columns
columns_rename = {
    "STRUCTURE": "structure",
    "STRUCTURE_ID": "structure_id",
    "STRUCTURE_NAME": "structure_name",
    "freq": "freq",
    "Time frequency": "time frequency",
    "unit": "unit",
    "Unit of measure": "unit of measure",
    "sex": "sex_tag",
    "Sex": "sex",
    "geo": "geo",
    "Geopolitical entity (reporting)": "country",
    "TIME_PERIOD": "time_period",
    "Time": "time",
    "OBS_VALUE": "obs_value",
    "Observation value": "observation value",
    "OBS_FLAG": "obs_flag",
    "Observation status (Flag) V2 structure": "observation status (flag) v2 structure",
    "CONF_STATUS": "conf_status",
    "Confidentiality status (flag)": "confidentiality status (flag)",
}
df = df.rename(columns=columns_rename)

# Filter the dataset removing not reliable data
df = df[df["obs_flag"].isna()]
df = df[df["unit of measure"] == "Percentage"]

df = remove_non_eu_countires(df, "country")

# Drop unuseful columns
columns_to_drop = [
    "structure",
    "structure_id",
    "structure_name",
    "freq",
    "time frequency",
    "unit",
    "unit of measure",
    "observation value",
    "obs_flag",
    "observation status (flag) v2 structure",
    "conf_status",
    "confidentiality status (flag)",
    "geo",
    "time",
]
df = df.drop(columns=columns_to_drop)

# Set indexes
df = df.set_index(["time_period", "country", "sex_tag"])

# Export the dataset
df.to_csv(PROCESSED_DATASET_PATH)
