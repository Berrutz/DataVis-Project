import csv
import os
import pandas as pd
import sys
sys.path.append('.\\original-datasets')
import country_indexes as countries

class CSV_ENTRIES:
    STATE_CODE = "state_code"
    DIVISION_NUMBER = "division_number"
    ELEMENT_CODE = "element_code"
    YEAR = "year"
    MONTH = "month"
    VALUE = "value"

REGIONS = [
    "Northeast Region",
    "East North Central Region",
    "Central Region",
    "Southeast Region",
    "West North Central Region",
    "South Region",
    "Southwest Region",
    "Northwest Region",
    "West Region",
]

def process_to_csv(input_file, output_file):
    if not os.path.exists(input_file):
        raise FileNotFoundError(f"Input file '{input_file}' does not exist.")

    with open(input_file, 'r') as infile, open(output_file, 'w', newline='') as outfile:
        writer = csv.writer(outfile)

        # Scrittura dell'intestazione del CSV
        writer.writerow(["state_code", "division_number", "element_code", "year", "month", "value"])

        for line in infile:
            # Parsing dei dati basato sulla posizione
            state_code = line[0:3].strip()
            division_number = line[3:4].strip()
            element_code = line[4:6].strip()
            year = int(line[6:10].strip())
            values = line[10:].strip().split()

            if len(values) != 12:
                raise ValueError(f"La riga non contiene esattamente 12 valori: {line}")

            # Creazione di un record per ogni mese
            for month_index, value in enumerate(values, start=1):
                writer.writerow([
                    state_code,
                    division_number,
                    element_code,
                    year,
                    month_index,  # Mese (1-12)
                    float(value) if value != '-99.90' else None  # Sostituisci -99.90 con None
                ])

# Specifica le cartelle di destinazione
pre_processing_folder = ".\\processed-datasets\\"
output_folder = ".\\..\\..\\web-application\\public\\datasets\\assignment4\\"

# Lista dei file di input
input_files = [
    ".\\original-datasets\\Max.txt",
    ".\\original-datasets\\Min.txt",
    ".\\original-datasets\\Avg.txt"
]

# Nomi dei file CSV corrispondenti
csv_names = [
    "Max.csv",
    "Min.csv",
    "Avg.csv"
]

DATA_PATH = os.getcwd() + "\\processed-datasets\\"

# Load CSV
def load_csv(file):
    file_path = os.path.join(pre_processing_folder, file)
    return pd.read_csv(file_path)

def store_csv_from_datframe(dataframe: pd.DataFrame, csv_name):
    # Store the dataframe in the processed dataset folder
    # and the folder of the web application (static/public files)
    processed_dataset_path = os.path.join (pre_processing_folder, csv_name)
    
    web_application_path = os.path.join(output_folder, csv_name)

    dataframe.to_csv(processed_dataset_path, index=False)
    dataframe.to_csv(web_application_path, index=False)

def process_and_merge_data():
    # Load the datasets 
    df_max = load_csv(csv_names[0])
    df_min = load_csv(csv_names[1])
    df_avg = load_csv(csv_names[2])

    # DROP DIVISION_NUMBER Coloum
    df_max = df_max.drop(CSV_ENTRIES.DIVISION_NUMBER, axis=1)
    df_min = df_min.drop(CSV_ENTRIES.DIVISION_NUMBER, axis=1)
    df_avg = df_avg.drop(CSV_ENTRIES.DIVISION_NUMBER, axis=1)

    print(df_max.shape)

    # Convert the array of objects into a Dataframe
    df_countries = pd.DataFrame(countries.get_sorted_countries())

    # Merge on 'index' from df_countries and 'state_code' from the csv files
    df_max = pd.merge(df_max, df_countries, left_on="state_code", right_on="index", how="left")
    df_min = pd.merge(df_min, df_countries, left_on="state_code", right_on="index", how="left")
    df_avg = pd.merge(df_avg, df_countries, left_on="state_code", right_on="index", how="left")

    # Keep only the states, nation and rempoves rows with empty country name
    index = 110
    df_max = df_max[df_max["state_code"] <= index]
    df_min = df_min[df_min["state_code"] <= index]
    df_avg = df_avg[df_avg["state_code"] <= index]

    df_max = df_max[~df_max["country"].isin(REGIONS)]
    df_min = df_min[~df_min["country"].isin(REGIONS)]
    df_avg = df_avg[~df_avg["country"].isin(REGIONS)]

    # Drop rows with NaN in 'country'
    df_max = df_max.dropna(subset=["country"])
    df_min = df_min.dropna(subset=["country"])
    df_avg = df_avg.dropna(subset=["country"])

    # Drop the rows in which the "value" is null
    df_max = df_max.dropna(subset=["value"])
    df_min = df_min.dropna(subset=["value"])
    df_avg = df_avg.dropna(subset=["value"])

    # Drop the redundant 'index' column
    df_max.drop(columns=["index"], inplace=True)
    df_min.drop(columns=["index"], inplace=True)
    df_avg.drop(columns=["index"], inplace=True)

    # DROP ELEMENT_CODE Coloum
    df_max = df_max.drop(CSV_ENTRIES.ELEMENT_CODE, axis=1)
    df_min = df_min.drop(CSV_ENTRIES.ELEMENT_CODE, axis=1)
    df_avg = df_avg.drop(CSV_ENTRIES.ELEMENT_CODE, axis=1)

    print(df_max.head())

    return df_max, df_min, df_avg

if __name__ == "__main__":
    for input_file, csv_name in zip(input_files, csv_names):
        # Crea i percorsi completi per entrambi i file CSV di output
        pre_processing_output_file = os.path.join(pre_processing_folder, csv_name)
        web_app_output_file = os.path.join(output_folder, csv_name)
        
        try:
            # Salva i dati in entrambe le cartelle
            process_to_csv(input_file, pre_processing_output_file)
            process_to_csv(input_file, web_app_output_file)
            print(f"Dati processati e salvati in formato CSV: {pre_processing_output_file} e {web_app_output_file}")
        except (FileNotFoundError, ValueError) as e:
            print(f"Errore con il file {input_file}: {e}")
    
    df_max, df_min, df_avg = process_and_merge_data()
    store_csv_from_datframe(df_max, csv_names[0])
    store_csv_from_datframe(df_min, csv_names[1])
    store_csv_from_datframe(df_avg, csv_names[2])

