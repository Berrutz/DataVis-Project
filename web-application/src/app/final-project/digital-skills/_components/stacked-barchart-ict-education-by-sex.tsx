'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import React, { useEffect, useState } from 'react';
import { getUnique } from '@/utils/general';
import { useGetD3Csv } from '@/hooks/use-get-d3-csv';
import ChartContainer from '@/components/chart-container';
import { H3 } from '@/components/headings';
import StackedBarChart, {
  Category,
  StackedData
} from '@/components/charts/stackedBarChart';

const MALE_CATEGORY = 'Males';
const FEMALE_CATEGORY = 'Females';

export default function StackedBarchartICTEducationBySex() {
  // Represent a selection for the user to switch the barchart parameters
  const [year, setYear] = useState<string>();
  const [stackedBarchartCategories, setStackedBarchartCategories] =
    useState<Category[]>();
  const [stackedBarchartState, setStackedBarchartState] =
    useState<StackedData[]>();

  // Get the data from the csv file using D3
  const csvData = useGetD3Csv(
    'digital-skills/employed-ict-education-by-sex.csv',
    (d) => ({
      year: +d.time_period,
      sex_tag: d.sex_tag,
      sex: d.sex,
      country: d.country,
      value: +d.obs_value
    })
  );

  // Choose the default selection values when the csv is loaded and fullfilled
  useEffect(() => {
    if (csvData === null || csvData.length <= 0) return;

    // As default choose the most recent year
    const years = csvData.map((value) => value.year);
    const selectedYear = Math.max(...years);

    const sexes = getUnique(csvData.map((value) => value.sex));
    if (!sexes.includes('Females') && !sexes.includes('Males')) {
      throw Error(
        'Cannot create catogoeries for the stacked bar chart since no Male or Femal sex tag has been found'
      );
    }

    setYear(selectedYear.toString());
    setStackedBarchartCategories([
      {
        name: MALE_CATEGORY,
        color: 'blue'
      },
      {
        name: FEMALE_CATEGORY,
        color: 'pink'
      }
    ]);
  }, [csvData]);

  // Change the chart state based on the current user selection
  useEffect(() => {
    if (!year || !stackedBarchartCategories || csvData === null) return;

    const filteredDataByYear = csvData
      .filter((value) => value.year === +year)
      .sort((a, b) => b.value - a.value);

    const maleAndFemaleData = filteredDataByYear.filter(
      (value) => value.sex_tag === 'M' || value.sex_tag === 'F'
    );

    type ReducerObjType = {
      country: string;
      males: number;
      females: number;
    };

    const reduced = maleAndFemaleData.reduce<Record<string, ReducerObjType>>(
      (acc, value) => {
        if (!acc[value.country]) {
          acc[value.country] = {
            country: value.country,
            males: 0,
            females: 0
          };
        }

        if (value.sex_tag === 'M') {
          acc[value.country].males += value.value;
        } else if (value.sex_tag === 'F') {
          acc[value.country].females += value.value;
        }

        return acc;
      },
      {}
    );

    const reducedArray = Object.values(reduced);
    const mapped = reducedArray.map((value) => {
      let country = value.country;
      if (country.toLowerCase().startsWith('european')) {
        const auxSplit = country.split(' ');
        country = `EU ${auxSplit[3]}`;
      }

      let males = value.males;
      let females = value.females;

      if (males <= 0 && females <= 0) {
        return {
          entity: value.country,
          Males: value.males,
          Females: value.females
        } as StackedData;
      }

      if (males <= 0) {
        males = 100 - females;
      }
      if (females <= 0) {
        females = 100 - males;
      }

      const total = males + females;

      // Rescale if necessary
      if (total != 100) {
        males = (males * 100) / total;
        females = (females * 100) / total;
      }

      return {
        entity: country,
        Males: males,
        Females: females
      } as StackedData;
    });

    setStackedBarchartState(mapped);
  }, [year, csvData, stackedBarchartCategories]);

  // The csv is not yet loaded or
  // the default selection has not already initializated or
  // no state for the chart has been set
  if (
    !year ||
    csvData === null ||
    stackedBarchartState === undefined ||
    stackedBarchartCategories === undefined
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
  const uniqueYears = getUnique(
    csvData.map((value) => value.year),
    (a, b) => b - a
  );

  return (
    <ChartContainer className="flex flex-col gap-8">
      <H3>Percentage of employed males and females with ICT education</H3>
      <StackedBarChart
        width={900}
        height={600}
        categories={stackedBarchartCategories}
        data={stackedBarchartState}
        mr={20}
        ml={100}
      />
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="sm:w-1/3">
          <label>Year</label>
          <Select onValueChange={setYear} defaultValue={year.toString()}>
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
    </ChartContainer>
  );
}
