import logging
import os

import pandas as pd
from data_processing.filter import remove_non_eu_countires

# Logger initialization
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

DATASET_NAME = "individual-level-of-digital-skills-2021.csv"
DATASET_PATH = os.path.join(os.path.dirname(__file__), DATASET_NAME)
PROCESSED_DATASET_PATH = os.path.join(
    os.path.dirname(__file__), f"../processed_datasets/{DATASET_NAME}"
)

# Read the dataframe
df = pd.read_csv(DATASET_PATH)

columns_rename = {
    "DATAFLOW": "dataflow",
    "LAST UPDATE": "last_update",
    "freq": "freq",
    "ind_type": "ind_type",
    "indic_is": "indic_is",
    "unit": "unit",
    "geo": "geo",
    "TIME_PERIOD": "time_period",
    "OBS_VALUE": "obs_value",
    "OBS_FLAG": "obs_flag",
    "CONF_STATUS": "conf_status",
}

unique = df["indic_is"].unique()

interesting_indic_is = [
    "Digital skills could not be assessed because the individual has not used the internet in the last 3 months",
    "Individuals with no overall digital skills",
    "Individuals with basic or above basic overall digital skills (all five component indicators are at basic or above basic level)",
    "Individuals with low overall digital skills (four out of five component indicators are at basic or above basic level)",
    "Individuals with narrow overall digital skills (three out of five component indicators are at basic or above basic level)",
    "Individuals with limited overall digital skills (two out of five component indicators are at basic or above basic level)",
]

indic_is_rename = {
    "Digital skills could not be assessed because the individual has not used the internet in the last 3 months": "Digital skills could not be assessed because the individual has not used the internet in the last 3 months",
    "Individuals with no overall digital skills": "Individuals with no overall digital skills",
    "Individuals with basic or above basic overall digital skills (all five component indicators are at basic or above basic level)": "Individuals with basic or above basic overall digital skills",
    "Individuals with low overall digital skills (four out of five component indicators are at basic or above basic level)": "Individuals with low overall digital skills",
    "Individuals with narrow overall digital skills (three out of five component indicators are at basic or above basic level)": "Individuals with narrow overall digital skills",
    "Individuals with limited overall digital skills (two out of five component indicators are at basic or above basic level)": "Individuals with limited overall digital skills",
}

interesting_ind_type = [
    "All individuals",
    "Individuals, 15 years old or less",
    "Individuals, 16 to 24 years old",
    "Individuals, 25 to 54 years old",
    "Individuals, 55 to 64 years old",
    "Individuals, 65 to 74 years old",
    "Individuals, 75 years old or more",
]

# Rename the columns
df.rename(columns=columns_rename, inplace=True)

# Filter out not reilable samples
df = df[df["obs_flag"].isna()]

df = remove_non_eu_countires(df, "geo")

# Set indexes
df["time_period"] = pd.to_numeric(df["time_period"])
df.set_index(["time_period", "geo"], inplace=True)

# Sort indexes
df.sort_index(inplace=True, ascending=[False, True])

# Filter data
df = df[df["ind_type"].isin(interesting_ind_type)]
df = df[df["unit"] == "Percentage of individuals"]
df = df[df["indic_is"].isin(interesting_indic_is)]

# Rename values for columns
df["indic_is"] = df["indic_is"].replace(indic_is_rename)

# Drop unused columns
df.drop(
    columns=["dataflow", "last_update", "freq", "obs_flag", "conf_status", "unit"],
    inplace=True,
)

df.to_csv(PROCESSED_DATASET_PATH)
