import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

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

const AlluvialPlot = () => {
  const [data, setData] = useState<Data[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('2023'); // Set default year here

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
    const width = 800;
    const height = 500;

    svg.attr('width', width).attr('height', height);

    const margin = { top: 20, right: 20, bottom: 40, left: 20 };
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

    // Get top 10 countries by total energy consumption
    const topCountries = countryTotals
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
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
      ...topCountries.map((country) => ({ name: country })),
      ...energySources.map((source) => ({ name: source }))
    ];

    const links = filteredData
      .filter((d) => topCountries.includes(d.country))
      .flatMap((d) =>
        energySources.map((source) => ({
          source: topCountries.indexOf(d.country),
          target: topCountries.length + energySources.indexOf(source),
          value: d[source as keyof Data]
        }))
      );
    /*    .filter((link: { value: number; }) => link.value > 0); // Remove zero-value links

    const sankeyGenerator = sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .extent([
      [0, 0],
      [innerWidth, innerHeight],
    ]);

  const sankeyData = sankeyGenerator({
    nodes: nodes.map((d) => ({ ...d })),
    links: links.map((d) => ({ ...d })),
  });

  // Draw links
  svg
    .append('g')
    .selectAll('path')
    .data(sankeyData.links)
    .join('path')
    .attr('d', sankeyLinkHorizontal())
    .attr('fill', 'none')
    .attr('stroke', '#888')
    .attr('stroke-width', (d) => Math.max(1, d.width))
    .attr('opacity', 0.7);

  // Draw nodes
  svg
    .append('g')
    .selectAll('rect')
    .data(sankeyData.nodes)
    .join('rect')
    .attr('x', (d) => d.x0)
    .attr('y', (d) => d.y0)
    .attr('width', (d) => d.x1 - d.x0)
    .attr('height', (d) => d.y1 - d.y0)
    .attr('fill', '#007acc')
    .attr('stroke', '#000');

  // Add labels
  svg
    .append('g')
    .selectAll('text')
    .data(sankeyData.nodes)
    .join('text')
    .attr('x', (d) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
    .attr('y', (d) => (d.y0 + d.y1) / 2)
    .attr('text-anchor', (d) => (d.x0 < width / 2 ? 'start' : 'end'))
    .attr('alignment-baseline', 'middle')
    .text((d) => d.name); */
  }, [data, selectedYear]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default AlluvialPlot;
