'use client';

import MapContainer from '@/components/map-switch-container';
import { useEffect, useState } from 'react';
import { FrequencyData, PurchaseData } from '../lib/interfaces';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';

// add alex barchart general solution
import BarChart from '@/components/charts/barchart';

import ChartContainer from '@/components/chart-container';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { foundOrFirst, getUnique } from '@/utils/general';

export default function Purchase() {
  const [windowWidth, setWindowWidth] = useState<number>(1200);
  const [AllData, setAllData] = useState<PurchaseData[]>([]);

  // Stati per opzioni nei selettori
  const [selectedCountry, setSelectedCountry] = useState<string>('Italy');
  const [countries, setCountries] = useState<string[]>([]);

  const [dataDomain, setDataDomain] = useState<number[]>([]);

  const [x, setX] = useState<string[]>([]);
  const [y, setY] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //console.log("Fetching data...");

        // Load of the data
        const PurchaseCsvData: PurchaseData[] = await d3.csv(
          getStaticFile(
            'datasets/final-project/use-of-the-internet/purchase/percentage_purchase_last_3_month_2010_2024.csv'
          ),
          (d: any) => ({
            country: d.Country,
            year: d.Year,
            percentage: +d.percentage_of_individual
          })
        );
        setAllData(PurchaseCsvData);

        //console.log("Data fetched:", PurchaseCsvData);

        // Estrazione di anni e paesi unici
        const uniqueYears = Array.from(
          new Set(PurchaseCsvData.map((d) => d.year))
        ).sort();
        const uniqueCountries = Array.from(
          new Set(PurchaseCsvData.map((d) => d.country))
        ).sort();

        setCountries(uniqueCountries);
      } catch (error) {
        console.error('Error', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (AllData.length === 0) return;

    const values = AllData.map((d) => d.percentage);

    setDataDomain([Math.min(...values), Math.max(...values)]);

    // Filtraggio dati in base alla selezione
    const filteredData = AllData.filter((d) => d.country === selectedCountry);

    //console.log("Filtered data:", filteredData);

    if (filteredData.length === 0) {
      setX([]);
      setY([]);
      return;
    }

    const xValues = filteredData.map((d) => String(d.year));
    const yValues = filteredData.map((d) => d.percentage);

    setX(xValues);
    setY(yValues);
  }, [selectedCountry, AllData]);

  // The csv is not yet loaded or
  // the default selection has not already initializated or
  // neither one of the x value and y value state for the barchart has been initializated
  if (!selectedCountry || AllData === null) {
    return (
      <ChartContainer>
        <Skeleton className="w-full bg-gray-200 rounded-xl h-[500px]" />
      </ChartContainer>
    );
  }

  // Unique years and indic_is to make the user input selections
  const uniqueIndicIs = getUnique(AllData.map((value) => value.country));

  return (
    <ChartContainer className="flex flex-col gap-10">
      {/*<H3>Frequency of internet use divided by age groups</H3> */}
      <BarChart
        x={x}
        y={y}
        width={900}
        height={600}
        colorScale={d3.scaleSequential(d3.interpolateCividis).domain([0, 55])}
        yLabelsSuffix="%"
        ml={90}
        mb={110}
        mr={10}
        xLabel="Percentage of Individuals"
        yLabel="Years"
      />
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="sm:w-full">
          <label>Country</label>
          <Select
            onValueChange={setSelectedCountry}
            defaultValue={selectedCountry}
          >
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
    </ChartContainer>
  );
}
