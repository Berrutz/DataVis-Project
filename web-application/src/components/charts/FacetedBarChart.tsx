import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import Tooltip from '../tooltip';

export interface FacetedPoint {
  group: string;
  category: string;
  value: number;
}

export interface FacetedBarChartProps {
  data: { category: string; group: string; value: number }[];
  width: number;
  height: number;

  colorInterpoaltor?: ((t: number) => string) | Iterable<string>;
  yDomainMin?: number;
  yDomainMax?: number;
  yLabelsPrefix?: string;
  yLabelsSuffix?: string;
  tooltipMapper?: (point: FacetedPoint) => React.ReactNode;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
}

/**
 * A Faceted Barchart component
 *
 * @param {string[]} FacetedBarChartProps.data - data
 * @param {number} FacetedBarChartProps.width - The width of the bartchart (e.g. 100px or 100% or ... <css-props>)
 * @param {number} FacetedBarChartProps.height - The height of the bartchart (e.g. 100px or 100% or ... <css-props>)
 
 * @param {((t: number) => string) | Iterable<string>} FacetedBarChartProps.colorInterpoaltor - A function that returns a color as string given a value of y data or an iterable that represent the values of the colors to use
 * @param {[number, number]} FacetedBarChartProps.yDomainMin- The min value for the y domain (e.g. 0 or min(y))
 * @param {[number, number]} FacetedBarChartProps.yDomainMax- The max value for the y domain (e.g. 100 or max(y))
 * @param {string} FacetedBarChartProps.yLabelsPrefix - The prefix for the y labels
 * @param {string} FacetedBarChartProps.yLabelsSuffix - The suffix for the y labels
 * @param {(point: Point) => React.ReactNode} FacetedBarChartProps.tooltipMapper - A react node used to create a tooltip from a poitn x, y
 * @param {number} FacetedBarChartProps.mt - The margin top
 * @param {number} FacetedBarChartProps.mr - The margin right
 * @param {number} FacetedBarChartProps.mb - The margin bottom
 * @param {number} FacetedBarChartProps.ml - The margin left
 * @throws {Error} - If the length less or equals to 0
 * @returns The react component
 */

export default function FacetedBarChart({
  data,
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
}: FacetedBarChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  // The ref of the tooltip and its content
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode | null>(
    null
  );

  useEffect(() => {
    if (!data || data.length === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    // Define the margin (used to make the svg do not clip to the border of the containing div)
    const margin = {
      top: mt || 20,
      right: mr || 0,
      bottom: mb || 40,
      left: ml || 75
    };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    var categories = Array.from(new Set(data.map((d) => d.category)));
    var groups = Array.from(new Set(data.map((d) => d.group)));
    var values = Array.from(new Set(data.map((d) => d.value)));

    categories = categories.slice(0, 6); // PAESI
    groups = groups.slice(0, 4); // CATEGORIE DISCRIMINATE

    console.log('Categories : ', categories);
    console.log('groups : ', groups);

    const filterCondition = (d: any) => {
      return categories.includes(d.category) && groups.includes(d.group);
    };

    // Filtrare i dati prima di usarli
    const filteredData = data.filter(filterCondition);

    // Determina il numero di facet e le loro dimensioni
    const facetWidth = chartWidth / groups.length;
    const facetHeight = chartHeight;

    // Define the Y domain
    var domain = [
      yDomainMin || Math.min(0, Math.min(...values)),
      yDomainMax || Math.max(...values)
    ];

    // Scala X (Values)
    const xScale = d3
      .scaleLinear()
      .domain(domain)
      .nice()
      .range([0, facetWidth]);

    // Scala Y (Categories)
    const yScale = d3
      .scaleBand()
      .domain(categories)
      .range([0, facetHeight])
      .padding(0.2);

    // Scala colori
    //const colorScale = d3.scaleOrdinal(colorInterpoaltor).domain(categories);

    // Selezione del container SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Creazione di un gruppo per ogni facet (gruppo)
    const facets = svg
      .selectAll('.facet')
      .data(groups)
      .enter()
      .append('g')
      .attr('class', 'facet')
      .attr('transform', (_, i) => `translate(${i * facetWidth},0)`);

    const rectHeight = 10; // Definisci la tua altezza fissa qui

    // Scala colori per i gruppi
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(groups);

    // Create the default tooltip mapper
    tooltipMapper =
      tooltipMapper ||
      ((point: FacetedPoint) => {
        return (
          <p>
            {point.group}: <span>{point.value}</span>
          </p>
        );
      });

    // Aggiunta delle barre per ogni facet
    facets.each(function (group) {
      const facet = d3.select(this);
      const groupData = filteredData.filter((d) => d.group === group);

      console.log('G : ', groupData);

      // Aggiunta delle barre
      facet
        .selectAll('rect')
        .data(groupData)
        .enter()
        .append('rect')
        .attr('x', 0) // Le barre iniziano all'angolo sinistro
        .attr('y', (d, i) => yScale(d.category)! + i * rectHeight) // Aggiungi l'offset di altezza in base all'indice i
        .attr('width', (d) => xScale(d.value)) // Larghezza della barra proporzionale al valore
        .attr('height', rectHeight) // Altezza prefissata per il rettangolo
        .attr('fill', (d) => colorScale(d.group)) // Colora le barre in base al gruppo
        .on('mousemove', (event, d) => {
          if (tooltipRef.current) {
            console.log('Move');

            // Calcola la posizione del tooltip
            const svgRect = svgRef.current?.getBoundingClientRect();
            const horizontalOffset = 25;
            const verticalOffset = 60;

            const tooltipX =
              event.clientX - (svgRect?.left || 0) + horizontalOffset;
            const tooltipY =
              event.clientY - (svgRect?.top || 0) - verticalOffset;

            tooltipRef.current.style.left = `${tooltipX}px`;
            tooltipRef.current.style.top = `${tooltipY}px`;
            tooltipRef.current.style.display = 'block';
            tooltipRef.current.style.opacity = '1';

            setTooltipContent(tooltipMapper!(d));
          }

          // Evidenzia la barra su cui è il mouse
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

          // Reset opacity per tutte le barre
          d3.selectAll('rect').transition().duration(200).style('opacity', 1);
        });

      // Aggiungi un rettangolo nero attorno a ogni paese (categoria)
      groupData.forEach(function (l, i) {
        const Heightrect = 50; // Imposta l'altezza del rettangolo in base alla larghezza della scala Y

        // Definisci i margini per il rettangolo attorno alla categoria
        const marginTop = -20; // Margine superiore
        const marginBottom = 0; // Margine inferiore
        const marginLeft = 0; // Margine sinistro
        const marginRight = 0; // Margine destro

        // Aggiungi il rettangolo per il paese (categoria)
        facet
          .append('rect')
          .attr('x', marginLeft) // Sposta a destra rispetto al margine sinistro
          .attr('y', yScale(l.category)! + i * rectHeight + marginTop) // Sposta in basso rispetto al margine superiore
          .attr('width', facetWidth - marginLeft - marginRight) // Riduci la larghezza in base ai margini
          .attr('height', Heightrect - marginBottom) // Riduci l'altezza in base ai margini
          .attr('fill', 'transparent') // Nessun riempimento
          .attr('stroke', 'black') // Colore del bordo
          .attr('stroke-width', 2) // Larghezza del bordo
          .on('mousemove', (event) => {
            if (tooltipRef.current) {
              // Calcola la posizione del tooltip
              const svgRect = svgRef.current?.getBoundingClientRect();
              const horizontalOffset = 25;
              const verticalOffset = 60;

              const tooltipX =
                event.clientX - (svgRect?.left || 0) + horizontalOffset;
              const tooltipY =
                event.clientY - (svgRect?.top || 0) - verticalOffset;

              tooltipRef.current.style.left = `${tooltipX}px`;
              tooltipRef.current.style.top = `${tooltipY}px`;
              tooltipRef.current.style.display = 'block';
              tooltipRef.current.style.opacity = '1';

              setTooltipContent(tooltipMapper!(l));
            }

            // Evidenzia la barra su cui è il mouse
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

            // Reset opacity per tutte le barre
            d3.selectAll('rect').transition().duration(200).style('opacity', 1);
          });
      });

      const center_width = 3;
      const center_distance = 30;

      // Aggiunta della didascalia sotto ogni gruppo
      const maxLength_group = 15; // Numero massimo di caratteri per l'etichetta
      facet
        .append('text')
        .attr('class', 'group-label')
        .attr('x', facetWidth / center_width) // Centra il testo orizzontalmente
        .attr('y', facetHeight + center_distance) // Posiziona sotto le barre (+30 per distanza)
        .attr('text-anchor', 'middle') // Centra il testo
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text(
          group.length > maxLength_group
            ? group.substring(0, maxLength_group) + '…'
            : group
        );
    });

    const maxLength = 10; // Numero massimo di caratteri per l'etichetta PAESI
    const label_offset = 20;
    // Aggiunta delle etichette sulla sinistra per ogni categoria
    svg
      .selectAll('.category-label')
      .data(categories)
      .enter()
      .append('text')
      .attr('class', 'category-label')
      .attr('x', -label_offset) // Posiziona l'etichetta a sinistra
      .attr('y', (d, i) => yScale(d)! + i * rectHeight + rectHeight / 2) // Posiziona verticalmente in base alla categoria
      .attr('dy', '.25em') // Allinea verticalmente al centro
      .attr('text-anchor', 'end') // Allinea l'etichetta a sinistra
      .style('font-size', '12px') // <-- Riduci la dimensione del font
      .text((d) => (d.length > maxLength ? d.slice(0, maxLength) + '…' : d));
  }, [data, width, height]);

  return (
    <div className="overflow-x-auto overflow-y-auto h-full w-fit">
      <svg ref={svgRef} />
      <Tooltip ref={tooltipRef}>{tooltipContent}</Tooltip>
    </div>
  );
}
