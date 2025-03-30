'use client';

import { Pencil } from 'lucide-react';
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
import { Sidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { ChartSidebar } from '@/components/chart-sidebar';
import MapContainer from '@/components/map-switch-container';

export default function LinechartYearsDigitalSkills() {
  // Represent a selection for the user to switch the linecharts parameters
  const [allUniqueCountries, setAllUniqueCountries] = useState<string[]>([]);
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

  const handleCountriesSelection = (point: string) => {
    setCountries((prev) => {
      if (countries === undefined) return [point];

      // Logic to handle the deletion of a country from the selection
      // Since the changed/selected coutry is in the coutries list of selection
      if (countries.includes(point)) {
        if (prev === undefined) return [];

        return prev.filter((c) => c !== point);
      }

      // Add the new country and sort by category
      return [...(prev || []), point];
    });
  };

  // Choose the default selection values when the csv is loaded and fullfilled
  useEffect(() => {
    if (csvData === null || csvData.length <= 0) return;

    // As default choose italy, germany, france and romania as countries if they are present in the csv
    const countries = csvData.map((value) => value.country);
    const allCountries = [...new Set(countries)];
    const defaultCountries = ['Italy', 'Germany', 'France', 'Romania'];
    const selectedCountries = defaultCountries.filter((value) =>
      allCountries.includes(value)
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

    setAllUniqueCountries(allCountries);
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
  }, [countries, indicIs, indType, csvData]);

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

  const height = 500;

  const noDataComponent = (
    <div className="flex justify-center items-center h-[400px] w-[min(100%,_900px)]">
      <h1 className="text-xl font-medium text-destructive">
        No data available
      </h1>
    </div>
  );

  const linechartBefore2019Component =
    linechartBefore2019Data.length <= 0 ? (
      noDataComponent
    ) : (
      <div className="p-4 mb-6">
        <H3 className="mb-4">
          Digital skills compared over the years after 2019
        </H3>
        <LineChart
          width={900}
          height={height}
          data={linechartBefore2019Data}
          ml={40}
        />
      </div>
    );

  const linechartAfter2019Component =
    linechartAfter2019Data.length <= 0 ? (
      noDataComponent
    ) : (
      <div className="p-4 mb-6">
        <H3 className="mb-4">
          Digital skills compared over the years after 2019
        </H3>
        <LineChart
          width={900}
          height={height}
          data={linechartAfter2019Data}
          ml={40}
        />
      </div>
    );

  return (
    <div className="px-2 sm:px-4">
      <MapContainer
        className="relative w-full max-w-[1200px]"
        components={[
          {
            buttonText: 'Before 2019',
            component: linechartBefore2019Component
          },
          {
            buttonText: 'After 2019',
            component: linechartAfter2019Component
          }
        ]}
      >
        <Sidebar>
          <div>
            <div className="mb-4">
              <SidebarTrigger
                variant={'outline'}
                className="w-full text-base font-medium xs:w-64"
              >
                <div className="flex items-center">
                  <Pencil className="mr-2 text-gray-500 min-w-5 min-h-5" />
                  Edit countries and regions
                </div>
              </SidebarTrigger>
              <ChartSidebar
                items={allUniqueCountries}
                selectedItems={countries}
                onSelectionChange={handleCountriesSelection}
                onClearSelection={() => setCountries([])}
                isChecked={(country: string) => countries.includes(country)}
                chartid="linechart-years-digital-skills"
              />
            </div>
            <div className="flex flex-col gap-6 sm:flex-row">
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
          </div>
        </Sidebar>
      </MapContainer>
    </div>
  );
}
