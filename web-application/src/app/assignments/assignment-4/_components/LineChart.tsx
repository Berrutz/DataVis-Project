import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';
import DataSourceInfo from '../../_components/data-source';
import ShowMoreChartDetailsModalDialog from '../../_components/show-more-chart-details-modal-dialog';

interface LineChartSmallScreenPops {
  newWidth: number | string;
}

interface Data {
    year: number;
    month: number;
    value: number;
    countryCode: string; // Cambia a string se il codice del paese è una stringa
}
  

const LineChart: React.FC<LineChartSmallScreenPops> = ({ newWidth }) => {
  const [minData, setMinData] = useState<Data[]>([]);
  const [maxData, setMaxData] = useState<Data[]>([]);
  const [avgData, setAvgData] = useState<Data[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2021);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('001'); // Stato per il codice dello stato

  useEffect(() => {
    const fetchData = async () => {
      // Caricamento dei dati per Min, Max, Avg con codice dello stato
      const minCsvData: Data[] = await d3.csv(getStaticFile('/datasets/assignment4/Min.csv'), (d: any) => ({
        year: +d.year,
        month: +d.month,
        value: +d.value,
        countryCode: d.state_code.toString(), // Usa state_code come stringa
      }));
      setMinData(minCsvData);

      const maxCsvData: Data[] = await d3.csv(getStaticFile('/datasets/assignment4/Max.csv'), (d: any) => ({
        year: +d.year,
        month: +d.month,
        value: +d.value,
        countryCode: d.state_code.toString(), // Usa state_code come stringa
      }));
      setMaxData(maxCsvData);

      const avgCsvData: Data[] = await d3.csv(getStaticFile('/datasets/assignment4/Avg.csv'), (d: any) => ({
        year: +d.year,
        month: +d.month,
        value: +d.value,
        countryCode: d.state_code.toString(), // Usa state_code come stringa
      }));
      setAvgData(avgCsvData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!minData.length || !maxData.length || !avgData.length) return;

    const svg = d3.select(svgRef.current);
    const width = +newWidth || 820;
    const height = 550;

    svg.attr('width', width).attr('height', height);

    const margin = { top: 20, right: 80, bottom: 50, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.selectAll('*').remove(); // Pulisce il contenuto precedente

    // Filtriamo i dati in base all'anno e al codice dello stato selezionato
    const filteredMinData = minData.filter(d => d.year === selectedYear 
        && (selectedCountryCode ? d.countryCode === selectedCountryCode : true));
    const filteredMaxData = maxData.filter(d => d.year === selectedYear 
        && (selectedCountryCode ? d.countryCode === selectedCountryCode : true));
    const filteredAvgData = avgData.filter(d => d.year === selectedYear 
        && (selectedCountryCode ? d.countryCode === selectedCountryCode : true));

    // Creiamo le scale
    const xScale = d3.scaleBand()
      .domain(filteredMinData.map(d => d.month.toString()))  // Mesi sull'asse X
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max([...filteredMinData, ...filteredMaxData, ...filteredAvgData], d => d.value) || 0])
      .range([innerHeight, 0]);

    // Creiamo le linee
    const lineMin = d3.line<Data>()
      .x(d => xScale(d.month.toString()) || 0)
      .y(d => yScale(d.value));

    const lineMax = d3.line<Data>()
      .x(d => xScale(d.month.toString()) || 0)
      .y(d => yScale(d.value));

    const lineAvg = d3.line<Data>()
      .x(d => xScale(d.month.toString()) || 0)
      .y(d => yScale(d.value));

    // Aggiungiamo le linee Min, Max e Avg
    svg.append('path')
      .data([filteredMinData])
      .attr('d', lineMin)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 2);

    svg.append('path')
      .data([filteredMaxData])
      .attr('d', lineMax)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 2);

    // Aggiungiamo i punti (opzionale)
    svg.selectAll('.avg-points')
      .data(filteredAvgData)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.month.toString()) || 0)
      .attr('cy', d => yScale(d.value))
      .attr('r', 5)
      .attr('fill', 'green');

    // Aggiungiamo gli assi
    svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top + innerHeight})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(yScale));

  }, [minData, maxData, avgData, selectedYear, selectedCountryCode, newWidth]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative w-full mb-2">
        <div className="flex relative justify-center items-center w-full">
          <div className="relative overflow-x-auto h-full w-fit">
            <svg ref={svgRef} />
          </div>
        </div>
      </div>
      <DataSourceInfo>
        Global Carbon Budget (2024);
      </DataSourceInfo>
      <div>
        <label htmlFor="year">Select Year: </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="py-1 px-2 ml-2 rounded-md border bg-background"
        >
          {[...new Set(minData.map((d) => d.year))].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="country">Select country: </label>
        <select
            id="country"
            value={selectedCountryCode}
            onChange={(e) => setSelectedCountryCode(e.target.value)} // Nessuna conversione a number
            className="py-1 px-2 ml-2 rounded-md border bg-background"
            >
            {[...new Set(minData.map((d) => d.countryCode))].map((countryCode) => (
            <option key={countryCode} value={countryCode}>
                {countryCode}
            </option>
            ))}
        </select>
      </div>
    </div>
  );

};

export default LineChart;
