import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

export interface Point {
    x: string;
    y: number;
}

export interface FacetedBarChartProps {
  data: { category: string; group: string; value: number }[];
  width: number;
  height: number;

  xLabel?: string;
  yLabel?: string;
  colorInterpoaltor?: ((t: number) => string) | Iterable<string>;
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

  xLabel,
  yLabel,
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

  useEffect(() => {

    if (!data || data.length === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    // Define the margin (used to make the svg do not clip to the border of the containing div)
    const margin = {
        top: mt || 20,
        right: mr || 0,
        bottom: mb || 40,
        left: ml || 30
    };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    var categories = Array.from(new Set(data.map(d => d.category)));
    var groups = Array.from(new Set(data.map(d => d.group)));
    var values = Array.from(new Set(data.map(d => d.value)));

    categories = categories.slice(0, 7);  // PAESI 
    groups = groups.slice(0, 2);          // CATEGORIE DISCRIMINATE
 

    console.log("Categories : ",categories)
    console.log("groups : ",groups)

    // Costante per il filtro dei dati: solo le prime 2 categorie e 2 gruppi
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
      .range([0, facetWidth])


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
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Creazione di un gruppo per ogni facet (gruppo)
    const facets = svg
      .selectAll(".facet")
      .data(groups)
      .enter()
      .append("g")
      .attr("class", "facet")
      .attr("transform", (_, i) => `translate(${i * facetWidth},0)`)


    const rectHeight = 20;  // Definisci la tua altezza fissa qui


    // Aggiunta delle barre per ogni facet
    facets.each(

      function (group) {
      const facet = d3.select(this);
      const groupData = filteredData.filter((d) => d.group === group);

      console.log("G : " ,groupData)

      // Aggiunta delle barre

      facet
            .selectAll("rect")
            .data(groupData)
            .enter()
            .append("rect")
            .attr("x", 0)  // Le barre iniziano all'angolo sinistro
            .attr("y", (d, i) => yScale(d.category)! + (i * rectHeight))  // Aggiungi l'offset di altezza in base all'indice i
            .attr("width", (d) => xScale(d.value))  // Larghezza della barra proporzionale al valore
            .attr("height", rectHeight);  // Altezza prefissata per il rettangolo
    
       // Aggiunta delle etichette sulla sinistra per ogni categoria
       facet
        .selectAll(".category-label")
        .data(categories)
        .enter()
        .append("text")
        .attr("class", "category-label")
        .attr("x", -10)  // Posiziona l'etichetta a sinistra
        .attr("y", (d, i) => yScale(d)! + (i * rectHeight) + 10)  // Posiziona verticalmente in base alla categoria
        .attr("dy", ".35em")  // Allinea verticalmente al centro
        .attr("text-anchor", "end")  // Allinea l'etichetta a sinistra
        .text((d) => d);  // Imposta il testo dell'etichetta alla categoria
        
      }
    );

  }, [data, width, height, xLabel, yLabel]);

  return (
    <div className="overflow-x-auto overflow-y-auto h-full w-fit">
      <svg ref={svgRef} />
    </div>
  );
}
