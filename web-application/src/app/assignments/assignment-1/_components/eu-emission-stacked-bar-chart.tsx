import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';

interface StackedData {
  entity: string;
  country: number;
  other: number;
}

const StackedBarChart = () => {
  const [data, setData] = useState<StackedData[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Load and prepare the data
    const fetchData = async () => {
      const csvData = await d3.csv(
        getStaticFile(
          '/datasets/assignment1/top5-emitter-and-other-2022-eu.csv'
        ),
        (d) => ({
          entity: d.Entity,
          code: d.Code,
          year: +d.Year,
          emission: +d['Annual CO₂ emissions (per capita)']
        })
      );

      // Sort data to get top 5 emitters
      const sortedData = csvData
        .filter((d) => d.entity !== 'Others') // Ignore "Others"
        .sort((a, b) => b.emission - a.emission);

      const top5 = sortedData.slice(0, 5);

      // Find row "Others"
      const othersData = csvData.find((d) => d.entity === 'Others');
      if (!othersData) {
        console.error("No 'Others' data found in the dataset.");
        return;
      }

      // Calcola i dati strutturati per ogni paese
      const stackedData = top5.map((emitter) => {
        // Calcola "Other" come somma della riga "Others" e delle altre 4 nazioni (escludendo quella corrente)
        const otherSum =
          othersData.emission +
          top5
            .filter((d) => d.entity !== emitter.entity) // Esclude il paese corrente
            .reduce((sum, d) => sum + d.emission, 0);

        return {
          entity: emitter.entity,
          country: emitter.emission,
          other: otherSum
        };
      });

      setData(stackedData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data.length) return;

    const width = 800;
    const height = 400;
    const margin = { top: 60, right: 10, bottom: 40, left: 65 };

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.entity))
      .range([0, height - margin.top - margin.bottom])
      .padding(0.2);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => (d.country ?? 0) + (d.other ?? 0))!])
      .range([0, width - margin.left - margin.right]);

    const color = d3
      .scaleOrdinal()
      .domain(['Country', 'Other'])
      .range(['#1f77b4', '#ff7f0e']);

    // Stack generator for the "Country" and "Other" categories
    const stackGenerator = d3.stack<StackedData>().keys(['country', 'other']);

    const stackedData = stackGenerator(data);

    // Add bars
    svg
      .selectAll('g.layer')
      .data(stackedData)
      .join('g')
      .attr('fill', (d) => color(d.key) as string)
      .selectAll('rect')
      .data((d) => d)
      .join('rect')
      .attr('y', (d) => y(d.data.entity) ?? 0)
      .attr('x', (d) => x(d[0]) ?? 0)
      .attr('width', (d) => x(d[1]) - x(d[0])!)
      .attr('height', y.bandwidth())
      .on('mouseover', function (event, d) {
        if (tooltipRef.current) {
          // Get bounding box of SVG to calculate relative positioning
          const svgRect = svgRef.current?.getBoundingClientRect();
          const horizontalOffset = 15;
          const verticalOffset = 30;

          // Calculate the position of the tooltip relative to the SVG
          const tooltipX =
            event.clientX - (svgRect?.left || 0) - horizontalOffset;
          const tooltipY = event.clientY - (svgRect?.top || 0) - verticalOffset;

          tooltipRef.current.style.left = `${tooltipX}px`;
          tooltipRef.current.style.top = `${tooltipY}px`;
          tooltipRef.current.style.opacity = '1';

          tooltipRef.current.textContent = `${(d[1] - d[0]).toFixed(
            2
          )} t per capita`;
        }

        // Highlight the hovered bar
        d3.selectAll('rect').transition().duration(200).style('opacity', 0.4);

        d3.select(event.target as SVGRectElement)
          .transition()
          .duration(200)
          .style('opacity', 1);
      })
      .on('mouseleave', function () {
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '0';
        }

        // Reset opacity for all bars
        d3.selectAll('rect').transition().duration(200).style('opacity', 1);
      });
    // X-axis
    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5))
      .append('text')
      .attr('x', (width - margin.left - margin.right) / 2)
      .attr('y', 30)
      .attr('fill', 'black')
      .text('CO₂ Emissions (t per capita)');

    // Y-axis
    svg.append('g').call(d3.axisLeft(y));

    // Legend
    const legend = svg.append('g').attr('transform', `translate(0, -50)`); // Posiziona la legenda sopra l'asse x

    // Position and add a label for "Country" above the left bar chart
    svg
      .append('text')
      .attr('x', margin.bottom / 2.0)
      .attr('y', -20) // Position above the chart area
      .attr('text-anchor', 'middle')
      .style('fill', color('Country') as string)
      .style('font-weight', 'bold')
      .text('Country');

    // Position and add a label for "Other" above the right bar chart
    svg
      .append('text')
      .attr('x', 2.5 * margin.left)
      .attr('y', -20) // Position above the chart area
      .attr('text-anchor', 'middle')
      .style('fill', color('Other') as string)
      .style('font-weight', 'bold')
      .text('Other');
  }, [data]);

  return (
    <div className="relative">
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        className="absolute px-2 py-1 text-sm bg-white border-solid border-2 border-primary rounded opacity-0 pointer-events-none"
      ></div>
    </div>
  );
};

export default StackedBarChart;
