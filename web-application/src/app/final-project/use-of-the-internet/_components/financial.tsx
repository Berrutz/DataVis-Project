'use client';

import MapContainer from '@/components/map-switch-container';
import { useEffect, useState } from 'react';
import { FinancialData } from '../lib/interfaces';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';

import ChartContainer from '@/components/chart-container';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import BubbleChart from '@/components/charts/BubbleChart';

export default function Financial() {
  const [windowWidth, setWindowWidth] = useState<number>(1200);
  const [AllData, setAllData] = useState<FinancialData[]>([]);

  // Stati per opzioni nei selettori
  //const [selectedCountry, setSelectedCountry] = useState<string>('Italy');

  const [countries, setCountries] = useState<string[]>([]);

  const [dimension_of_the_bubble, setDimBubble] = useState<number[]>([]);
  const [color_of_the_bubble, setColorBubble] = useState<string[]>([]);
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
            year: d.Years,
            percentage: +d.percentage,
            population: +d.population
          })
        );
        setAllData(FinCsvData);

        // Estrazione di anni e paesi unici
        //const uniqueCountries = Array.from(new Set(FinCsvData.map(d => d.country))).sort();
        //setCountries(uniqueCountries);
      } catch (error) {
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (AllData.length === 0) return;

    // Filtraggio dati in base alla selezione
    //const filteredData = AllData.filter(d => d.geo === selectedCountry);

    const filteredData = AllData;

    if (filteredData.length === 0) {
      setDimBubble([]);
      setColorBubble([]);
      return;
    }

    const how_much_rows = 20;
    // Ordinare i dati in base a "percentage" in ordine decrescente
    const sortedData = filteredData.sort((a, b) => b.percentage - a.percentage);
    const top20 = sortedData.slice(0, how_much_rows);
    const topCountries = Array.from(new Set(top20.map((d) => d.country)));
    const maxPercentage = Math.max(...top20.map((d) => d.percentage));
    const normalizedPercentages = top20.map(
      (d) => (d.percentage / maxPercentage) * 100
    );

    // Impostare gli stati
    //setPercentage()
    setDimBubble(normalizedPercentages);
    setColorBubble(top20.map((d) => d.country));
    setNumBubble(top20.map((d) => d.year));
    setPercentage(
      top20.map((d) => [
        d.percentage,
        Math.floor((d.percentage / 100) * d.population)
      ])
    );
  }, [AllData]);

  return (
    <ChartContainer className="flex flex-col ">
      {/*<H3>Frequency of internet use divided by age groups</H3> */}
      <BubbleChart
        bubble_percentage={percentage}
        bubble_dimension={dimension_of_the_bubble}
        bubble_color={color_of_the_bubble}
        bubble_number={number_of_bubbles}
        width={700}
        height={700}
        colorInterpolator={d3.interpolateRainbow}
      />
    </ChartContainer>
  );
}
