import os

import pandas as pd

# Read the dataset
DATASET_NAME = "estat_isoc_ski_itsex_en.csv"
CURRENT_DIR = os.path.join(os.path.dirname(__file__), "../../original-datasets")
DATASET_PATH = os.path.join(CURRENT_DIR, DATASET_NAME)

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
csv_path = os.path.join(
    os.path.dirname(__file__),
    "../../processed-datasets/employed-ict-education-by-sex.csv",
)
df.to_csv(csv_path)
