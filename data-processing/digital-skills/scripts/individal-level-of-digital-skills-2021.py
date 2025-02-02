import logging
import os
from ctypes import cast

import pandas as pd
from tabulate import tabulate

# Logger initialization
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

DATASET_PATH = os.path.join(
    os.getcwd(), "../original-datasets/individual-level-of-digital-skills-2021.csv"
)

# Read the dataframe
logger.info(f"Reading dataset path: {DATASET_PATH}")
df = pd.read_csv(DATASET_PATH)
logger.info("Dataset red correctly")
logger.info(f"Dataset columns: {df.columns.values}")

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

interesting_indic_is = [
    "Individuals with above basic overall digital skills (all five component indicators are at above basic level)",
    "Individuals with low overall digital skills (four out of five component indicators are at basic or above basic level)",
    "Individuals with basic overall digital skills (all five component indicators are at basic or above basic level, without being all above basic)",
    "Individuals with basic or above basic overall digital skills (all five component indicators are at basic or above basic level)",
    "Individuals with no overall digital skills",
]

indic_is_rename = {
    "Individuals with above basic overall digital skills (all five component indicators are at above basic level)": "Individuals with above basic overall digital skills",
    "Individuals with low overall digital skills (four out of five component indicators are at basic or above basic level)": "Individuals with basic or above basic overall digital skills",
    "Individuals with basic overall digital skills (all five component indicators are at basic or above basic level, without being all above basic)": "Individuals with basic overall digital skills",
    "Individuals with basic or above basic overall digital skills (all five component indicators are at basic or above basic level)": "Individuals with low overall digital skills",
    "Individuals with no overall digital skills": "Individuals with no overall digital skills",
}

interesting_ind_type = [
    "All individuals",
    "Individuals, 15 years old or less",
    "Individuals, 16 to 19 years old",
    "Individuals, 16 to 24 years old",
    "Individuals, 16 to 29 years old",
    "Individuals, 20 to 24 years old",
    "Individuals, 25 to 29 years old",
    "Individuals, 25 to 34 years old",
    "Individuals, 25 to 54 years old",
    "Individuals, 25 to 64 years old",
    "Individuals, 35 to 44 years old",
    "Individuals, 45 to 54 years old",
    "Individuals, 55 to 64 years old",
    "Individuals, 55 to 74 years old",
    "Individuals, 65 to 74 years old",
    "Individuals, 75 years old or more",
]

# Rename the columns
df.rename(columns=columns_rename, inplace=True)

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

pass
