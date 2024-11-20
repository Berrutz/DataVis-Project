import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import DataSourceInfo from '../../_components/data-source';

interface Data {
  country: string; // Country name
  code: string; // Country ID
  year: number; // year considered
  biofuels: number; // Biofuels consumption - TWh
  solar: number; // Solar consumption - TWh
  wind: number; // Wind consumption - TWh
  hydro: number; // Hydro consumption - TWh
  nuclear: number; // Nuclear consumption - TWh
  gas: number; // Gas consumption - TWh
  coal: number; // Coal consumption - TWh
  oil: number; // Oil consumption - TWh
  other: number; // Other renewables (including geothermal and biomass) - TWh
}

interface CustomNode {
  name: string;
  index: number;
  x0?: number; // Optional, added by Sankey layout
  x1?: number; // Optional, added by Sankey layout
  y0?: number; // Optional, added by Sankey layout
  y1?: number; // Optional, added by Sankey layout
}

interface CustomLink {
  source: number; // Index of source node
  target: number; // Index of target node
  value: number; // Link value
  width?: number; // Optional, added by Sankey layout
}

const AlluvialPlot = () => {
  const [data, setData] = useState<Data[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('2021'); // Set default year here

  const colorScale = d3
    .scaleOrdinal<string>()
    .domain([
      'biofuels',
      'solar',
      'wind',
      'hydro',
      'nuclear',
      'gas',
      'coal',
      'oil',
      'other'
    ])
    .range([
      '#66c2a5',
      '#fc8d62',
      '#8da0cb',
      '#e78ac3',
      '#a6d854',
      '#ffd92f',
      '#e5c494',
      '#543937',
      '#d73027'
    ]);

  useEffect(() => {
    const fetchData = async () => {
      const csvData = await d3.csv(
        getStaticFile('/datasets/assignment2/energy-consumption-2021.csv'),
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
          oil: +d['Oil consumption - TWh'],
          other: +d['Other renewables (including geothermal and biomass) - TWh']
        })
      );
      setData(csvData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 850;
    const height = 500;

    svg.attr('width', width).attr('height', height);

    const margin = { top: 20, right: 80, bottom: 40, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const filteredData = data.filter((d) => d.year === +selectedYear);

    // Calculate total energy consumption for each country
    const countryTotals = filteredData.map((d) => ({
      country: d.country,
      total:
        d.biofuels +
        d.solar +
        d.wind +
        d.hydro +
        d.nuclear +
        d.gas +
        d.coal +
        d.oil +
        d.other
    }));

    // Get top 7 countries by total energy consumption
    const topCountries = countryTotals
      .sort((a, b) => b.total - a.total)
      .slice(0, 7)
      .map((d) => d.country);

    // Create nodes and links for Sankey layout
    const energySources = [
      'biofuels',
      'solar',
      'wind',
      'hydro',
      'nuclear',
      'gas',
      'coal',
      'oil',
      'other'
    ];

    const nodes = [
      ...topCountries.map((country, i) => ({ name: country, index: i })),
      ...energySources.map((source, i) => ({
        name: source,
        index: topCountries.length + i
      }))
    ];

    // Update links to reference `index` instead of relying on array position
    const links = filteredData
      .filter((d) => topCountries.includes(d.country))
      .flatMap((d) =>
        energySources.map((source) => ({
          source: +nodes.find((node) => node.name === d.country)?.index!, // Match country node index
          target: +nodes.find((node) => node.name === source)?.index!, // Match energy source node index
          value: +d[source as keyof Data]
        }))
      )
      .filter((link) => link.value > 0); // Remove zero-value links

    const sankeyGenerator = sankey<CustomNode, CustomLink>()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [0, 0],
        [innerWidth, innerHeight]
      ]);

    const sankeyData = sankeyGenerator({
      nodes: nodes.map((d) => ({ ...d })),
      links: links.map((d) => ({ ...d }))
    });

    // Add labels
    svg
      .append('g')
      .selectAll('rect')
      .data(sankeyData.nodes)
      .join('rect')
      .attr('x', (d) => d.x0 ?? 0)
      .attr('y', (d) => d.y0 ?? 0)
      .attr('width', (d) => (d.x1 ?? 0) - (d.x0 ?? 0))
      .attr('height', (d) => (d.y1 ?? 0) - (d.y0 ?? 0))
      .attr('fill', (d) => {
        // If the node is an energy source, use the color scale
        if (energySources.includes(d.name)) {
          return colorScale(d.name); // Energy type color
        }
        return '#007acc'; // Default color for countries
      })
      .attr('stroke', '#000');

    // Draw links
    svg
      .append('g')
      .selectAll('path')
      .data(sankeyData.links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('fill', 'none')
      .attr('stroke', '#888')
      .attr('stroke-width', (d) => Math.max(1, d.width ?? 0)) // Fallback to 0 if `width` is undefined
      .attr('opacity', 0.7);

    // Draw nodes
    svg
      .append('g')
      .selectAll('path')
      .data(sankeyData.links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('fill', 'none')
      .attr('stroke', (d) => {
        const targetNode = d.target as CustomNode;
        return colorScale(targetNode.name); // Use the energy source name for the color
      })
      .attr('stroke-width', (d) => Math.max(1, d.width ?? 0))
      .attr('opacity', 0.7);

    svg
      .append('g')
      .selectAll('text')
      .data(sankeyData.nodes)
      .join('text')
      .attr('x', (d) =>
        energySources.includes(d.name) ? d.x0! - 10 : margin.left
      ) // Fixed x for countries
      .attr('y', (d) => ((d.y0 ?? 0) + (d.y1 ?? 0)) / 2)
      .attr('text-anchor', (d) =>
        energySources.includes(d.name) ? 'end' : 'start'
      )
      .attr('alignment-baseline', 'middle')
      .text((d) => {
        if (!energySources.includes(d.name)) {
          return d.name; // Display country name (only for country nodes)
        }
        return '';
      })
      .attr('fill', '#000');

    /***********************LEGEND*********************/
    const legendMargin = 15;
    const legendX = innerWidth + legendMargin;

    const legend = svg
      .append('g')
      .attr('transform', `translate(${legendX}, ${margin.top})`);

    legend
      .selectAll('rect')
      .data(energySources)
      .join('rect')
      .attr('x', 0)
      .attr('y', (_, i) => i * 20)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d) => colorScale(d));

    legend
      .selectAll('text')
      .data(energySources)
      .join('text')
      .attr('x', 20)
      .attr('y', (_, i) => i * 20 + 12)
      .text((d) => d)
      .attr('font-size', '12px')
      .attr('fill', '#000');
  }, [data, selectedYear]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex relative justify-center items-center w-full">
        <div className="overflow-x-auto h-full w-fit">
          <svg ref={svgRef} />
        </div>
      </div>
      <DataSourceInfo>
        Energy Institute - Statistical Review of World Energy (2024) - with
        major processing by Our World in Data
      </DataSourceInfo>
      <div className="mt-3">
        <label htmlFor="year">Select Year: </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="py-1 px-2 ml-2 rounded-md border bg-background"
        >
          {[...new Set(data.map((d) => d.year))].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AlluvialPlot;
