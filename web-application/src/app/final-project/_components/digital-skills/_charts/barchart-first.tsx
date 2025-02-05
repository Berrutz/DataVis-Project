'use client';

import BarChart from '@/components/charts/barchart';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import { foundOrFirst, getUnique } from '@/utils/general';
import { useGetD3Csv } from '@/hooks/use-get-d3-csv';

type BarchartState = {
  x: string[];
  y: number[];
};

export default function BarChartFirst() {
  // Represent a selection for the user to switch the barchart parameters
  const [year, setYear] = useState<string>();
  const [indicIs, setIndicIs] = useState<string>();

  // The current state of the barchart x and y
  const [barchartState, setBarchartState] = useState<BarchartState | null>(
    null
  );

  // Get the data from the csv file using D3
  const csvData = useGetD3Csv('digital-skills/ilods-final.csv', (d) => ({
    year: +d.time_period,
    country: d.geo,
    indic_is: d.indic_is,
    value: +d.obs_value
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

    // Set the first default selection for the first barchart visualization
    setYear(selectedYear.toString());
    setIndicIs(selectedIndicIs);
  }, [csvData]);

  // Change the barchart state based on the current user selection
  useEffect(() => {
    if (!year || !indicIs || csvData === null) return;

    const filteredData = csvData
      .filter((value) => value.year === +year && value.indic_is === indicIs)
      .sort((a, b) => b.value - a.value);

    setBarchartState({
      x: filteredData.map((value) => value.country),
      y: filteredData.map((value) => value.value)
    });
  }, [year, indicIs]);

  // The csv is not yet loaded or
  // the default selection has not already initializated or
  // neither one of the x value and y value state for the barchart has been initializated
  if (!year || !indicIs || csvData === null || barchartState === null) {
    return <Skeleton className="bg-gray-200 rounded-xl w-[800px] h-[400px]" />;
  }

  // The csv is loaded but no data has been found
  if (csvData.length <= 0) {
    throw Error('Cannot retrieve the data from the csv');
  }

  // Unique years and indic_is to make the user input selections
  const uniqueIndicIs = getUnique(csvData.map((value) => value.indic_is));
  const uniqueYears = getUnique(
    csvData.map((value) => value.year),
    (a, b) => b - a
  );

  return (
    <div>
      <BarChart
        x={barchartState.x}
        y={barchartState.y}
        width={800}
        height={400}
        colorInterpoaltor={d3.interpolateBlues}
      />
      <div>
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
    </div>
  );
}
