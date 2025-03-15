import ChartContainer from '@/components/chart-container';
import LineChart, { Line } from '@/components/charts/linechart';
import { H3 } from '@/components/headings';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetD3Csv } from '@/hooks/use-get-d3-csv';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import chroma from 'chroma-js';
import { Sidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { ChartSidebar } from '@/components/chart-sidebar';
import { Pencil } from 'lucide-react';

interface InternetUseLineChartProps {
  newWidth: number;
  newHeight: number;
}

const InternetUseLineChart: React.FC<InternetUseLineChartProps> = ({
  newWidth,
  newHeight
}) => {
  const [selectedCountries, setSelectedCountries] = useState<Line[]>([]);
  const [lines, setLines] = useState<Line[]>([]);

  const defaultCountries = ['Italy', 'Germany', 'France', 'Romania'];

  // Get the data from the csv file using D3
  const csvData = useGetD3Csv(
    'internet-access-level/internet-access.csv',
    (d) => ({
      country: d.Country,
      year: +d.Year,
      value: +d.Value
    })
  );

  useEffect(() => {
    if (csvData === null || csvData.length <= 0) return;

    // Group data by country
    const grouped = d3.group(csvData, (d) => d.country);

    // Generate colors for the countries
    const colors = chroma.scale('Paired').colors(grouped.size);

    const Lines = Array.from(grouped.entries()).map(
      ([country, data], index) => {
        // Order data by year
        const sortedData = data.sort((a, b) => a.year - b.year);

        return {
          x: sortedData.map((d) => d.year.toString()),
          y: sortedData.map((d) => d.value),
          color: colors[index], // Assign unique color
          tag: country, // Country name
          scatter: false // Default to line chart
        };
      }
    );

    // Transform into `Line` objects
    setLines(Lines);
  }, [csvData]);

  // When the lines objects are constructed select only the default selected countries
  useEffect(() => {
    if (lines === null || lines.length <= 0) return;

    setSelectedCountries(
      lines.filter((line) => defaultCountries.includes(line.tag))
    );
  }, [lines]);

  // The csv is not yet loaded or
  // the default selection has not already initializated or
  // neither one of the x value and y value state for the barchart has been initializated
  if (csvData === null || lines === null || selectedCountries === null) {
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

  // Toggle countries selection
  const handleCountriesSelection = (line: Line) => {
    setSelectedCountries((prev) => {
      // Check if the country is already selected
      if (prev.some((d) => d.tag === line.tag)) {
        return prev.filter((c) => c.tag !== line.tag); // Remove if already selected
      } else {
        // Add the new country and sort by x (years in this case)
        return [...prev, line].sort((a, b) => +a.x - +b.x);
      }
    });
  };

  // Create all countries group and sort them alphabetically by country name
  const allCountriesGroup = lines.sort((a, b) => a.tag.localeCompare(b.tag)); // Sort based on x values (ascending)

  // Create selected countries group from the already sorted allCountriesGroup
  const selectedCountriesGroup = allCountriesGroup.filter((line) =>
    selectedCountries.some((d) => d.tag === line.tag)
  );

  console.log(selectedCountries);

  return (
    <ChartContainer className="sm:relative flex flex-col overflow-hidden gap-8">
      <Sidebar>
        <H3>Internet use for countries and regions</H3>
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
        <LineChart
          data={selectedCountries}
          width={newWidth}
          height={newHeight}
          unitOfMeasurement="%"
          ml={45}
          xLabelsFontSize="0.7rem"
          yUpperBound={100}
          yLowerBound={0}
        ></LineChart>
        {/* Sidebar Content */}
        <ChartSidebar
          items={allCountriesGroup}
          selectedItems={selectedCountriesGroup}
          onSelectionChange={handleCountriesSelection}
          onClearSelection={() => setSelectedCountries([])}
          displayKey="tag"
          isChecked={(line) =>
            selectedCountries.some((d) => d.tag === line.tag)
          }
          chartid="internet-use-linechart"
        />
      </Sidebar>
    </ChartContainer>
  );
};

export default InternetUseLineChart;
