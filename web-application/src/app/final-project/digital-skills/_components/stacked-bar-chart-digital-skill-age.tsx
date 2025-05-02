'use client';

import { useEffect, useState } from 'react';
import * as d3 from 'd3';

import { useGetD3Csv } from '@/hooks/use-get-d3-csv';
import ChartContainer from '@/components/chart-container';
import { Skeleton } from '@/components/ui/skeleton';
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
import DatasetDataSource from '@/app/_components/dataset-datasource';
import Link from 'next/link';

interface StackedBarChartProps {}

const StackedBarChartAgeDigitalSkills: React.FC<StackedBarChartProps> = () => {
  const [stackedData, setData] = useState<StackedData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [uniqueYears, setUniqueYears] = useState<string[]>([]);

  const colors = ['#91aaff', '#ff9c38', '#00cc33'];

  // Get the data from the CSV file using D3
  const csvData = useGetD3Csv(
    'digital-skills/employed-persons-with-ict-education-by-age.csv',
    (d) => ({
      time: +d.time_period,
      country: d.geo,
      range: d.age,
      percentage: +d.obs_value
    })
  );

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

    // Process data for StackedBarChart
    const processedData: StackedData[] = Array.from(
      groupedData,
      ([country, values]) => {
        const entry: Record<string, any> = {
          entity: country
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
  }, [selectedYear]);

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
      <StackedBarChart
        data={stackedData}
        categories={categories}
        width={800}
        height={500}
        unitOfMeasurement="%"
        vertical={false}
        percentage={true}
        ml={80}
        mr={20}
      />
      <DatasetDataSource
        displayedName="Eurostats - Employed persons with ICT education by age"
        datasetInfos={
          <p>
            See more on the{' '}
            <Link
              className="text-blue-500"
              href="https://ec.europa.eu/eurostat/cache/metadata/en/isoc_ski_itemp_esms.htm"
            >
              dataset metadata
            </Link>
          </p>
        }
        dataSources={
          <p>
            Go to the dataset:{'  '}
            <Link
              className="text-blue-500"
              href="https://ec.europa.eu/eurostat/databrowser/view/isoc_ski_itage/default/table?lang=en&category=isoc.isoc_sk.isoc_skt.isoc_skt_"
            >
              Employed persons with ICT education by age
            </Link>
          </p>
        }
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
