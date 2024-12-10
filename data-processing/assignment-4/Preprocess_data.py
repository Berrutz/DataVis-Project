import csv
import os

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
