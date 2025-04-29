import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import Tooltip from '../tooltip';
import ChartScrollableWrapper from '../chart-scrollable-wrapper';
import NoDataMessage from '../no-data-message';

// Interface that represent a single point x and y
export interface GroupedBarChartPoint {
  value: number;
  name: string;
}

type Cateogry = {
  value: number;
  name: string;
};

// Interface that represent a bars group
export interface BarGroup {
  values: Cateogry[];
  label: string;
}

export interface GroupedBarChartProps {
  data: BarGroup[];
  width: number;
  height: number;
  categoryColors: string[];
  yDomainMin?: number;
  yDomainMax?: number;
  yLabelsPrefix?: string;
  yLabelsSuffix?: string;
  tooltipMapper?: (
    point: GroupedBarChartPoint & { label: string }
  ) => React.ReactNode;
  vertical?: boolean;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  yLabel?: string;
  xLabel?: string;
}

/**
 * A barchart component
 *
 * @param {BarGroup[]} BarChartPorps.data - The data for the grouped bar chart
 * @param {number} BarChartProps.width - The width of the bartchart (e.g. 100px or 100% or ... <css-props>)
 * @param {number} BarChartProps.height - The height of the bartchart (e.g. 100px or 100% or ... <css-props>)
 * @param {string[]} BarChartProps.categoryColors - The colors for each category
 * @param {[number, number]} BarChartProps.yDomainMin- The min value for the y domain (e.g. 0 or min(y))
 * @param {[number, number]} BarChartProps.yDomainMax- The max value for the y domain (e.g. 100 or max(y))
 * @param {string} BarChartProps.yLabelsPrefix - The prefix for the y labels
 * @param {string} BarChartProps.yLabelsSuffix - The suffix for the y labelsc
 * @param {GroupedBarChartPoint & { label: string }} BarChartProps.tooltipMapper - A react node used to create a tooltip
 * @param {boolean} BarChartProps.vertical - Option to swap x and y axis
 * @param {number} BarChartProps.mt - The margin top
 * @param {number} BarChartProps.mr - The margin right
 * @param {number} BarChartProps.mb - The margin bottom
 * @param {number} BarChartProps.ml - The margin left
 * @throws {Error} - If the lenght of x and y are different
 * @returns The react component
 */
export default function GroupedBarChart({
  data,
  width,
  height,
  categoryColors,
  yDomainMin,
  yDomainMax,
  yLabelsPrefix,
  yLabelsSuffix,
  tooltipMapper,
  vertical,
  mt,
  mr,
  mb,
  ml,
  yLabel,
  xLabel
}: GroupedBarChartProps) {
  // The ref of the chart created by d3
  const svgRef = useRef<SVGSVGElement | null>(null);

  // The container of the svg
  const containerRef = useRef<HTMLDivElement | null>(null);

  // The ref of the tooltip and its content
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode | null>(
    null
  );

  // The ref of the legend and it's content
  let legendRef = useRef<HTMLDivElement | null>(null);
  const [legendContent, setLegendContent] = useState<React.ReactNode | null>(
    null
  );

  // Type guards
  // If scale has the bandwidth() function it is of type ScaleBand
  const isBandScale = (scale: any): scale is d3.ScaleBand<string> =>
    'bandwidth' in scale;

  // If scale has the invert() function it is of type ScaleLinear
  const isLinearScale = (scale: any): scale is d3.ScaleLinear<number, number> =>
    'invert' in scale;

  useEffect(() => {
    // Clear the svg in case of re-rendering
    d3.select(svgRef.current).selectAll('*').remove();

    // Check that x and y data has some data to display
    if (data.length <= 0) return;

    // Check that there is at least a value for each label
    data.forEach((d) => {
      if (d.values.length <= 0) {
        throw new Error(
          `Every label must have at least one value, no value found for ${d.label}`
        );
      }
    });

    const uniqueCategory: string[] = Array.from(
      new Set(
        data.flatMap((group) => group.values.map((category) => category.name))
      )
    );

    if (uniqueCategory.length < categoryColors.length) {
      throw new Error(
        'The number of colors should match the numbers of categories'
      );
    }

    // The colorscale of the chart
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(uniqueCategory)
      .range(categoryColors);

    // Define the margin (used to make the svg do not clip to the border of the containing div)
    const margin = {
      top: mt || 20,
      right: mr || 0,
      bottom: mb || 40,
      left: ml || 30
    };

    // Define if the chart is vertical (i.e. x and y are swapped), default false
    vertical = vertical || false;

    // Flat the data array to get all values
    const allValues = data
      .flatMap((d) => d.values)
      .flat()
      .map((d) => {
        return d.value;
      });

    // Define the numeric domain
    var domain = [
      yDomainMin || Math.min(0, Math.min(...allValues)),
      yDomainMax || Math.max(...allValues)
    ];

    // Define current svg dimension and properties
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Retrive all labels
    const groupLabels = data.map((d) => d.label);
    const categoryNames = Array.from(
      new Set(data.flatMap((d) => d.values).map((v) => v.name))
    );

    // Define X and Y scales
    const xD3 = vertical
      ? d3
          .scaleBand()
          .domain(groupLabels)
          .range([0, width - margin.left - margin.right])
          .padding(0.2)
      : d3
          .scaleLinear()
          .domain(domain)
          .nice()
          .range([0, width - margin.left - margin.right]);

    const yD3 = vertical
      ? d3
          .scaleLinear()
          .domain(domain)
          .nice()
          .range([height - margin.top - margin.bottom, 0])
      : d3
          .scaleBand()
          .domain(groupLabels)
          .range([0, height - margin.top - margin.bottom])
          .padding(0.2);

    // Define inner scale based on which scale is of type ScaleBand
    var innerScale: d3.ScaleBand<string>;

    if (isBandScale(xD3)) {
      innerScale = d3
        .scaleBand()
        .domain(categoryNames)
        .range([0, xD3.bandwidth()])
        .padding(0.05);
    } else {
      innerScale = d3
        .scaleBand()
        .domain(categoryNames)
        .range([0, isBandScale(yD3) ? yD3.bandwidth() : 0])
        .padding(0.05);
    }

    // Define the X and Y axis labels
    var prefix = yLabelsPrefix || '';
    var suffix = yLabelsSuffix || '';

    if (isBandScale(xD3)) {
      svg
        .append('g')
        .attr(
          'transform',
          `translate(0,${height - margin.top - margin.bottom})`
        )
        .call(d3.axisBottom(xD3).tickSize(0))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');
    } else {
      svg
        .append('g')
        .attr(
          'transform',
          `translate(0,${height - margin.top - margin.bottom})`
        )
        .call(d3.axisBottom(xD3).tickFormat((x) => `${prefix}${x}${suffix}`))
        .append('text')
        .attr('text-anchor', 'end')
        .attr('fill', 'black')
        .attr('font-weight', 'bold')
        .attr('y', -10)
        .attr('x', -10);
    }

    if (isBandScale(yD3)) {
      svg
        .append('g')
        .call(d3.axisLeft(yD3).tickSize(0))
        .selectAll('text')
        .style('text-anchor', 'end');
    } else {
      svg
        .append('g')
        .call(d3.axisLeft(yD3).tickFormat((y) => `${prefix}${y}${suffix}`))
        .append('text')
        .attr('text-anchor', 'end')
        .attr('fill', 'black')
        .attr('font-weight', 'bold')
        .attr('y', -10)
        .attr('x', -10);
    }

    // Set Y-Label
    var ylabel = yLabel || '';
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 10) // Posizione rispetto all'asse
      .attr('x', -height / 2) // Centrare rispetto al grafico
      .attr('dy', '1em') // Spostamento fine per l'allineamento
      .style('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .text(ylabel);

    // Set X-Label
    var xlabel = xLabel || '';
    svg
      .append('text')
      .attr('x', (width - margin.left - margin.right) / 2) // Centrare rispetto all'asse X
      .attr('y', height - margin.top - margin.bottom + 35) // Posizionare sotto l'asse X
      .attr('dy', '1em') // Spostamento fine per l'allineamento
      .style('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .text(xlabel);

    // Create the default tooltip mapper
    tooltipMapper =
      tooltipMapper ||
      ((point: GroupedBarChartPoint & { label: string }) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '250px',
              whiteSpace: 'normal'
            }}
          >
            <span>
              <a style={{ fontWeight: 'bolder' }}>{point.label}</a> -{' '}
              {point.name}:
            </span>
            <span>
              {point.value}
              {yLabelsSuffix || ''}
            </span>
          </div>
        );
      });

    // Iterate over the data and create the svg bars and tooltips
    const group = svg
      .selectAll('.group')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', (d) => {
        if (isBandScale(xD3)) {
          return `translate(${xD3(d.label)}, 0)`;
        } else {
          const bandYD3 = yD3 as d3.ScaleBand<string>;
          return `translate(0, ${bandYD3(d.label)})`;
        }
      });

    group
      .selectAll('rect')
      .data((d) => d.values.map((v) => ({ ...v, label: d.label })))
      .enter()
      .append('rect')
      .attr('x', (d) =>
        isLinearScale(xD3) ? xD3(Math.min(0, d.value)) : innerScale(d.name)!
      )
      .attr('y', (d) =>
        isLinearScale(yD3) ? yD3(Math.max(0, d.value)) : innerScale(d.name)!
      )
      .attr('width', (d) =>
        isBandScale(xD3)
          ? innerScale.bandwidth()
          : Math.abs(xD3(d.value)! - xD3(0)!)
      )
      .attr('height', (d) =>
        isLinearScale(yD3)
          ? Math.abs(yD3(d.value)! - yD3(0)!)
          : innerScale.bandwidth()
      )
      .attr('fill', (d) => colorScale(d.name))
      .on('mousemove', (event, d) => {
        if (tooltipRef.current) {
          // Get bounding box of SVG to calculate relative positioning
          const containerRect = containerRef.current?.getBoundingClientRect();
          const horizontalOffset = 25;
          const verticalOffset = 60;

          // Calculate the position of the tooltip relative to the SVG
          const tooltipX =
            event.clientX - (containerRect?.left || 0) + horizontalOffset;
          const tooltipY =
            event.clientY - (containerRect?.top || 0) - verticalOffset;

          tooltipRef.current.style.left = `${tooltipX}px`;
          tooltipRef.current.style.top = `${tooltipY}px`;
          tooltipRef.current.style.display = 'block';
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.style.borderColor = colorScale(d.name);

          setTooltipContent(tooltipMapper!(d));
        }

        // Highlight the hovered bar
        d3.select(containerRef.current)
          .selectAll('rect')
          .transition()
          .duration(200)
          .style('opacity', 0.4);

        d3.select(event.target as SVGRectElement)
          .transition()
          .duration(200)
          .style('opacity', 1);
      })
      .on('mouseleave', () => {
        if (tooltipRef.current) {
          tooltipRef.current.style.display = 'none';
          tooltipRef.current.style.opacity = '0';
        }

        // Reset opacity for all bars
        d3.select(containerRef.current)
          .selectAll('rect')
          .transition()
          .duration(200)
          .style('opacity', 1);
      });

    setLegendContent(
      <div className="flex flex-wrap gap-4 items-center">
        {categoryNames.map((name) => (
          <div key={name} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: colorScale(name) }}
            />
            <span className="text-base">{name}</span>
          </div>
        ))}
      </div>
    );
  }, [data]);

  if (data.length <= 0) {
    return <NoDataMessage height={height}></NoDataMessage>;
  }

  return (
    <div className="relative" ref={containerRef}>
      <ChartScrollableWrapper>
        <svg ref={svgRef} />
        <div ref={legendRef}>{legendContent}</div>
      </ChartScrollableWrapper>
      <Tooltip ref={tooltipRef}>{tooltipContent}</Tooltip>
    </div>
  );
}
