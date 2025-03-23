import logging
import os
from ctypes import cast

import pandas as pd
from tabulate import tabulate

# Logger initialization
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

DATASET_PATH = os.path.join(
    os.getcwd(), "../original-datasets/Employed-ICT-education-age.csv"
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
    "unit": "unit",
    "age":"age",
    "geo": "geo",
    "TIME_PERIOD": "time_period",
    "OBS_VALUE": "obs_value",
    "OBS_FLAG": "obs_flag",
    "CONF_STATUS": "conf_status",
}

# Rename the columns
df.rename(columns=columns_rename, inplace=True)

# Set indexes
df["time_period"] = pd.to_numeric(df["time_period"])
df.set_index(["time_period", "geo"], inplace=True)

# Sort indexes
df.sort_index(inplace=True, ascending=[False, True])

# Filter data
df = df[df["unit"] == "Percentage"]

# Drop unused columns
df.drop(
    columns=["dataflow", "last_update", "freq", "obs_flag", "conf_status", "unit"],
    inplace=True,
)

# Export the dataframe
df.to_csv("../processed-datasets/Employed-ICT-education-age.csv")

pass

