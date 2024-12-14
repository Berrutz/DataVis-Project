import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';
import DataSourceInfo from '../../_components/data-source';
import ShowMoreChartDetailsModalDialog from '../../_components/show-more-chart-details-modal-dialog';
import Tooltip from '../../_components/tooltip';

interface LineChartSmallScreenPops {
  newWidth: number | string;
}

interface Data {
  year: number;
  month: number;
  value: number;
  countryName: string;
}

// Array to map month numbers to month names
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const LineChart: React.FC<LineChartSmallScreenPops> = ({ newWidth }) => {
  const [minData, setMinData] = useState<Data[]>([]);
  const [maxData, setMaxData] = useState<Data[]>([]);
  const [avgData, setAvgData] = useState<Data[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2021);
  const [selectedCountryCode, setSelectedCountryCode] =
    useState<string>('Alabama');

  const maxColor = '#ff851a';
  const minColor = '#b35300';
  const avgColor = '#ffd000';

  useEffect(() => {
    const fetchData = async () => {
      // Caricamento dei dati per Min, Max, Avg con codice dello stato
      const minCsvData: Data[] = await d3.csv(
        getStaticFile('/datasets/assignment4/Min.csv'),
        (d: any) => ({
          year: +d.year,
          month: +d.month,
          value: +d.value,
          countryName: d.country
        })
      );
      setMinData(minCsvData);

      const maxCsvData: Data[] = await d3.csv(
        getStaticFile('/datasets/assignment4/Max.csv'),
        (d: any) => ({
          year: +d.year,
          month: +d.month,
          value: +d.value,
          countryName: d.country
        })
      );
      setMaxData(maxCsvData);

      const avgCsvData: Data[] = await d3.csv(
        getStaticFile('/datasets/assignment4/Avg.csv'),
        (d: any) => ({
          year: +d.year,
          month: +d.month,
          value: +d.value,
          countryName: d.country
        })
      );
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
    const filteredMinData = minData.filter(
      (d) =>
        d.year === selectedYear &&
        (selectedCountryCode ? d.countryName === selectedCountryCode : true)
    );
    const filteredMaxData = maxData.filter(
      (d) =>
        d.year === selectedYear &&
        (selectedCountryCode ? d.countryName === selectedCountryCode : true)
    );
    const filteredAvgData = avgData.filter(
      (d) =>
        d.year === selectedYear &&
        (selectedCountryCode ? d.countryName === selectedCountryCode : true)
    );

    // Creiamo le scale
    const xScale = d3
      .scaleBand()
      .domain(filteredMinData.map((d) => d.month.toString())) // Mesi sull'asse X
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          [...filteredMinData, ...filteredMaxData, ...filteredAvgData],
          (d) => d.value
        ) || 0
      ])
      .range([innerHeight, 0]);

    // Create lines
    const line = d3
      .line<Data>()
      .x((d) => (xScale(d.month.toString()) || 0) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.value));

    const chartGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Aggiungiamo le linee Min, Max e Avg to the chartGroup
    chartGroup
      .append('path')
      .data([filteredMinData])
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', `${minColor}`)
      .attr('stroke-width', 2);

    chartGroup
      .append('path')
      .data([filteredMaxData])
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', `${maxColor}`)
      .attr('stroke-width', 2);

    // Add circles for average
    chartGroup
      .selectAll('.avg-circle')
      .data(filteredAvgData)
      .enter()
      .append('circle')
      .attr('class', 'avg-circle')
      .attr(
        'cx',
        (d) => (xScale(d.month.toString()) || 0) + xScale.bandwidth() / 2
      )
      .attr('cy', (d) => yScale(d.value))
      .attr('r', 5)
      .attr('fill', `${avgColor}`);

    // Append circles for Min points
    chartGroup
      .selectAll('.min-circle')
      .data(filteredMinData)
      .enter()
      .append('circle')
      .attr('class', 'min-circle')
      .attr(
        'cx',
        (d) => (xScale(d.month.toString()) || 0) + xScale.bandwidth() / 2
      )
      .attr('cy', (d) => yScale(d.value))
      .attr('r', 3)
      .attr('fill', `${minColor}`);

    // Append circles for Max points
    chartGroup
      .selectAll('.max-circle')
      .data(filteredMaxData)
      .enter()
      .append('circle')
      .attr('class', 'max-circle')
      .attr(
        'cx',
        (d) => (xScale(d.month.toString()) || 0) + xScale.bandwidth() / 2
      )
      .attr('cy', (d) => yScale(d.value))
      .attr('r', 3)
      .attr('fill', `${maxColor}`);

    // Create tooltip
    const tooltip = d3.select('#tooltip');

    // Create vertical line and points
    const verticalLine = chartGroup
      .append('line')
      .attr('stroke', 'gray')
      .attr('stroke-width', 1)
      .style('visibility', 'hidden');

    const circles = chartGroup
      .selectAll('.hover-circle')
      .data([0, 1, 2]) // Represents Min, Max, Avg data
      .enter()
      .append('circle')
      .attr('r', 5)
      .style('visibility', 'hidden');

    // Mouse event listener
    svg
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'none')
      .style('pointer-events', 'all')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .on('mousemove', (event) => {
        const [mouseX] = d3.pointer(event);
        const hoveredMonth = xScale.domain().find((d) => {
          const bandX = xScale(d)! + xScale.bandwidth() / 2;
          return Math.abs(mouseX - bandX) < xScale.bandwidth() / 2;
        });

        if (!hoveredMonth) return;

        // Convert hoveredMonth (string) to an integer for lookup
        const monthIndex = parseInt(hoveredMonth, 10) - 1; // Adjust 1-based index
        const monthName = monthNames[monthIndex] || 'Unknown'; // Fallback for safety

        // Get closest data points
        const minPoint = filteredMinData.find(
          (d) => d.month.toString() === hoveredMonth
        );
        const maxPoint = filteredMaxData.find(
          (d) => d.month.toString() === hoveredMonth
        );
        const avgPoint = filteredAvgData.find(
          (d) => d.month.toString() === hoveredMonth
        );

        const points = [minPoint, maxPoint, avgPoint];

        // Get year
        const year = avgPoint?.year;

        // Update vertical line
        verticalLine
          .attr('x1', xScale(hoveredMonth)! + xScale.bandwidth() / 2)
          .attr('x2', xScale(hoveredMonth)! + xScale.bandwidth() / 2)
          .attr('y1', 0)
          .attr('y2', innerHeight)
          .style('visibility', 'visible');

        // Update circles
        circles
          .data(points)
          .attr('cx', xScale(hoveredMonth)! + xScale.bandwidth() / 2)
          .attr('cy', (d) => (d ? yScale(d.value) : 0))
          .attr(
            'fill',
            (_, i) => [`${minColor}`, `${maxColor}`, `${avgColor}`][i]
          )
          .style('visibility', (d) => (d ? 'visible' : 'hidden'));

        // Update tooltip
        // Update tooltip position
        const svgRect = svgRef.current?.getBoundingClientRect();
        const tooltipWidth = (tooltip.node() as HTMLElement)?.offsetWidth || 0; // Get tooltip width dynamically
        const tooltipHeight =
          (tooltip.node() as HTMLElement)?.offsetHeight || 0; // Get tooltip height dynamically
        const horizontalOffset = 10;
        const verticalOffset = 10;

        let tooltipX = event.clientX - (svgRect?.left || 0) + horizontalOffset;
        let tooltipY = event.clientY - (svgRect?.top || 0) - verticalOffset;

        // Check if the tooltip would overflow the graph's width and hieght
        if (tooltipX + tooltipWidth > innerWidth) {
          tooltipX =
            event.clientX -
            (svgRect?.left || 0) -
            tooltipWidth -
            horizontalOffset;
        }
        if (tooltipY + tooltipHeight > innerHeight) {
          tooltipY =
            event.clientY -
            (svgRect?.top || 0) -
            tooltipHeight -
            verticalOffset;
        }

        tooltip
          .html(
            `
          <div style="display: flex; flex-direction: column;">
            <!-- Header with Year and Month -->
            <div style="font-weight: bold; margin-bottom: 5px;">
              ${year} - ${monthName}
            </div>

            <!-- Line 2: Max -->
            <div style="display: flex; align-items: center; gap: 5px;">
              <div style="width: 15px; height: 15px; background-color: ${maxColor};"></div>
              <span> 
                Max: <a style="font-weight: bold">${maxPoint?.value.toFixed(
                  1
                )} °F</a>
              </span>
            </div>

            <!-- Line 3: Avg -->
            <div style="display: flex; align-items: center; gap: 5px;">
              <div style="width: 15px; height: 15px; background-color: ${avgColor};"></div>
              <span>
                Avg: <a style="font-weight: bold">${avgPoint?.value.toFixed(
                  1
                )} °F</a>
              </span>
            </div>
      
            <!-- Line 1: Min -->
            <div style="display: flex; align-items: center; gap: 5px;">
              <div style="width: 15px; height: 15px; background-color: ${minColor};"></div>
              <span>
                Min: <a style="font-weight: bold">${minPoint?.value.toFixed(
                  1
                )} °F</a>
              </span>
            </div>
          </div>
        `
          )
          .style('left', `${tooltipX}px`)
          .style('top', `${tooltipY}px`)
          .style('display', 'block')
          .style('opacity', 1);
      })
      .on('mouseout', () => {
        verticalLine.style('visibility', 'hidden');
        circles.style('visibility', 'hidden');
        tooltip.style('display', 'none').style('opacity', 0);
      });

    // Add y-axis grid lines
    const yTicks = yScale.ticks().filter((tick) => tick !== 0); // Get tick values from yScale
    chartGroup
      .selectAll('.grid-line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', 'gray')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4 4'); // Dotted line pattern

    // Add axis
    svg
      .append('g')
      .attr(
        'transform',
        `translate(${margin.left}, ${margin.top + innerHeight})`
      )
      .call(d3.axisBottom(xScale));

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(yScale));
  }, [minData, maxData, avgData, selectedYear, selectedCountryCode, newWidth]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative w-full mb-2">
        <div className="flex relative justify-center items-center w-full">
          <div className="relative overflow-x-auto h-full w-fit">
            <svg ref={svgRef} />
            <Tooltip id="tooltip" />
          </div>
        </div>
      </div>
      <DataSourceInfo>
        National Centers for Environmental Information (NCEI);{' '}
        <ShowMoreChartDetailsModalDialog>
          <div className="mt-1 mb-3 mr-4 ml-4">
            <h2 className="font-serif mt-4 mb-2 text-xl xs:text-2xl sm:text-3xl">
              Methodologies
            </h2>
            <p>
              From the database provided by the National Centers for
              Environmental Information containing data on minimum, maximum and
              average temperatures, only those relating to the states and nation
              have been extracted. The data are displayed on request depending
              on the selected year.
            </p>
          </div>
        </ShowMoreChartDetailsModalDialog>
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
      <div className="mt-3">
        <label htmlFor="country">Select country: </label>
        <select
          id="country"
          value={selectedCountryCode}
          onChange={(e) => setSelectedCountryCode(e.target.value)} // Nessuna conversione a number
          className="py-1 px-2 ml-2 rounded-md border bg-background"
        >
          {[...new Set(minData.map((d) => d.countryName))].map(
            (countryName) => (
              <option key={countryName} value={countryName}>
                {countryName}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );
};

export default LineChart;
