import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import Tooltip from '../tooltip';
import ChartScrollableWrapper from '../chart-scrollable-wrapper';
import NoDataMessage from '../no-data-message';

// Interface that represent a single point x and y
export interface Point {
  x: string;
  y: number;
}

export interface BarChartProps {
  x: string[];
  y: number[];
  width: number;
  height: number;
  colorInterpoaltor: ((t: number) => string) | Iterable<string>;
  yDomainMin?: number;
  yDomainMax?: number;
  yLabelsPrefix?: string;
  yLabelsSuffix?: string;
  tooltipMapper?: (point: Point) => React.ReactNode;
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
 * @param {string[]} BarChartPorps.x - The x array of the values for the barchart
 * @param {number[]} BarChartProps.y - The y array of the values for the barchart
 * @param {number} BarChartProps.width - The width of the bartchart (e.g. 100px or 100% or ... <css-props>)
 * @param {number} BarChartProps.height - The height of the bartchart (e.g. 100px or 100% or ... <css-props>)
 * @param {((t: number) => string) | Iterable<string>} BarChartProps.colorInterpoaltor - A function that returns a color as string given a value of y data or an iterable that represent the values of the colors to use
 * @param {[number, number]} BarChartProps.yDomainMin- The min value for the y domain (e.g. 0 or min(y))
 * @param {[number, number]} BarChartProps.yDomainMax- The max value for the y domain (e.g. 100 or max(y))
 * @param {string} BarChartProps.yLabelsPrefix - The prefix for the y labels
 * @param {string} BarChartProps.yLabelsSuffix - The suffix for the y labelsc
 * @param {(point: Point) => React.ReactNode} BarChartProps.tooltipMapper - A react node used to create a tooltip from a poitn x, y
 * @param {boolean} BarChartProps.vertical - Option to swap x and y axis
 * @param {number} BarChartProps.mt - The margin top
 * @param {number} BarChartProps.mr - The margin right
 * @param {number} BarChartProps.mb - The margin bottom
 * @param {number} BarChartProps.ml - The margin left
 * @throws {Error} - If the lenght of x and y are different
 * @returns The react component
 */
export default function BarChart({
  x,
  y,
  width,
  height,
  colorInterpoaltor,
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
}: BarChartProps) {
  // The ref of the chart created by d3
  const svgRef = useRef<SVGSVGElement | null>(null);

  // The container of the svg
  const containerRef = useRef<HTMLDivElement | null>(null);

  // The ref of the tooltip and its content
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode | null>(
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
    if (x.length <= 0 || y.length <= 0) return;

    // Check that x and y data has the same number of samples
    if (x.length != y.length) {
      throw new Error('X and Y data must have the same lenght');
    }

    // Define the margin (used to make the svg do not clip to the border of the containing div)
    const margin = {
      top: mt || 20,
      right: mr || 0,
      bottom: mb || 40,
      left: ml || 30
    };

    // Define if the chart is vertical (i.e. x and y are swapped), default false
    vertical = vertical || false;

    // Define the numeric domain
    var domain = [
      yDomainMin || Math.min(0, Math.min(...y)),
      yDomainMax || Math.max(...y)
    ];

    // The colorscale of the chart
    const colorScale = d3.scaleSequential(colorInterpoaltor).domain(domain);

    // Define current svg dimension and properties
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define X and Y scales
    const xD3 = vertical
      ? d3
          .scaleBand()
          .domain(x)
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
          .domain(x)
          .range([0, height - margin.top - margin.bottom])
          .padding(0.2);

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

    // Zip the X and Y values together
    const data: Point[] = y.map((value, index) => {
      return {
        x: x[index],
        y: value
      };
    });

    // Create the default tooltip mapper
    tooltipMapper =
      tooltipMapper ||
      ((point: Point) => {
        return (
          <p>
            {point.x}:{' '}
            <span style={{ fontWeight: '600' }}>
              {prefix}
              {point.y} {suffix}
            </span>
          </p>
        );
      });

    // Iterate over the data and create the svg bars and tooltips
    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) =>
        isBandScale(xD3) ? xD3(d.x) || 0 : Math.min(xD3(0)!, xD3(d.y)!)
      )
      .attr('y', (d) => (isBandScale(yD3) ? yD3(d.x) || 0 : yD3(d.y)))
      .attr('width', (d) =>
        isLinearScale(xD3) ? Math.abs(xD3(d.y)! - xD3(0)!) : xD3.bandwidth()
      )
      .attr('height', (d) =>
        isLinearScale(yD3)
          ? height - margin.top - margin.bottom - yD3(d.y)
          : yD3.bandwidth()
      )
      .attr('fill', (d) => colorScale(d.y))
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
  }, [x, y]);

  if (x.length <= 0 || y.length <= 0) {
    return <NoDataMessage height={height}></NoDataMessage>;
  }

  return (
    <div className="relative" ref={containerRef}>
      <ChartScrollableWrapper>
        <svg ref={svgRef} />
      </ChartScrollableWrapper>
      <Tooltip ref={tooltipRef}>{tooltipContent}</Tooltip>
    </div>
  );
}
