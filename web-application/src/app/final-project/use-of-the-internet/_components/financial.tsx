'use client';

import MapContainer from '@/components/map-switch-container';
import { useEffect, useState } from 'react';
import { FinancialData } from '../lib/interfaces';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';

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

    const [percentage, setPercentage] = useState<number[]>([]);


    useEffect(() => {
        const fetchData = async () => {
          try{
            console.log("Fetching data...");
    
            // Load of the data
            const FinCsvData: FinancialData[] = await d3.csv(
            getStaticFile('datasets/final-project/use-of-the-internet/financial/percentage_Individuals_bought_or_sold shares_or_other_investiment.csv'),
              (d: any) => ({
                  country: d.Country,
                  year:  d.Years,
                  percentage: +d.percentage,
                  population: +d.population
              })
            );
            setAllData(FinCsvData);
            
            console.log("All Data Financial: " ,FinCsvData )
    
            // Estrazione di anni e paesi unici
            //const uniqueCountries = Array.from(new Set(FinCsvData.map(d => d.country))).sort();
            //setCountries(uniqueCountries);
    
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
        
            if (filteredData.length === 0) {
              setDimBubble([]);
              setColorBubble([]);
              return;
            }
        
            const how_much_rows = 20
            // Ordinare i dati in base a "percentage" in ordine decrescente
            const sortedData = filteredData.sort((a, b) => b.percentage - a.percentage);
            const top20 = sortedData.slice(0, how_much_rows);
            const topCountries = Array.from(new Set(top20.map(d => d.country)));
            const maxPercentage = Math.max(...top20.map(d => d.percentage));
            const normalizedPercentages = top20.map(d => (d.percentage / maxPercentage) * 100);

            // Impostare gli stati
            //setPercentage()
            setDimBubble(normalizedPercentages);
            setColorBubble(top20.map(d => d.country));
            setNumBubble(top20.map(d => d.year));
            setPercentage(top20.map(d => d.percentage))

            console.log("🔹 Top 20 dati ordinati per percentage:", top20);
            console.log("🌍 Paesi presenti nelle top 20:", topCountries);

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
                component: (dimension_of_the_bubble.length > 0 && color_of_the_bubble.length > 0 && number_of_bubbles.length > 0) ? (
                    <BubbleChart
                    bubble_percentage={percentage}
                    bubble_dimension = {dimension_of_the_bubble}
                    bubble_color = {color_of_the_bubble}
                    bubble_number = {number_of_bubbles}
                    width={800}
                    height={700}
                    colorInterpolator={d3.interpolateRainbow}
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
          