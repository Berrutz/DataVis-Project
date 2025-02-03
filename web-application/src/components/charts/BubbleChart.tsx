import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

// Interfaccia per le proprietà del componente
interface BubbleChartProps {
  x: string[]; // Tempo o altre etichette lungo l'asse X
  y: number[]; // Valori Y
  r: number[]; // Dimensioni delle bolle
  p: string[]; // Paesi
  width: number; // Larghezza del grafico
  height: number; // Altezza del grafico
  colorInterpolator: (t: number) => string; // Funzione per l'interpolazione dei colori
}

const BubbleChart: React.FC<BubbleChartProps> = ({ x, y, r, p, width, height, colorInterpolator }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || x.length === 0 || y.length === 0 || r.length === 0 || p.length === 0) return;

    // Rimuove il contenuto precedente
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const margin = 20;
    const chartWidth = width - margin * 2;
    const chartHeight = height - margin * 2;

    // Scala per l'asse X (da etichette stringhe a numeri)
    const xScale = d3.scalePoint().domain(x).range([0, chartWidth]);

    // Scala per i colori
    const uniqueCountries = Array.from(new Set(p));
    const colorScale = d3
      .scaleOrdinal<string, string>()
      .domain(uniqueCountries)
      .range(uniqueCountries.map((_, i) => colorInterpolator(i / uniqueCountries.length)));

    // Unisce i dati
    const data = x.map((label, i) => ({
      x: xScale(label) || 0, // Mappa la stringa X a un valore numerico
      y: chartHeight - y[i], // Inverti l'asse Y
      r: r[i],
      p: p[i],
    }));

    // Simulazione di forza
    const simulation = d3
      .forceSimulation(data as d3.SimulationNodeDatum[]) // Cast a SimulationNodeDatum[]
      .force(
        'x',
        d3.forceX(chartWidth / 2).strength(0.05)
      )
      .force(
        'y',
        d3.forceY(chartHeight / 2).strength(0.05)
      )
      .force(
        'collision',
        d3.forceCollide().radius((d: any) => d.r / 5 + 5)
      )
      .stop();

    for (let i = 0; i < 30; i++) simulation.tick();

    // Aggiunta del gruppo principale
    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin}, ${margin})`);

    // Aggiunge le bolle
    g.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y)
      .attr('r', (d: any) => d.r / 5)
      .style('fill', (d: any) => colorScale(d.p))
      .style('opacity', 0.8);

    // Etichette per le bolle
    g.selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .attr('x', (d: any) => d.x)
      .attr('y', (d: any) => d.y)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .text((d: any) => d.p)
      .style('font-size', '10px')
      .style('fill', 'white')
      .style('pointer-events', 'none');

    // Legenda
    const legend = svg
      .append('g')
      .attr('transform', `translate(${margin}, ${chartHeight + margin + 20})`);

    legend
      .selectAll('rect')
      .data(uniqueCountries)
      .enter()
      .append('rect')
      .attr('x', (_, i) => i * 80)
      .attr('width', 15)
      .attr('height', 15)
      .style('fill', (d) => colorScale(d));

    legend
      .selectAll('text')
      .data(uniqueCountries)
      .enter()
      .append('text')
      .attr('x', (_, i) => i * 80 + 20)
      .attr('y', 12)
      .text((d) => d)
      .style('font-size', '10px')
      .style('fill', 'black');



  }, [x, y, r, p, width, height, colorInterpolator]);

  return <svg ref={svgRef}></svg>;
};

export default BubbleChart;
