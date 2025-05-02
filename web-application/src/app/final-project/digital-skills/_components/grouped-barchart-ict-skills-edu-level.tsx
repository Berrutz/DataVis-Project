'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import { getUnique } from '@/utils/general';
import { useGetD3Csv } from '@/hooks/use-get-d3-csv';
import ChartContainer from '@/components/chart-container';
import GroupedBarChart, { BarGroup } from '@/components/charts/groupedBarchart';
import DatasetDataSource from '@/app/_components/dataset-datasource';
import Link from 'next/link';

export default function GroupedBarChartICTSkillsByEdu() {
  // Represent a selection for the user to switch the barchart parameters
  const [year, setYear] = useState<string>();

  // The current state of the barchart x and y
  const [groupedBarchartState, setBarchartState] = useState<BarGroup[]>([]);
  // Get the data from the csv file using D3
  const csvData = useGetD3Csv(
    'digital-skills/employed-persons-with-ict-education-by-att-level.csv',
    (d) => ({
      year: +d.time_period,
      country: d.country,
      category: d.iscoe,
      value: +d.obs_value
    })
  );

  // Choose the default selection values when the csv is loaded and fullfilled
  useEffect(() => {
    if (csvData === null || csvData.length <= 0) return;

    // As default choose the most recent year
    const years = csvData.map((value) => value.year);
    const selectedYear = Math.max(...years);

    // Set the first default selection for the first barchart visualization
    setYear(selectedYear.toString());
  }, [csvData]);

  // Change the barchart state based on the current user selection
  useEffect(() => {
    if (!year || csvData === null) return;

    const filteredData = csvData
      .filter((value) => value.year === +year && value.value > 0)
      .sort((a, b) => b.value - a.value);

    // Create an object to collect groups by country
    const groups: { [country: string]: BarGroup } = {};

    filteredData.forEach((item) => {
      // Use the country as the key (this will be the label)
      if (!groups[item.country]) {
        groups[item.country] = {
          label: item.country,
          values: []
        };
      }
      // Push the category and value information into the group's values array
      groups[item.country].values.push({
        name: item.category,
        value: item.value
      });
    });

    setBarchartState(Object.values(groups));
  }, [year]);

  // The csv is not yet loaded or
  // the default selection has not already initializated or
  // neither one of the x value and y value state for the barchart has been initializated
  if (!year || csvData === null || groupedBarchartState === null) {
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
      <GroupedBarChart
        data={groupedBarchartState}
        width={900}
        height={700}
        categoryColors={['#4287f5', '#f5a207']}
        yLabelsSuffix="%"
        mb={90}
        mr={20}
        mt={0}
        ml={80}
        vertical={true}
      />
      <DatasetDataSource
        displayedName="Eurostats - Employed persons with ICT education by educational attainment level"
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
              href="https://ec.europa.eu/eurostat/databrowser/view/isoc_ski_itedu/default/table?lang=en&category=isoc.isoc_sk.isoc_skt.isoc_skt_"
            >
              Employed persons with ICT education by educational attainment
              level
            </Link>
          </p>
        }
      />
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="w-full">
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
