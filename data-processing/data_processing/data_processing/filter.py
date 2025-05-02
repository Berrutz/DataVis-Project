from pandas import DataFrame

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
]


def remove_non_eu_countires(dataframe: DataFrame, geo_column_name: str) -> DataFrame:
    """
    Filter out non eu countries from the dataframe given the column that identifies the
    geographical information (aka country name).

    :param dataframe: The dataframe to be filtered.
    :param geo_column_name: The column name that identifies the geographical information.
    :return: The dataframe filtered without the non eu countries.
    """

    mask = dataframe[geo_column_name].isin(EU_COUNTRIES)
    df_filtered = dataframe[mask]

    if not isinstance(df_filtered, DataFrame):
        raise Exception("Canno remove the non eu countries")
    return df_filtered
