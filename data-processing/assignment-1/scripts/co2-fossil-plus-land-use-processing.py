from csv import Error
import os
import pandas as pd


class CSV_ENTRIES:
    ENTITY = "Entity"
    CODE = "Code"
    YEAR = "Year"
    ANNUAL_EMISSION_INCLUDING_LAND = "Annual CO₂ emissions including land-use change"
    ANNUAL_EMISSION_FROM_LAND_CHANGE = "Annual CO₂ emissions from land-use change"
    ANNUAL_EMISSION = "Annual CO₂ emissions"


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
]


def load_csv():
    # Read and load the dataset from the csv file
    return pd.read_csv(
        os.getcwd()
        + "/assignment-1/datasets/original-datasets/co2-fossil-plus-land-use.csv",
        sep=",",
    )


def store_csv_from_datframe(dataframe: pd.DataFrame):
    # Store the dataframe in the processed dataset folder
    # and the folder of the web application (static/public files)
    csv_name = "eu-countries-emission-including-land-usage.csv"
    processed_dataset_path = (
        os.getcwd() + "/assignment-1/datasets/processed-datasets/" + csv_name
    )
    web_application_path = (
        os.getcwd() + "/../web-application/public/datasets/assignment1/" + csv_name
    )

    dataframe.to_csv(processed_dataset_path, index=False)
    dataframe.to_csv(web_application_path, index=False)


if __name__ == "__main__":
    df = load_csv()

    # Remove the columns that we are not interested in
    df = df.drop(CSV_ENTRIES.ANNUAL_EMISSION_FROM_LAND_CHANGE, axis=1)
    df = df.drop(CSV_ENTRIES.ANNUAL_EMISSION, axis=1)
    df = df.drop(CSV_ENTRIES.CODE, axis=1)

    # Take rows with year greather then 1954
    df = df[df[CSV_ENTRIES.YEAR] > 1954]

    # Remove the countries that are not in eu
    df = df.query(f"{CSV_ENTRIES.ENTITY} in {EU_COUNTRIES}")

    # This is only a guard that checks if the columns of interests
    # have null values.
    hasNulls = df.isnull().sum()
    for col in hasNulls:
        if col > 0:
            raise Error("The dataframe contains null, more processings are required")

    # Sort the dataframe by year
    df = df.sort_values(by=[CSV_ENTRIES.YEAR, CSV_ENTRIES.ENTITY])    

    # Rename the columns values
    df = df.rename(columns={
        CSV_ENTRIES.ENTITY: "country",
        CSV_ENTRIES.YEAR: "year",
        CSV_ENTRIES.ANNUAL_EMISSION_INCLUDING_LAND: "annual_emission_with_land_usage"
    })

    # Compute the average `annual_emission_with_land_usage` per country, sorting them by average
    # emission and taking only the first 10 country names
    top10_emitter = df.groupby("country")["annual_emission_with_land_usage"]\
        .mean()\
        .sort_values(ascending=False)\
        .head(10)\
        .index.tolist()

    df = df.query(f"country in {top10_emitter}")

    store_csv_from_datframe(df)
