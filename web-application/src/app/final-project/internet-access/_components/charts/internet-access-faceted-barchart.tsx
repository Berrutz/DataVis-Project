import DataSourceInfo from '@/app/assignments/_components/data-source';
import ShowMoreChartDetailsModalDialog from '@/app/assignments/_components/show-more-chart-details-modal-dialog';
import ChartContainer from '@/components/chart-container';
import { ChartSidebar } from '@/components/chart-sidebar';
import FacetedBarChart, {
  FacetedPoint
} from '@/components/charts/FacetedBarChart';
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
import { getStaticFile, getUnique } from '@/utils/general';
import * as d3 from 'd3';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FacetedGroup {
  name: string; // Reason name
  value: number; // Percentage of people that don't have internet for the specific reason
}

interface FacetedGroupedData {
  groups: FacetedGroup[]; // reasons and their values
  category: string; // Countries
}

interface InternetAccessFacetedBarChartProps {
  newWidth: number;
  newHeight: number;
}

const InternetAccessFacetedBarChart: React.FC<
  InternetAccessFacetedBarChartProps
> = ({ newWidth, newHeight }) => {
  const [selectedCountries, setSelectedCountries] = useState<
    FacetedGroupedData[]
  >([]);
  const [selectedYear, setSelectedYear] = useState<string>(); // Set default year here
  const [facetedData, setFacetedData] = useState<FacetedGroupedData[]>([]);
  const defaulCountiresSelected = 10;

  // Get the data from the csv file using D3
  const csvData = useGetD3Csv(
    'internet-access-level/reasons-not-have-internet-access.csv',
    (d) => ({
      reason: d.Reason,
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

  useEffect(() => {
    if (!selectedYear || csvData === null) return;

    // Filter data based on the selected year
    const filteredData = csvData
      .filter((d) => d.year === +selectedYear)
      .sort((a, b) => a.country.localeCompare(b.country));

    if (filteredData.length === 0) return;

    // Cast the data into an object usefull for the FacetedBarChart
    const groupedFacetedData: FacetedGroupedData[] = Object.values(
      filteredData.reduce((acc, { country, reason, value }) => {
        if (!acc[country]) {
          acc[country] = { category: country, groups: [] };
        }

        acc[country].groups.push({ name: reason, value });

        return acc;
      }, {} as Record<string, FacetedGroupedData>)
    );

    setFacetedData(groupedFacetedData);

    if (selectedCountries === null || selectedCountries.length <= 0) {
      setSelectedCountries(
        groupedFacetedData.slice(0, defaulCountiresSelected)
      );
    } else {
      setSelectedCountries(
        groupedFacetedData.filter((item) =>
          selectedCountries.some(
            (filterItem) => filterItem.category === item.category
          )
        )
      );
    }
  }, [selectedYear]);

  // The csv is not yet loaded or
  // the default selection has not already initializated or
  // neither one of the x value and y value state for the barchart has been initializated
  if (
    !selectedYear ||
    csvData === null ||
    facetedData === null ||
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
  const handleCountriesSelection = (point: FacetedGroupedData) => {
    setSelectedCountries((prev) => {
      // Check if the country is already selected
      if (prev.some((d) => d.category === point.category)) {
        return prev.filter((c) => c.category !== point.category); // Remove if already selected
      } else {
        // Add the new country and sort by category
        return [...prev, point].sort((a, b) =>
          a.category.localeCompare(b.category)
        );
      }
    });
  };

  // Create all countries group and sort them alphabetically by country name
  const allCountriesGroup = facetedData.sort((a, b) =>
    a.category.localeCompare(b.category)
  );

  const selectedCountriesGroup = allCountriesGroup.filter((facetedPoint) =>
    selectedCountries.some((d) => d.category === facetedPoint.category)
  );

  const transformToFacetedPoints = (
    data: FacetedGroupedData[]
  ): FacetedPoint[] =>
    data.flatMap(({ category, groups }) =>
      groups.map(({ name, value }) => ({
        group: name, // 'reason' becomes the group (y-axis)
        category, // 'country' becomes the category (x-axis)
        value // 'value' remains the same
      }))
    );

  return (
    <ChartContainer className="relative flex flex-col gap-8">
      <Sidebar>
        <H3>Reasons for not having internet access at home</H3>
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
        <FacetedBarChart
          data={transformToFacetedPoints(selectedCountries)}
          width={newWidth}
          height={newHeight}
          unitOfMeasurement="%"
          ml={115}
        ></FacetedBarChart>
        <DataSourceInfo>
          Eurostat, Households - reasons for not having internet access at home
          (2019);{' '}
          <ShowMoreChartDetailsModalDialog>
            <div className="mt-1 mb-4 mr-4 ml-4">
              <h2 className="mt-4 mb-4 font-serif text-xl xs:text-2xl sm:text-3xl">
                What you should know about this data
              </h2>
              <ul className="list-disc pl-5 text-base">
                <li>
                  The survey population of Households consists of all private
                  households having at least one member in the age group 16 to
                  74 years.
                </li>
              </ul>
              <h2 className="font-serif mt-4 mb-2 text-xl xs:text-2xl sm:text-3xl">
                Methodologies
              </h2>
              <p className="text-base">
                To create the graph, data provided by "Eurostat" were taken
                regarding the reasons of householders for not having internet at
                home. The data were then grouped by year and by country or
                region. The data are displayed on request depending on the
                selected year and countries/regions.
              </p>
              <h2 className="font-serif mt-4 mb-2 text-xl xs:text-2xl sm:text-3xl">
                Data Sources
              </h2>
              <ul className="list-disc pl-5 text-base">
                <li>
                  Eurostat: Households - reasons for not having internet access
                  at home (id isoc_pibi_rni, last data update: 16/06/2024)
                </li>
              </ul>
            </div>
          </ShowMoreChartDetailsModalDialog>
        </DataSourceInfo>
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
          displayKey="category"
          isChecked={(facetedPoint) =>
            selectedCountries.some((d) => d.category === facetedPoint.category)
          }
          chartid="internet-access-faceted-barchart"
        />
      </Sidebar>
    </ChartContainer>
  );
};

export default InternetAccessFacetedBarChart;
