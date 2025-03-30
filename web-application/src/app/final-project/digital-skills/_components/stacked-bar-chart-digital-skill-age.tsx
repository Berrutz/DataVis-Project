'use client';

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface StackedBarChartProps {
  newWidth: number;
  newHeight: number;
}

const StackedBarChartAgeDigitalSkills: React.FC<StackedBarChartProps> = ({
  newWidth,
  newHeight
}) => {
  const [stackedData, setData] = useState<StackedData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [uniqueYears, setUniqueYears] = useState<string[]>([]);

  const colors = ['#34eb52', '#34d5eb', '#336ad0'];

  // Get the data from the CSV file using D3
  const csvData = useGetD3Csv(
    'digital-skills/Employed-ICT-education-age.csv',
    (d) => ({
      time: +d.time_period,
      country: d.geo,
      range: d.age,
      percentage: +d.obs_value
    })
  );

  console.log('CsvData:', csvData);

  // Extract unique years when CSV data is loaded
  useEffect(() => {
    if (!csvData || csvData.length === 0) return;

    const years = Array.from(new Set(csvData.map((d) => d.time.toString())));
    setUniqueYears(years);

    if (!selectedYear) {
      setSelectedYear(years[0]); // Set the first year as default
    }
  }, [csvData]);

  // Process data when selectedYear changes
  useEffect(() => {
    if (!selectedYear || csvData!.length === 0) return;

    // Filter data for the selected year
    const filteredData = csvData!.filter(
      (d) => d.time.toString() === selectedYear
    );

    // Group data by country
    const groupedData = d3.group(filteredData, (d) => d.country);

    // Function to truncate country names
    const truncateCountryName = (name: string, maxLength: number = 3) =>
      name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;

    // Process data for StackedBarChart
    const processedData: StackedData[] = Array.from(
      groupedData,
      ([country, values]) => {
        const entry: Record<string, any> = {
          entity: truncateCountryName(country)
        };
        values.forEach((d) => {
          entry[d.range] = d.percentage;
        });
        return entry as StackedData;
      }
    );

    setData(processedData);

    // Extract unique age ranges for categories
    const ageGroups = Array.from(new Set(filteredData.map((d) => d.range)));
    const categoryList: Category[] = ageGroups.map((group, index) => ({
      name: group,
      color: colors[index % colors.length] // Rotate through available colors
    }));
    setCategories(categoryList);
  }, [selectedYear, csvData]);

  // Show loading skeleton if data isn't ready
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
      />
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="sm:w-full">
          <label>Year</label>
          <Select value={selectedYear || ''} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {uniqueYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </ChartContainer>
  );
};

export default StackedBarChartAgeDigitalSkills;
