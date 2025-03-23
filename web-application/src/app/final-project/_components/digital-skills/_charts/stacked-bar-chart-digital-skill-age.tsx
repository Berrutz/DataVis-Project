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

const StackedBarcharAgeDigitalSkills: React.FC<StackedBarChartProps> = ({
      newWidth,
      newHeight
    }) => {


      const [stackedData, setData] = useState<StackedData[]>([]);
      const [categories, setCategories] = useState<Category[]>([]);

      const colors = ['#34eb52', '#34d5eb'];

      // Get the data from the csv file using D3
      const csvData = useGetD3Csv(
        'digital-skills/Employed-ICT-education-age.csv',
        (d) => ({
        time: +d.time_period,
        country: d.geo,
        range: d.age,
        percentage: +d.obs_value
        })
      );

      console.log("CsvData : " ,csvData);

      useEffect(() => {

        if (csvData === null || csvData.length <= 0) return;
    
        // data already sorted in pre-processing
    
        // TODO : use setData and setCategories to pass at the StackedBarChart

        // Raggruppiamo i dati per paese e creiamo la struttura per lo stacked bar chart
        const groupedData = d3.group(csvData, (d) => d.country);

        const processedData: StackedData[] = Array.from(groupedData, ([country, values]) => {
        const entry: Record<string, any> = { entity: country };
        values.forEach((d) => {
            entry[d.range] = d.percentage;
        });
        return entry as StackedData;
        });

        setData(processedData);

        // Otteniamo tutte le fasce d'età presenti nei dati
        const ageGroups = Array.from(new Set(csvData.map((d) => d.range)));
        const categoryList: Category[] = ageGroups.map((group, index) => ({
        name: group,
        color: colors[index % colors.length] // Cicla sui colori disponibili
        }));
        setCategories(categoryList);
        
      }, [csvData]);

      if (!csvData || stackedData.length === 0 || categories.length === 0) {
        return (
          <ChartContainer>
            <Skeleton className="w-full bg-gray-200 rounded-xl h-[500px]" />
          </ChartContainer>
        );
      }
      
      

  return (
      <ChartContainer className="flex flex-col gap-8">
        <H3>Employed persons with ICT education by age</H3>
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

export default StackedBarcharAgeDigitalSkills;
