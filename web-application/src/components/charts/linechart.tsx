import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Tooltip from '../tooltip';
import ChartScrollableWrapper from '../chart-scrollable-wrapper';
import NoDataMessage from '../no-data-message';

export interface DataPoint {
  x: string;
  y: number;
  color: string;
  tag: string;
}

export interface Line {
  x: string[];
  y: number[];
  color: string; // The color of the line
  tag: string; // The 'name' of the line, used for the tooltip
  scatter: boolean; // Option for draw the line as points
}

export interface LineChartProps {
  data: Line[];
  width?: number;
  height?: number;
  yUpperBound?: number | undefined;
  yLowerBound?: number | undefined;
  xFullTags?: string[];
  unitOfMeasurement?: string;
  tooltipMapper?: (point: DataPoint[], unitM: string) => React.ReactNode;
  xLabelsFontSize?: string;
  yLabelsFontSize?: string;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  xLabel?: string;
  yLabel?: string;
}

/**
 * A line chart component
 *
 * @param LineChartProps.data - A line represented by his x, y data and the color
 * @param LineChartProps.width - The width of the bartchart (e.g. 100px or 100% or ... <css-props>)
 * @param LineChartProps.height - The height of the bartchart (e.g. 100px or 100% or ... <css-props>)
 * @param LineChartProps.yUpperBound - Upper limit for y values, default is the maximum of the y values
 * @param LineChartProps.yLowerBound - Lower limit for y values, default is the minimum of the y values
 * @param LineChartProps.xFullTags - Long names for x values, used in the tooltip
 * @param LineChartProps.unitOfMeasurement - Unit of measurement
 * @param {(point: DataPoint[], unitM: string) => React.ReactNode} LineChartProps.tooltipMapper - A functions that map from a pair x, y values from input the correspoding tooltip
 * @param LineChartProps.xLabelsFontSize - Font size for the labels of the x values
 * @param LineChartProps.yLabelsFontSize - Font size for the labels of the y values
 * @param {number} LineChartProps.mt - The margin top
 * @param {number} LineChartProps.mr - The margin right
 * @param {number} LineChartProps.mb - The margin bottom
 * @param {number} LineChartProps.ml - The margin left
 * @throws {Error} - If the lenght of x and y are different
 * @throws {Error} - If the lenght of xFullTags and y are different
 * @returns
 */
const LineChart: React.FC<LineChartProps> = ({
  width = 820,
  height = 550,
  data,
  yUpperBound,
  yLowerBound,
  xFullTags: xFullTags,
  unitOfMeasurement,
  tooltipMapper,
  xLabelsFontSize,
  yLabelsFontSize,
  mt,
  mr,
  mb,
  ml,
  xLabel,
  yLabel
}) => {
  // The ref of the chart created by d3
  const svgRef = useRef<SVGSVGElement | null>(null);

  // The container of the svg
  const containerRef = useRef<HTMLDivElement | null>(null);

  // The ref of the tooltip
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [tooltipContent, setTooltipContent] = useState<React.ReactNode | null>(
    null
  );

  useEffect(() => {
    // Clear the svg in case of re-rendering
    d3.select(svgRef.current).selectAll('*').remove();

    // Check if there are some data to display
    if (data.length <= 0) return;

    data.forEach((line) => {
      // Check that x and y data has the same number of samples
      if (line.x.length != line.y.length) {
        throw new Error('X and Y data must have the same lenght');
      }
    });
    if (xFullTags != undefined) {
      data.forEach((line) => {
        if (line.x.length != xFullTags.length) {
          throw new Error(
            `X data and relative names must have the same lenght: x=${line.x.length} xFullTags=${xFullTags.length}`
          );
        }
      });
    }

    const svg = d3.select(svgRef.current);

    svg.attr('width', width).attr('height', height);

    // Define the margin (used to make the svg do not clip to the border of the containing div)
    const margin = {
      top: mt || 20,
      right: mr || 0,
      bottom: mb || 40,
      left: ml || 30
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create x Scale
    // Find the line with the major numbers of element for the x domain
    var maxYearsNumber = 0;
    var index = 0;
    data.forEach((line, currIndex) => {
      if (line.x.length > maxYearsNumber) {
        maxYearsNumber = line.x.length;
        index = currIndex;
      }
    });
    const xScale = d3
      .scaleBand()
      .domain(data[index].x.map((d) => d.toString()))
      .range([0, innerWidth])
      .padding(0.1);

    // Create y Scale
    // Get min value among y
    let min = Number.MAX_SAFE_INTEGER;
    data.forEach((line) => {
      const current = d3.min(line.y);
      if (current === undefined) return;

      if (current < min) min = current;
    });
    const yLowerDomain = min;

    // Get max value among y
    let max = Number.MIN_SAFE_INTEGER;
    data.forEach((line) => {
      const current = d3.max(line.y);
      if (current === undefined) return;

      if (current > max) max = current;
    });
    const yUpperDomain = max;

    const yScale = d3
      .scaleLinear()
      .domain([yLowerBound || yLowerDomain, yUpperBound || yUpperDomain])
      .range([innerHeight, 0]);

    type Data = { x: string; y: number };

    // Create lines
    const line = d3
      .line<Data>()
      .x((d) => (xScale(d.x.toString()) || 0) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.y));

    const chartGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // For each line
    data.forEach((d, lineIndex) => {
      const lineData: Data[] = d.x.map((xValue, i) => ({
        x: xValue,
        y: d.y[i]
      }));

      // Create a group for each line to ensure independent selections
      const lineGroup = chartGroup
        .append('g')
        .attr('class', `line-group-${lineIndex}`);

      // Add points to the chart instead of line
      if (d.scatter) {
        lineGroup
          .selectAll(`.avg-circle-${lineIndex}`)
          .data(lineData)
          .enter()
          .append('circle')
          .attr('class', `avg-circle-${lineIndex}`)
          .attr(
            'cx',
            (d) => (xScale(d.x.toString()) || 0) + xScale.bandwidth() / 2
          )
          .attr('cy', (d) => yScale(d.y))
          .attr('r', 5)
          .attr('fill', d.color);
      } else {
        // Add a line to the chart
        lineGroup
          .append('path')
          .data([lineData])
          .attr('d', line)
          .attr('fill', 'none')
          .attr('stroke', d.color)
          .attr('stroke-width', 2);
      }

      // Append small circles for each line separately
      lineGroup
        .selectAll(`.min-circle-${lineIndex}`)
        .data(lineData)
        .enter()
        .append('circle')
        .attr('class', `min-circle-${lineIndex}`)
        .attr(
          'cx',
          (d) => (xScale(d.x.toString()) || 0) + xScale.bandwidth() / 2
        )
        .attr('cy', (d) => yScale(d.y))
        .attr('r', 3)
        .attr('fill', d.color);
    });

    // Create vertical line and points
    const verticalLine = chartGroup
      .append('line')
      .attr('stroke', '#c2c2c2')
      .attr('stroke-width', 1)
      .style('visibility', 'hidden');

    const circles = chartGroup
      .selectAll('.hover-circle')
      .data(Array.from({ length: data.length }, (_, i) => i))
      .enter()
      .append('circle')
      .attr('r', 5)
      .style('visibility', 'hidden');

    // Create the default tooltip mapper
    tooltipMapper =
      tooltipMapper ||
      ((points: DataPoint[], unitM: string) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              {points[0].x}
            </div>

            {points.map((point, index) => (
              <div
                key={index}
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <div
                  style={{
                    minWidth: '15px',
                    minHeight: '15px',
                    backgroundColor: point.color
                  }}
                ></div>
                <span>
                  {point.tag}:{' '}
                  <a style={{ fontWeight: '600' }}>
                    {point.y.toFixed(2)} {unitM}
                  </a>
                </span>
              </div>
            ))}
          </div>
        );
      });

    // Mouse event listener
    svg
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'none')
      .style('pointer-events', 'all')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .on('mousemove', (event) => {
        // Get closest data points
        const [mouseX] = d3.pointer(event);
        const hoveredPoint = xScale.domain().find((d) => {
          const bandX = xScale(d)! + xScale.bandwidth() / 2;
          return Math.abs(mouseX - bandX) < xScale.bandwidth() / 2;
        });

        if (!hoveredPoint) return;

        // Set x value to display to a custom tag if any. defualt is "hoveredPoint"
        let xName: string = '';
        if (xFullTags != undefined) {
          const index = parseInt(hoveredPoint, 10) - 1; // Adjust 1-based index
          xName = xFullTags[index] || ''; // Fallback for safety
        } else {
          xName = hoveredPoint;
        }

        // Construct the DataPoints used for the tooltip
        const points: DataPoint[] = data.map((line) => {
          const index = line.x.indexOf(hoveredPoint); // Find the index of targetX in x array
          return {
            x: xName,
            y: index !== -1 ? line.y[index] : NaN, // Get corresponding y value or NaN if not found
            color: line.color,
            tag: line.tag
          };
        });

        // Update vertical line
        verticalLine
          .attr('x1', xScale(hoveredPoint)! + xScale.bandwidth() / 2)
          .attr('x2', xScale(hoveredPoint)! + xScale.bandwidth() / 2)
          .attr('y1', 0)
          .attr('y2', innerHeight)
          .style('visibility', 'visible');

        // Update circles
        circles
          .data(points.filter((d) => !Number.isNaN(d.y)))
          .attr('cx', xScale(hoveredPoint)! + xScale.bandwidth() / 2)
          .attr('cy', (d) => (d ? yScale(d.y) : 0))
          .attr('fill', (d) => d.color)
          .style('visibility', (d) => (d ? 'visible' : 'hidden'));

        // Update tooltip
        if (tooltipRef.current) {
          const horizontalOffset = 10;
          const verticalOffset = 75;
          const containerRect = containerRef.current?.getBoundingClientRect();
          const tooltipWidth = tooltipRef.current.offsetWidth || 0;

          var tooltipX =
            event.clientX - (containerRect?.left || 0) + horizontalOffset;
          var tooltipY =
            event.clientY - (containerRect?.top || 0) - verticalOffset;

          // Check if the tooltip would overflow the graph's width and height
          if (tooltipX + tooltipWidth > innerWidth) {
            tooltipX =
              event.clientX -
              (containerRect?.left || 0) -
              tooltipWidth -
              horizontalOffset;
          }

          tooltipRef.current.style.left = `${tooltipX}px`;
          tooltipRef.current.style.top = `${tooltipY}px`;
          tooltipRef.current.style.display = 'block';
          tooltipRef.current.style.opacity = '1';
          setTooltipContent(tooltipMapper!(points, unitOfMeasurement || ''));
        }
      })
      .on('mouseout', () => {
        verticalLine.style('visibility', 'hidden');
        circles.style('visibility', 'hidden');
        if (tooltipRef.current) {
          tooltipRef.current.style.display = 'none';
          tooltipRef.current.style.opacity = '0';
        }
      });

    const ticksNumber = 8;

    // Add y-axis grid lines
    const yTicks = yScale
      .ticks(8)
      .filter((tick) => tick !== yScale.domain()[0]); // Get tick values from yScale
    chartGroup
      .selectAll('.grid-line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', '#d6d6d6')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4 4'); // Dotted line pattern

    // Add axis
    svg
      .append('g')
      .attr(
        'transform',
        `translate(${margin.left}, ${margin.top + innerHeight})`
      )
      .call(d3.axisBottom(xScale))
      .style('font-size', `${xLabelsFontSize || '0.8rem'}`);

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(
        d3
          .axisLeft(yScale)
          .ticks(ticksNumber)
          .tickFormat((d) => `${d} ${unitOfMeasurement || ''}`)
      )
      .style('font-size', `${yLabelsFontSize || '0.8rem'}`);

    var ylabel = yLabel || '';
    svg
      .append('text')
      .attr('transform', `rotate(-90)`)
      .attr('x', -height / 2) // Centrare verticalmente
      .attr('y', margin.left / 2 - 10) // Posizionarla vicino all'asse Y
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', 'black')
      .text(ylabel); // Testo della label

    var xlabel = xLabel || '';
    svg
      .append('text')
      .attr('x', width / 1.8)
      .attr('y', height - margin.bottom / 4)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', 'black')
      .text(xlabel);
  }, [data, width]);

  if (data.length <= 0) return <NoDataMessage height={height}></NoDataMessage>;

  return (
    <div className="relative" ref={containerRef}>
      <ChartScrollableWrapper>
        <svg ref={svgRef} />
      </ChartScrollableWrapper>
      <Tooltip ref={tooltipRef}>{tooltipContent}</Tooltip>
    </div>
  );
};

export default LineChart;
