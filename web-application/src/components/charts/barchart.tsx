import Tooltip from '@/app/assignments/_components/tooltip';
import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';

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
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
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
 * @param {number} BarChartProps.mt - The margin top
 * @param {number} BarChartProps.mr - The margin right
 * @param {number} BarChartProps.mb - The margin bottom
 * @param {number} BarChartProps.ml - The margin left
 * @throws {Error} - If the length of x or y is less or equals to 0
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
  mt,
  mr,
  mb,
  ml
}: BarChartProps) {
  // The ref of the chart created by d3
  const svgRef = useRef < SVGSVGElement | null > (null);

  // The ref of the tooltip and its content
  const tooltipRef = useRef < HTMLDivElement | null > (null);
  const [tooltipContent, setTooltipContent] = useState < React.ReactNode | null > (
    null
  );

  useEffect(() => {
    // Check that x and y data has some data to display
    if (x.length <= 0 || y.length <= 0) {
      throw new Error(
        `X and Y must contains data (current number of sample: x=${x.length} y=${y.length}, expected x > 0 and y > 0)`
      );
    }

    // Check that x and y data has the same number of samples
    if (x.length != y.length) {
      throw new Error('X and Y data must have the same lenght');
    }

    // Clear the svg in case of re-rendering
    d3.select(svgRef.current).selectAll('*').remove();

    // Define the margin (used to make the svg do not clip to the border of the containing div)
    const margin = {
      top: mt || 20,
      right: mr || 0,
      bottom: mb || 40,
      left: ml || 30
    };

    // Define the Y domain
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
    const xD3 = d3
      .scaleBand()
      .domain(x)
      .range([0, width - margin.left - margin.right])
      .padding(0.2);

    const yD3 = d3
      .scaleLinear()
      .domain(domain)
      .nice()
      .range([height - margin.top - margin.bottom, 0]);

    // Define the X axis labels
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(xD3).tickSize(0))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Define the Y axis lables
    var prefix = yLabelsPrefix || '';
    var suffix = yLabelsSuffix || '';
    svg
      .append('g')
      .call(d3.axisLeft(yD3).tickFormat((y) => `${prefix}${y}${suffix}`))
      .append('text')
      .attr('text-anchor', 'end')
      .attr('fill', 'black')
      .attr('font-weight', 'bold')
      .attr('y', -10)
      .attr('x', -10);

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
            {point.x}: <span>{point.y}</span>
          </p>
        );
      });

    // Iterate over the data and create the svg bars and tooltips
    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => xD3(d.x) || 0)
      .attr('y', (d) => yD3(d.y))
      .attr('width', xD3.bandwidth())
      .attr('height', (d) => height - margin.top - margin.bottom - yD3(d.y))
      .attr('fill', (d) => colorScale(d.y))
      .on('mousemove', (event, d) => {
        if (tooltipRef.current) {
          // Get bounding box of SVG to calculate relative positioning
          const svgRect = svgRef.current?.getBoundingClientRect();
          const horizontalOffset = 25;
          const verticalOffset = 30;

          // Calculate the position of the tooltip relative to the SVG
          const tooltipX =
            event.clientX - (svgRect?.left || 0) + horizontalOffset;
          const tooltipY = event.clientY - (svgRect?.top || 0) - verticalOffset;

          tooltipRef.current.style.left = `${tooltipX}px`;
          tooltipRef.current.style.top = `${tooltipY}px`;
          tooltipRef.current.style.opacity = '1';

          setTooltipContent(tooltipMapper!(d));
        }

        // Highlight the hovered bar
        d3.selectAll('rect').transition().duration(200).style('opacity', 0.4);

        d3.select(event.target as SVGRectElement)
          .transition()
          .duration(200)
          .style('opacity', 1);
      })
      .on('mouseleave', () => {
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '0';
        }

        // Reset opacity for all bars
        d3.selectAll('rect').transition().duration(200).style('opacity', 1);
      });
  }, [x, y]);

  return (
    <div className="overflow-x-auto h-full w-fit">
      <svg ref={svgRef} />
      <Tooltip ref={tooltipRef}>{tooltipContent}</Tooltip>
    </div>
  );
}
