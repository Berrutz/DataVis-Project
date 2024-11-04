import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';

interface EmissionData {
  entity: string;
  country: number;
  other: number;
}

const StackedBarChart = () => {
  const [data, setData] = useState<EmissionData[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);

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

      // Trova la riga "Others"
      const othersData = csvData.find((d) => d.entity === 'Others');
      if (!othersData) {
        console.error("No 'Others' data found in the dataset.");
        return;
      }

      // Calcola i dati strutturati per ogni paese
      const structuredData = top5.map((emitter) => {
        // Calcola "Other" come somma della riga "Others" e delle altre 4 nazioni (escludendo quella corrente)
        const otherSum =
          othersData.emission +
          top5
            .filter((d) => d.entity !== emitter.entity) // Esclude il paese corrente
            .reduce((sum, d) => sum + d.emission, 0);

        // Stampa il valore di otherSum per il paese corrente
        //console.log(`${emitter.entity} Others Sum: ${otherSum}`);

        return {
          entity: emitter.entity,
          country: emitter.emission,
          other: otherSum
        };
      });

      setData(structuredData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data.length) return;

    const width = 800;
    const height = 400;
    const margin = { top: 60, right: 40, bottom: 40, left: 120 };

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
      .domain(['Other', 'Country'])
      .range(['#1f77b4', '#ff7f0e']);

    // Stack generator for the "Country" and "Other" categories
    const stackGenerator = d3.stack().keys(['entity', 'country', 'other']);

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
      .attr('height', y.bandwidth());

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

  return <svg ref={svgRef}></svg>;
};

export default StackedBarChart;
