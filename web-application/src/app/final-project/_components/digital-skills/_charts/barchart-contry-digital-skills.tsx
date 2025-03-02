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
import { H3 } from '@/components/headings';

type BarchartState = {
  x: string[];
  y: number[];
};

export default function BarchartCountriesDigitalSkills() {
  // Represent a selection for the user to switch the barchart parameters
  const [year, setYear] = useState<string>();
  const [indicIs, setIndicIs] = useState<string>();
  const [indType, setIndType] = useState<string>();

  // The current state of the barchart x and y
  const [barchartState, setBarchartState] = useState<BarchartState | null>(
    null
  );

  // Get the data from the csv file using D3
  const csvData = useGetD3Csv('digital-skills/ilods-final.csv', (d) => ({
    year: +d.time_period,
    country: d.geo,
    indic_is: d.indic_is,
    value: +d.obs_value,
    ind_type: d.ind_type
  }));

  // Choose the default selection values when the csv is loaded and fullfilled
  useEffect(() => {
    if (csvData === null || csvData.length <= 0) return;

    // As default choose the most recent year
    const years = csvData.map((value) => value.year);
    const selectedYear = Math.max(...years);

    // As default indic_is choose `Individuals with no overall digital skills` or the first one in alphabetical order
    const indicIsList = csvData.map((value) => value.indic_is);
    var selectedIndicIs = foundOrFirst(
      'Individuals with no overall digital skills',
      indicIsList
    );

    const indTypeList = csvData.map((value) => value.ind_type);
    var selectedIndType = foundOrFirst('All individuals', indTypeList);

    // Set the first default selection for the first barchart visualization
    setYear(selectedYear.toString());
    setIndicIs(selectedIndicIs);
    setIndType(selectedIndType);
  }, [csvData]);

  // Change the barchart state based on the current user selection
  useEffect(() => {
    if (!year || !indicIs || !indType || csvData === null) return;

    const filteredData = csvData
      .filter(
        (value) =>
          value.year === +year &&
          value.indic_is === indicIs &&
          value.ind_type === indType
      )
      .sort((a, b) => b.value - a.value);

    setBarchartState({
      x: filteredData.map((value) => value.country),
      y: filteredData.map((value) => value.value)
    });
  }, [year, indicIs, indType]);

  // The csv is not yet loaded or
  // the default selection has not already initializated or
  // neither one of the x value and y value state for the barchart has been initializated
  if (
    !year ||
    !indicIs ||
    !indType ||
    csvData === null ||
    barchartState === null
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
  const uniqueIndicIs = getUnique(csvData.map((value) => value.indic_is));
  const uniqueIndType = getUnique(csvData.map((value) => value.ind_type));
  const uniqueYears = getUnique(
    csvData.map((value) => value.year),
    (a, b) => b - a
  );

  return (
    <ChartContainer className="flex flex-col gap-8">
      <H3>Different countires compared by digital skill levels</H3>
      <BarChart
        x={barchartState.x}
        y={barchartState.y}
        width={900}
        height={400}
        colorInterpoaltor={d3.interpolateBlues}
        mb={90}
        mr={20}
        mt={0}
        tooltipMapper={(point: Point): React.ReactNode => (
          <div>
            {point.x}: {point.y}%
            <br />
            <p className="text-sm text-foreground/60">
              Percentage of people
            </p>{' '}
          </div>
        )}
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
        <div className="sm:w-full">
          <label>Digital Skill Level</label>
          <Select onValueChange={setIndicIs} defaultValue={indicIs}>
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
        <div className="sm:w-full">
          <label>Individuals Range</label>
          <Select onValueChange={setIndType} defaultValue={indType}>
            <SelectTrigger>
              <SelectValue placeholder="Individuals Range" />
            </SelectTrigger>
            <SelectContent>
              {uniqueIndType.map((indType) => (
                <SelectItem key={indType} value={indType.toString()}>
                  {indType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </ChartContainer>
  );
}
