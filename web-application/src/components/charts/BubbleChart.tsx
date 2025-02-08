import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

// Interfaccia per le proprietà del componente
interface BubbleChartProps {
  bubble_percentage:number[];
  bubble_dimension: number[]; // Dimension of the bubbles
  bubble_color: string[]; 
  bubble_number: string[];
  width: number; 
  height: number; 
  colorInterpolator: (t: number) => string; 
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
}

const BubbleChart: React.FC<BubbleChartProps> = (
  { 
    bubble_percentage,
    bubble_dimension, 
    bubble_color, 
    bubble_number, 
    width, 
    height, 
    colorInterpolator,
    mt,
    mr,
    mb,
    ml
  }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || bubble_dimension.length === 0 || bubble_color.length === 0 || bubble_number.length === 0 ) return;


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

    // Creazione della mappa colori
    const uniqueCountries = Array.from(new Set(bubble_color)); // Ottieni i paesi unici
    const colorMap = uniqueCountries.reduce((acc, country, i) => {
      acc[country] = colorInterpolator(i / uniqueCountries.length); // Associa un colore fisso
      return acc;
    }, {} as Record<string, string>);


    // Creazione di un dataset con i dati normalizzati
    const centerX = chartWidth / 2;
    const centerY = chartHeight / 2;
    const dataset = bubble_dimension.map((dim, i) => ({
      radius: dim, // Grandezza della bolla
      color: colorMap[bubble_color[i]], // Colore della bolla
      year: bubble_number[i], // Anno della bolla
      percentage : bubble_percentage[i],
      x: centerX, // Posizione iniziale casuale (necessario per D3)
      y: centerY, // Posizione iniziale casuale
    }));

    console.log("dataset: ",dataset)

    // Definizione del layout a forza
    const distance = 3
    const strenght = -10
    const simulation = d3.forceSimulation(dataset as d3.SimulationNodeDatum[])
      .force("charge", d3.forceManyBody().strength(strenght)) // Controlla la dispersione
      .force("center", d3.forceCenter(centerX, centerY))
      .force("collision", d3.forceCollide().radius(d => (d as any).radius + distance)) // +3 per un po' di spazio
      .force("customMoveX", d3.forceX().x(d => {
        const moveX = Math.random() ; // Movimento più grande orizzontale
        
        var xFinalPos = (d as any).x + moveX + (d as any).radius;
        if(xFinalPos > chartWidth){
          xFinalPos = chartWidth - (d as any).radius; 
        }
        return xFinalPos ;

      }))
      .force("customMoveY", d3.forceY().y(d => {
        const moveY = Math.random() ; // Movimento verticale minore
        var xFinalPos = (d as any).x + moveY + (d as any).radius;
        if(xFinalPos > chartHeight){
          xFinalPos = chartHeight - (d as any).radius; 
        }
        return xFinalPos ;
      }))
      .on("tick", ticked);

      const group = svg.append("g").attr("transform", `translate(0,0)`);

      // Crea le bolle
      const bubbles = group.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => d.color); // Usa il colore fisso del paese
  
      const labels = group.selectAll("text")
      .data(dataset)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .style("fill", "white")
      .style("font-size", "10px")
      .each(function(d) {
        const text = d3.select(this);

        // Calcola le dimensioni del testo in base al raggio
        const yearFontSize = Math.max(d.radius * 0.4, 10);  // Minimo 10px, massimo in proporzione
        const percentageFontSize = Math.max(d.radius * 0.3, 8); // Minimo 8px
    
        // Aggiunge la prima riga (anno)
        text.append("tspan")
          .attr("x", d.x) // Deve essere aggiornato con la simulazione
          .attr("dy", "-0.4em") // Sposta leggermente sopra il centro
          .style("font-size", `${yearFontSize}px`)
          .style("font-weight", "bold")  // 🔥 TESTO IN GRASSETTO
          .text(d.year);
    
        // Aggiunge la seconda riga (percentuale)
        text.append("tspan")
          .attr("x", d.x) // Deve essere aggiornato con la simulazione
          .attr("dy", "1.2em") // Sposta sotto il primo testo
          .style("font-size", `${percentageFontSize}px`)
          .text(`${Math.trunc(d.percentage)}%`);
      });

        // 🔄 Aggiorna la posizione del testo in ticked()
        function ticked() {
          bubbles
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

          labels
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .selectAll("tspan")
            .attr("x", d => (d as any).x); // Aggiorna anche i tspans!
        }

        // Posizione della legenda
        const legendX = -30; // A destra del grafico
        const legendY = 20;

        // Seleziona il gruppo per la legenda
        const legend = svg.append("g")
          .attr("transform", `translate(${legendX}, ${legendY})`);

        // Creazione degli elementi della legenda
        const legendItems = legend.selectAll(".legend-item")
          .data(uniqueCountries) // Usa l'array di paesi unici
          .enter()
          .append("g")
          .attr("class", "legend-item")
          .attr("transform", (d, i) => `translate(0, ${i * 20})`); // Spaziatura verticale

        // Aggiungi i rettangoli colorati
        legendItems.append("rect")
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", d => colorMap[d]); // Colore del paese

        // Aggiungi i nomi dei paesi accanto ai colori
        legendItems.append("text")
          .attr("x", 20)
          .attr("y", 12)
          .text(d => d)
          .style("font-size", "12px")
          .style("fill", "#000");

  }, [bubble_dimension, bubble_color, bubble_number, width, height, colorInterpolator]);

  return <svg ref={svgRef}></svg>

};

export default BubbleChart;
