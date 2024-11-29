from csv import Error
import os
import pandas as pd

class CSV_ENTRIES:
    ENTITY = "Entity"
    CODE = "Code"
    YEAR = "Year"

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
    print("\n" + os.getcwd()
        + "/assignment-2/datasets/original-datasets/energy-consumption-by-source-and-country.csv")
    return pd.read_csv(
        os.getcwd()
        + "/assignment-2/datasets/original-datasets/energy-consumption-by-source-and-country.csv",
        sep=",",
    )


def store_csv_from_datframe(dataframe: pd.DataFrame):
    # Store the dataframe in the processed dataset folder
    # and the folder of the web application (static/public files)
    csv_name = "eu-27-countries-energy-consumption-by-source.csv"
    processed_dataset_path = (
        os.getcwd() + "/assignment-2/datasets/processed-datasets/" + csv_name
    )
    web_application_path = (
        os.getcwd() + "/../web-application/public/datasets/assignment2/" + csv_name
    )

    dataframe.to_csv(processed_dataset_path, index=False)
    dataframe.to_csv(web_application_path, index=False)


if __name__ == "__main__":
    df = load_csv()

    # Remove the columns that we are not interested in
    df = df.drop(CSV_ENTRIES.CODE, axis=1)

    # Remove the countries that are not in eu
    df = df.query(f"{CSV_ENTRIES.ENTITY} in {EU_COUNTRIES}")

    # Sort the dataframe by year
    df = df.sort_values(by=[CSV_ENTRIES.YEAR, CSV_ENTRIES.ENTITY])

    # Rename the columns values
    df = df.rename(columns={
        CSV_ENTRIES.ENTITY: "Country"
    })

    # Add a column for the total energy consumed
    # All the energy source columns are from the 3rd column onward
    energy_source_columns = df.columns[2:]  # Skip "Country" and "Year"
    df["Total energy consumption - TWh"] = df[energy_source_columns].sum(axis=1)

    store_csv_from_datframe(df)