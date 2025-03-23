'use client';

import chroma from 'chroma-js';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import React, { useEffect, useState } from 'react';
import { foundOrFirst, getUnique } from '@/utils/general';
import { useGetD3Csv } from '@/hooks/use-get-d3-csv';
import ChartContainer from '@/components/chart-container';
import { H3 } from '@/components/headings';
import LineChart, { Line } from '@/components/charts/linechart';

export default function LinechartYearsDigitalSkills() {
  // Represent a selection for the user to switch the linecharts parameters
  const [countries, setCountries] = useState<string[]>();
  const [indicIs, setIndicIs] = useState<string>();
  const [indType, setIndType] = useState<string>();

  // I decided to create two linechart one for data before 2019 and one for data after 2019
  // This because the methods used to derive the digital skills has been changed after 2019 and
  // data is scaled in a different way. If all the period span is keept together the data could be
  // misleading due to scales factors and different methods used to derive the digital skills.

  // The current state of the linechart x and y values for data before 2019
  const [linechartBefore2019Data, setLinechartBefore2019Data] = useState<
    Line[] | null
  >(null);

  // The current state of the linechart x and y values for data after 2019
  const [linechartAfter2019Data, setLinechartAfter2019Data] = useState<
    Line[] | null
  >(null);

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

    // As default choose italy, germany, france and romania as countries if they are present in the csv
    const countries = csvData.map((value) => value.country);
    const allUniqueCountries = [...new Set(countries)];
    const defaultCountries = ['Italy', 'Germany', 'France', 'Romania'];
    const selectedCountries = defaultCountries.filter((value) =>
      allUniqueCountries.includes(value)
    );

    // As default indic_is choose `Individuals with no overall digital skills` or the first one in alphabetical order
    const indicIsList = csvData.map((value) => value.indic_is);
    const selectedIndicIs = foundOrFirst(
      'Individuals with no overall digital skills',
      indicIsList
    );

    const indTypeList = csvData.map((value) => value.ind_type);
    const selectedIndType = foundOrFirst('All individuals', indTypeList);

    // Set the first default selection for the first linechart visualization
    setCountries(selectedCountries);
    setIndicIs(selectedIndicIs);
    setIndType(selectedIndType);
  }, [csvData]);

  // Change the linechart state based on the current user selection
  useEffect(() => {
    if (!countries || !indicIs || !indType || csvData === null) return;

    const filteredData = csvData
      .filter(
        (value) =>
          countries.includes(value.country) &&
          value.indic_is === indicIs &&
          value.ind_type === indType
      )
      .sort((a, b) => a.year - b.year);

    const before2019Data = filteredData.filter((value) => value.year < 2019);
    const after2019Data = filteredData.filter((value) => value.year >= 2019);

    console.table(before2019Data);

    const uniqueCountriesBefore2019 = getUnique(
      before2019Data.map((value) => value.country)
    );
    const uniqueCountriesAfter2019 = getUnique(
      after2019Data.map((value) => value.country)
    );

    const colorsBefore2019 = chroma
      .scale('Paired')
      .colors(uniqueCountriesBefore2019.length);
    const colorsAfter2019 = chroma
      .scale('Paired')
      .colors(uniqueCountriesAfter2019.length);

    const linesBefore2019: Line[] = [];
    for (let i = 0; i < uniqueCountriesBefore2019.length; i++) {
      const country = uniqueCountriesBefore2019[i];
      const filtered = before2019Data.filter(
        (value) => value.country === country && value.value > 0.0
      );
      linesBefore2019.push({
        x: filtered.map((value) => value.year.toString()),
        y: filtered.map((value) => value.value),
        scatter: false,
        tag: country,
        color: colorsBefore2019[i]
      });
    }

    const linesAfter2019: Line[] = [];
    for (let i = 0; i < uniqueCountriesAfter2019.length; i++) {
      const country = uniqueCountriesAfter2019[i];
      const filtered = after2019Data.filter(
        (value) => value.country === country && value.value > 0.0
      );
      linesAfter2019.push({
        x: filtered.map((value) => value.year.toString()),
        y: filtered.map((value) => value.value),
        scatter: false,
        tag: country,
        color: colorsAfter2019[i]
      });
    }

    setLinechartBefore2019Data(linesBefore2019);
    setLinechartAfter2019Data(linesAfter2019);
  }, [countries, indicIs, indType]);

  // The csv is not yet loaded or
  // the default selection has not already initializated or
  // the value state for the linechart has been initializated
  if (
    !countries ||
    !indicIs ||
    !indType ||
    csvData === null ||
    linechartBefore2019Data === null ||
    linechartAfter2019Data === null
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
  const uniqueCountries = getUnique(csvData.map((value) => value.country));

  const height = 500;

  return (
    <ChartContainer className="flex flex-col gap-8">
      <H3>Digital skills compared over the years</H3>
      {linechartBefore2019Data.length <= 0 ? (
        <div className="flex justify-center items-center h-[400px] w-[min(100%,_900px)]">
          <h1 className="text-xl font-medium text-destructive">
            No data available
          </h1>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-[-30px]">
            Years before 2019
          </h3>
          <LineChart
            width={900}
            height={height}
            data={linechartBefore2019Data}
            ml={40}
          />

          <h3 className="text-xl font-semibold mb-[-30px]">Years after 2019</h3>
          <LineChart
            width={900}
            height={height}
            data={linechartAfter2019Data}
            ml={40}
          />
        </>
      )}
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="sm:w-1/3">
          <label>Year</label>
          <Select onValueChange={setCountries} defaultValue={countries}>
            <SelectTrigger>
              <SelectValue placeholder="Country" />
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
