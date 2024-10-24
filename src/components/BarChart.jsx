import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function BarChart() {
  const svgRef = useRef();

  useEffect(() => {
    // Dati casuali
    const data = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));

    // Dimensioni del grafico
    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Seleziona l'elemento SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#f0f0f0')
      .style('margin-top', '20px');

    // Scala per l'asse X (bande per le barre)
    const x = d3.scaleBand()
      .domain(data.map((_, i) => i))  // Indici dei dati come etichette
      .range([margin.left, width - margin.right])
      .padding(0.1);

    // Scala per l'asse Y
    const y = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([height - margin.bottom, margin.top]);

    // Crea le barre
    svg.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (_, i) => x(i))
      .attr('y', d => y(d))
      .attr('width', x.bandwidth())
      .attr('height', d => y(0) - y(d))
      .attr('fill', 'steelblue');

    // Asse X
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(i => `Bar ${i + 1}`)); // Etichette personalizzate

    // Asse Y
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

  }, []); // Esegui una volta quando il componente è montato

  return <svg ref={svgRef}></svg>;
}

export default BarChart;
