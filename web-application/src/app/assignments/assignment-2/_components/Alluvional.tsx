import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';

interface Data {
    country: string;  // Nome del paese
    code: string;     // Codice del paese o identificatore
    year: number;     // Anno del dato
    biofuels: number; // Consumo di bioenergia in TWh
    solar: number;    // Consumo di energia solare in TWh
    wind: number;     // Consumo di energia eolica in TWh
    hydro: number;    // Consumo di energia idroelettrica in TWh
    nuclear: number;  // Consumo di energia nucleare in TWh
    gas: number;      // Consumo di gas in TWh
    coal: number;     // Consumo di carbone in TWh
    oil: number;      // Consumo di petrolio in TWh
  }
  

const AlluvialPlot = () => {
  const [data, setData] = useState<Data[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('2021'); // Set default year here


  useEffect(() => {
    const fetchData = async () => {
      const csvData = await d3.csv(
        getStaticFile('/datasets/assignment2/energy-consumption-2021.csv'), // Sostituisci con il tuo file CSV
        (d) => ({
          country: d.Entity,
          code: d.Code,
          year: +d.Year,
          biofuels: +d['Biofuels consumption - TWh'],
          solar: +d['Solar consumption - TWh'],
          wind: +d['Wind consumption - TWh'],
          hydro: +d['Hydro consumption - TWh'],
          nuclear: +d['Nuclear consumption - TWh'],
          gas: +d['Gas consumption - TWh'],
          coal: +d['Coal consumption - TWh'],
          oil: +d['Oil consumption - TWh']
        })
      );
      setData(csvData);
    };

    fetchData();
  }, []);


  useEffect(() => { 

    if (!data || data.length === 0) return;

    const width = 800;
    const height = 500;
    const margin = { top: 20, right: 0, bottom: 40, left: 30 };
    const categories = ['biofuels', 'solar', 'wind', 'hydro', 'nuclear', 'gas', 'coal', 'oil'];

    const years = [...new Set(data.map(d => d.year))].sort();
    console.log(years);

    // TODO : continue implementing Alluvional

  }, [data, selectedYear]);
  
    
  
    
  
  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default AlluvialPlot;
