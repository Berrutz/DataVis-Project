'use client';

import MapContainer from '@/components/map-switch-container';
import { useEffect, useState } from 'react';
import { DegradingData } from '../lib/interfaces';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';

import FacetedBarChart from '@/components/charts/FacetedBarChart';

// Definiamo il tipo atteso da FacetedBarChart
interface ChartData {
  category: string;
  group: string;
  value: number;
}

export default function DegradingMessages() {

    const [windowWidth, setWindowWidth] = useState<number>(1200);
    const [AllData, setAllData] = useState<DegradingData[]>([]);

    // Stati per opzioni nei selettori
    //const [selectedCountry, setSelectedCountry] = useState<string>('Italy');
    
    //const [years, setYears] = useState<string[]>([]);
    const [countries, setCountries] = useState<string[]>([]);
    const [chartData, setChartData] = useState<ChartData[]>([]);



    useEffect(() => {
        const fetchData = async () => {
          try{
            //console.log("Fetching data...");
    
            // Load of the data
            const DegradeCsvData: DegradingData[] = await d3.csv(
            getStaticFile('datasets/final-project/use-of-the-internet/degrading/percentage_people_degrading_online_mex.csv'),
              (d: any) => ({
                  reason : d.reason_to_discriminate,
                  country: d.Country,
                  percentage: +d.percentage_of_individual,
              })
            );
            setAllData(DegradeCsvData);
            
            //console.log("ALL DATA DEGRADED : " ,DegradeCsvData )
    
            // Estrazione di anni e paesi unici
            const uniqueCountries = Array.from(new Set(DegradeCsvData.map(d => d.country))).sort();
            
            setCountries(uniqueCountries);

            // Convertiamo i dati nel formato richiesto
            const formattedData: ChartData[] = DegradeCsvData.map(d => ({
              category: d.country,  // "reason" diventa "category"
              group: d.reason,    // "country" diventa "group"
              value: d.percentage  // "percentage" diventa "value"
          }));

          setChartData(formattedData);

    
          }catch (error) {
            console.error("Error", error);
          }
    
        };
    
        fetchData();
        }, []);

        useEffect(() => {
            if (AllData.length === 0) return;

          }, [AllData]);


return(
    <div className="mt-3">
    {/* Mappa e grafico */}
        <MapContainer
            components={[
                {
                buttonText: 'Line',
                component:  AllData.length > 0 ? (
                  <FacetedBarChart data={chartData} width={800} height={500} />
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
          