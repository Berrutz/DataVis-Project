import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';

interface Data {
  country: string;
  code: string;
  year: string;
  emission: number;
}

const UEEmissionDecade = () => {
  const [data, setData] = useState<Data[]>([]);
  const [selectedDecade, setSelectedDecade] = useState<number>(2013); // Default decade
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const minDecade = 1963;
  const maxDecade = 2013;

  const decadeOptions = Array.from(
    { length: (maxDecade - minDecade) / 10 + 1 },
    (_, i) => {
      const startYear = minDecade + i * 10;
      return `${startYear}-${startYear + 9}`;
    }
  );

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
    // Define the decade range
    const startYear = selectedDecade;
    const endYear = startYear + 9;

    // Filter data to only include years in the selected decade
    const decadeData = data.filter(
      (d) => +d.year >= startYear && +d.year <= endYear
    );

    // Group data by country and calculate the average emissions for each country
    const decadeAverages = Array.from(
      d3.group(decadeData, (d) => d.code),
      ([code, values]) => ({
        code,
        averageEmission: d3.mean(values, (d) => d.emission) || 0
      })
    );

    // Sort countries by average emission in descending order
    decadeAverages.sort((a, b) => b.averageEmission - a.averageEmission);

    if (decadeAverages.length === 0) return;

    const width = 800;
    const height = 500;
    const margin = { top: 20, right: 0, bottom: 40, left: 30 };

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(decadeAverages.map((d) => d.code))
      .range([0, width - margin.left - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(decadeAverages, (d) => d.averageEmission)!])
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
      .call(d3.axisLeft(y).tickFormat((d) => `${d} t`))
      .append('text')
      .attr('text-anchor', 'end')
      .attr('fill', 'black')
      .attr('font-weight', 'bold')
      .attr('y', -10)
      .attr('x', -10);

    svg
      .selectAll('rect')
      .data(decadeAverages)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.code)!)
      .attr('y', (d) => y(d.averageEmission))
      .attr('width', x.bandwidth())
      .attr(
        'height',
        (d) => height - margin.top - margin.bottom - y(d.averageEmission)
      )
      .attr('fill', '#22269c')
      .on('mousemove', (event, d) => {
        if (tooltipRef.current) {
          // Get bounding box of SVG to calculate relative positioning
          const svgRect = svgRef.current?.getBoundingClientRect();

          // Calculate the position of the tooltip relative to the SVG
          const tooltipX = event.clientX - (svgRect?.left || 0) + 15; // Offset by 10px for better visibility
          const tooltipY = event.clientY - (svgRect?.top || 0) - 30; // Offset slightly above the cursor

          tooltipRef.current.style.left = `${tooltipX}px`;
          tooltipRef.current.style.top = `${tooltipY}px`;
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.textContent = `CO₂ Emissions: ${d.averageEmission.toFixed(
            2
          )} t per capita`;
        }
      })
      .on('mouseleave', () => {
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '0';
        }
      });
  }, [data, selectedDecade]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const startYear = parseInt(e.target.value.split('-')[0]);
    setSelectedDecade(startYear);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex relative justify-center items-center w-full">
        <div className="absolute top-3 right-0 hidden sm:block">
          <label>Select Decade: </label>
          <select
            value={`${selectedDecade}-${selectedDecade + 9}`}
            onChange={handleSelectChange}
            className="py-1 px-2 ml-2 rounded-md border bg-background"
          >
            {decadeOptions.map((decade) => (
              <option key={decade} value={decade}>
                {decade}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto h-full w-fit">
          <svg ref={svgRef}></svg>
          <div
            ref={tooltipRef}
            className="absolute px-2 py-1 text-sm bg-white border-solid border-2 border-primary rounded opacity-0 pointer-events-none"
          ></div>
        </div>
      </div>
      <p className="text-sm text-gray-500">
        <a className="font-medium text-gray-800">Data source: </a>
        Global Carbon Budget (2023); Population based on various sources (2023)
      </p>
      <div className="mt-3 block sm:hidden">
        <label>Select Decade: </label>
        <select
          value={`${selectedDecade}-${selectedDecade + 9}`}
          onChange={handleSelectChange}
          className="py-1 px-2 ml-2 rounded-md border bg-background"
        >
          {decadeOptions.map((decade) => (
            <option key={decade} value={decade}>
              {decade}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default UEEmissionDecade;