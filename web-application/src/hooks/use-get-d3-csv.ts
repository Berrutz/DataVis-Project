import { getStaticFile } from '@/utils/general';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';

export function useGetD3Csv<
  ParsedRow extends object,
  Columns extends string = string
>(
  datasetPath: string,
  row: (
    rawRow: d3.DSVRowString<Columns>,
    index: number,
    columns: Columns[]
  ) => ParsedRow | undefined | null
) {
  // The data retrieve from the csv
  const [csvData, setCsvData] = useState<ParsedRow[] | null>(null);

  // Function used to fetch data from the csv file
  const fetchCSV = async () => {
    var data = await d3.csv(getStaticFile(`/datasets/${datasetPath}`), row);
    setCsvData(data);
  };

  useEffect(() => {
    fetchCSV();
  }, []);

  return csvData;
}
