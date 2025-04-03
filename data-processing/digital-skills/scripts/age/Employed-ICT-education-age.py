import logging
import os
from ctypes import cast

import pandas as pd

# Logger initialization
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

DATASET_PATH = os.path.join(
    os.getcwd(), "original-datasets\employed-ICT-education-age.csv"
)

COLUMNS_RENAME = {
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

EU_COUNTRIES = [
    "Austria",
    "Belgium",
    "Bulgaria",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Ireland",
    "Italy",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Netherlands",
    "Poland",
    "Portugal",
    "Romania",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
    "United Kingdom",
    "European Union - 27 countries (from 2020)",
    "European Union - 28 countries (2013-2020)"
]

def store_csv_from_datframe(dataframe: pd.DataFrame, processed_dataset_path, csv_name):
    # Store the dataframe in the processed dataset folder
    # and the folder of the web application (static\public files)
    processed_dataset_path = (
        os.getcwd() + processed_dataset_path
    )
    web_application_path = (
        os.getcwd() + r"\..\..\web-application\public\datasets\digital-skills\\" + csv_name
    )

    dataframe.to_csv(processed_dataset_path)
    dataframe.to_csv(web_application_path)

def replace_str(df: pd.DataFrame, column, old_values, new_values) -> pd.DataFrame:
    # Remove "old" from every value in "column"
    if len(old_values) != len(new_values):
        raise ValueError("old_values and new_values must have the same length")

    for old, new in zip(old_values, new_values):
        df[column] = df[column].str.replace(old, new, regex=False)

    return df

def filter_incomplete_entries(df: pd.DataFrame) -> pd.DataFrame:
    """
    Removes rows where a (year, country) pair does not have at least two unique 'age' values.
    
    Args:
        df (pd.DataFrame): The input DataFrame with columns ['time_period', 'geo', 'age', 'obs_value'].
    
    Returns:
        pd.DataFrame: A filtered DataFrame containing only valid (year, country) pairs.
    """
    counts = df.groupby(["time_period", "geo"])["age"].nunique()
    valid_countries = counts[counts >= 2].index
    return df[df.set_index(["time_period", "geo"]).index.isin(valid_countries)]

if __name__ == "__main__":
    
    # Read the dataframe
    logger.info(f"Reading dataset path: {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)

    logger.info("Dataset red correctly")

    # Rename the columns
    df.rename(columns=COLUMNS_RENAME, inplace=True)

    # Filter data
    df = df[df["unit"] == "Percentage"]
    df = df.query(f"{"geo"} in {EU_COUNTRIES}")

    # Change entities names into their short version for better display
    oldStrings = ["European Union - 27 countries (from 2020)",
                  "European Union - 28 countries (2013-2020)"]
    newStrings = ["EU-27(from 2020)",
                  "EU-28(2013-2020)"]
    
    df = replace_str(df, "geo", oldStrings, newStrings)

    # Drop unused columns
    df.drop(
        columns=["dataflow", "last_update", "freq", "obs_flag", "conf_status", "unit"],
        inplace=True,
    )

    # Remove rows that contain empty (NaN) values
    df = df.dropna()

    df = filter_incomplete_entries(df)

    logger.info(f"Dataset columns: {df.columns.values}")

    # Set indexes
    df["time_period"] = pd.to_numeric(df["time_period"])
    df.set_index(["time_period", "geo"], inplace=True)

    # Sort indexes
    df.sort_index(inplace=True, ascending=[False, True])

    # Export the dataframe
    store_csv_from_datframe(df, "\processed-datasets\employed-ICT-education-age.csv", "employed-ICT-education-age.csv")

pass

