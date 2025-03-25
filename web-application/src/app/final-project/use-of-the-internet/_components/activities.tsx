'use client';

import MapContainer from '@/components/map-switch-container';
import { useEffect, useState } from 'react';
import { ActivitiesData } from '../lib/interfaces';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';

// add alex barchart general solution
import LineChart from '@/components/charts/linechart';   
import BarChart from '@/components/charts/barchart';
import { Percent } from 'lucide-react';

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

export interface Line {
  x: string[];
  y: number[];
  color: string; // The color of the line
  tag: string; // The 'name' of the line, used for the tooltip
  scatter: boolean; // Option for draw the line as points
}



export default function Activities() {

    const [windowWidth, setWindowWidth] = useState<number>(1200);
    const [AllData, setAllData] = useState<ActivitiesData[]>([]);

    // Stati per opzioni nei selettori
    const [selectedCountry, setSelectedCountry] = useState<string>('Italy');
    
    const [countries, setCountries] = useState<string[]>([]);

    /////////////////////////

    const [chartData, setChartData] = useState<Line[]>([]);

    const colorScale = d3.scaleOrdinal([
      "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
      "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
    ]);

    useEffect(() => {
        const fetchData = async () => {
          
          try{
            //console.log("Fetching data...");
    
            // Load of the data
            const ActivitiesCsvData: ActivitiesData[] = await d3.csv(
            getStaticFile('datasets/final-project/use-of-the-internet/activities/percentage_people_good_and_services.csv'),
              (d: any) => ({
                forwhat: d.ForWhat,
                country:  d.Country,
                year: d.Year,
                percentage: +d.percentage_of_individual
              })
            );
            setAllData(ActivitiesCsvData);
            
            ////console.log("Data fetched:", ActivitiesCsvData);
    
            // Estrazione di anni e paesi unici
            const uniqueYears = Array.from(new Set(ActivitiesCsvData.map(d => d.year))).sort();
            const uniqueCountries = Array.from(new Set(ActivitiesCsvData.map(d => d.country))).sort();
            
            setCountries(uniqueCountries);
    
          }catch (error) {
            console.error("Error", error);
          }
    
        };
    
        fetchData();
        }, []);

        useEffect(() => {
            if (AllData.length === 0) return;
        
            // Filtraggio dati in base alla selezione
            const filteredData = AllData.filter(d => d.country === selectedCountry);
        
            //console.log("Filtered data:", filteredData);
        
            if (filteredData.length === 0) {
              setChartData([]);
              return;
            }

          // Raggruppa i dati per `forwhat`
          const groupedByForWhat = d3.group(filteredData, d => d.forwhat);

          // Array per memorizzare gli oggetti `Line`
          const newLines: Line[] = [];

          // Itera sui gruppi e crea un oggetto `Line` per ciascuno
          groupedByForWhat.forEach((values, forwhat) => {
              // Ordina i valori per anno
              values.sort((a, b) => Number(a.year) - Number(b.year));

              const truncateTag = (text: string, maxWords: number = 20) => {
                const words = text.split(" ");
                return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "..." : text;
               };

              // Crea l'oggetto `Line`
              const line: Line = {
                  x: values.map(d => String(d.year)),
                  y: values.map(d => Number(d.percentage)),
                  color: colorScale(forwhat), // Colore unico
                  tag: truncateTag(forwhat,8), // Nome della linea
                  scatter: false, // Linea continua
              };

              // Aggiunge l'oggetto `Line` all'array
              newLines.push(line);
          });

          // Imposta il nuovo stato con i dati aggiornati
          setChartData(newLines);

          }, [selectedCountry, AllData]);

    // The csv is not yet loaded or
    // the default selection has not already initializated or
    // neither one of the x value and y value state for the barchart has been initializated
    if (
      !selectedCountry ||
      AllData === null ||
      chartData === undefined
    ) {
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
            <LineChart data={chartData} width={650} height={600} 
            xLabel='Years' yLabel='Percentage of Individual' ml={50} mb={70} mr={50} mt={50}/>
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
          