import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import Tooltip from '../tooltip';
import ChartScrollableWrapper from '../chart-scrollable-wrapper';
import NoDataMessage from '../no-data-message';

// Interface that represent the information usefull to construct the staked barchart
/* data example
 [
  { entity: "A", apples: 30, bananas: 20, oranges: 10 },
  { entity: "B", apples: 80, bananas: 50, oranges: 30 },
  { entity: "C", apples: 45, bananas: 35, oranges: 25 }
 ];
 apples, bananas and oranges are the categories
*/
export interface StackedData {
  entity: string; // Fixed field for the X-axis
  [category: string]: number | string; // type is number | string cause of typescript constraints, the type should always be number
}

// Interface that represent the informations of a category
export interface Category {
  name: string;
  color: string;
}

export interface StackedBarChartPoint {
  entity: string; // The enitity name (Ex. country name)
  category: string; // The category (Ex 'other')
  start: number; // The start value of the category
  end: number; // The end value of the category
}

export interface StackedBarChartProps {
  data: StackedData[];
  categories: Category[];
  width: number;
  height: number;
  tooltipMapper?: (name: StackedBarChartPoint) => React.ReactNode;
  unitOfMeasurement?: string;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  percentage?: boolean;
  vertical?: boolean;
}

/**
 * A barchart component
 *
 * @param {StackedData[]} StackedBarChartProps.data - The stacked bar chart data, for each enitity the value for every category
 * @param {Category[]} StackedBarChartProps.categories - The categories array, is used to have the direct link between the categories and their color
 * @param {number} StackedBarChartProps.width - The width of the bartchart (e.g. 100px or 100% or ... <css-props>)
 * @param {number} StackedBarChartProps.height - The height of the bartchart (e.g. 100px or 100% or ... <css-props>)
 * @param {(point: StackedBarChartPoint) => React.ReactNode} StackedBarChartProps.tooltipMapper - A react node used to create a tooltip from a poitn x, y
 * @param {string} FacetedBarChartProps.unitOfMeasurement - The unit of measure used for axis and tooltip
 * @param {number} StackedBarChartProps.mt - The margin top
 * @param {number} StackedBarChartProps.mr - The margin right
 * @param {number} StackedBarChartProps.mb - The margin bottom
 * @param {number} StackedBarChartProps.ml - The margin left
 * @param {boolean} StackedBarChartProps.percentage - Option to create a normalized stacked barchart
 * @param {boolean} StackedBarChartProps.vertical - Option to swap x and y axis
 * @throws {Error} - If every entity has not the same numbers of categories
 * @returns The react component
 */
export default function StackedBarChart({
  data,
  categories,
  width,
  height,
  unitOfMeasurement,
  tooltipMapper,
  mt,
  mr,
  mb,
  ml,
  percentage,
  vertical
}: StackedBarChartProps) {
  const categoriesName = categories.map((d) => d.name);

  data.forEach((element) => {
    const keys = Object.keys(element).filter((key) => key !== 'entity');
    const allInArray = categoriesName.every((category) =>
      keys.includes(category)
    );

    if (!allInArray) {
      throw new Error('Every entity must have the same numbers of categories');
    }
  });

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

    // Check that data and categories data has some data to display
    if (data.length <= 0 || categories.length <= 0) return;

    // Define the margin (used to make the svg do not clip to the border of the containing div)
    const margin = {
      top: mt || 50,
      right: vertical ? mr || 60 : mr || 10,
      bottom: mb || 40,
      left: ml || 100
    };

    // Check options
    percentage = percentage || false;
    vertical = vertical || false;
    unitOfMeasurement =
      unitOfMeasurement === undefined && percentage
        ? '%'
        : unitOfMeasurement === undefined
        ? ''
        : unitOfMeasurement;

    // Compute the normalized data in case of normalized plot
    if (percentage) {
      // Compute total for normalization
      const total = d3.sum(
        Object.values(data[0])
          .slice(1)
          .map((e) => +e) //Cast to numeric
      );

      data = data.map((item) => {
        const { entity, ...categories } = item; // Extract entity separately
        const dividedCategories = Object.fromEntries(
          Object.entries(categories).map(([key, value]) => [
            key,
            typeof value === 'number' ? value / total : value // Perform division only if it's a number
          ])
        );

        return { entity, ...dividedCategories };
      });
    }

    // Define X and Y scales
    const xScale = vertical
      ? d3
          .scaleBand<string>()
          .domain(data.map((e) => e.entity))
          .range([0, width - margin.left - margin.right])
          .padding(0.2)
      : d3
          .scaleLinear<number, number>()
          .domain(
            percentage
              ? [0, 1] // If `percentage` is true, set domain from 0 to 1
              : [
                  0,
                  d3.max(data, (d) =>
                    d3.sum(
                      Object.values(d)
                        .slice(1)
                        .map((e) => +e) // Cast to numeric
                    )
                  )!
                ] // Otherwise, compute the sum-based max
          )
          .range([0, width - margin.left - margin.right]);

    const yScale = vertical
      ? d3
          .scaleLinear<number, number>()
          .domain(
            percentage
              ? [0, 1] // If `percentage` is true, set domain from 0 to 1
              : [
                  0,
                  d3.max(data, (d) =>
                    d3.sum(
                      Object.values(d)
                        .slice(1)
                        .map((e) => +e) // Cast to numeric
                    )
                  )!
                ] // Otherwise, compute the sum-based max
          )
          .range([height - margin.top - margin.bottom, 0])
      : d3
          .scaleBand<string>()
          .domain(data.map((e) => e.entity))
          .range([0, height - margin.top - margin.bottom])
          .padding(0.2);

    // Define the color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain(categories.map((category) => category.name))
      .range(categories.map((category) => category.color));

    // Define current svg dimension and properties
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Stack generator for the "Country" and "Other" categories
    const stackGenerator = d3
      .stack<StackedData>()
      .keys(Object.keys(data[0]).filter((key) => key !== 'entity'));

    const stackedData = stackGenerator(data);

    // Create the default tooltip mapper
    tooltipMapper =
      tooltipMapper ||
      ((point: StackedBarChartPoint) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              {point.entity}
            </div>
            <p>
              {point.category}:{' '}
              <span style={{ fontWeight: '600' }}>
                {(point.end - point.start).toFixed(2)}
              </span>{' '}
              {unitOfMeasurement}
            </p>
          </div>
        );
      });

    // Add bars
    svg
      .selectAll('g.layer')
      .data(stackedData)
      .join('g')
      .attr('fill', (d) => colorScale(d.key) as string)
      .selectAll('rect')
      .data((d) => d)
      .join('rect')
      .attr('opacity', 0.95)
      .attr('y', (d) =>
        isBandScale(yScale) ? yScale(d.data.entity) ?? 0 : yScale(d[1]) ?? 0
      )
      .attr('x', (d) =>
        isBandScale(xScale) ? xScale(d.data.entity) ?? 0 : xScale(d[0]) ?? 0
      )
      .attr('width', (d) =>
        isLinearScale(xScale)
          ? xScale(d[1]) - xScale(d[0])!
          : xScale.bandwidth()
      )
      .attr('height', (d) =>
        isLinearScale(yScale)
          ? yScale(d[0]) - yScale(d[1])!
          : yScale.bandwidth()
      )
      .on('mousemove', function (event, d) {
        const point: StackedBarChartPoint = {
          entity: d.data.entity,
          category: (
            d3.select(event.currentTarget.parentNode).datum() as d3.Series<
              StackedData,
              string
            >
          ).key,
          start: d[0],
          end: d[1]
        };

        if (percentage) {
          point.start *= 100;
          point.end *= 100;
        }

        if (tooltipRef.current) {
          // Get bounding box of SVG to calculate relative positioning
          const containerRect = containerRef.current?.getBoundingClientRect();
          const horizontalOffset = -10;
          const verticalOffset = 65;

          // Calculate the position of the tooltip relative to the SVG
          const tooltipX =
            event.clientX - (containerRect?.left || 0) - horizontalOffset;
          const tooltipY =
            event.clientY - (containerRect?.top || 0) - verticalOffset;

          tooltipRef.current.style.left = `${tooltipX}px`;
          tooltipRef.current.style.top = `${tooltipY}px`;
          tooltipRef.current.style.display = 'block';
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.style.borderColor = `${colorScale(
            point.category
          )}`;
          setTooltipContent(tooltipMapper!(point));
        }

        // Highlight the hovered bar
        d3.select(containerRef.current)
          .selectAll('rect')
          .transition()
          .duration(200)
          .style('opacity', 0.25);

        d3.select(event.target as SVGRectElement)
          .transition()
          .duration(100)
          .style('opacity', 1);
      })
      .on('mouseleave', function () {
        if (tooltipRef.current) {
          tooltipRef.current.style.display = 'none';
          tooltipRef.current.style.opacity = '0';
          tooltipRef.current.style.borderColor = 'hsl(var(--border))';
        }

        // Reset opacity for all bars
        d3.select(containerRef.current)
          .selectAll('rect')
          .transition()
          .duration(200)
          .style('opacity', 0.95);
      });

    // X-Axis
    if (isBandScale(xScale)) {
      svg
        .append('g')
        .attr(
          'transform',
          `translate(0, ${height - margin.top - margin.bottom})`
        )
        .call(d3.axisBottom(xScale)) // No .ticks() for ScaleBand
        .style('font-size', '12px')
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .attr('text-anchor', 'end');
    } else {
      svg
        .append('g')
        .attr(
          'transform',
          `translate(0, ${height - margin.top - margin.bottom})`
        )
        .call(
          d3
            .axisBottom(xScale)
            .ticks(5)
            .tickFormat((x) =>
              percentage
                ? `${+x * 100}${unitOfMeasurement}`
                : `${x}${unitOfMeasurement}`
            )
        )
        .style('font-size', '12px')
        .append('text')
        .attr('x', (width - margin.left - margin.right) / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle');
    }

    // Y-Axis
    if (isBandScale(yScale)) {
      svg.append('g').call(d3.axisLeft(yScale)).style('font-size', '12px');
    } else {
      svg
        .append('g')
        .call(
          d3
            .axisLeft(yScale)
            .ticks(5)
            .tickFormat((y) =>
              percentage
                ? `${+y * 100}${unitOfMeasurement}`
                : `${y}${unitOfMeasurement}`
            )
        )
        .attr('font-size', 'rem0.7');
    }

    const xOffset = 10;

    categories.forEach((category) => {
      svg
        .append('text')
        .attr('text-anchor', vertical ? 'start' : 'middle') // Left-align when vertical
        .style('fill', colorScale(category.name) as string)
        .style('font-weight', 'bold')
        .style('font-size', '1.2rem')
        .style('font-family', 'Arial')
        .text(category.name)
        .attr(
          vertical ? 'x' : 'y',
          vertical
            ? width - margin.left - margin.right - xOffset // Align left when vertical
            : -15 // Move text slightly above the tallest bar
        )
        .attr(
          vertical ? 'y' : 'x',
          vertical
            ? d3.mean(data, (d) => {
                const start = d3.sum(
                  categories
                    .slice(
                      0,
                      categories.findIndex((c) => c.name === category.name)
                    )
                    .map((c) => +d[c.name])
                );
                const end = start + +d[category.name];
                return (yScale as d3.ScaleLinear<number, number>)(
                  (start + end) / 2
                )!; // Midpoint of stacked bar section
              }) ?? 0
            : d3.mean(data, (d) => {
                const start = d3.sum(
                  categories
                    .slice(
                      0,
                      categories.findIndex((c) => c.name === category.name)
                    )
                    .map((c) => +d[c.name])
                );
                const end = start + +d[category.name];
                return (xScale as d3.ScaleLinear<number, number>)(
                  (start + end) / 2
                )!; // Midpoint of stacked bar section
              }) ?? 0
        );
    });
  }, [data, vertical]);

  if (data.length <= 0 || categories.length <= 0)
    return <NoDataMessage height={height}></NoDataMessage>;

  return (
    <div className="relative" ref={containerRef}>
      <ChartScrollableWrapper>
        <svg ref={svgRef} />
      </ChartScrollableWrapper>
      <Tooltip ref={tooltipRef}>{tooltipContent}</Tooltip>
    </div>
  );
}
