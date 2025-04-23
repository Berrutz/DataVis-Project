import os

import pandas as pd
from data_processing.filter import remove_non_eu_countires

# Read the dataset
DATASET_NAME = "estat_isoc_ski_itedu_en.csv"
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
    "isced11": "isced11",
    "International Standard Classification of Education (ISCED 2011)": "iscoe",
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
    "isced11",
    "time",
    "geo",
    "observation value",
    "obs_flag",
    "observation status (flag) v2 structure",
    "conf_status",
    "confidentiality status (flag)",
]
df = df.drop(columns=columns_to_drop)

# Filter only eu countries
df = remove_non_eu_countires(df, "country")

# Remove unused data category
df = df[df['iscoe'] != "Upper secondary, post-secondary non-tertiary and tertiary education (levels 3-8)"]

# Set indexes
df = df.set_index(["time_period", "country", "iscoe"])

# Export the dataset
csv_path = os.path.join(
    os.path.dirname(__file__),
    "../../processed-datasets/employed-ict-education-by-att-level.csv",
)
df.to_csv(csv_path)
