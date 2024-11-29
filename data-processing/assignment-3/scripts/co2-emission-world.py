import pandas as pd
import os
from csv import Error

class CSV_ENTRIES_FOSSIL:
    ENTITY = "Entity"
    CODE = "Code"
    YEAR = "Year"
    ANNUAL_EMISSION_INCLUDING_LAND = "Annual CO₂ emissions including land-use change"
    ANNUAL_EMISSION_FROM_LAND_CHANGE = "Annual CO₂ emissions from land-use change"
    ANNUAL_EMISSION = "Annual CO₂ emissions"

class CSV_ENTRIES_PER_CAPITA:
    CODE = "Code"
    ANNUAL_EMISSION_PER_CAPITA = "Annual CO₂ emissions (per capita)"

class CSV_ENTRIES_LAND:
    CODE = "Code"
    LAND_SQUARE_KM = "Land area (sq. km)"



# Define Path for system
DATA_PATH = os.getcwd() + "\\..\\original-datasets\\"
FILES = {
    "co_emissions_per_capita": "co-emissions-per-capita.csv",
    "co2_fossil_plus_land_use": "co2-fossil-plus-land-use.csv",
    "land_area_km": "land-area-km.csv",
}

# Load CSV
def load_csv(file_key):
    file_path = os.path.join(DATA_PATH, FILES[file_key])
    return pd.read_csv(file_path)

def check_null(dataframe: pd.DataFrame):
    hasNulls = dataframe.isnull().sum()
    for col in hasNulls:
        if col > 0:
            raise Error("The dataframe contains null, more processings are required")
        
def store_csv_from_datframe(dataframe: pd.DataFrame):
    # Store the dataframe in the processed dataset folder
    # and the folder of the web application (static/public files)
    csv_name = "World-data.csv"
    processed_dataset_path = (
        os.getcwd() + "\\..\\processed-datasets\\" + csv_name
    )
    web_application_path = (
        os.getcwd() + "\\..\\..\\..\\web-application\\public\\datasets\\assignment3\\" + csv_name
    )

    dataframe.to_csv(processed_dataset_path, index=False)
    dataframe.to_csv(web_application_path, index=False)

def preprocess_and_merge_data():

    # Load the datasets 
    df_per_capita = load_csv("co_emissions_per_capita")
    df_fossil_land = load_csv("co2_fossil_plus_land_use")
    df_land_area = load_csv("land_area_km")

    # Manage null values 

    # DROP CODE Coloumn 
    df_per_capita = df_per_capita.drop(CSV_ENTRIES_FOSSIL.CODE, axis=1)
    # Drop Null Rows in the coloumn "Annual CO₂ emissions (per capita)"
    df_per_capita = df_per_capita.dropna(subset=[CSV_ENTRIES_PER_CAPITA.ANNUAL_EMISSION_PER_CAPITA])
     
    print("Shape of df_per_capita :",df_per_capita.shape)

    # As done in Assignemnt 2 
    # Remove the columns that we are not interested in 
    df_fossil_land = df_fossil_land.drop(CSV_ENTRIES_FOSSIL.ANNUAL_EMISSION_FROM_LAND_CHANGE, axis=1)
    df_fossil_land = df_fossil_land.drop(CSV_ENTRIES_FOSSIL.ANNUAL_EMISSION, axis=1)
    df_fossil_land = df_fossil_land.drop(CSV_ENTRIES_FOSSIL.CODE, axis=1)

    # Drop all the Rows which have Null values in the coloumn "Annual CO₂ emissions including land-use change"
    df_fossil_land = df_fossil_land.dropna(subset=[CSV_ENTRIES_FOSSIL.ANNUAL_EMISSION_INCLUDING_LAND])

    print("Shape of df_fossil_land :",df_fossil_land.shape)

    # DROP CODE Coloumn 
    df_land_area = df_land_area.drop(CSV_ENTRIES_LAND.CODE, axis=1)
    # drop All the Rows which have Null values in the coloumn "Land area (sq. km)"
    df_land_area = df_land_area.dropna(subset=[CSV_ENTRIES_LAND.LAND_SQUARE_KM]) 

    print("Shape of df_land_area :",df_land_area.shape)

    check_null(df_per_capita)
    check_null(df_fossil_land)
    check_null(df_land_area)

    # Rename coloumn 
    df_per_capita = df_per_capita.rename(columns={
        "Entity": "country_name",
        "Year": "year",
        "Annual CO₂ emissions (per capita)": "total_emission_per_capita"
    })

    df_fossil_land = df_fossil_land.rename(columns={
        "Entity": "country_name",
        "Year": "year",
        "Annual CO₂ emissions including land-use change": "fossil_emissions"
    })

    df_land_area = df_land_area.rename(columns={
        "Entity": "country_name",
        "Year": "year",
        "Land area (sq. km)": "land_area_km"
    })

    # Filter data after `year > 1954`
    year = 1954
    df_per_capita = df_per_capita[df_per_capita["year"] > year]
    df_fossil_land = df_fossil_land[df_fossil_land["year"] > year]
    df_land_area = df_land_area[df_land_area["year"] > year]

    # Merge on the coloumn `country_name` e `year`
    merged_df = pd.merge(df_per_capita, df_fossil_land, on=["country_name", "year"], how="inner")
    merged_df = pd.merge(merged_df, df_land_area, on=["country_name", "year"], how="inner")

    print(merged_df.head())

    # Calculate Density annual -> `annual_emission_density`
    merged_df["annual_emission_density"] = (
        merged_df["fossil_emissions"] / merged_df["land_area_km"]
    )

    # Select Final Coloumn 
    final_df = merged_df[[
        "country_name", 
        "year", 
        "total_emission_per_capita", 
        "fossil_emissions", 
        "annual_emission_density"
    ]]

    # Order based on year and country name 
    final_df = final_df.sort_values(by=["year", "country_name"])

    store_csv_from_datframe(final_df)

if __name__ == "__main__":
    preprocess_and_merge_data()
