'use client';

import BarChart, { Point } from '@/components/charts/barchart';
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
import { foundOrFirst, getUnique } from '@/utils/general';
import { useGetD3Csv } from '@/hooks/use-get-d3-csv';
import ChartContainer from '@/components/chart-container';
import Alluvial, { AlluvialData, LinkData } from '@/components/charts/alluvial';

export default function AlluvialDigitalSkills() {
  // Represent a year and country selection for the user
  const [year, setYear] = useState<string>();
  const [country, setCountry] = useState<string>();

  // The current state of the alluvial
  const [alluvialState, setAlluvialState] = useState<AlluvialData | null>(null);

  // Get the data from the csv file using D3
  const csvData = useGetD3Csv(
    'digital-skills/individual-level-of-digital-skills-2021.csv',
    (d) => ({
      year: +d.time_period,
      country: d.geo,
      indic_is: d.indic_is,
      value: +d.obs_value,
      ind_type: d.ind_type
    })
  );

  // Choose the default selection values when the csv is loaded and fullfilled
  useEffect(() => {
    if (csvData === null || csvData.length <= 0) return;

    const years = csvData.map((value) => value.year);
    const selectedYear = Math.max(...years);

    const countries = csvData.map((value) => value.country);
    const selectedCountry = foundOrFirst('Italy', countries);

    // Set the first default selection for the year
    setYear(selectedYear.toString());
    setCountry(selectedCountry);
  }, [csvData]);

  // Change the chart state based on the current user selection
  useEffect(() => {
    if (!year || !country || csvData === null) return;

    const filteredData = csvData
      .filter(
        (value) =>
          value.year === +year &&
          value.country === country &&
          value.ind_type !== 'All individuals'
      )
      .sort((a, b) => b.value - a.value);

    const filterIndicTypeName = (value: string) => {
      return value.replace('Individuals,', '').trim();
    };

    const uniqueIndType = getUnique(
      filteredData.map((value) => filterIndicTypeName(value.ind_type))
    );

    const uniqueIndicIs = getUnique(
      filteredData.map((value) => value.indic_is)
    );

    const nodes = [uniqueIndType, uniqueIndicIs];
    const linkData: LinkData[] = [];
    filteredData.forEach((value) => {
      console.log(filterIndicTypeName(value.ind_type));
      linkData.push({
        source: filterIndicTypeName(value.ind_type),
        target: value.indic_is,
        value: value.value
      });
    });

    setAlluvialState({
      nodes: nodes,
      links: linkData
    });
  }, [year, country, csvData]);

  // The csv is not yet loaded or
  // the default selection has not already initializated or
  // neither one of the x value and y value state for the barchart has been initializated
  if (!year || csvData === null || alluvialState === null) {
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

  const uniqueYears = getUnique(
    csvData.map((value) => value.year),
    (a, b) => b - a
  );
  const uniqueCountries = getUnique(csvData.map((value) => value.country));

  const colors = [
    '#E63946',
    '#A8DADC',
    '#ffb3ba',
    '#ffdfba',
    '#baffc9',
    '#bae1ff'
  ];

  return (
    <ChartContainer className="flex flex-col gap-8">
      <Alluvial
        data={alluvialState}
        width={1000}
        height={800}
        colors={colors}
        mb={90}
        mr={20}
        mt={0}
        ml={120}
      />
      <div className="gap-6 md:flex">
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

        <div className="w-full">
          <label>Country</label>
          <Select onValueChange={setCountry} defaultValue={country}>
            <SelectTrigger>
              <SelectValue placeholder="country" />
            </SelectTrigger>
            <SelectContent>
              {uniqueCountries.map((country) => (
                <SelectItem key={country} value={country.toString()}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </ChartContainer>
  );
}
