import { useEffect, useState } from 'react';
import * as d3 from 'd3';

import Alluvial, { AlluvialData } from '@/components/charts/alluvial';
import { useGetD3Csv } from '@/hooks/use-get-d3-csv';
import { foundOrFirst, getUnique } from '@/utils/general';
import ChartContainer from '@/components/chart-container';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { H3 } from '@/components/headings';

interface InternetUseAlluvialProps {
  newWidth: number;
  newHeight: number;
}

interface Data {
  lastInternetUse: string; // The category
  ageGroup: string; // The age group
  country: string; // Country name
  year: number; // year considered
  value: number; // percentage
  population: number; // population in that age group for the relative country
}

const InternetUseAlluvial: React.FC<InternetUseAlluvialProps> = ({
  newWidth,
  newHeight
}) => {
  const [alluvialData, setData] = useState<AlluvialData>();
  const [selectedYear, setSelectedYear] = useState<string>(); // Set default year here
  const [selectedCountry, setSelectedCountry] = useState<string>(); // Set default country here

  const colors = ['#ffb3ba', '#ffdfba', '#baffc9', '#bae1ff'];

  // Get the data from the csv file using D3
  const csvData = useGetD3Csv(
    'final-project/use-of-the-internet/freq/internet-use-divided-by-age-group.csv',
    (d) => ({
      lastInternetUse: d['Last internet use'],
      ageGroup: d['Age group'],
      country: d.Country,
      year: +d.Year,
      value: +d.Value,
      population: +d.Population
    })
  );

  // Choose the default selection values when the csv is loaded and fullfilled
  useEffect(() => {
    if (csvData === null || csvData.length <= 0) return;

    // As default choose the most recent year
    const years = csvData.map((value) => value.year);
    const selectedYear = Math.max(...years);

    // As default indic_is choose `Individuals with no overall digital skills` or the first one in alphabetical order
    const countryList = csvData.map((value) => value.country);
    const selectedCountry = foundOrFirst('Italy', countryList);

    // Set the first default selection for the first barchart visualization
    setSelectedYear(selectedYear.toString());
    setSelectedCountry(selectedCountry);
  }, [csvData]);

  useEffect(() => {
    if (!selectedYear || !selectedCountry || csvData === null) return;

    const filteredData = csvData
      .filter((d) => d.year === +selectedYear)
      .filter((d) => d.country === selectedCountry);

    const adjustedData = filteredData.map((d) => ({ ...d })); // Clone to avoid mutating original data

    // Group data by ageGroup
    const groupedByAge = adjustedData.reduce<Record<string, Data[]>>(
      (map, d) => {
        if (!map[d.ageGroup]) {
          map[d.ageGroup] = []; // Initialize array if it doesn't exist
        }
        map[d.ageGroup].push(d);
        return map;
      },
      {}
    ); // Explicitly define initial value as Record<string, Data[]>

    // Adjust values for each age group
    Object.values(groupedByAge).forEach((group) => {
      const totalValue = group.reduce((sum, d) => sum + d.value, 0);
      const missingValue = 100 - totalValue;

      if (missingValue !== 0) {
        group.forEach((d) => {
          d.value += (d.value / totalValue) * missingValue;
        });
      }
    });

    // compute the population of each age group for a specific category
    adjustedData.forEach((d) => {
      d.population = Math.ceil((d.population * d.value) / 100);
    });

    // Initialize the starting nodes made of age groups
    const ageGroupSortedByPopulation = adjustedData
      .filter((d) => d.lastInternetUse === adjustedData[0].lastInternetUse)
      .sort((a, b) => b.population - a.population)
      .map((d) => d.ageGroup);

    // Initialize the 2° nodes column made of the categories
    // Group data by lastInternetUse and calculate total sum per category
    const groupedByInternetUse = adjustedData.reduce<Record<string, number>>(
      (map, d) => {
        if (!map[d.lastInternetUse]) {
          map[d.lastInternetUse] = 0;
        }
        map[d.lastInternetUse] += d.value; // Sum up values
        return map;
      },
      {}
    );

    // Sort lastInternetUse categories based on total summed value (descending)
    const sortedInternetUseCategories = Object.entries(groupedByInternetUse)
      .sort((a, b) => b[1] - a[1]) // Sort by summed value (descending)
      .map(([category]) => category); // Extract just the sorted category names

    setData({
      nodes: [ageGroupSortedByPopulation, sortedInternetUseCategories],
      links: adjustedData.map((d) => ({
        source: d.ageGroup,
        target: d.lastInternetUse,
        value: d.population
      }))
    });
  }, [selectedYear, selectedCountry]);

  // The csv is not yet loaded or
  // the default selection has not already initializated or
  // neither one of the x value and y value state for the barchart has been initializated
  if (
    !selectedYear ||
    !selectedCountry ||
    csvData === null ||
    alluvialData === undefined
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

  // Unique years and indic_is to make the user input selections
  const uniqueIndicIs = getUnique(csvData.map((value) => value.country));
  const uniqueYears = getUnique(
    csvData.map((value) => value.year),
    (a, b) => b - a
  );
  return (
    <ChartContainer className="flex flex-col ">
      {/*<H3>Frequency of internet use divided by age groups</H3> */}
      <Alluvial
        data={alluvialData}
        width={newWidth}
        height={newHeight}
        colors={colors}
        tooltipSuffix="k individuals"
        scalingFactor={1000}
        mr={125}
      ></Alluvial>
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
        <div className="sm:w-full">
          <label>Country</label>
          <Select
            onValueChange={setSelectedCountry}
            defaultValue={selectedCountry}
          >
            <SelectTrigger>
              <SelectValue placeholder="Digital Skill Level" />
            </SelectTrigger>
            <SelectContent>
              {uniqueIndicIs.map((indicIs) => (
                <SelectItem key={indicIs} value={indicIs.toString()}>
                  {indicIs}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </ChartContainer>
  );
};

export default InternetUseAlluvial;
