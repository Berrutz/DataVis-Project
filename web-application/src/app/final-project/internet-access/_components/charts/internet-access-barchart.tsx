import ChartContainer from '@/components/chart-container';
import { ChartSidebar } from '@/components/chart-sidebar';
import BarChart, { Point } from '@/components/charts/barchart';
import { H3 } from '@/components/headings';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Sidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetD3Csv } from '@/hooks/use-get-d3-csv';
import { getUnique } from '@/utils/general';
import * as d3 from 'd3';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface BarchartDataWrap {
  x: string[];
  y: number[];
}

interface InternetAccessBarChartProps {
  newWidth: number;
  newHeight: number;
}

const InternetAccessBarChart: React.FC<InternetAccessBarChartProps> = ({
  newWidth,
  newHeight
}) => {
  const [selectedYear, setSelectedYear] = useState<string>();
  const [selectedCountries, setSelectedCountries] = useState<Point[]>([]);
  const [barchartData, setBarchartData] = useState<BarchartDataWrap | null>(
    null
  );

  // Get the data from the csv file using D3
  const csvData = useGetD3Csv(
    'internet-access-level/internet-access.csv',
    (d) => ({
      country: d.Country,
      year: +d.Year,
      value: +d.Value
    })
  );

  // Choose the default selection values when the csv is loaded and fullfilled
  useEffect(() => {
    if (csvData === null || csvData.length <= 0) return;

    // As default choose the most recent year
    const years = csvData.map((value) => value.year);
    const selectedYear = Math.max(...years);

    // Set the first default selection for the first barchart visualization
    setSelectedYear(selectedYear.toString());
  }, [csvData]);

  // Filter data based on the selected options
  useEffect(() => {
    if (!selectedYear || csvData === null) return;

    const filteredData = csvData.filter((d) => d.year === +selectedYear);

    filteredData.sort((a, b) => b.value - a.value);

    // Set X and Y data to be passed to the BarChart component
    setBarchartData({
      x: filteredData.map((d) => d.country),
      y: filteredData.map((d) => d.value)
    });

    // Default: all countries are selected
    setSelectedCountries(
      filteredData.map((d) => {
        return {
          x: d.country,
          y: d.value
        };
      })
    );
  }, [selectedYear]);

  // The csv is not yet loaded or
  // the default selection has not already initializated or
  // neither one of the x value and y value state for the barchart has been initializated
  if (
    !selectedYear ||
    csvData === null ||
    barchartData === null ||
    selectedCountries === null
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

  // Unique years to make the user input selections
  const uniqueYears = getUnique(
    csvData.map((value) => value.year),
    (a, b) => b - a
  );

  // Toggle countries selection
  const handleCountriesSelection = (point: Point) => {
    setSelectedCountries((prev) => {
      // Check if the country is already selected
      if (prev.some((d) => d.y === point.y)) {
        return prev.filter((c) => c.y !== point.y); // Remove if already selected
      } else {
        // Add the new country and sort by y
        return [...prev, point].sort((a, b) => b.y - a.y);
      }
    });
  };

  // Create all countries group and sort them alphabetically by country name
  const allCountriesGroup = barchartData.x
    .map((x, index) => ({ x, y: barchartData.y[index] })) // Pair x and y
    .sort((a, b) => a.x.localeCompare(b.x)); // Sort based on x values (ascending)

  const selectedCountriesGroup = allCountriesGroup.filter((country) =>
    selectedCountries.some((point) => point.x === country.x)
  );

  return (
    <ChartContainer className="sm:relative flex flex-col overflow-hidden gap-8">
      <Sidebar>
        <H3>Different countries compared by internet access level</H3>
        <div className="flex justify-end">
          <SidebarTrigger
            variant={'outline'}
            className="font-medium text-base w-full xs:w-64"
          >
            <div className="flex items-center">
              <Pencil className="min-w-5 min-h-5 mr-2 text-gray-500" />
              Edit countries and regions
            </div>
          </SidebarTrigger>
        </div>
        {/* Bar Chart */}
        <BarChart
          x={selectedCountries.map((point) => point.x)}
          y={selectedCountries.map((point) => point.y)}
          width={newWidth}
          height={newHeight}
          colorInterpoaltor={d3.interpolateReds}
          ml={55}
          mr={15}
          mb={70}
          yLabelsSuffix="%"
          vertical={true}
        ></BarChart>
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="sm:w-1/3">
            <label>Year</label>
            <Select
              onValueChange={setSelectedYear}
              defaultValue={selectedYear.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {uniqueYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Sidebar Content */}
        <ChartSidebar
          items={allCountriesGroup}
          selectedItems={selectedCountriesGroup}
          onSelectionChange={handleCountriesSelection}
          onClearSelection={() => setSelectedCountries([])}
          displayKey="x" // The field to display
          isChecked={(point) => selectedCountries.some((d) => d.x === point.x)}
          chartid="internet-access-barchart"
        />
      </Sidebar>
    </ChartContainer>
  );
};

export default InternetAccessBarChart;
