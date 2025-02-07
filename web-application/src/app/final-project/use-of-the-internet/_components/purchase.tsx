'use client';

import MapContainer from '@/components/map-switch-container';
import { useEffect, useState } from 'react';
import { FrequencyData, PurchaseData } from '../lib/interfaces';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';

// add alex barchart general solution
import BarChart from '@/components/charts/barchart';   

export default function Purchase() {

    const [windowWidth, setWindowWidth] = useState<number>(1200);
    const [AllData, setAllData] = useState<PurchaseData[]>([]);

    // Stati per opzioni nei selettori
    const [selectedCountry, setSelectedCountry] = useState<string>('Italy');
    
    //const [years, setYears] = useState<string[]>([]);
    const [countries, setCountries] = useState<string[]>([]);

    const [x, setX] = useState<string[]>([]);
    const [y, setY] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          try{
            console.log("Fetching data...");
    
            // Load of the data
            const PurchaseCsvData: PurchaseData[] = await d3.csv(
            getStaticFile('datasets/final-project/use-of-the-internet/purchase/percentage_purchase_last_3_month_2010_2024.csv'),
                (d: any) => ({
                  country: d.Country,
                  year:  d.Year,
                  percentage: +d.percentage_of_individual
              })
            );
            setAllData(PurchaseCsvData);
    
            
            console.log("Data fetched:", PurchaseCsvData);
    
            // Estrazione di anni e paesi unici
            const uniqueYears = Array.from(new Set(PurchaseCsvData.map(d => d.year))).sort();
            const uniqueCountries = Array.from(new Set(PurchaseCsvData.map(d => d.country))).sort();
            
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
              setX([]);
              setY([]);
              return;
            }
        
            const xValues = filteredData.map(d => String(d.year));
            const yValues = filteredData.map(d => d.percentage);
        
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
                            <BarChart x={x} y={y} width={700} height={500} colorInterpoaltor={d3.interpolateReds} ml={90} mb={70} yLabel='Percentage of Individuals' xLabel='Years' />
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
          