import { SankeyLink, SankeyNode, SankeyNodeMinimal } from 'd3-sankey';
import { CustomLink, CustomNode } from './charts/internet-use-alluvial';
import { MutableRefObject } from 'react';

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
        const value = link.value.toFixed(2);

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
              {sourceName}: {value} TWh
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
  nodes: CustomNode[],
  colorScale: (name: string) => string
): JSX.Element {
  const countriesPowerUsage = relatedLinks.map((link, index) => (
    <div key={index}>
      {nodes[link.source].name}: {link.value.toFixed(2)}
    </div>
  ));

  const totalPeople = relatedLinks
    .reduce((sum, link) => sum + link.value, 0)
    .toFixed(2);

  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {nodeData.name}
      </div>
      {countriesPowerUsage}
      <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
        Total: {totalPeople}
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
  >
): SankeyLink<CustomNode, CustomLink>[] {
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

  return relatedSourceLinks;
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
      return EnergyNodeTooltipContent(d, relatedLinks, nodes, colorScale);
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
