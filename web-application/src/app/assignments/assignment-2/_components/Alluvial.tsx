import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';
import { sankey, sankeyLinkHorizontal, SankeyNodeMinimal } from 'd3-sankey';
import DataSourceInfo from '../../_components/data-source';
import ShowMoreChartDetailsModalDialog from '../../_components/show-more-chart-details-modal-dialog';
import {
  generateLegend,
  handleResize,
  highlightLinks,
  mouseOverLinks,
  mouseOverNodes,
  resetHighlight,
  updateLegendLayout
} from '../lib/alluvial';

interface AlluvialSmallScreenProps {
  newWidth: number | string;
}

interface Data {
  country: string; // Country name
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
  total: number; // Total energy consumption - TWh
}

export interface CustomNode {
  name: string;
  index: number;
  x0?: number; // Optional, added by Sankey layout
  x1?: number; // Optional, added by Sankey layout
  y0?: number; // Optional, added by Sankey layout
  y1?: number; // Optional, added by Sankey layout
}

export interface CustomLink {
  source: number; // Index of source node
  target: number; // Index of target node
  value: number; // Link value
  width?: number; // Optional, added by Sankey layout
}

const Alluvial: React.FC<AlluvialSmallScreenProps> = ({ newWidth }) => {
  const [data, setData] = useState<Data[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('2023'); // Set default year here

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
      '#ffd92f',
      '#8da0cb',
      '#e78ac3',
      '#a6d854',
      '#d73027',
      '#2d2e33',
      '#543937',
      '#fd6925'
    ]);

  useEffect(() => {
    const fetchData = async () => {
      const csvData = await d3.csv(
        getStaticFile(
          '/datasets/assignment2/eu-27-countries-energy-consumption-by-source.csv'
        ),
        (d) => ({
          country: d.Country,
          year: +d.Year,
          biofuels: +d['Biofuels consumption - TWh'],
          solar: +d['Solar consumption - TWh'],
          wind: +d['Wind consumption - TWh'],
          hydro: +d['Hydro consumption - TWh'],
          nuclear: +d['Nuclear consumption - TWh'],
          gas: +d['Gas consumption - TWh'],
          coal: +d['Coal consumption - TWh'],
          oil: +d['Oil consumption - TWh'],
          other:
            +d['Other renewables (including geothermal and biomass) - TWh'],
          total: +d['Total energy consumption - TWh']
        })
      );
      setData(csvData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = +newWidth || 850;
    const height = 500;

    svg.attr('width', width).attr('height', height);

    const margin = { top: 20, right: 80, bottom: 50, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous SVG contents to prevent overlapping graphs
    svg.selectAll('*').remove();

    const filteredData = data.filter((d) => d.year === +selectedYear);

    // Get top 7 countries by total energy consumption
    const sortedCountries = filteredData
      .sort((a, b) => b.total - a.total)
      .slice(0, 7);

    console.log(sortedCountries);

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

    const energySourceTotals = energySources.map((source) => ({
      source,
      total: d3.sum(
        filteredData.filter((d) =>
          sortedCountries.some((country) => 
          country.country === d.country)
        ),
        (d) => +d[source as keyof Data]
      )
    }));

    // Sort energy sources sorted by total usage in descending order
    energySourceTotals.sort((a, b) => b.total - a.total);

    const sortedEnergySources = energySourceTotals.map(
      (d) => d.source);

    const nodes = [
      ...sortedCountries.map((d, i) => ({ name: d.country, index: i })),
      ...sortedEnergySources.map((source, i) => ({
        name: source,
        index: sortedCountries.length + i
      }))
    ];

    // Update links to reference `index` instead of relying on array position
    const links = sortedCountries
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
      .nodeSort((a, b) => {
        // Sort by index or a custom order you define
        return a.index - b.index;
      })
      .extent([
        [0, 0],
        [innerWidth, innerHeight]
      ]);

    const sankeyData = sankeyGenerator({
      nodes: nodes.map((d) => ({ ...d })),
      links: links.map((d) => ({ ...d }))
    });

    // Adjust the x1 position for country nodes
    sankeyData.nodes.forEach((node) => {
      if (!sortedEnergySources.includes(node.name)) {
        const additionalWidth = 95;
        node.x1 = (node.x1 ?? 0) + additionalWidth;
      }
    });

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('padding', '1rem')
      .style('background', 'hsl(var(--background))')
      .style('color', 'hsl(var(--foreground))')
      .style('border-radius', '0.5rem')
      .style('border-style', 'solid')
      .style('border-width', '1px')
      .style(
        'box-shadow',
        '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
      )
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('display', 'none');

    // Draw links
    const linkPaths = svg
      .append('g')
      .selectAll('path')
      .data(sankeyData.links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('fill', 'none')
      .attr('stroke', (d) => {
        const aux = d.target as SankeyNodeMinimal<CustomNode, CustomLink>;
        if (aux.index == undefined) throw Error('index undefined');
        return colorScale(nodes[aux.index].name) || '#888';
      })
      .attr('stroke-width', (d) => Math.max(1, d.width ?? 0)) // Fallback to 0 if `width` is undefined
      .attr('opacity', 0.85)
      .on('mouseover', function (event, d) {
        mouseOverLinks(event, d, nodes, links, linkPaths, tooltip, colorScale);
      })
      .on('mouseout', function () {
        resetHighlight(linkPaths, tooltip);
      });

    // Drawn nodes
    svg
      .append('g')
      .selectAll('rect')
      .data(sankeyData.nodes)
      .join('rect')
      .on('mouseover', function (event, d) {
        mouseOverNodes(
          event,
          d,
          linkPaths,
          nodes,
          links,
          tooltip,
          colorScale,
          sortedEnergySources
        );
      })
      .on('mouseout', function () {
        resetHighlight(linkPaths, tooltip);
      })
      .attr('x', (d) => d.x0 ?? 0)
      .attr('y', (d) => d.y0 ?? 0)
      .attr('width', (d) => (d.x1 ?? 0) - (d.x0 ?? 0))
      .attr('height', (d) => (d.y1 ?? 0) - (d.y0 ?? 0))
      .attr('fill', (d) => {
        // If the node is an energy source, use the color scale
        if (sortedEnergySources.includes(d.name)) {
          return colorScale(d.name); // Energy type color
        }
        return '#f7f7f5'; // Default color for countries
      })
      .attr('stroke', '#000');

    svg
      .append('g')
      .selectAll('text')
      .data(sankeyData.nodes)
      .join('text')
      .attr('x', (d) => (d.x0 ?? 0) + ((d.x1 ?? 0) - (d.x0 ?? 0)) / 2)
      .attr('y', (d) => ((d.y0 ?? 0) + (d.y1 ?? 0)) / 2)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text((d) => {
        if (!sortedEnergySources.includes(d.name)) {
          return d.name; // Display country name (only for country nodes)
        }
        return '';
      })
      .attr('fill', '#000')
      .on('mouseover', function (event, d) {
        // Highlight effect
        highlightLinks(linkPaths, d);

        const relatedLinks = links
          .filter((link) => link.source === d.index || link.target === d.index)
          .sort((a, b) => b.value - a.value);

        // Tooltip for country nodes
        if (!sortedEnergySources.includes(d.name)) {
          // Generate the legend for energy sources
          const legend = generateLegend(relatedLinks, nodes, colorScale);

          tooltip
            .style('opacity', 1)
            .style('display', 'block')
            .html(
              `
                <div style="font-weight: bold; margin-bottom: 0.5rem;">${d.name}</div>
                ${legend}
              `
            )
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 40}px`);
        }
      })
      .on('mouseout', function () {
        resetHighlight(linkPaths, tooltip);
      });

    /***********************LEGEND*********************/
    const legendMargin = 15;
    const legendX = innerWidth + legendMargin;
    const legendY = innerHeight;

    const legend = svg.append('g');

    const updateLegend = () => {
      const screenWidth = window.innerWidth;
      updateLegendLayout(
        legend,
        sortedEnergySources,
        colorScale,
        screenWidth,
        legendX,
        legendY,
        margin
      );
    };

    const cleanupResize = handleResize(updateLegend);

    // Initial layout adjustment
    updateLegend();

    return () => {
      cleanupResize();
    };
  }, [data, selectedYear, newWidth]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex relative justify-center items-center w-full">
        <div className="overflow-x-auto h-full w-fit">
          <svg ref={svgRef} />
        </div>
      </div>
      <DataSourceInfo>
        Energy Institute - Statistical Review of World Energy (2024) - with
        major processing by Our World in Data;{' '}
        <ShowMoreChartDetailsModalDialog>
          <div className="mt-1 mb-3 mr-4 ml-4">
            <h2 className="mb-4 font-serif text-xl xs:text-2xl sm:text-3xl">
              What you should know about this data
            </h2>
            <ul className="list-disc pl-5">
              <li>
                The energy consumption is based on gross generation and does not
                account for cross-border electricity supply
              </li>
            </ul>
            <h2 className="mt-4 mb-4 font-serif text-xl xs:text-2xl sm:text-3xl">
              What you should know about this indicator
            </h2>
            <ul className="list-disc pl-5">
              <li>
                <b>Primary energy</b> is the energy available as resources -
                such as the fuels burnt in power plants - before it has been
                transformed. This relates to the coal before it has been burned,
                the uranium, or the barrels of oil. Primary energy includes
                energy that the end user needs, in the form of electricity,
                transport and heating, plus inefficiencies and energy that is
                lost when raw resources are transformed into a usable form.
              </li>
            </ul>
            <h2 className="font-serif mt-4 mb-2 text-xl xs:text-2xl sm:text-3xl">
              Methodologies
            </h2>
            <p>
              From the database provided by "Our World In Data" containing data
              on energy consumption divided by energy source for all countries,
              only those relating to the countries of the European Union (EU-27)
              have been extracted. The data are displayed on request depending
              on the selected year.
            </p>
          </div>
        </ShowMoreChartDetailsModalDialog>
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

export default Alluvial;
