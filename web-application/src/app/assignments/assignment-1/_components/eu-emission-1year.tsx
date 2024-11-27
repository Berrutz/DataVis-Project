import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';
import DataSourceInfo from '../../_components/data-source';
import ShowMoreChartDetailsModalDialog from '../../_components/show-more-chart-details-modal-dialog';

interface Data {
  country: string;
  code: string;
  year: string;
  emission: number;
}

const UEEmission1Year = () => {
  const [data, setData] = useState<Data[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('2022'); // Set default year here
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const yearStart = 1957;
  const yearEnd = 2022;

  // Fetch data when the component mounts
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

    const width = 800;
    const height = 500;
    const margin = { top: 20, right: 0, bottom: 40, left: 30 };

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
      .scaleBand()
      .domain(filteredData.map((d) => d.code))
      .range([0, width - margin.left - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(filteredData, (d) => d.emission)!])
      .nice()
      .range([height - margin.top - margin.bottom, 0]);

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svg
      .append('g')
      .call(d3.axisLeft(y).tickFormat((d) => `${d} t`)) // Add unit measure
      .append('text')
      .attr('text-anchor', 'end')
      .attr('fill', 'black')
      .attr('font-weight', 'bold')
      .attr('y', -10)
      .attr('x', -10);

    svg
      .selectAll('rect')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.code)!)
      .attr('y', (d) => y(d.emission))
      .attr('width', x.bandwidth())
      .attr(
        'height',
        (d) => height - margin.top - margin.bottom - y(d.emission)
      )
      .attr('fill', (d) => colorScale(d.emission))
      .on('mousemove', (event, d) => {
        if (tooltipRef.current) {
          // Get bounding box of SVG to calculate relative positioning
          const svgRect = svgRef.current?.getBoundingClientRect();
          const horizontalOffset = 15;
          const verticalOffset = 30;

          // Calculate the position of the tooltip relative to the SVG
          const tooltipX =
            event.clientX - (svgRect?.left || 0) + horizontalOffset;
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
  }, [data, selectedYear]);

  const yearOptions = Array.from(
    { length: yearEnd - yearStart + 1 },
    (_, i) => `${yearStart + i}`
  );

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex relative justify-center items-center w-full">
        <div className="hidden absolute right-0 top-3 sm:block">
          <label>Select Year: </label>
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
        <div className="overflow-x-auto h-full w-fit">
          <svg ref={svgRef} />
          <div
            ref={tooltipRef}
            className="absolute py-1 px-2 text-sm bg-white rounded border-2 border-solid opacity-0 pointer-events-none border-primary"
          ></div>
        </div>
      </div>
      <div className="flex">
        <DataSourceInfo>
          Global Carbon Budget (2023); Population based on various sources
          (2023){'; '}
          <ShowMoreChartDetailsModalDialog>
            <div className="mt-1 mb-1 mr-4 ml-4">
              <h2 className="mb-4 font-serif text-3xl">
                What you should know about this indicator
              </h2>
              <ul className="list-disc pl-5">
                <li>
                  Per capita emissions represent the emissions of an average
                  person in a country or region - they are calculated as the
                  total emissions divided by population
                </li>
                <li>
                  This data is based on territorial emissions, which do not
                  account for emissions embedded in traded goods
                </li>
                <li>
                  Emissions from international aviation and shipping are not
                  included in any country or region's emissions. They are only
                  included in the global total emissions.
                </li>
              </ul>
              <h2 className="mt-4 mb-2 font-serif text-3xl">Methodologies</h2>
              <p>
                From the database provided by "Our World In Data" containing
                data on per capita CO2 emissions of all countries, only those
                relating to the countries of the European Union (EU-27) have
                been extracted. The data are displayed on request depending on
                the selected year.
              </p>
            </div>
          </ShowMoreChartDetailsModalDialog>
        </DataSourceInfo>
      </div>
      <div className="block mt-3 sm:hidden">
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

export default UEEmission1Year;
