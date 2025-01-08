import { Data } from './interfaces';

export function groupByDecade(data: Data[]) {
  const groupedData: Record<string, { values: number[] }> = {};

  // Raggruppa i dati per decadi
  data.forEach((d) => {
    const decade = Math.floor(d.year / 10) * 10; // Calcola il decennio
    if (!groupedData[decade]) {
      groupedData[decade] = { values: [] }; // Inizializza l'array per il decennio se non esiste
    }
    // Aggiungi il valore al decennio appropriato
    groupedData[decade].values.push(d.value);
  });

  return groupedData;
}
