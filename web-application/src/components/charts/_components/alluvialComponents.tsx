import { SankeyLink, SankeyNode, SankeyNodeMinimal } from 'd3-sankey';
import { MutableRefObject, ReactElement } from 'react';
import * as d3 from 'd3';
import { CustomLink, CustomNode } from '../alluvial';

export interface Margin {
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

export function defaultTooltipStartingNodes(
  d: CustomNode,
  relatedLinks: CustomLink[],
  nodes: CustomNode[],
  colorScale: (name: string) => string,
  suffix: string,
  scalingFactor: number,
  floatPrecision: number
): JSX.Element {
  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{d.name}</div>

      {relatedLinks.map((link, index) => {
        const sourceName = nodes[link.target].name;
        const color = colorScale(sourceName);
        const value = (link.value / scalingFactor).toFixed(floatPrecision);

        return (
          <div
            key={index}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span
              style={{
                display: 'inline-block',
                minWidth: '15px',
                minHeight: '15px',
                backgroundColor: color,
                borderRadius: '2px'
              }}
            ></span>
            <span>
              {sourceName}: {value}
              {suffix}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function defaultTooltipSecondLayerNodes(
  nodeData: CustomNode,
  relatedLinks: CustomLink[],
  nodes: CustomNode[],
  suffix: string,
  scalingFactor: number,
  floatPrecision: number
): JSX.Element {
  const totalPeople = (
    relatedLinks.reduce((sum, link) => sum + link.value, 0) / scalingFactor
  ).toFixed(floatPrecision);

  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {nodeData.name}
      </div>
      {relatedLinks.map((link, index) => (
        <div key={index}>
          {nodes[link.source].name}:{' '}
          {(link.value / scalingFactor).toFixed(floatPrecision)}
          {suffix}
        </div>
      ))}
      <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
        Total: {totalPeople}
        {suffix}
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
  nodesSecondLayer: string[],
  suffix: string,
  scalingFactor: number,
  floatPrecision: number,
  tooltipStartingNodes?: (
    hoveredNode: CustomNode,
    relatedLinks: CustomLink[],
    nodes: CustomNode[],
    colorScale: (name: string) => string
  ) => JSX.Element,
  tooltipSecondLayerNodes?: (
    hoveredNode: CustomNode,
    relatedLinks: CustomLink[],
    nodes: CustomNode[],
    suffix: string,
    scalingFactor: number,
    floatPrecision: number
  ) => JSX.Element
): JSX.Element | undefined {
  // Highlight effect for related links
  highlightLinks(linkPaths, d);

  const relatedLinks = links
    .filter((link) => link.source === d.index || link.target === d.index)
    .sort((a, b) => b.value - a.value);

  // Create different tooltips based on the fact if the mouse is over the first or seconds layer nodes
  if (tooltip.current) {
    if (!nodesSecondLayer.includes(d.name)) {
      tooltip.current.style.borderColor = 'hsl(var(--border))';
      // Generate the tooltip for the first layer nodes
      if (tooltipStartingNodes != undefined) {
        return tooltipStartingNodes(d, relatedLinks, nodes, colorScale);
      }
      return defaultTooltipStartingNodes(
        d,
        relatedLinks,
        nodes,
        colorScale,
        suffix,
        scalingFactor,
        floatPrecision
      );
    } else {
      // Generate tooltip for the second layer nodes
      tooltip.current.style.borderColor = colorScale(d.name);
      if (tooltipSecondLayerNodes != undefined) {
        return tooltipSecondLayerNodes(
          d,
          relatedLinks,
          nodes,
          suffix,
          scalingFactor,
          floatPrecision
        );
      }
      return defaultTooltipSecondLayerNodes(
        d,
        relatedLinks,
        nodes,
        suffix,
        scalingFactor,
        floatPrecision
      );
    }
  }

  return undefined;
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
  nodes: CustomNode[],
  tooltipMapper:
    | ((
        hoveredLink: SankeyLink<CustomNode, CustomLink>,
        links: SankeyLink<CustomNode, CustomLink>[],
        nodes: CustomNode[],
        linkPaths: d3.Selection<
          d3.BaseType | SVGPathElement,
          SankeyLink<CustomNode, CustomLink>,
          SVGGElement,
          unknown
        >
      ) => JSX.Element)
    | undefined,
  suffix: string,
  scalingFactor: number,
  floatPrecision: number
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

  if (tooltipMapper != undefined) {
    return tooltipMapper(d, relatedSourceLinks, nodes, linkPaths);
  }

  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {targetNode.name}
      </div>
      {relatedSourceLinks.map((link, index) => {
        const sourceNode = nodes[link.source as number]; // Assuming `source` is an index
        return (
          <div key={sourceNode.name + index}>
            {sourceNode.name}:{' '}
            {(link.value / scalingFactor).toFixed(floatPrecision)}
            {suffix}
            <br></br>
          </div>
        );
      })}
      <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
        Total:{' '}
        {(
          relatedSourceLinks.reduce((sum, link) => sum + link.value, 0) /
          scalingFactor
        ).toFixed(floatPrecision)}
        {suffix}
      </div>
    </div>
  );
}
