'use client';

import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import Tooltip from '../tooltip';
import { calculateMaxLength, splitText } from './utils/facetedBarChart';
import { tooltipPositionOnMouseMove } from './utils/general';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ChartScrollableWrapper from '../chart-scrollable-wrapper';
import NoDataMessage from '../no-data-message';

export interface FacetedPoint {
  group: string; // The data on y axis
  category: string; // The data on x axis
  value: number; // The value
}

export interface FacetedBarChartProps {
  data: { category: string; group: string; value: number }[];
  width: number;
  height: number;
  colorInterpoaltors?: (((t: number) => string) | Iterable<string>)[];
  rows?: number;
  xDomainMin?: number;
  xDomainMax?: number;
  facetsMargin?: number;
  tooltipMapper?: (point: FacetedPoint[], header?: string) => React.ReactNode;
  unitOfMeasurement?: string;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
}

/**
 * A Faceted Barchart component
 *
 * @param {string[]} FacetedBarChartProps.data - data
 * @param {number} FacetedBarChartProps.width - The width of the faceted bartchart (e.g. 100px or 100% or ... <css-props>)
 * @param {number} FacetedBarChartProps.height - The height of the faceted bartchart, used only when no data is avaiable
 * @param {((t: number) => string) | Iterable<string>} FacetedBarChartProps.colorInterpoaltors - A function that returns a color as string given a value of y data or an iterable that represent the values of the colors to use
 * @param {number} FacetedBarChartProps.rows - The numbers of rows on which the graph is draw, default is 1
 * @param {[number, number]} FacetedBarChartProps.xDomainMin- The min value for the x domain (e.g. 0 or min(y))
 * @param {[number, number]} FacetedBarChartProps.xDomainMax- The max value for the x domain (e.g. 100 or max(y))
 * @param {number} FacetedBarChartProps.facetsMargin - Margin between each facet, default is the margin suitable for four facets;
 * @param {(point: FacetedPoint[], header: string | undefined) => React.ReactNode} FacetedBarChartProps.tooltipMapper - A react node used to create a tooltip from a poitn x, y
 * @param {string} FacetedBarChartProps.unitOfMeasurement - The unit of measure used for axis and tooltip
 * @param {number} FacetedBarChartProps.mt - The margin top
 * @param {number} FacetedBarChartProps.mr - The margin right
 * @param {number} FacetedBarChartProps.mb - The margin bottom
 * @param {number} FacetedBarChartProps.ml - The margin left
 * @throws {Error} - If the numbers of groups and color maps doesn't match
 * @returns The react component
 */
export default function FacetedBarChart({
  data,
  width,
  height,
  colorInterpoaltors,
  rows,
  xDomainMin,
  xDomainMax,
  facetsMargin,
  tooltipMapper,
  unitOfMeasurement,
  mt,
  mr,
  mb,
  ml
}: FacetedBarChartProps) {
  // The ref of the chart created by d3
  const svgRef = useRef<SVGSVGElement | null>(null);
  // The container of the svg
  const containerRef = useRef<HTMLDivElement | null>(null);
  // The ref of the tooltip and its content
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode | null>(
    null
  );
  // The page currently displayed
  const [currentPage, setCurrentPage] = useState(0);

  const groups = Array.from(new Set(data.map((d) => d.group)));

  useEffect(() => {
    d3.select(svgRef.current).selectAll('*').remove();

    if (data.length <= 0) return;

    rows = rows || 1;
    if (groups.length - rows < 0) rows = groups.length;
    const cols = Math.ceil(groups.length / rows);

    // Define the margin (used to make the svg do not clip to the border of the containing div)
    const margin = {
      top: mt || 50,
      right: mr || rows == 3 ? 60 : 0,
      bottom: mb || 40,
      left: ml || 75
    };

    var categories = Array.from(new Set(data.map((d) => d.category)));
    var values = Array.from(new Set(data.map((d) => d.value)));

    const topFactedOffset = rows == 2 ? 40 : rows < 8 ? 65 : 80;

    height =
      (margin.top +
        margin.bottom +
        15 +
        33 * categories.length +
        topFactedOffset) *
      rows;

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    if (
      colorInterpoaltors != undefined &&
      groups.length < colorInterpoaltors.length
    ) {
      throw new Error(
        'The numbers of color maps has to be the same of the groups.'
      );
    }

    // Determine the number of facets and their dimension
    facetsMargin = facetsMargin || 30;

    const facetWidth =
      chartWidth / Math.max(1, groups.length / rows) - facetsMargin;
    const facetHeight = chartHeight / rows - topFactedOffset;

    // Define the X domain
    var domain = [
      xDomainMin || Math.min(0, Math.min(...values)),
      xDomainMax || Math.max(...values)
    ];

    // Scala X (Values)
    // Set axis ticks number
    const ticksNumber = 3;
    const xScale = d3.scaleLinear().domain(domain).range([0, facetWidth]);

    // Scala Y (Categories)
    const yScale = d3
      .scaleBand()
      .domain(categories)
      .range([0, facetHeight])
      .padding(0.2);

    // Selezione del container SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Creazione di un gruppo per ogni facet (gruppo)
    const facetsTopMargin = 90;

    const facets = svg
      .selectAll('.facet')
      .data(groups)
      .enter()
      .append('g')
      .attr('class', 'facet')
      .attr('transform', (_, i) => {
        const col = i % cols; // column index
        const row = Math.floor(i / cols); // row index
        return `translate(${col * (facetWidth + facetsMargin!)}, ${
          row * (facetHeight + facetsTopMargin)
        })`;
      });

    // Bars size
    const rectHeight = 31;

    // Scala colori per i gruppi
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(groups);

    // Create the default tooltip mapper
    tooltipMapper =
      tooltipMapper ||
      ((points: FacetedPoint[], header?: string) => {
        header = header || '';

        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '300px'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              {header}
            </div>
            {points.map((point, index) => (
              <p key={index}>
                {point.group}:{' '}
                <span style={{ fontWeight: '600' }}>
                  {point.value}
                  {unitOfMeasurement || ''}
                </span>
              </p>
            ))}
          </div>
        );
      });

    // Aggiunta delle barre per ogni facet
    facets.each(function (group) {
      const facet = d3.select(this);
      const groupData = data.filter((d) => d.group === group);

      // Append gray background rectangle
      facet
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', facetWidth)
        .attr('height', facetHeight)
        .attr('fill', 'none')
        .attr('stroke', '#d9d9d9') // Border for separation
        .attr('stroke-width', 1);

      // Add category boundary rectangles
      for (let i = 0; i < groupData.length; i++) {
        const d = groupData[i];
        const nextD = groupData[i + 1];

        const top = yScale(d.category)! + rectHeight / 2; // Middle of current bar
        const bottom = nextD
          ? yScale(nextD.category)! + rectHeight / 2
          : facetHeight; // Middle of next bar or chart bottom

        facet
          .append('rect')
          .attr('x', 0)
          .attr('y', top)
          .attr('width', facetWidth)
          .attr('height', bottom - top)
          .attr('fill', 'none')
          .attr('stroke', '#d9d9d9') // Border color
          .attr('stroke-width', 1);
      }

      // Add bars
      facet
        .selectAll('rect.bar')
        .data(groupData)
        .enter()
        .append('rect')
        .attr('class', `bar`)
        .attr('x', 0) // Le barre iniziano all'angolo sinistro
        .attr('y', (d) => yScale(d.category)!) // Aggiungi l'offset di altezza in base all'indice i
        .attr('width', (d) => xScale(d.value)) // Larghezza della barra proporzionale al valore
        .attr('height', rectHeight) // Altezza prefissata per il rettangolo
        .attr('fill', (d) => colorScale(d.group)) // Colora le barre in base al gruppo
        .attr('opacity', 0.85)
        .on('mousemove', (event, d) => {
          if (tooltipRef.current) {
            // Compute tooltip position
            const horizontalOffset = 25;
            const verticalOffset = 40;

            tooltipPositionOnMouseMove(
              tooltipRef,
              containerRef,
              event,
              horizontalOffset,
              verticalOffset,
              width
            );

            setTooltipContent(tooltipMapper!([d]));
          }
          // Reduce opacity of all bars in the same group
          d3.select(containerRef.current)
            .selectAll('.bar')
            .filter((barData) => (barData as FacetedPoint).group === d.group) // Select only bars in the same group
            .transition()
            .duration(200)
            .style('opacity', 0.5);

          // Evidenzia la barra su cui è il mouse
          d3.select(event.target as SVGRectElement)
            .transition()
            .duration(200)
            .style('opacity', 1);
        })
        .on('mouseleave', (event, d) => {
          if (tooltipRef.current) {
            tooltipRef.current.style.display = 'none';
            tooltipRef.current.style.opacity = '0';
          }
          // Reset opacity for all bars in the same group
          d3.select(containerRef.current)
            .selectAll(`.bar`)
            .filter((barData) => (barData as FacetedPoint).group === d.group)
            .transition()
            .duration(200)
            .style('opacity', 0.85);
        });

      // Add label of the group on top of each facet
      const bottomMargin = 15;
      const lineHeight = 12; // Spacing between lines
      const fontSize = 0.8; // Font size in rem (this matches the style in your code)

      // Calculate the max characters per line based on the facet width
      const maxLength_group = calculateMaxLength(facetWidth, fontSize);

      const lines = splitText(group, maxLength_group, 3);

      // Adjust y-position based on the number of lines
      const textYOffset = -bottomMargin - (lines.length - 1) * lineHeight;

      // Append each line separately
      lines.forEach((line, index) => {
        facet
          .append('text')
          .attr('class', 'group-label')
          .attr('x', facetWidth / 2) // Center the text horizontally
          .attr('y', textYOffset + index * lineHeight) // Offset each line
          .attr('text-anchor', 'middle')
          .style('font-size', `${fontSize}rem`)
          .style('font-weight', 'bold')
          .text(line)
          .on('mousemove', (event) => {
            // Swap 'category' and 'group' to adapt it to the tooltip display
            const adaptedGroupData = groupData.map((d) => {
              return {
                category: d.group,
                group: d.category,
                value: d.value
              };
            });

            if (tooltipRef.current) {
              // Calcola la posizione del tooltip
              const horizontalOffset = 10;
              const verticalOffset = 0;
              tooltipPositionOnMouseMove(
                tooltipRef,
                containerRef,
                event,
                horizontalOffset,
                verticalOffset,
                width
              );
              setTooltipContent(tooltipMapper!(adaptedGroupData, group));

              tooltipRef.current.style.borderColor = colorScale(group);
            }
          })
          .on('mouseleave', () => {
            if (tooltipRef.current) {
              tooltipRef.current.style.display = 'none';
              tooltipRef.current.style.opacity = '0';
              tooltipRef.current.style.borderColor = 'hsl(var(--border))';
            }
          });
      });

      // Append x-axis
      facet
        .append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${facetHeight})`) // Position below the bars
        .style('font-size', '0.7rem')
        .call(
          d3
            .axisBottom(xScale)
            .ticks(ticksNumber)
            .tickFormat((d) => `${d3.format('d')(d)}${unitOfMeasurement || ''}`) // Format as integer (removes decimal points)
        )
        .call((g) => {
          g.selectAll('.domain').attr('stroke', '#d9d9d9'); // Style axis line
          g.selectAll('.tick line').attr('stroke', '#d9d9d9'); // Change tick line color
        });
    });

    const maxLength = 13; // Max number of characters per line
    const label_offset = 15;
    const lineHeight = 15; // Space between lines

    var categoriesArray = [...categories];
    for (var i = 0; i < rows - 1; ++i) {
      categoriesArray = categoriesArray.concat(categories);
    }

    const categoriesPerRow = Math.ceil(categoriesArray.length / rows);

    const flattened: { category: string; row: number; indexInRow: number }[] =
      [];

    for (let i = 0; i < rows; i++) {
      const start = i * categoriesPerRow;
      const end = start + categoriesPerRow;
      const rowCategories = categoriesArray.slice(start, end);
      rowCategories.forEach((cat, j) => {
        flattened.push({
          category: cat,
          row: i,
          indexInRow: j
        });
      });
    }

    // Aggiunta delle etichette sulla sinistra per ogni categoria
    for (var i = 0; i < rows; ++i) {
      svg
        .selectAll('.category-label')
        .data(flattened)
        .enter()
        .append('text')
        .attr('class', 'category-label')
        .attr('data-category', (d) => d.category) // Store original category name
        .attr('x', -label_offset) // Posiziona l'etichetta a sinistra
        .attr('y', (d) => {
          const y = yScale(d.category);
          return (
            y! +
            rectHeight / 2 +
            d.indexInRow * lineHeight +
            d.row * facetHeight
          ); // Adjust for multiple lines
        })
        .attr('dy', '.25em') // Allinea verticalmente al centro
        .attr('text-anchor', 'end') // Allinea l'etichetta a sinistra
        .style('font-size', '0.8rem') // Riduci la dimensione del font
        .style('font-weight', '600')
        .each(function (d) {
          // limit d with max_lenght and add "..." at the end .

          const lines = splitText(d.category, maxLength);
          const textElement = d3.select(this);

          // Append additional lines
          lines.forEach((line, index) => {
            textElement
              .append('tspan') // Use <tspan> to add multiple lines within the same <text> element
              .attr('x', -label_offset) // Keep the same x position for all lines
              .attr(
                'y',
                yScale(d.category)! +
                  rectHeight / 2 +
                  index * lineHeight +
                  d.row * (facetHeight + facetsTopMargin)
              ) // Adjust y position for subsequent lines
              .style('font-size', '0.8rem')
              .style('font-weight', '600')
              .text(line); // Add the text for the line
          });

          textElement
            .on('mousemove', (event) => {
              // Get category not edited name
              const cateogyOriginal = d3.select(this).attr('data-category');

              const categoryData = data.filter(
                (d) => d.category === cateogyOriginal
              );

              if (tooltipRef.current) {
                // compute tooltip position
                const horizontalOffset = 10;
                const verticalOffset = 60;
                tooltipPositionOnMouseMove(
                  tooltipRef,
                  containerRef,
                  event,
                  horizontalOffset,
                  verticalOffset,
                  width
                );

                setTooltipContent(
                  tooltipMapper!(categoryData, cateogyOriginal)
                );
              }
            })
            .on('mouseleave', () => {
              if (tooltipRef.current) {
                tooltipRef.current.style.display = 'none';
                tooltipRef.current.style.opacity = '0';
              }
            });
        });
    }
  }, [data, width, height, currentPage]);

  if (data.length <= 0) {
    return <NoDataMessage height={height}></NoDataMessage>;
  }

  return (
    <div className="relative" ref={containerRef}>
      <ChartScrollableWrapper>
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: -20 }} // Start slightly off-screen
          animate={{ opacity: 1, x: 0 }} // Fade and slide in
          exit={{ opacity: 0, x: 20 }} // Slide out when changing
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="overflow-x-auto overflow-y-auto h-full w-fit"
        >
          <svg ref={svgRef} />
        </motion.div>
      </ChartScrollableWrapper>
      <Tooltip ref={tooltipRef}>{tooltipContent}</Tooltip>
    </div>
  );
}
