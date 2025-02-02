import pandas as pd

DATASET_2019 = "../processed-datasets/ilods-2019.csv"
DATASET_2021 = "../processed-datasets/ilods-2021.csv"

df_2019 = pd.read_csv(DATASET_2019)
df_2021 = pd.read_csv(DATASET_2021)

df_2019 = df_2019[~df_2019["geo"].str.contains("Euro", na=False)]
df_2019 = df_2019[~df_2019["geo"].str.contains("European", na=False)]

df_2021 = df_2021[~df_2021["geo"].str.contains("Euro", na=False)]
df_2021 = df_2021[~df_2021["geo"].str.contains("European", na=False)]

df_2019.set_index(["time_period", "geo"], inplace=True)
df_2021.set_index(["time_period", "geo"], inplace=True)

result = pd.concat([df_2019, df_2021])

result.sort_index()
result = result[result["ind_type"] == "All individuals"]

result.to_csv("../processed-datasets/ilods-final.csv")
