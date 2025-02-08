'use client';

import MapContainer from '@/components/map-switch-container';
import { useEffect, useState } from 'react';
import { FrequencyData } from '../lib/interfaces';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';

// add alex barchart general solution
import BarChart from '@/components/charts/barchart';   

export default function Frequencies() {

    const [windowWidth, setWindowWidth] = useState<number>(1200);
    const [AllData, setAllData] = useState<FrequencyData[]>([]);

    // Stati per opzioni nei selettori
    const [selectedCountry, setSelectedCountry] = useState<string>('IT:Italy');
    
    //const [years, setYears] = useState<string[]>([]);
    const [countries, setCountries] = useState<string[]>([]);

    const [x, setX] = useState<string[]>([]);
    const [y, setY] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          try{
            //console.log("Fetching data...");
    
            // Load of the data
            const FreqCsvData: FrequencyData[] = await d3.csv(
            getStaticFile('datasets/final-project/use-of-the-internet/freq/annual_percentage_of_internet_access_per_EU_country_13_24.csv'),
              (d: any) => ({
                  freq: d.freq,
                  indic_is: d.indic_is,
                  ind_type: d.ind_type,
                  geo: d.geo,
                  TIME_PERIOD:  d.TIME_PERIOD?.toString(),
                  OBS_VALUE: +d.OBS_VALUE
              })
            );
            setAllData(FreqCsvData);
    
            
            //console.log("Data fetched:", FreqCsvData);
    
            // Estrazione di anni e paesi unici
            const uniqueYears = Array.from(new Set(FreqCsvData.map(d => d.TIME_PERIOD))).sort();
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
            const filteredData = AllData.filter(d => d.geo === selectedCountry);
        
            //console.log("Filtered data:", filteredData);
        
            if (filteredData.length === 0) {
              setX([]);
              setY([]);
              return;
            }
        
            const xValues = filteredData.map(d => String(d.TIME_PERIOD));
            const yValues = filteredData.map(d => d.OBS_VALUE);
        
            setX(xValues);
            setY(yValues);

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
                        component: (x.length > 0 && y.length > 0) ? (
                            <BarChart x={x} y={y} width={800} height={400} colorInterpoaltor={d3.interpolateBlues} />
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
          