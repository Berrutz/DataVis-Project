import { useEffect, useState } from 'react';
import * as d3 from 'd3';

import { useGetD3Csv } from '@/hooks/use-get-d3-csv';
import ChartContainer from '@/components/chart-container';
import { Skeleton } from '@/components/ui/skeleton';
import { H3 } from '@/components/headings';
import StackedBarChart, {
  Category,
  StackedData
} from '@/components/charts/stackedBarChart';

interface StackedBarChartProps {
  newWidth: number;
  newHeight: number;
}

const StackedBarChartTest: React.FC<StackedBarChartProps> = ({
  newWidth,
  newHeight
}) => {
  const [stackedData, setData] = useState<StackedData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const colors = ['#34eb52', '#34d5eb'];

  // Get the data from the csv file using D3
  const csvData = useGetD3Csv(
    'assignment1/top5-emitter-and-other-2022-eu.csv',
    (d) => ({
      entity: d.Entity,
      year: +d.Year,
      emission: +d['Annual CO₂ emissions (per capita)']
    })
  );

  useEffect(() => {
    if (csvData === null || csvData.length <= 0) return;

    // Sort data to get top 5 emitters
    const sortedData = csvData
      .filter((d) => d.entity !== 'Others') // Ignore "Others"
      .sort((a, b) => b.emission - a.emission);

    const top5 = sortedData.slice(0, 5);

    // Find row "Others"
    const othersData = csvData.find((d) => d.entity === 'Others');
    if (!othersData) {
      console.error("No 'Others' data found in the dataset.");
      return;
    }

    // Calcola i dati strutturati per ogni paese
    const processedData = top5.map((emitter) => {
      // Calcola "Other" come somma della riga "Others" e delle altre 4 nazioni (escludendo quella corrente)
      const otherSum =
        othersData.emission +
        top5
          .filter((d) => d.entity !== emitter.entity) // Esclude il paese corrente
          .reduce((sum, d) => sum + d.emission, 0);

      return {
        entity: emitter.entity,
        country: emitter.emission,
        other: otherSum
      };
    });
    setData(processedData);

    const keys = Object.keys(processedData[0]).filter(
      (key) => key !== 'entity'
    );
    const combinedArray: Category[] = keys.map((value, index) => ({
      name: value,
      color: colors[index] ?? '000' // Use an empty string if array2 is shorter
    }));
    setCategories(combinedArray);

    
  }, [csvData]);

  // The csv is not yet loaded or
  // the default selection has not already initializated or
  // neither one of the x value and y value state for the barchart has been initializated
  if (
    csvData === null ||
    stackedData === undefined ||
    stackedData.length <= 0 ||
    categories.length <= 0
  ) {
    return (
      <ChartContainer>
        <Skeleton className="w-full bg-gray-200 rounded-xl h-[500px]" />
      </ChartContainer>
    );
  }

  // The csv is loaded but no data has been found
  if (csvData.length <= 0) {
    throw Error('Cannot retrieve the data from the csv');
  }

  return (
    <ChartContainer className="flex flex-col gap-8">
      <H3>Frequency of internet use divided by age groups</H3>
      <StackedBarChart
        data={stackedData}
        categories={categories}
        width={newWidth}
        height={newHeight}
        unitOfMeasurement="%"
        vertical={true}
        percentage={true}
      ></StackedBarChart>
    </ChartContainer>
  );
};

export default StackedBarChartTest;
