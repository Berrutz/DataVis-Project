'use client';

import { useEffect, useState } from 'react';
import { FinancialData } from '../lib/interfaces';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';

import ChartContainer from '@/components/chart-container';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import BubbleChart, {
  BubbleData,
  BubblePoint
} from '@/components/charts/BubbleChart';
import React from 'react';

export default function Financial() {
  const [AllData, setAllData] = useState<FinancialData[]>([]);
  const [bubbleData, setBubbleData] = useState<BubbleData>({
    currentYearData: [],
    otherYearsData: []
  });

  const [selectedYear, setSelectedYear] = useState<string>();
  const [previusYear, setPreviusYear] = useState<string>();

  // For visualization purpose only
  const [years, setYears] = useState<number[]>([]);
  const [sliderValue, setSliderValue] = useState<number[]>();

  // Utility to find closest year
  function getClosestYear(target: number, validYears: number[]) {
    return validYears.reduce((prev, curr) =>
      Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load of the data
        const FinCsvData: FinancialData[] = await d3.csv(
          getStaticFile(
            'datasets/final-project/use-of-the-internet/financial/percentage_Individuals_bought_or_sold shares_or_other_investiment.csv'
          ),
          (d: any) => ({
            country: d.Country,
            year: +d.Years,
            percentage: +d.percentage,
            population: +d.population
          })
        );
        setAllData(FinCsvData);
      } catch (error) {}
    };

    fetchData();
  }, []);

  // Choose the default selection values when the csv is loaded and fullfilled
  useEffect(() => {
    if (AllData === null || AllData.length <= 0) return;

    // As default choose the most recent year
    const uniqueYears = Array.from(new Set(AllData.map((d) => d.year))).sort(
      (a, b) => a - b
    );
    const years = AllData.map((value) => value.year);
    const selectedYear = Math.max(...years);

    // Set the first default selection for the first barchart visualization
    setSelectedYear(selectedYear.toString());
    setPreviusYear(selectedYear.toString());
    setSliderValue([Math.max(...years)]);
    setYears(uniqueYears);
  }, [AllData]);

  useEffect(() => {
    if (!selectedYear || AllData.length === 0) return;

    const selectedYearNum = +selectedYear;

    // 1. Filter data for selected year and other years
    const selectedYearDataRaw = AllData.filter(
      (d) => d.year === selectedYearNum
    );
    const otherYearsDataRaw = AllData.filter((d) => d.year !== selectedYearNum);

    // 2. Guard clause if there's no data
    if (selectedYearDataRaw.length === 0) {
      setBubbleData({ currentYearData: [], otherYearsData: [] });
      return;
    }

    // 3. Get global max percentage for normalization
    const globalMaxPercentage = Math.max(...AllData.map((d) => d.percentage));
    const MIN_SIZE = 15;

    // 4. Build enriched BubblePoint arrays
    const enrich = (d: (typeof AllData)[number]): BubblePoint => {
      const scale = (d.percentage / globalMaxPercentage) * 100;
      return {
        country: d.country,
        year: d.year.toString(),
        percentage: d.percentage,
        adjustedPercentage: Math.max(scale, MIN_SIZE),
        absoluteValue: Math.floor((d.percentage / 100) * d.population)
      };
    };

    const currentYearData = selectedYearDataRaw.map(enrich);
    const otherYearsData = otherYearsDataRaw.map(enrich);

    // 5. Update state
    setBubbleData({ currentYearData, otherYearsData });
  }, [selectedYear, AllData]);

  // The csv is not yet loaded or
  // the default selection has not already initializated or
  // neither one of the x value and y value state for the barchart has been initializated
  if (
    AllData === null ||
    !selectedYear ||
    !previusYear ||
    years == null ||
    sliderValue == null
  ) {
    return (
      <ChartContainer>
        <Skeleton className="w-full bg-gray-200 rounded-xl h-[500px]" />
      </ChartContainer>
    );
  }

  return (
    <ChartContainer className="flex flex-col ">
      <BubbleChart
        data={bubbleData}
        previusYear={previusYear}
        width={900}
        height={700}
        colorInterpolator={d3.interpolateRainbow}
      />
      <Slider
        min={Math.min(...AllData.map((d) => d.year))}
        max={Math.max(...AllData.map((d) => d.year))}
        step={0.01}
        value={sliderValue}
        onValueChange={(val) => setSliderValue(val)} // update smoothly as user drags
        onValueCommit={(val) => {
          const snappedYear = getClosestYear(val[0], years);
          setSliderValue([snappedYear]); // Snap thumb to closest year
          setPreviusYear(selectedYear);
          setSelectedYear(snappedYear.toString());
        }}
      />
    </ChartContainer>
  );
}
