import { SankeyLink, SankeyNode, SankeyNodeMinimal } from 'd3-sankey';
import { CustomLink, CustomNode } from './charts/internet-use-alluvial';
import { MutableRefObject } from 'react';
import * as d3 from 'd3';

interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function highlightLinks(
  linkPaths: d3.Selection<
    d3.BaseType | SVGPathElement,
    SankeyLink<CustomNode, CustomLink>,
    SVGGElement,
    unknown
  >,
  targetNode: SankeyNodeMinimal<CustomNode, CustomLink>
): void {
  linkPaths
    .transition()
    .duration(200)
    .attr('opacity', (link) => {
      const auxSource = link.source as SankeyNodeMinimal<
        CustomNode,
        CustomLink
      >;
      const auxTarget = link.target as SankeyNodeMinimal<
        CustomNode,
        CustomLink
      >;

      if (auxSource.index == undefined || auxTarget.index == undefined) {
        throw Error('index undefined');
      }

      return auxSource.index === targetNode.index ||
        auxTarget.index === targetNode.index
        ? 1
        : 0.2;
    });
}

export function resetHighlight(
  linkPaths: d3.Selection<
    d3.BaseType | SVGPathElement,
    SankeyLink<CustomNode, CustomLink>,
    SVGGElement,
    unknown
  >,
  tooltip: MutableRefObject<HTMLDivElement | null>
): void {
  linkPaths.transition().duration(200).attr('opacity', 0.85);
  if (tooltip.current) {
    tooltip.current.style.opacity = '0';
    tooltip.current.style.display = 'none';
  }
}

export function generateLegend(
  relatedLinks: CustomLink[],
  nodes: CustomNode[],
  colorScale: (name: string) => string
): JSX.Element {
  return (
    <div>
      {relatedLinks.map((link, index) => {
        const sourceName = nodes[link.target].name;
        const energyColor = colorScale(sourceName);
        const value = (link.value / 1000).toFixed(0);

        return (
          <div
            key={index}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                backgroundColor: energyColor,
                borderRadius: '2px'
              }}
            ></span>
            <span>
              {sourceName}: {value}k individuals
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function EnergyNodeTooltipContent(
  nodeData: CustomNode,
  relatedLinks: CustomLink[],
  nodes: CustomNode[]
): JSX.Element {
  const ageGroupPopulation = relatedLinks.map((link, index) => (
    <div key={index}>
      {nodes[link.source].name}: {(link.value / 1000).toFixed(0)}k individuals
    </div>
  ));

  const totalPeople = (
    relatedLinks.reduce((sum, link) => sum + link.value, 0) / 1000
  ).toFixed(0);

  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {nodeData.name}
      </div>
      {ageGroupPopulation}
      <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
        Total: {totalPeople}k individuals
      </div>
    </div>
  );
}

export function mouseOverLinks(
  d: SankeyLink<CustomNode, CustomLink>,
  links: SankeyLink<CustomNode, CustomLink>[],
  linkPaths: d3.Selection<
    d3.BaseType | SVGPathElement,
    SankeyLink<CustomNode, CustomLink>,
    SVGGElement,
    unknown
  >,
  nodes: CustomNode[]
): JSX.Element {
  const targetNode = d.target as CustomNode;
  if (targetNode.index == undefined) {
    throw new Error('index undefined');
  }

  // Highlight effect
  linkPaths
    .transition()
    .duration(200)
    .attr('opacity', (link) => {
      const linkTarget = link.target as SankeyNodeMinimal<
        CustomNode,
        CustomLink
      >;
      return linkTarget.index === targetNode.index ? 1 : 0.2;
    });

  // Filter and sort related source links
  const relatedSourceLinks = links
    .filter((link) => link.target === targetNode.index)
    .sort((a, b) => b.value - a.value);

  const totalPeople = (
    relatedSourceLinks.reduce((sum, link) => sum + link.value, 0) / 1000
  ).toFixed(0);

  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {targetNode.name}
      </div>
      {relatedSourceLinks.map((link, index) => {
        const sourceNode = nodes[link.source as number]; // Assuming `source` is an index
        return (
          <div key={sourceNode.name + index}>
            {sourceNode.name}: {(link.value / 1000).toFixed(0)}k individuals
            <br></br>
          </div>
        );
      })}
      <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
        Total: {totalPeople}k individuals
      </div>
    </div>
  );
}

export function mouseOverNodes(
  d: SankeyNode<CustomNode, CustomLink>,
  linkPaths: d3.Selection<
    d3.BaseType | SVGPathElement,
    SankeyLink<CustomNode, CustomLink>,
    SVGGElement,
    unknown
  >,
  nodes: CustomNode[],
  links: SankeyLink<CustomNode, CustomLink>[],
  tooltip: MutableRefObject<HTMLDivElement | null>,
  colorScale: d3.ScaleOrdinal<string, string>,
  sortedInternetUseCategories: string[]
): JSX.Element | undefined {
  // Highlight effect for related links
  highlightLinks(linkPaths, d);

  const relatedLinks = links
    .filter((link) => link.source === d.index || link.target === d.index)
    .sort((a, b) => b.value - a.value);

  const tooltipMapperStartingNodes = (
    legend: JSX.Element,
    name: string
  ): JSX.Element => {
    return (
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{name}</div>
        {legend}
      </div>
    );
  };

  // Tooltip for country nodes
  if (tooltip.current) {
    if (!sortedInternetUseCategories.includes(d.name)) {
      // Generate the legend for energy sources
      const legend = generateLegend(relatedLinks, nodes, colorScale);
      tooltip.current.style.borderColor = 'hsl(var(--border))';
      return tooltipMapperStartingNodes(legend, d.name);
    } else {
      // Tooltip for energy resource nodes
      tooltip.current.style.borderColor = colorScale(d.name);
      return EnergyNodeTooltipContent(d, relatedLinks, nodes);
    }
  }

  return undefined;
}

export const handleResize = (updateLegendLayout: () => void) => {
  const handleResizeCallback = () => {
    updateLegendLayout();
  };

  window.addEventListener('resize', handleResizeCallback);

  // Cleanup function
  return () => {
    window.removeEventListener('resize', handleResizeCallback);
  };
};

export const updateLegendLayout = (
  legend: d3.Selection<SVGGElement, unknown, null, undefined>,
  sortedInternetUseCategories: string[],
  colorScale: d3.ScaleOrdinal<string, string, never>,
  screenWidth: number,
  plotWidth: number,
  plotHeight: number,
  plotMargin: Margin
) => {
  const isLarge = screenWidth >= 1024;

  const legendMarginX = 5;
  const maxTextWidth = 90; // Adjust max text width for wrapping
  const lineHeight = 14; // Adjust line height for readability

  if (isLarge) {
    const legendX = plotWidth + legendMarginX;

    legend.attr('transform', `translate(${legendX}, ${plotMargin.top})`);
    legend.selectAll('*').remove(); // Clear existing legend content

    // Add legend rectangles
    const rects = legend
      .selectAll('rect')
      .data(sortedInternetUseCategories)
      .join('rect')
      .attr('x', 0)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d) => colorScale(d));

    // Add legend text and apply wrapping
    const texts = legend
      .selectAll('text')
      .data(sortedInternetUseCategories)
      .join('text')
      .attr('x', 20)
      .attr('font-size', '0.9rem')
      .attr('fill', '#000')
      .call((text) => wrapTextLegend(text, maxTextWidth, lineHeight));

    let currentY = 0; // Track the accumulated Y position

    texts.each(function (_, i) {
      const textElement = d3.select(this);
      const lineCount = +textElement.attr('data-line-count') || 1;
      const totalHeight = lineCount * lineHeight;

      textElement.attr('y', currentY + 12); // Adjust text y position
      rects.filter((_, j) => i === j).attr('y', currentY); // Adjust rect y position

      currentY += totalHeight + 10; // Update Y position for next item
    });
  } else {
    const legendMarginY = 20;
    const legendY = plotHeight + legendMarginY;

    legend.attr('transform', `translate(${plotMargin.left}, ${legendY})`);
    legend.selectAll('*').remove(); // Clear existing legend content
    const itemsPerRow = Math.ceil(sortedInternetUseCategories.length / 2);
    const rowHeight = 25; // Space between rows
    const legendSpacingSmall = 125;

    legend
      .selectAll('rect')
      .data(sortedInternetUseCategories)
      .join('rect')
      .attr('x', (_, i) => (i % itemsPerRow) * (47 + legendSpacingSmall))
      .attr('y', (_, i) => Math.floor(i / itemsPerRow) * rowHeight)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d) => colorScale(d));

    legend
      .selectAll('text')
      .data(sortedInternetUseCategories)
      .join('text')
      .attr('x', (_, i) => (i % itemsPerRow) * (47 + legendSpacingSmall) + 20)
      .attr('y', (_, i) => Math.floor(i / itemsPerRow) * rowHeight + 12)
      .text((d) => d)
      .attr('font-size', '0.9rem')
      .attr('fill', '#000');
  }
};

// Function to wrap text into multiple lines
function wrapTextLegend(
  textSelection: d3.Selection<d3.BaseType, string, SVGGElement, unknown>,
  maxTextWidth: number,
  lineHeight: number
) {
  textSelection.each(function (d) {
    const text = d3.select(this as SVGTextElement);
    const words = d.split(/\s+/); // Split text into words
    let line: string[] = [];
    let tspan = text.append('tspan').attr('x', 20).attr('dy', '0em');
    let lineIndex = 0;

    words.forEach((word) => {
      line.push(word);
      tspan.text(line.join(' '));

      if (tspan.node()!.getComputedTextLength() > maxTextWidth) {
        line.pop();
        tspan.text(line.join(' ')); // Keep the previous valid line

        // Start a new line
        line = [word];
        tspan = text
          .append('tspan')
          .attr('x', 20)
          .attr('dy', `${lineHeight}px`)
          .text(word);
        lineIndex++;
      }
    });

    // Set final text element height to fit multiple lines
    text.attr('data-line-count', lineIndex + 1);
  });
}

/**
 * Function to wrap text into multiple lines based on max width
 */
export function wrapTextNode(
  textElement: d3.Selection<SVGTextElement, unknown, null, undefined>,
  text: string,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(/\s+/);
  let line: string[] = [];
  let dy = 0; // Tracks vertical offset

  let tspan = textElement
    .append('tspan')
    .attr('x', textElement.attr('x'))
    .attr('dy', '0') // First line stays at dy = 0
    .attr('font-weight', '600')
    .text('');

  words.forEach((word) => {
    line.push(word);
    tspan.text(line.join(' ')); // Try adding the word to the current line

    if ((tspan.node()?.getComputedTextLength() ?? 0) > maxWidth) {
      // Remove the last word that caused overflow
      line.pop();
      tspan.text(line.join(' '));

      // Start a new line with the overflow word
      line = [word];
      dy += lineHeight; // Move down for the new line
      tspan = textElement
        .append('tspan')
        .attr('x', textElement.attr('x'))
        .attr('dy', `${dy}px`)
        .attr('font-weight', '600')
        .text(word);
    }
  });
}
