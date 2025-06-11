'use client';

import { useEffect, useState } from 'react';
import { FinancialData } from '../lib/interfaces';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';

import ChartContainer from '@/components/chart-container';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import BubbleChart from '@/components/charts/BubbleChart';

export default function Financial() {
  const [AllData, setAllData] = useState<FinancialData[]>([]);

  const [selectedYear, setSelectedYear] = useState<string>();
  const [dimension_of_the_bubble, setDimBubble] = useState<number[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [number_of_bubbles, setNumBubble] = useState<string[]>([]);

  const [percentage, setPercentage] = useState<[number, number][]>([]);

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
    const years = AllData.map((value) => value.year);
    const selectedYear = Math.max(...years);

    // Set the first default selection for the first barchart visualization
    setSelectedYear(selectedYear.toString());
  }, [AllData]);

  useEffect(() => {
    if (!selectedYear || AllData.length === 0) return;

    // 1. Filter data for the selected year
    const filteredData = AllData.filter((d) => d.year === +selectedYear);

    if (filteredData.length === 0) {
      setDimBubble([]);
      setCountries([]);
      setNumBubble([]);
      setPercentage([]);
      return;
    }

    // 2. Get max percentage across all years for normalization
    const globalMaxPercentage = Math.max(...AllData.map((d) => d.percentage));

    // 3. Normalize percentages and enforce a minimum bubble size
    const MIN_SIZE = 10; // minimum bubble size (in percent scale)
    const normalizedPercentages = filteredData.map((d) => {
      const scale = (d.percentage / globalMaxPercentage) * 100;
      return Math.max(scale, MIN_SIZE);
    });

    // 4. Set all the required states
    setDimBubble(normalizedPercentages);
    setCountries(filteredData.map((d) => d.country));
    setNumBubble(filteredData.map((d) => d.year.toString()));
    setPercentage(
      filteredData.map((d) => [
        d.percentage,
        Math.floor((d.percentage / 100) * d.population)
      ])
    );
  }, [selectedYear, AllData]);

  // The csv is not yet loaded or
  // the default selection has not already initializated or
  // neither one of the x value and y value state for the barchart has been initializated
  if (AllData === null || !selectedYear) {
    return (
      <ChartContainer>
        <Skeleton className="w-full bg-gray-200 rounded-xl h-[500px]" />
      </ChartContainer>
    );
  }

  /* console.log('percentage: ', percentage);
  console.log('dimesnione_of_the_bubble: ', dimension_of_the_bubble); */
  /* console.log('color_of_the_bubble: ', countries); */
  /* console.log('number_of_bubbles: ', number_of_bubbles); */

  return (
    <ChartContainer className="flex flex-col ">
      <BubbleChart
        bubble_percentage={percentage}
        bubble_dimension={dimension_of_the_bubble}
        countiresList={countries}
        bubble_number={number_of_bubbles}
        width={700}
        height={700}
        colorInterpolator={d3.interpolateRainbow}
      />
      <Slider
        min={Math.min(...AllData.map((d) => d.year))}
        max={Math.max(...AllData.map((d) => d.year))}
        step={1}
        value={[+selectedYear]}
        onValueChange={(val) => {
          setSelectedYear(val[0].toString());
        }}
      />
    </ChartContainer>
  );
}
