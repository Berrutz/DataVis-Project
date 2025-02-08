import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';
import { sankey, sankeyLinkHorizontal, SankeyNodeMinimal } from 'd3-sankey';
import Tooltip from '@/components/tooltip';
import {
  generateLegend,
  handleResize,
  highlightLinks,
  mouseOverLinks,
  mouseOverNodes,
  resetHighlight,
  updateLegendLayout,
  wrapTextNode
} from '../alluvial';
import { updateTooltipPosition } from '../lib/utils';

interface InternetUseAlluvialProps {
  newWidth: number | string;
}

interface Data {
  lastInternetUse: string; // The category
  ageGroup: string; // The age group
  country: string; // Country name
  year: number; // year considered
  value: number; // percentage
  population: number; // population in that age group for the relative country
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

const InternetUseAlluvial: React.FC<InternetUseAlluvialProps> = ({
  newWidth
}) => {
  const [csvData, setCsvData] = useState<Data[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('2023'); // Set default year here
  const [selectedCountry, setSelectedCountry] = useState<string>('Italy'); // Set default country here
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode | null>(
    null
  );

  const colorScale = d3
    .scaleOrdinal<string>()
    .domain([
      '16 to 24 years old',
      '25 to 54 years old',
      '55 to 74 years old',
      '75 years old or more'
    ])
    .range(['#ffb3ba', '#ffdfba', '#baffc9', '#bae1ff']);

  useEffect(() => {
    const fetchData = async () => {
      const csvData = await d3.csv(
        getStaticFile(
          '/datasets/internet-access-level/internet-use-divided-by-age-group.csv'
        ),
        (d) => ({
          lastInternetUse: d['Last internet use'],
          ageGroup: d['Age group'],
          country: d.Country,
          year: +d.Year,
          value: +d.Value,
          population: +d.Population
        })
      );
      setCsvData(csvData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!csvData || csvData.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = +newWidth || 850;
    const height = 500;

    svg.attr('width', width).attr('height', height);

    const margin = { top: 20, right: 120, bottom: 50, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous SVG contents to prevent overlapping graphs
    svg.selectAll('*').remove();

    const filteredData = csvData
      .filter((d) => d.year === +selectedYear)
      .filter((d) => d.country === selectedCountry);

    const adjustedData = filteredData.map((d) => ({ ...d })); // Clone to avoid mutating original data

    // Group data by ageGroup
    const groupedByAge = adjustedData.reduce<Record<string, Data[]>>(
      (map, d) => {
        if (!map[d.ageGroup]) {
          map[d.ageGroup] = []; // Initialize array if it doesn't exist
        }
        map[d.ageGroup].push(d);
        return map;
      },
      {}
    ); // Explicitly define initial value as Record<string, Data[]>

    // Adjust values for each age group
    Object.values(groupedByAge).forEach((group) => {
      const totalValue = group.reduce((sum, d) => sum + d.value, 0);
      const missingValue = 100 - totalValue;

      if (missingValue !== 0) {
        group.forEach((d) => {
          d.value += (d.value / totalValue) * missingValue;
        });
      }
    });

    // compute the population of each age group for a specific category
    adjustedData.forEach((d) => {
      d.population = Math.ceil((d.population * d.value) / 100);
    });

    // Initialize the starting nodes made of age groups
    const ageGroupSortedByPopulation = adjustedData
      .filter((d) => d.lastInternetUse === adjustedData[0].lastInternetUse)
      .sort((a, b) => b.population - a.population)
      .map((d) => d.ageGroup);

    // Initialize the 2° nodes column made of the categories
    // Group data by lastInternetUse and calculate total sum per category
    const groupedByInternetUse = adjustedData.reduce<Record<string, number>>(
      (map, d) => {
        if (!map[d.lastInternetUse]) {
          map[d.lastInternetUse] = 0;
        }
        map[d.lastInternetUse] += d.value; // Sum up values
        return map;
      },
      {}
    );

    // Sort lastInternetUse categories based on total summed value (descending)
    const sortedInternetUseCategories = Object.entries(groupedByInternetUse)
      .sort((a, b) => b[1] - a[1]) // Sort by summed value (descending)
      .map(([category]) => category); // Extract just the sorted category names

    const nodes = [
      ...ageGroupSortedByPopulation.map((d, i) => ({ name: d, index: i })),
      ...sortedInternetUseCategories.map((category, i) => ({
        name: category,
        index: ageGroupSortedByPopulation.length + i
      }))
    ];

    // Update links to reference `index` instead of relying on array position
    const links = ageGroupSortedByPopulation
      .flatMap((ageGroup) => {
        return sortedInternetUseCategories.map((category) => ({
          source: +nodes.find((node) => node.name === ageGroup)?.index!, // Match country node index
          target: +nodes.find((node) => node.name === category)?.index!, // Match energy source node index
          value:
            adjustedData.find(
              (d) => d.ageGroup === ageGroup && d.lastInternetUse === category
            )?.population || 0
        }));
      })
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
      if (!sortedInternetUseCategories.includes(node.name)) {
        const additionalWidth = 95;
        node.x1 = (node.x1 ?? 0) + additionalWidth;
      }
    });

    const minNodeHeight = 45; // Set your desired minimum height

    sankeyData.nodes.forEach((node) => {
      if (!sortedInternetUseCategories.includes(node.name)) {
        const currentHeight = (node.y1 ?? 0) - (node.y0 ?? 0);

        if (currentHeight < minNodeHeight) {
          const adjustment = (minNodeHeight - currentHeight) / 2;
          node.y0 = (node.y0 ?? 0) - adjustment;
          node.y1 = (node.y1 ?? 0) + adjustment;
        }
      }
    });

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
        const targetNode = d.target as SankeyNodeMinimal<
          CustomNode,
          CustomLink
        >;
        if (tooltipRef.current) {
          const tooltipCoordinates = updateTooltipPosition(
            event,
            svgRef,
            innerWidth,
            innerHeight,
            tooltipRef
          );
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.style.display = 'block';
          tooltipRef.current.style.left = `${tooltipCoordinates.x + 10}px`;
          tooltipRef.current.style.top = `${tooltipCoordinates.y - 40}px`;
          tooltipRef.current.style.borderColor = colorScale(
            nodes[targetNode.index!].name
          );
          setTooltipContent(mouseOverLinks(d, links, linkPaths, nodes));
        }
      })
      .on('mouseout', function () {
        resetHighlight(linkPaths, tooltipRef);
      });

    // Drawn nodes
    svg
      .append('g')
      .selectAll('rect')
      .data(sankeyData.nodes)
      .join('rect')
      .on('mouseover', function (event, d) {
        if (tooltipRef.current) {
          // Tooltip for country nodes
          setTooltipContent(
            mouseOverNodes(
              d,
              linkPaths,
              nodes,
              links,
              tooltipRef,
              colorScale,
              sortedInternetUseCategories
            )
          );
          const tooltipCoordinates = updateTooltipPosition(
            event,
            svgRef,
            innerWidth,
            innerHeight,
            tooltipRef
          );
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.style.display = 'block';
          tooltipRef.current.style.left = `${tooltipCoordinates.x + 10}px`;
          tooltipRef.current.style.top = `${tooltipCoordinates.y - 40}px`;
        }
      })
      .on('mouseout', function () {
        resetHighlight(linkPaths, tooltipRef);
      })
      .attr('x', (d) => d.x0 ?? 0)
      .attr('y', (d) => d.y0 ?? 0)
      .attr('width', (d) => (d.x1 ?? 0) - (d.x0 ?? 0))
      .attr('height', (d) => (d.y1 ?? 0) - (d.y0 ?? 0))
      .attr('fill', (d) => {
        // If the node is an energy source, use the color scale
        if (sortedInternetUseCategories.includes(d.name)) {
          return colorScale(d.name); // Energy type color
        }
        return '#ffffff'; // Default color for countries
      })
      .attr('stroke', '#000');

    const maxWidth = 100; // Mat line width
    const lineHeight = 15; // Line height for multi-line text

    svg
      .append('g')
      .selectAll('text')
      .data(sankeyData.nodes)
      .join('text')
      .attr('x', (d) => (d.x0 ?? 0) + ((d.x1 ?? 0) - (d.x0 ?? 0)) / 2)
      .attr('y', (d) => ((d.y0 ?? 0) + (d.y1 ?? 0)) / 2)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .each(function (d) {
        if (!sortedInternetUseCategories.includes(d.name)) {
          const textElement = d3.select(this) as d3.Selection<
            SVGTextElement,
            unknown,
            null,
            undefined
          >;
          wrapTextNode(textElement, d.name, maxWidth, lineHeight);
        }
      })
      .attr('fill', '#000')
      .on('mouseover', function (event, d) {
        // Highlight effect
        highlightLinks(linkPaths, d);

        const relatedLinks = links
          .filter((link) => link.source === d.index || link.target === d.index)
          .sort((a, b) => b.value - a.value);

        // Tooltip for country nodes
        if (!sortedInternetUseCategories.includes(d.name)) {
          // Generate the legend for energy sources
          const legend = generateLegend(relatedLinks, nodes, colorScale);
          if (tooltipRef.current) {
            const tooltipCoordinates = updateTooltipPosition(
              event,
              svgRef,
              innerWidth,
              innerHeight,
              tooltipRef
            );
            tooltipRef.current.style.opacity = '1';
            tooltipRef.current.style.display = 'block';
            tooltipRef.current.style.left = `${tooltipCoordinates.x + 10}px`;
            tooltipRef.current.style.top = `${tooltipCoordinates.y - 40}px`;
            setTooltipContent(
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {d.name}
                </div>
                ${legend}
              </div>
            );
          }
        }
      })
      .on('mouseout', function () {
        resetHighlight(linkPaths, tooltipRef);
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
        sortedInternetUseCategories,
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
  }, [csvData, selectedYear, selectedCountry, newWidth]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex relative justify-center items-center w-full">
        <div className="overflow-x-auto h-full w-fit">
          <svg ref={svgRef} />
          <Tooltip ref={tooltipRef}>{tooltipContent}</Tooltip>
        </div>
      </div>
      <div className="mt-3">
        <label htmlFor="year">Select Year: </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="py-1 px-2 ml-2 rounded-md border bg-background"
        >
          {[...new Set(csvData.map((d) => d.year))].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3">
        <label htmlFor="country">Select Country: </label>
        <select
          id="country"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="py-1 px-2 ml-2 rounded-md border bg-background"
        >
          {[...new Set(csvData.map((d) => d.country))].map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InternetUseAlluvial;
