import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';
import DataSourceInfo from '../../_components/data-source';
import ShowMoreChartDetailsModalDialog from '../../_components/show-more-chart-details-modal-dialog';

interface UEEmission1YearVerticalProps {
  newWidth: number | string;
}

interface Data {
  country: string;
  code: string;
  year: string;
  emission: number;
}

const UEEmission1YearVertical: React.FC<UEEmission1YearVerticalProps> = ({
  newWidth
}) => {
  const [data, setData] = useState<Data[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('2022'); // Set default year here
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const yearStart = 1957;
  const yearEnd = 2022;

  // Fetch data  when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const csvData = await d3.csv(
        getStaticFile('/datasets/assignment1/co-emissions-per-capita-ue.csv'),
        (d) => ({
          country: d.Entity,
          code: d.Code,
          year: d.Year,
          emission: +d['Annual CO₂ emissions (per capita)']
        })
      );
      setData(csvData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter data based on the selected year
    const filteredData = data.filter((d) => d.year === selectedYear);

    if (filteredData.length === 0) return;

    filteredData.sort((a, b) => b.emission - a.emission);

    const width = +newWidth || 600;
    const height = 600;
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };

    d3.select(svgRef.current).selectAll('*').remove();

    const colorScale = d3
      .scaleSequential(d3.interpolateReds)
      .domain([0, d3.max(filteredData, (d) => d.emission)!]);

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(filteredData, (d) => d.emission)!])
      .range([0, width - margin.left - margin.right]); // Linear scale for emissions

    const y = d3
      .scaleBand()
      .domain(filteredData.map((d) => d.code))
      .range([0, height - margin.top - margin.bottom])
      .padding(0.1);

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .tickSize(0)
          .tickFormat((d) => `${d} t`)
      );

    svg
      .append('g')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('text-anchor', 'end')
      .attr('fill', 'black')
      .attr('font-weight', 'bold')
      .attr('y', -10)
      .attr('x', -10)
      .text('Countries');

    // Draw bars with tooltip
    svg
      .selectAll('rect')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('x', 0) // x is fixed at 0 for vertical bars
      .attr('y', (d) => y(d.code)!)
      .attr('width', (d) => x(d.emission))
      .attr('height', y.bandwidth())
      .attr('fill', (d) => colorScale(d.emission))
      .on('mousemove', (event, d) => {
        if (tooltipRef.current) {
          const svgRect = svgRef.current?.getBoundingClientRect();
          const horizontalOffset = 100;
          const verticalOffset = 35;

          const tooltipX =
            event.clientX - (svgRect?.left || 0) - horizontalOffset;
          const tooltipY = event.clientY - (svgRect?.top || 0) - verticalOffset;
          tooltipRef.current.style.left = `${tooltipX}px`;
          tooltipRef.current.style.top = `${tooltipY}px`;
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.textContent = `${d.emission.toFixed(
            2
          )} tonnes per person`;
        }

        // Highlight the hovered bar
        d3.selectAll('rect').transition().duration(200).style('opacity', 0.4);

        d3.select(event.target as SVGRectElement)
          .transition()
          .duration(200)
          .style('opacity', 1);
      })
      .on('mouseleave', () => {
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '0';
        }

        // Reset opacity for all bars
        d3.selectAll('rect').transition().duration(200).style('opacity', 1);
      });

    const legendWidth = 300;
    const legendHeight = 20;

    const legendSvg = svg
      .append('g')
      .attr(
        'transform',
        `translate(${margin.left}, ${height - margin.bottom - 40})`
      );
  }, [data, selectedYear, newWidth]);

  const yearOptions = Array.from(
    { length: yearEnd - yearStart + 1 },
    (_, i) => `${yearStart + i}`
  );
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex relative justify-center items-center w-full">
        <div className="overflow-x-auto h-full w-fit">
          <svg ref={svgRef} />
          <div
            ref={tooltipRef}
            className="absolute py-1 px-2 text-sm bg-white rounded border-2 border-solid opacity-0 pointer-events-none border-primary"
          ></div>
        </div>
      </div>
      <DataSourceInfo>
        Global Carbon Budget (2023); Population based on various sources (2023){' '}
        <ShowMoreChartDetailsModalDialog>
          More graph details here
        </ShowMoreChartDetailsModalDialog>
      </DataSourceInfo>
      <div className="mt-3">
        <label>Selected Year: </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="py-1 px-2 ml-2 rounded-md border bg-background"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default UEEmission1YearVertical;
