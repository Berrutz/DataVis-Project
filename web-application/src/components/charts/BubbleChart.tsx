import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import ChartScrollableWrapper from '../chart-scrollable-wrapper';
import Tooltip from '../tooltip';

export interface BubblePoint {
  country: string;
  year: string;
  percentage: number;
  adjustedPercentage: number; // normalized & MIN_SIZE enforced
  absoluteValue: number; // calculated from population
}

export interface BubbleData {
  currentYearData: BubblePoint[];
  otherYearsData: BubblePoint[];
}

interface BubbleTooltip {
  radius: number;
  countryName: string;
  color: string | undefined;
  year: string;
  percentage: number;
  absoluteValue: number;
  x: number;
  y: number;
}

// Interfaccia per le proprietà del componente
interface BubbleChartProps {
  data: BubbleData;
  previusYear: string;
  width: number;
  height: number;
  colorInterpolator: (t: number) => string;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
}

const BubbleChart: React.FC<BubbleChartProps> = ({
  data,
  previusYear,
  width,
  height,
  colorInterpolator,
  mt,
  mr,
  mb,
  ml
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // The container of the svg
  const containerRef = useRef<HTMLDivElement | null>(null);

  // The ref of the tooltip and its content
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [tooltipContent, setTooltipContent] = useState<React.ReactNode | null>(
    null
  );

  useEffect(() => {
    if (!svgRef.current || data.currentYearData.length === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const margin = {
      top: mt || 20,
      right: mr || 0,
      bottom: mb || 40,
      left: ml || 75
    };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const currentData = data.currentYearData;
    const countiresList = currentData.map((d) => d.country);

    // Creazione della mappa colori
    const countryColorMap = new Map<string, string>();
    countiresList.forEach((country, i) => {
      const t = i / (countiresList.length - 1); // Normalize index to [0, 1]
      countryColorMap.set(country, colorInterpolator(t));
    });

    // Creazione di un dataset con i dati normalizzati
    const centerX = chartWidth / 2;
    const centerY = chartHeight / 2;
    const dataset = currentData.map((d) => ({
      radius: d.adjustedPercentage, // Grandezza della bolla
      countryName: d.country,
      color: countryColorMap.get(d.country), // Colore della bolla
      year: d.year, // Anno della bolla
      percentage: d.percentage,
      absoluteValue: d.absoluteValue,
      x: centerX, // Posizione iniziale casuale (necessario per D3)
      y: centerY // Posizione iniziale casuale
    }));

    const previusYearData: BubblePoint[] = [];
    if (dataset[0].year != previusYear) {
      data.otherYearsData.forEach((element) => {
        if (element.year === previusYear) previusYearData.push(element);
      });
    }

    // Definizione del layout a forza
    const distance = 3;
    const strenght = -10;
    const simulation = d3
      .forceSimulation(dataset as d3.SimulationNodeDatum[])
      .force('charge', d3.forceManyBody().strength(strenght)) // Controlla la dispersione
      .force('center', d3.forceCenter(centerX, centerY))
      .force(
        'collision',
        d3.forceCollide().radius((d) => (d as any).radius + distance)
      ) // +3 per un po' di spazio
      .force(
        'customMoveX',
        d3.forceX().x((d) => {
          const moveX = Math.random(); // Movimento più grande orizzontale

          var xFinalPos = (d as any).x + moveX + (d as any).radius;
          if (xFinalPos > chartWidth) {
            xFinalPos = chartWidth - (d as any).radius;
          }
          return xFinalPos;
        })
      )
      .force(
        'customMoveY',
        d3.forceY().y((d) => {
          const moveY = Math.random(); // Movimento verticale minore
          var xFinalPos = (d as any).x + moveY + (d as any).radius;
          if (xFinalPos > chartHeight) {
            xFinalPos = chartHeight - (d as any).radius;
          }
          return xFinalPos;
        })
      )
      .stop();

    // Run the simulation fully before rendering
    for (let i = 0; i < 300; ++i) simulation.tick();

    const group = svg.append('g').attr('transform', `translate(0,0)`);

    // Create tooltip mapper
    const tooltipMapper = (point: BubbleTooltip) => {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '300px'
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            {point.countryName}
          </div>
          <div>
            Percentage of people in this country operating on bound or other
            investment:{' '}
            <a style={{ fontWeight: '600' }}>{point.percentage.toFixed(2)}%</a>
          </div>
          <div>
            Actual number of people interacting in the economic field is equal
            to{' '}
            <a style={{ fontWeight: '600' }}>
              {(point.absoluteValue / 1000000).toFixed(2)} M people
            </a>
          </div>
        </div>
      );
    };

    // Crea le bolle
    const bubbles = group
      .selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('r', (d) => {
        if (previusYear === d.year) return d.radius;
        const countryData = previusYearData.find(
          (p) => p.country === d.countryName
        );
        return countryData != null ? countryData.adjustedPercentage : 0;
      }) // start small
      .attr('fill', (d) => d.color!) // Usa il colore fisso del paese
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
          tooltipRef.current.style.borderColor = `${d.color}`;

          setTooltipContent(tooltipMapper!(d));
        }

        // Restrict selection to only the current chart
        d3.select(containerRef.current)
          .selectAll('circle')
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
          tooltipRef.current.style.borderColor = 'hsl(var(--border))';
        }

        // Restrict selection to only the current chart
        d3.select(containerRef.current)
          .selectAll('circle')
          .transition()
          .duration(200)
          .style('opacity', 1);
      });

    // 🔄 Apply transition separately
    bubbles
      .transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attr('r', (d) => d.radius);

    const labels = group
      .selectAll('text')
      .data(dataset)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .style('fill', 'white')
      .style('font-size', '10px')
      .each(function (d) {
        const text = d3.select(this);

        // Calcola le dimensioni del testo in base al raggio
        const percentageFontSize = Math.max(d.radius * 0.3, 8); // Minimo 8px

        // Aggiunge la seconda riga (percentuale)
        text
          .append('tspan')
          .attr('x', d.x) // Deve essere aggiornato con la simulazione
          .style('font-size', `${percentageFontSize}px`)
          .text(`${d.percentage.toFixed(1)}%`);
      })
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
          tooltipRef.current.style.borderColor = `${d.color}`;

          setTooltipContent(tooltipMapper!(d));
        }

        // Restrict selection to only the current chart
        d3.select(containerRef.current)
          .selectAll('circle')
          .transition()
          .duration(200)
          .style('opacity', 0.4);

        // Highlight only the corresponding bubble (circle) associated with this label
        d3.select(containerRef.current)
          .selectAll('circle')
          .filter((circleData) => circleData === d) // Match the data object
          .transition()
          .duration(200)
          .style('opacity', 1);
      })
      .on('mouseleave', () => {
        if (tooltipRef.current) {
          tooltipRef.current.style.display = 'none';
          tooltipRef.current.style.opacity = '0';
          tooltipRef.current.style.borderColor = 'hsl(var(--border))';
        }

        d3.select(containerRef.current)
          .selectAll('circle')
          .transition()
          .duration(200)
          .style('opacity', 1);
      });

    ticked(); // apply the final node positions

    // 🔄 Aggiorna la posizione del testo in ticked()
    function ticked() {
      bubbles.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

      labels
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y)
        .selectAll('tspan')
        .attr('x', (d) => (d as any).x); // Aggiorna anche i tspans!
    }

    // Posizione della legenda
    const legendX = -30; // A destra del grafico
    const legendY = 20;

    // Seleziona il gruppo per la legenda
    const legend = svg
      .append('g')
      .attr('transform', `translate(${legendX}, ${legendY})`);

    // Creazione degli elementi della legenda
    const legendItems = legend
      .selectAll('.legend-item')
      .data(countiresList) // Usa l'array di paesi unici
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`); // Spaziatura verticale

    // Aggiungi i rettangoli colorati
    legendItems
      .append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d) => countryColorMap.get(d)!); // Colore del paese

    // Aggiungi i nomi dei paesi accanto ai colori
    legendItems
      .append('text')
      .attr('x', 20)
      .attr('y', 12)
      .text((d) => d)
      .style('font-size', '12px')
      .style('fill', '#000');
  }, [data, width, height]);

  return (
    <div className="relative" ref={containerRef}>
      <ChartScrollableWrapper>
        <svg ref={svgRef} />
      </ChartScrollableWrapper>
      <Tooltip ref={tooltipRef}>{tooltipContent}</Tooltip>
    </div>
  );
};

export default BubbleChart;
