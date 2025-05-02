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
import ShowMoreChartDetailsModalDialog from '@/app/assignments/_components/show-more-chart-details-modal-dialog';
import DataSourceInfo from '@/app/assignments/_components/data-source';

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
    'internet-access-level/internet-use.csv',
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

  return (
    <ChartContainer className="relative flex flex-col gap-8">
      <Sidebar>
        <H3>Percentage of individuals who have never used internet</H3>
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
        <DataSourceInfo>
          Eurostat, Individuals - internet use (2024);{' '}
          <ShowMoreChartDetailsModalDialog>
            <div className="mt-1 mb-4 mr-4 ml-4">
              <h2 className="mt-4 mb-4 font-serif text-xl xs:text-2xl sm:text-3xl">
                What you should know about this data
              </h2>
              <ul className="list-disc pl-5 text-base">
                <li>
                  The survey population of Individuals consists of all
                  individuals aged 16 to 74. On an optional basis, some
                  countries collect separate data on other age groups:
                  individuals aged 15 years or less, aged 75 or more.
                </li>
              </ul>
              <h2 className="font-serif mt-4 mb-2 text-xl xs:text-2xl sm:text-3xl">
                Methodologies
              </h2>
              <p className="text-base">
                The data are taken from the databases provided by "Eurostats"
                containing data on the last time an individual has used internet
                for all EU countries. The data are displayed on request
                depending on the selected year and country.
              </p>
              <h2 className="font-serif mt-4 mb-2 text-xl xs:text-2xl sm:text-3xl">
                Data Sources
              </h2>
              <ul className="list-disc pl-5 text-base">
                <li>
                  Eurostat: Individuals - internet use (id isoc_ci_ifp_iu, last
                  data update: 17/12/2024).
                </li>
              </ul>
            </div>
          </ShowMoreChartDetailsModalDialog>
        </DataSourceInfo>
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
