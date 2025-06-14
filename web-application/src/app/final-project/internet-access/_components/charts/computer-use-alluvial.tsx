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
import DataSourceInfo from '@/app/assignments/_components/data-source';
import ShowMoreChartDetailsModalDialog from '@/app/assignments/_components/show-more-chart-details-modal-dialog';

interface ComputerUseAlluvialProps {
  newWidth: number;
  newHeight: number;
}

interface Data {
  lastComputerUse: string; // The category
  ageGroup: string; // The age group
  country: string; // Country name
  year: number; // year considered
  value: number; // percentage
  population: number; // population in that age group for the relative country
}

const ComputerUseAlluvial: React.FC<ComputerUseAlluvialProps> = ({
  newWidth,
  newHeight
}) => {
  const [alluvialData, setData] = useState<AlluvialData>();
  const [selectedYear, setSelectedYear] = useState<string>(); // Set default year here
  const [selectedCountry, setSelectedCountry] = useState<string>(); // Set default country here

  const colors = ['#ffb3ba', '#ffdfba', '#baffc9', '#bae1ff'];

  const ageGroupOrder = [
    '16 to 24 years old',
    '25 to 54 years old',
    '55 to 74 years old',
    '75 years old or more'
  ];

  const ageGroupIndex = new Map(
    ageGroupOrder.map((age, index) => [age, index])
  );

  const categoriesOrder = [
    'within last 3 months',
    'between 3 and 12 months ago',
    'more than a year ago',
    'never'
  ];

  const categoryIndex = new Map(
    categoriesOrder.map((category, index) => [category, index])
  );

  // Get the data from the csv file using D3
  const csvData = useGetD3Csv(
    'internet-access-level/computer-use-divided-by-age-group.csv',
    (d) => ({
      lastComputerUse: d['Last computer use'],
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

      if (missingValue !== 0 && missingValue < 2) {
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
    const ageGroupsSorted = Array.from(
      new Set(
        adjustedData
          .filter((d) => d.lastComputerUse === adjustedData[0].lastComputerUse)
          .map((d) => d.ageGroup)
      )
    ).sort((a, b) => {
      return (
        (ageGroupIndex.get(a) ?? Infinity) - (ageGroupIndex.get(b) ?? Infinity)
      );
    });

    // Initialize the 2° nodes column made of the categories
    // Group data by lastComputerUse and calculate total sum per category
    const groupedByComputerUse = adjustedData.reduce<Record<string, number>>(
      (map, d) => {
        if (!map[d.lastComputerUse]) {
          map[d.lastComputerUse] = 0;
        }
        map[d.lastComputerUse] += d.value; // Sum up values
        return map;
      },
      {}
    );

    // Sort lastComputerUse categories based on total summed value (descending)
    const sortedComputerUseCategories = Object.entries(groupedByComputerUse)
      .map(([category]) => category)
      .sort((a, b) => {
        return (
          (categoryIndex.get(a) ?? Infinity) -
          (categoryIndex.get(b) ?? Infinity)
        );
      });

    setData({
      nodes: [ageGroupsSorted, sortedComputerUseCategories],
      links: adjustedData.map((d) => ({
        source: d.ageGroup,
        target: d.lastComputerUse,
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
    <ChartContainer className="flex flex-col overflow-hidden gap-8">
      <H3>Last computer use divided by age groups</H3>
      <Alluvial
        data={alluvialData}
        width={newWidth}
        height={newHeight}
        colors={colors}
        tooltipSuffix="M individuals"
        scalingFactor={1000000}
        floatPrecision={2}
        ml={50}
      ></Alluvial>
      <DataSourceInfo>
        Eurostat, Individuals - computer use (2017); Eurostat, Population on 1
        January by age group and sex (2024){' '}
        <ShowMoreChartDetailsModalDialog>
          <div className="mt-1 mb-4 mr-4 ml-4">
            <h2 className="mt-4 mb-4 font-serif text-xl xs:text-2xl sm:text-3xl">
              What you should know about this data
            </h2>
            <ul className="list-disc pl-5 text-base">
              <li>
                The survey population of Individuals consists of all individuals
                aged 16 to 74. On an optional basis, some countries collect
                separate data on other age groups: individuals aged 15 years or
                less, aged 75 or more.
              </li>
            </ul>
            <h2 className="font-serif mt-4 mb-2 text-xl xs:text-2xl sm:text-3xl">
              Methodologies
            </h2>
            <p className="text-base">
              The data are taken from the databases provided by "Eurostats"
              containing data on the frequency of computer use and data on the
              population divided by age group for all EU countries. The
              databases were merged and only the population of the age group of
              interest was taken. The data are displayed on request depending on
              the selected year and country.
            </p>
            <h2 className="font-serif mt-4 mb-2 text-xl xs:text-2xl sm:text-3xl">
              Data Sources
            </h2>
            <ul className="list-disc pl-5 text-base">
              <li>
                Eurostat: Individuals - computer use (id isoc_ci_cfp_cu, last
                data update: 16/06/2024).
              </li>
              <li>
                Eurostat: Population on 1 January by age group and sex (id
                demo_pjangroup, last data update: 18-03-2025)
              </li>
              <li>
                Eurostat: Population on 1 January by age and sex (id demo_pjan,
                last data update: 18-03-2025)
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

export default ComputerUseAlluvial;
