import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  sankey,
  SankeyLink,
  sankeyLinkHorizontal,
  SankeyNodeMinimal
} from 'd3-sankey';
import Tooltip from '@/components/tooltip';
import {
  defaultTooltipStartingNodes,
  highlightLinks,
  mouseOverLinks,
  mouseOverNodes,
  resetHighlight
} from './_components/alluvialComponents';
import { updateLegendLayout } from './utils/alluvial';
import { wrapTextNode } from './utils/alluvial';
import { handleResize } from './utils/alluvial';
import { tooltipPositionOnMouseMove } from './utils/general';
import ChartScrollableWrapper from '../chart-scrollable-wrapper';

/**
 * Represents the data structure for a link between one layer of nodes and the other.
 * For every couple {source, target} a value is associated to it
 * @interface
 */
export interface LinkData {
  source: string;
  target: string;
  value: number;
}

export interface AlluvialData {
  /**
   * A 2D array representing the nodes in the alluvial diagram.
   * @property {number[][]} nodes - Every row represent one layer of nodes, currently only two rows are supported
   */
  nodes: string[][];
  /**
   * An array of links between nodes.
   * @property {LinkData[]} links
   */
  links: LinkData[];
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

export interface AlluvialProps {
  data: AlluvialData;
  width: number;
  height: number;
  colors: string[];
  minNodeHeight?: number;
  nodeWidth?: number;
  tooltipSuffix?: string;
  scalingFactor?: number;
  floatPrecision?: number;
  linksTooltipMapper?: (
    hoveredLink: SankeyLink<CustomNode, CustomLink>,
    relatedLinks: SankeyLink<CustomNode, CustomLink>[],
    nodes: CustomNode[]
  ) => JSX.Element;
  startingNodesTooltipMapper?: (
    hoveredNode: CustomNode,
    relatedLinks: CustomLink[],
    nodes: CustomNode[],
    colorScale: (name: string) => string
  ) => JSX.Element;
  SecondLayerNodesTooltipMapper?: (
    hoveredNode: CustomNode,
    relatedLinks: CustomLink[],
    nodes: CustomNode[]
  ) => JSX.Element;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
}

/**
 * A barchart component
 *
 * @param {AlluvialData} AlluvialProps.data - The data for the alluvial, it is composed by nodes and links
 * @param {number} AlluvialProps.width - The width of the bartchart (e.g. 100px or 100% or ... <css-props>)
 * @param {number} AlluvialProps.height - The height of the bartchart (e.g. 100px or 100% or ... <css-props>)
 * @param {string[]} Alluvial.colors - An array of colors for the target nodes
 * @param {number} Alluvila.minNodeHeight - The minimum height that can assume a node independently from it's value
 * @param {number} Alluvila.nodeWidth - The width of the nodes of the first layer
 * @param {string} AlluvialProps.tooltipSuffix - The suffix for the defualt tooltip (ex. 'k individuals')
 * @param {number} AlluvialProps.scalingFactor - The scaling factor for better data visualization in the tooltip, default '1'
 * @param {number} AlluvialProps.floatPrecision - The number of significant figures in data visualization for the tooltip, default '0'
 * @param {(hoveredLink: SankeyLink<CustomNode, CustomLink>, relatedLinks: SankeyLink<CustomNode, CustomLink>[], nodes: CustomNode[]) => JSX.Element} AlluvialProps.linksTooltipMapper - A JSX.Element used to create a tooltip in the case where the cursor is over a link
 * @param {(hoveredNode: CustomNode, relatedLinks: SankeyLink<CustomNode, CustomLink>[], nodes: CustomNode[], colorScale: (name: string) => string) => JSX.Element} AlluvialProps.startingNodesTooltipMapper - A JSX.Element used to create a tooltip in the case where the cursor is over a node of the first layer
 * @param {(hoveredNode: CustomNode, relatedLinks: SankeyLink<CustomNode, CustomLink>[], nodes: CustomNode[]) => JSX.Element} AlluvialProps.SecondLayerNodesTooltipMapper - A JSX.Element used to create a tooltip in the case where the cursor is over a node of the second layer
 * @param {number} AlluvialProps.mt - The margin top
 * @param {number} AlluvialProps.mr - The margin right
 * @param {number} AlluvialProps.mb - The margin bottom
 * @param {number} AlluvialProps.ml - The margin left
 * @throws {Error} - If the length of colors is different form the lenght of the second layer of nodes
 * @throws {Error} - If there are more than two layers
 * @throws {Error} - If the numbers of links and nodes data doesn't match
 * @returns The react component
 */
export default function Alluvial({
  data,
  width,
  height,
  colors,
  minNodeHeight,
  nodeWidth,
  tooltipSuffix,
  scalingFactor,
  floatPrecision,
  linksTooltipMapper,
  startingNodesTooltipMapper,
  SecondLayerNodesTooltipMapper,
  mt,
  mr,
  mb,
  ml
}: AlluvialProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode | null>(
    null
  );

  // The container of the svg
  const containerRef = useRef<HTMLDivElement | null>(null);

  const nodesFirstLayer = data.nodes[0];
  const nodesSecondLayer = data.nodes[1];
  tooltipSuffix = tooltipSuffix || '';
  scalingFactor = scalingFactor || 1;
  floatPrecision = floatPrecision || 0;

  if (nodesSecondLayer.length > colors.length) {
    throw new Error(
      `The number colors must be the same of nodes. colors: ${colors.length}; nodes: ${nodesSecondLayer.length}`
    );
  }

  const colorScale = d3
    .scaleOrdinal<string>()
    .domain(nodesSecondLayer)
    .range(['#ffb3ba', '#ffdfba', '#baffc9', '#bae1ff']);

  useEffect(() => {
    if (data.nodes.length > 2) {
      throw new Error('Not more than two layers supported');
    }

    const svg = d3.select(svgRef.current);

    svg.attr('width', width).attr('height', height);

    // Define the margin (used to make the svg do not clip to the border of the containing div)
    const margin = {
      top: mt || 20,
      right: mr || 80,
      bottom: mb || 50,
      left: ml || 20
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous SVG contents to prevent overlapping graphs
    d3.select(svgRef.current).selectAll('*').remove();

    let cumulativeIndex = 0;

    const nodes: { name: string; index: number }[] = data.nodes.flatMap(
      (nodesLayer) =>
        nodesLayer.map((d) => ({ name: d, index: cumulativeIndex++ }))
    );

    // Update links to reference `index` instead of relying on array position
    const links = nodesFirstLayer
      .flatMap((sourceNode) => {
        return nodesSecondLayer.map((targetNode) => ({
          source: +nodes.find((node) => node.name === sourceNode)?.index!, // Match country node index
          target: +nodes.find((node) => node.name === targetNode)?.index!, // Match energy source node index
          value:
            data.links.find(
              (d) => d.source === sourceNode && d.target === targetNode
            )?.value || 0
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

    // Adjust nodes width, effect only nodes on the first layer
    nodeWidth = nodeWidth || 95;

    sankeyData.nodes.forEach((node) => {
      if (!nodesSecondLayer.includes(node.name)) {
        node.x1 = (node.x1 ?? 0) + nodeWidth!;
      }
    });

    // Set nodes minimum height, effect only nodes on the first layer
    minNodeHeight = minNodeHeight || 45;

    sankeyData.nodes.forEach((node) => {
      if (!nodesSecondLayer.includes(node.name)) {
        const currentHeight = (node.y1 ?? 0) - (node.y0 ?? 0);

        if (currentHeight < minNodeHeight!) {
          const adjustment = (minNodeHeight! - currentHeight) / 2;
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
          const horizontalOffset = 10;
          const verticalOffset = 40;
          tooltipPositionOnMouseMove(
            tooltipRef,
            containerRef,
            event,
            horizontalOffset,
            verticalOffset
          );
          tooltipRef.current.style.borderColor = colorScale(
            nodes[targetNode.index!].name
          );
          setTooltipContent(
            mouseOverLinks(
              d,
              links,
              linkPaths,
              nodes,
              linksTooltipMapper,
              tooltipSuffix,
              scalingFactor,
              floatPrecision
            )
          );
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
              nodesSecondLayer,
              tooltipSuffix,
              scalingFactor,
              floatPrecision,
              startingNodesTooltipMapper,
              SecondLayerNodesTooltipMapper
            )
          );
          const horizontalOffset = 10;
          const verticalOffset = 40;
          tooltipPositionOnMouseMove(
            tooltipRef,
            containerRef,
            event,
            horizontalOffset,
            verticalOffset
          );
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
        if (nodesSecondLayer.includes(d.name)) {
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
        if (!nodesSecondLayer.includes(d.name)) {
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
        if (!nodesSecondLayer.includes(d.name)) {
          // Generate tooltip the for first layer nodes
          if (tooltipRef.current) {
            const horizontalOffset = 10;
            const verticalOffset = 40;
            tooltipPositionOnMouseMove(
              tooltipRef,
              containerRef,
              event,
              horizontalOffset,
              verticalOffset
            );

            if (startingNodesTooltipMapper != undefined) {
              setTooltipContent(
                startingNodesTooltipMapper(d, relatedLinks, nodes, colorScale)
              );
            } else {
              setTooltipContent(
                defaultTooltipStartingNodes(
                  d,
                  relatedLinks,
                  nodes,
                  colorScale,
                  tooltipSuffix,
                  scalingFactor,
                  floatPrecision
                )
              );
            }
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
        nodesSecondLayer,
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
  }, [data, width, height]);

  return (
    <div className="relative" ref={containerRef}>
      <ChartScrollableWrapper>
        <svg ref={svgRef} />
      </ChartScrollableWrapper>
      <Tooltip ref={tooltipRef}>{tooltipContent}</Tooltip>
    </div>
  );
}
