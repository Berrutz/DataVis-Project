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
            console.log("Fetching data...");
    
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
    
            
            console.log("Data fetched:", ActivitiesCsvData);
    
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
        
            console.log("Filtered data:", filteredData);
        
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


return(
    <div className="mt-3">
    <label htmlFor="line-chart-country">Select country: </label>
    <select
      id="line-chart-country"
      value={selectedCountry}
      onChange={(e) => setSelectedCountry(e.target.value)} // Nessuna conversione a number
      className="py-1 px-2 ml-2 rounded-md border bg-background"
    >
        {countries.map(country => (
          <option key={country} value={country}>{country}</option>
        ))}
    </select>

            {/* Mappa e grafico */}
                <MapContainer
                    components={[
                        {
                        buttonText: 'Line',
                        component:chartData.length > 0 ? (
                          <LineChart data={chartData} width={750} height={600}
                          xLabel='Years' yLabel='Percentage of Individual' ml={80} mb={80}/>
                          ) : (
                              <p>Loading chart data...</p>
                          )
                        ,
                        }
                    ]}
                >
                </MapContainer>
        </div>
        )
}
          