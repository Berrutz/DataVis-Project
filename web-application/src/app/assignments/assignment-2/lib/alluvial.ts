import { SankeyLink, SankeyNode, SankeyNodeMinimal } from 'd3-sankey';
import { CustomLink, CustomNode } from '../_components/Alluvial';

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
        : 0.1;
    });
}

export function resetHighlight(
  linkPaths: d3.Selection<
    d3.BaseType | SVGPathElement,
    SankeyLink<CustomNode, CustomLink>,
    SVGGElement,
    unknown
  >,
  tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>
): void {
  linkPaths.transition().duration(200).attr('opacity', 0.85);
  tooltip.style('opacity', 0).style('display', 'none');
}

export function generateLegend(
  relatedLinks: CustomLink[],
  nodes: CustomNode[],
  colorScale: (name: string) => string
): string {
  return relatedLinks
    .map((link) => {
      const sourceName = nodes[link.target].name; // Get the energy source name
      const energyColor = colorScale(sourceName); // Get the corresponding color
      const value = link.value.toFixed(2); // Format the value

      // Generate HTML for the legend entry
      return `
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="
              display: inline-block; 
              width: 12px; 
              height: 12px; 
              background-color: ${energyColor}; 
              border-radius: 2px;
            "></span>
            <span>${sourceName}: ${value} TWh</span>
          </div>
        `;
    })
    .join(''); // Combine all legend entries
}

export function createEnergyNodeTooltip(
  tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>,
  nodeData: CustomNode,
  relatedLinks: CustomLink[],
  nodes: CustomNode[],
  colorScale: (name: string) => string
): void {
  const countriesPowerUsage = relatedLinks
    .map((link) => `${nodes[link.source].name}: ${link.value.toFixed(2)} TWh`)
    .join('<br>');

  const totalPowerUsage = relatedLinks
    .reduce((sum, link) => sum + link.value, 0)
    .toFixed(2);

  tooltip
    .style('opacity', 1)
    .style('display', 'block')
    .html(
      `
        <div style="font-weight: bold; margin-bottom: 0.5rem;">${nodeData.name}</div>
        ${countriesPowerUsage}
        <div style="margin-top: 0.5rem;">
          <a style="font-weight: bold;">Total:</a> ${totalPowerUsage} TWh
        </div>
      `
    )
    .style('border-color', colorScale(nodeData.name));
}

export function mouseOverLinks(
  event: MouseEvent,
  d: SankeyLink<CustomNode, CustomLink>,
  nodes: CustomNode[],
  links: SankeyLink<CustomNode, CustomLink>[],
  linkPaths: d3.Selection<
    d3.BaseType | SVGPathElement,
    SankeyLink<CustomNode, CustomLink>,
    SVGGElement,
    unknown
  >,
  tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>,
  colorScale: d3.ScaleOrdinal<string, string>
) {
  const targetNode = d.target as SankeyNodeMinimal<CustomNode, CustomLink>;
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
      return linkTarget.index === targetNode.index ? 1 : 0.1;
    });

  // Filter and sort related source links
  const relatedSourceLinks = links
    .filter((link) => link.target === targetNode.index)
    .sort((a, b) => b.value - a.value);

  // Generate tooltip content
  const sourceInfo = relatedSourceLinks
    .map((link) => {
      const sourceNode = nodes[link.source as number]; // Assuming `source` is an index
      return `${sourceNode.name}: ${link.value.toFixed(2)} TWh`;
    })
    .join('<br>');

  // Display tooltip
  tooltip
    .style('opacity', 1)
    .style('display', 'block')
    .html(
      `
        <div style="font-weight: bold; margin-bottom: 0.5rem;">${
          nodes[targetNode.index].name
        }</div>
        ${sourceInfo}
      `
    )
    .style('border-color', colorScale(nodes[targetNode.index].name))
    .style('left', `${event.pageX + 10}px`)
    .style('top', `${event.pageY - 40}px`);
}

export function mouseOverNodes(
  event: MouseEvent,
  d: SankeyNode<CustomNode, CustomLink>,
  linkPaths: d3.Selection<
    d3.BaseType | SVGPathElement,
    SankeyLink<CustomNode, CustomLink>,
    SVGGElement,
    unknown
  >,
  nodes: CustomNode[],
  links: SankeyLink<CustomNode, CustomLink>[],
  tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>,
  colorScale: d3.ScaleOrdinal<string, string>,
  sortedEnergySources: string[]
): void {
  // Highlight effect for related links
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
      .style('border-color', 'hsl(var(--border))');
    // Position tooltip near the mouse cursor
    tooltip
      .style('left', `${event.pageX + 10}px`)
      .style('top', `${event.pageY - 40}px`);
  } else {
    // Tooltip for energy resource nodes
    createEnergyNodeTooltip(tooltip, d, relatedLinks, nodes, colorScale);

    // Position tooltip on the left side of the mouse cursor
    tooltip
      .style('left', `${event.pageX - 175}px`)
      .style('top', `${event.pageY - 40}px`);
  }
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
  sortedEnergySources: string[],
  colorScale: d3.ScaleOrdinal<string, string, never>,
  screenWidth: number,
  plotWidth: number,
  plotHeight: number,
  plotMargin: Margin
) => {
  const isLarge = screenWidth >= 1024;
  const isMedium = screenWidth >= 768;
  const legendSpacing = 20;
  const legendMargin = 15;

  if (isLarge) {
    const legendX = plotWidth + legendMargin;

    legend.attr('transform', `translate(${legendX}, ${plotMargin.top})`);
    legend.selectAll('*').remove(); // Clear existing legend content

    legend
      .selectAll('rect')
      .data(sortedEnergySources)
      .join('rect')
      .attr('x', 0)
      .attr('y', (_, i) => i * legendSpacing)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d) => colorScale(d));

    legend
      .selectAll('text')
      .data(sortedEnergySources)
      .join('text')
      .attr('x', 20)
      .attr('y', (_, i) => i * legendSpacing + 12)
      .text((d) => d)
      .attr('font-size', '12px')
      .attr('fill', '#000');
  } else {
    const legendY = plotHeight + legendMargin;

    legend.attr('transform', `translate(${plotMargin.left}, ${legendY})`);
    legend.selectAll('*').remove(); // Clear existing legend content

    if (isMedium) {
      legend
        .selectAll('rect')
        .data(sortedEnergySources)
        .join('rect')
        .attr('x', (_, i) => i * (47 + legendSpacing))
        .attr('y', 0)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', (d) => colorScale(d));

      legend
        .selectAll('text')
        .data(sortedEnergySources)
        .join('text')
        .attr('x', (_, i) => i * (47 + legendSpacing) + 20)
        .attr('y', 12)
        .text((d) => d)
        .attr('font-size', '12px')
        .attr('fill', '#000');
    } else {
      const itemsPerRow = Math.ceil(sortedEnergySources.length / 2);
      const rowHeight = 25; // Space between rows

      legend
        .selectAll('rect')
        .data(sortedEnergySources)
        .join('rect')
        .attr('x', (_, i) => (i % itemsPerRow) * (47 + legendSpacing))
        .attr('y', (_, i) => Math.floor(i / itemsPerRow) * rowHeight)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', (d) => colorScale(d));

      legend
        .selectAll('text')
        .data(sortedEnergySources)
        .join('text')
        .attr('x', (_, i) => (i % itemsPerRow) * (47 + legendSpacing) + 20)
        .attr('y', (_, i) => Math.floor(i / itemsPerRow) * rowHeight + 12)
        .text((d) => d)
        .attr('font-size', '12px')
        .attr('fill', '#000');
    }
  }
};
