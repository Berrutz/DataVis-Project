from csv import Error
import os
import pandas as pd

class IA_CSV_ENTRIES:
    DATAFLOW = "DATAFLOW"
    LAST_UPDATE = "LAST UPDATE"
    FREQ = "freq"
    CATEGORY = "indic_is"
    UNIT = "unit"
    HHTYP = "hhtyp"
    COUNTRY = "geo"
    YEAR = "TIME_PERIOD" 
    OBS_VALUE = "OBS_VALUE"
    OBS_FLAG = "OBS_FLAG"
    CONF_STATUS = "CONF_STATUS"

class ICU_CSV_ENTRIES:
    DATAFLOW = "DATAFLOW"
    LAST_UPDATE = "LAST UPDATE"
    FREQ = "freq"
    CATEGORY = "indic_is"
    UNIT = "unit"
    INDIVIDUAL_TYPE = "ind_type"
    COUNTRY = "geo"
    YEAR = "TIME_PERIOD" 
    OBS_VALUE = "OBS_VALUE"
    OBS_FLAG = "OBS_FLAG"
    CONF_STATUS = "CONF_STATUS"

class P_AGE_CSV_ENTRIES:
    DATAFLOW = "DATAFLOW"
    LAST_UPDATE = "LAST UPDATE"
    FREQ = "freq"
    UNIT = "unit"
    AGE = "age"
    SEX = "sex"
    COUNTRY = "geo"
    YEAR = "TIME_PERIOD" 
    OBS_VALUE = "OBS_VALUE"
    OBS_FLAG = "OBS_FLAG"
    CONF_STATUS = "CONF_STATUS"

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

def load_csv(path):
    # Read and load the dataset from the csv file
    print("\n" + os.getcwd()
        + path)
    return pd.read_csv(
        os.getcwd()
        + path,
        sep=",",
    )


def store_csv_from_datframe(dataframe: pd.DataFrame, processed_dataset_path, csv_name):
    # Store the dataframe in the processed dataset folder
    # and the folder of the web application (static\public files)
    processed_dataset_path = (
        os.getcwd() + processed_dataset_path
    )
    web_application_path = (
        os.getcwd() + r"\..\web-application\public\datasets\internet-access-level\\" + csv_name
    )

    dataframe.to_csv(processed_dataset_path, index=False)
    dataframe.to_csv(web_application_path, index=False)

def correct_age_group(df_age_group: pd.DataFrame, df_age: pd.DataFrame) -> pd.DataFrame:
    # Merge data on 'TIME_PERIOD' and 'geo', keeping only relevant age group from df_age_group
    df_merged = df_age_group[df_age_group["age"] == "From 15 to 19 years"].merge(
        df_age[["TIME_PERIOD", "geo", "OBS_VALUE"]], 
        on=["TIME_PERIOD", "geo"], 
        suffixes=("_age_group", "_age")
    )

    # Subtract OBS_VALUE_age from OBS_VALUE_age_group
    df_merged["OBS_VALUE_age_group"] -= df_merged["OBS_VALUE_age"]

    # Drop the extra column
    df_merged = df_merged.drop(columns=["OBS_VALUE_age"])

    # Rename column back to original
    df_merged = df_merged.rename(columns={"OBS_VALUE_age_group": "OBS_VALUE"})

    # Update original df_csv2 by replacing the values for the matching rows
    df_age_group.update(df_merged)

    return df_age_group

def merge_population_age_group(df: pd.DataFrame) -> pd.DataFrame:
    # Define age groupings ("From 15 to 19 years" here it's actually "From 16 to 19 years")
    age_groups = {
        "From 15 to 19 years": "Individuals, 16 to 24 years old",
        "From 20 to 24 years": "Individuals, 16 to 24 years old",

        "From 25 to 29 years": "Individuals, 25 to 54 years old",
        "From 30 to 34 years": "Individuals, 25 to 54 years old",
        "From 35 to 39 years": "Individuals, 25 to 54 years old",
        "From 40 to 44 years": "Individuals, 25 to 54 years old",
        "From 45 to 49 years": "Individuals, 25 to 54 years old",
        "From 50 to 54 years": "Individuals, 25 to 54 years old",

        "From 55 to 59 years": "Individuals, 55 to 74 years old",
        "From 60 to 64 years": "Individuals, 55 to 74 years old",
        "From 65 to 69 years": "Individuals, 55 to 74 years old",
        "From 70 to 74 years": "Individuals, 55 to 74 years old",
    }

    # Map age values to new merged groups
    df["merged_age_group"] = df["age"].replace(age_groups)

    # Group by TIME_PERIOD, geo, and merged age group, summing OBS_VALUE
    df_merged = (
        df.groupby(["TIME_PERIOD", "geo", "merged_age_group"], as_index=False)
        .agg({"OBS_VALUE": "sum", "DATAFLOW": "first", "LAST UPDATE": "first", "freq": "first", 
            "unit": "first", "sex": "first", "OBS_FLAG": "first", "CONF_STATUS": "first"})
    )

    # Rename column back to "age"
    df_merged.rename(columns={"merged_age_group": "age"}, inplace=True)

    # Change values in "age" column
    df_merged["age"] = df_merged["age"].replace("75 years or over", "Individuals, 75 years old or more")

    return df_merged

def merge_population_internet_usage(df_p: pd.DataFrame, df_iu: pd.DataFrame) -> pd.DataFrame:
    # Rename columns in df_population to match df_internet
    df_p.rename(columns={P_AGE_CSV_ENTRIES.OBS_VALUE: "Population"}, inplace=True)

    # Merge on Year, Country, and Age Group
    df_merged = df_iu.merge(
    df_p[[P_AGE_CSV_ENTRIES.YEAR, P_AGE_CSV_ENTRIES.COUNTRY, P_AGE_CSV_ENTRIES.AGE, "Population"]],
    left_on=[ICU_CSV_ENTRIES.YEAR, ICU_CSV_ENTRIES.COUNTRY, ICU_CSV_ENTRIES.INDIVIDUAL_TYPE], 
    right_on=[P_AGE_CSV_ENTRIES.YEAR, P_AGE_CSV_ENTRIES.COUNTRY, P_AGE_CSV_ENTRIES.AGE],
    how="left"
    )

    # Drop duplicate Age column
    df_merged.drop(columns=[P_AGE_CSV_ENTRIES.AGE], inplace=True)

    return df_merged
    

def replace_str(df: pd.DataFrame, column, old_values, new_values) -> pd.DataFrame:
    # Remove "old" from every value in "column"
    if len(old_values) != len(new_values):
        raise ValueError("old_values and new_values must have the same length")

    for old, new in zip(old_values, new_values):
        df[column] = df[column].str.replace(old, new, regex=False)

    return df

if __name__ == "__main__":
    # Define paths
    ia_path = r"\internet-access-level\datasets\original-datasets\internet-access.csv"
    ia_reasons_path = r"\internet-access-level\datasets\original-datasets\reasons-not-have-internet-access.csv"
    iu_divided_by_edu_age_path = r"\internet-access-level\datasets\original-datasets\internet-use-divided-by-age-education-level.csv"
    iu_divided_by_age_group_path = r"\internet-access-level\datasets\original-datasets\internet-use-divided-by-age-group.csv"
    cu_divided_by_age_group_path = r"\internet-access-level\datasets\original-datasets\computer-use-divided-by-age-group.csv"
    iu_path = r"\internet-access-level\datasets\original-datasets\internet-use.csv"
    p_age_15_path = r"\internet-access-level\datasets\original-datasets\population-age-15.csv"
    p_age_group_path = r"\internet-access-level\datasets\original-datasets\population-divided-by-age-group.csv"

    ia_pd_path = r"\internet-access-level\datasets\processed-datasets\internet-access.csv"
    ia_reasons_pd_path = r"\internet-access-level\datasets\processed-datasets\reasons-not-have-internet-access.csv"
    iu_divided_by_edu_age_pd_path = r"\internet-access-level\datasets\processed-datasets\internet-use-divided-by-age-education-level.csv"
    iu_divided_by_age_group_pd_path = r"\internet-access-level\datasets\processed-datasets\internet-use-divided-by-age-group.csv"
    cu_divided_by_age_group_pd_path = r"\internet-access-level\datasets\processed-datasets\computer-use-divided-by-age-group.csv"
    iu_pd_path = r"\internet-access-level\datasets\processed-datasets\internet-use.csv"

    # Load csv
    df_ia = load_csv(ia_path)
    df_ia_reasons = load_csv(ia_reasons_path)
    df_iu_age_edu = load_csv(iu_divided_by_edu_age_path)
    df_iu_age_group = load_csv(iu_divided_by_age_group_path)
    df_cu_age_group = load_csv(cu_divided_by_age_group_path)
    df_iu = load_csv(iu_path)
    df_p_age15 = load_csv(p_age_15_path)
    df_p_age_group = load_csv(p_age_group_path)

    # Subtract the population of 15 years old from the age group 15-19
    df_p_age_group = correct_age_group(df_p_age_group, df_p_age15)

    # Merge population age groups to match the age groups of the internet use datasets
    df_p_age_group = merge_population_age_group(df_p_age_group)

    # Merge population and internet usage and computer usage datasets
    df_iu_age_group = merge_population_internet_usage(df_p_age_group, df_iu_age_group)
    df_cu_age_group = merge_population_internet_usage(df_p_age_group, df_cu_age_group)

    # Remove the columns that we are not interested in
    df_ia = df_ia.drop([
        IA_CSV_ENTRIES.DATAFLOW,
        IA_CSV_ENTRIES.LAST_UPDATE,
        IA_CSV_ENTRIES.FREQ,
        IA_CSV_ENTRIES.UNIT,
        IA_CSV_ENTRIES.HHTYP,
        IA_CSV_ENTRIES.OBS_FLAG,
        IA_CSV_ENTRIES.CONF_STATUS], axis=1)
    
    df_ia_reasons =  df_ia_reasons.drop([
        IA_CSV_ENTRIES.DATAFLOW,
        IA_CSV_ENTRIES.LAST_UPDATE,
        IA_CSV_ENTRIES.FREQ,
        IA_CSV_ENTRIES.UNIT,
        IA_CSV_ENTRIES.HHTYP,
        IA_CSV_ENTRIES.OBS_FLAG,
        IA_CSV_ENTRIES.CONF_STATUS], axis=1)

    df_iu_age_edu = df_iu_age_edu.drop([
        ICU_CSV_ENTRIES.DATAFLOW,
        ICU_CSV_ENTRIES.LAST_UPDATE,
        ICU_CSV_ENTRIES.FREQ,
        ICU_CSV_ENTRIES.UNIT,
        ICU_CSV_ENTRIES.OBS_FLAG,
        ICU_CSV_ENTRIES.CONF_STATUS], axis=1)
    
    df_iu_age_group = df_iu_age_group.drop([
        ICU_CSV_ENTRIES.DATAFLOW,
        ICU_CSV_ENTRIES.LAST_UPDATE,
        ICU_CSV_ENTRIES.FREQ,
        ICU_CSV_ENTRIES.UNIT,
        ICU_CSV_ENTRIES.OBS_FLAG,
        ICU_CSV_ENTRIES.CONF_STATUS], axis=1)
    
    df_cu_age_group = df_cu_age_group.drop([
        ICU_CSV_ENTRIES.DATAFLOW,
        ICU_CSV_ENTRIES.LAST_UPDATE,
        ICU_CSV_ENTRIES.FREQ,
        ICU_CSV_ENTRIES.UNIT,
        ICU_CSV_ENTRIES.OBS_FLAG,
        ICU_CSV_ENTRIES.CONF_STATUS], axis=1)
    
    df_iu = df_iu.drop([
        ICU_CSV_ENTRIES.DATAFLOW,
        ICU_CSV_ENTRIES.LAST_UPDATE,
        ICU_CSV_ENTRIES.FREQ,
        ICU_CSV_ENTRIES.CATEGORY,
        ICU_CSV_ENTRIES.UNIT,
        ICU_CSV_ENTRIES.INDIVIDUAL_TYPE,
        ICU_CSV_ENTRIES.OBS_FLAG,
        ICU_CSV_ENTRIES.CONF_STATUS], axis=1)

    # Remove the countries that are not in our interest
    df_ia = df_ia.query(f"{IA_CSV_ENTRIES.COUNTRY} in {EU_COUNTRIES}")
    df_ia_reasons = df_ia_reasons.query(f"{IA_CSV_ENTRIES.COUNTRY} in {EU_COUNTRIES}")
    df_iu_age_edu = df_iu_age_edu.query(f"{ICU_CSV_ENTRIES.COUNTRY} in {EU_COUNTRIES}")
    df_iu_age_group = df_iu_age_group.query(f"{ICU_CSV_ENTRIES.COUNTRY} in {EU_COUNTRIES}")
    df_cu_age_group = df_cu_age_group.query(f"{ICU_CSV_ENTRIES.COUNTRY} in {EU_COUNTRIES}")
    df_iu = df_iu.query(f"{ICU_CSV_ENTRIES.COUNTRY} in {EU_COUNTRIES}")

    # Remove "Last internet use: " and "internet use: " from every value in the column 'ICU_CSV_ENTRIES.CATEGORY'
    strings = ["Last internet use: ",
               "Internet use: "]
    df_iu_age_group = replace_str(df_iu_age_group, ICU_CSV_ENTRIES.CATEGORY, strings, ["", ""])
    df_iu_age_edu = replace_str(df_iu_age_edu, ICU_CSV_ENTRIES.CATEGORY, strings, ["", ""])

    # Remove "Last computer use: ", "Individuals who used a computer " and "Computer use: " from every value in the column 'ICU_CSV_ENTRIES.CATEGORY'
    strings = ["Last computer use: ",
               "Individuals who used a computer ",
               "Computer use: "
               ]
    df_cu_age_group = replace_str(df_cu_age_group, ICU_CSV_ENTRIES.CATEGORY, strings, ["", "", ""])

    # Remove "individuals, " from the IU_CSV_ENTRIES.INDIVIDUAL_TYPE column.
    str1 = "Individuals, "
    df_iu_age_group = replace_str(df_iu_age_group, ICU_CSV_ENTRIES.INDIVIDUAL_TYPE, [str1], [""])
    df_iu_age_edu = replace_str(df_iu_age_edu, ICU_CSV_ENTRIES.INDIVIDUAL_TYPE, [str1], [""])
    df_cu_age_group = replace_str(df_cu_age_group, ICU_CSV_ENTRIES.INDIVIDUAL_TYPE, [str1], [""])

    # Change values of IA_CSV_ENTRIES.CATEGORY column for better display
    oldStrings = ["Households without access to internet at home, because the access costs are too high (telephone, etc.)",
                  "Households without access to the internet at home, because broadband is not available in the area",
                  "Households without access to internet at home, because of access elsewhere",
                  "Households without access to internet at home, because the equipment costs are too high",
                  "Households without access to internet at home, because access not needed (content is not useful, not interesting, etc.)",
                  "Households without access to internet at home, because of privacy or security concerns",
                  "Households without access to internet at home, because of lack of skills",
                  "Households without access to internet at home, because of other reasons"
                  ]

    newStrings = ["access costs are too high (telephone, etc.)",
                  "broadband is not available in the area",
                  "access elsewhere",
                  "equipment costs are too high",
                  "access not needed (content is not useful, interesting, etc.)",
                  "privacy or security concerns",
                  "lack of skills",
                  "other reasons"
                  ]
    
    df_ia_reasons = replace_str(df_ia_reasons, IA_CSV_ENTRIES.CATEGORY, oldStrings, newStrings)

    # Change entities names into their short version for better display
    oldStrings = ["European Union - 27 countries (from 2020)",
                  "European Union - 28 countries (2013-2020)"]
    newStrings = ["EU-27(from 2020)",
                  "EU-28(2013-2020)"]

    df_ia = replace_str(df_ia, IA_CSV_ENTRIES.COUNTRY, oldStrings, newStrings)
    df_ia_reasons = replace_str(df_ia_reasons, IA_CSV_ENTRIES.COUNTRY, oldStrings, newStrings)
    df_iu_age_edu = replace_str(df_iu_age_edu, ICU_CSV_ENTRIES.COUNTRY, oldStrings, newStrings)
    df_iu_age_group = replace_str(df_iu_age_group, ICU_CSV_ENTRIES.COUNTRY, oldStrings, newStrings)
    df_cu_age_group = replace_str(df_cu_age_group, ICU_CSV_ENTRIES.COUNTRY, oldStrings, newStrings)
    df_iu = replace_str(df_iu, ICU_CSV_ENTRIES.COUNTRY, oldStrings, newStrings)

    # Sort the dataframe by year and country
    df_ia = df_ia.sort_values(by=[IA_CSV_ENTRIES.YEAR, IA_CSV_ENTRIES.COUNTRY])
    df_ia_reasons = df_ia_reasons.sort_values(by=[IA_CSV_ENTRIES.YEAR, IA_CSV_ENTRIES.COUNTRY])
    df_iu_age_edu = df_iu_age_edu.sort_values(by=[ICU_CSV_ENTRIES.YEAR, ICU_CSV_ENTRIES.COUNTRY])
    df_iu_age_group = df_iu_age_group.sort_values(by=[ICU_CSV_ENTRIES.YEAR, ICU_CSV_ENTRIES.COUNTRY])
    df_cu_age_group = df_cu_age_group.sort_values(by=[ICU_CSV_ENTRIES.YEAR, ICU_CSV_ENTRIES.COUNTRY])
    df_iu = df_iu.sort_values(by=[ICU_CSV_ENTRIES.YEAR, ICU_CSV_ENTRIES.COUNTRY])

    # Remove rows that contain empty (NaN) values
    df_ia = df_ia.dropna()
    df_ia_reasons = df_ia_reasons.dropna()
    df_iu_age_group = df_iu_age_group.dropna()
    df_iu_age_edu = df_iu_age_edu.dropna()
    df_cu_age_group = df_cu_age_group.dropna()
    df_iu = df_iu.dropna()

    # Rename the columns values
    df_ia = df_ia.rename(columns={
        IA_CSV_ENTRIES.COUNTRY: "Country",
        IA_CSV_ENTRIES.YEAR: "Year",
        IA_CSV_ENTRIES.OBS_VALUE: "Value"
    })
    df_ia_reasons = df_ia_reasons.rename(columns={
        IA_CSV_ENTRIES.COUNTRY: "Country",
        IA_CSV_ENTRIES.YEAR: "Year",
        IA_CSV_ENTRIES.CATEGORY: "Reason",
        IA_CSV_ENTRIES.OBS_VALUE: "Value"
    })
    df_iu_age_edu = df_iu_age_edu.rename(columns={
        ICU_CSV_ENTRIES.COUNTRY: "Country",
        ICU_CSV_ENTRIES.YEAR: "Year",
        ICU_CSV_ENTRIES.CATEGORY: "Last internet use",
        ICU_CSV_ENTRIES.INDIVIDUAL_TYPE: "Age and education",
        ICU_CSV_ENTRIES.OBS_VALUE: "Value"
    })
    df_iu_age_group = df_iu_age_group.rename(columns={
        ICU_CSV_ENTRIES.COUNTRY: "Country",
        ICU_CSV_ENTRIES.YEAR: "Year",
        ICU_CSV_ENTRIES.CATEGORY: "Last internet use",
        ICU_CSV_ENTRIES.INDIVIDUAL_TYPE: "Age group",
        ICU_CSV_ENTRIES.OBS_VALUE: "Value"
    })
    df_cu_age_group = df_cu_age_group.rename(columns={
        ICU_CSV_ENTRIES.COUNTRY: "Country",
        ICU_CSV_ENTRIES.YEAR: "Year",
        ICU_CSV_ENTRIES.CATEGORY: "Last computer use",
        ICU_CSV_ENTRIES.INDIVIDUAL_TYPE: "Age group",
        ICU_CSV_ENTRIES.OBS_VALUE: "Value"
    })
    df_iu = df_iu.rename(columns={
        ICU_CSV_ENTRIES.COUNTRY: "Country",
        ICU_CSV_ENTRIES.YEAR: "Year",
        ICU_CSV_ENTRIES.OBS_VALUE: "Value"
    })

    store_csv_from_datframe(df_ia, ia_pd_path, "internet-access.csv")
    store_csv_from_datframe(df_ia_reasons, ia_reasons_pd_path, "reasons-not-have-internet-access.csv")
    store_csv_from_datframe(df_iu_age_edu, iu_divided_by_edu_age_pd_path, "internet-use-divided-by-age-education-level.csv")
    store_csv_from_datframe(df_iu_age_group, iu_divided_by_age_group_pd_path, "internet-use-divided-by-age-group.csv")
    store_csv_from_datframe(df_cu_age_group, cu_divided_by_age_group_pd_path, "computer-use-divided-by-age-group.csv")
    store_csv_from_datframe(df_iu, iu_pd_path, "internet-use.csv")