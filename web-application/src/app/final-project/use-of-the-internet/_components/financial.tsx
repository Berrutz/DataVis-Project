'use client';

import MapContainer from '@/components/map-switch-container';
import { useEffect, useState } from 'react';
import { FinancialData } from '../lib/interfaces';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';

// add alex barchart general solution
import BarChart from '@/components/charts/barchart';   

import BubbleChart from '@/components/charts/BubbleChart';

export default function Financial() {

    const [windowWidth, setWindowWidth] = useState<number>(1200);
    const [AllData, setAllData] = useState<FinancialData[]>([]);

    // Stati per opzioni nei selettori
    //const [selectedCountry, setSelectedCountry] = useState<string>('Italy');
    
    //const [years, setYears] = useState<string[]>([]);
    const [countries, setCountries] = useState<string[]>([]);

    const [x, setX] = useState<string[]>([]);
    const [y, setY] = useState<number[]>([]);
    const [r, setR] = useState<number[]>([]);
    const [p, setP] = useState<string[]>([]);


    useEffect(() => {
        const fetchData = async () => {
          try{
            console.log("Fetching data...");
    
            // Load of the data
            const FreqCsvData: FinancialData[] = await d3.csv(
            getStaticFile('datasets/final-project/use-of-the-internet/financial/percentage_Individuals_bought_or_sold shares_or_other_investiment.csv'),
              (d: any) => ({
                  geo: d.geo,
                  TIME_PERIOD:  d.TIME_PERIOD_x?.toString(),
                  OBS_VALUE: +d.OBS_VALUE,
                  population: +d.population
              })
            );
            setAllData(FreqCsvData);
            
            console.log("All Data Financial: " ,FreqCsvData )
    
            // Estrazione di anni e paesi unici
            const uniqueCountries = Array.from(new Set(FreqCsvData.map(d => d.geo))).sort();
            
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
            //const filteredData = AllData.filter(d => d.geo === selectedCountry);

            const filteredData = AllData
        
            console.log("Filtered data Financial:", filteredData);
        
            if (filteredData.length === 0) {
              setX([]);
              setY([]);
              return;
            }
        
            const xValues = filteredData.map(d => String(d.TIME_PERIOD));
            const yValues = filteredData.map(d => d.OBS_VALUE);
            const rValues = filteredData.map(d => d.population);
            const pValues = filteredData.map(d => String(d.geo));

            console.log("Data fetched pValues : ", pValues);
        
            setX(xValues);
            setY(yValues);
            setR(rValues);
            setP(pValues);

          }, [AllData]);


return(
    <div className="mt-3">
    {/*</div>/*<label htmlFor="line-chart-country">Select country: </label>
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
    */}
    {/* Mappa e grafico */}
        <MapContainer
            components={[
                {
                buttonText: 'Line',
                component: (x.length > 0 && y.length > 0) ? (
                    <BubbleChart
                    x={x}
                    y={y} // Valori Y
                    r = {r} // Dimensione delle bolle
                    p = {p} // Valore dei paesi
                    width={600}
                    height={400}
                    colorInterpolator={d3.interpolateBlues}
                    />
                ) : (
                    <p>Loading chart data...</p> // Placeholder temporaneo
                )
                ,
                }
            ]}
        >
        </MapContainer>
        </div>
        )
}
          