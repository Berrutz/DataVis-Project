import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';

interface EmissionData {
  entity: string;
  country: number;
  other: number;
}

const StackedBarChart3 = () => {
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
        .filter((d) => d.entity !== 'Others')
        .sort((a, b) => b.emission - a.emission);

      // Get top 5 emitters
      const top5 = sortedData.slice(0, 5);

      // Find the "Others" row
      const othersData = csvData.find((d) => d.entity === 'Others');
      if (!othersData) {
        console.error("No 'Others' data found in the dataset.");
        return;
      }

      // Prepare structured data with percentages
      const structuredData = top5.map(
        (emitter) => {

        const otherSum = othersData.emission +
          top5.filter((d) => d.entity !== emitter.entity) .reduce((sum, d) => sum + d.emission, 0);

        const totalEmission = emitter.emission + otherSum;

        return {
          entity: emitter.entity,
          country: emitter.emission / totalEmission,
          other: otherSum / totalEmission
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
    const margin = { top: 60, right: 10, bottom: 40, left: 65 };

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Create y scale for the entities
    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.entity))
      .range([0, height - margin.top - margin.bottom])
      .padding(0.2);

    // Define the x-axis scale with a domain from 0 to 1 for percentages
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, width - margin.left - margin.right]);

    const color = d3.scaleOrdinal().domain(['Country', 'Other']).range(['#1f77b4', '#ff7f0e']);

    // Create groups for each entity
    const barGroups = svg
      .selectAll('.bar-group')
      .data(data)
      .join('g')
      .attr('transform', (d) => `translate(0, ${yScale(d.entity)})`);

    // Add "Country" bars (left part of each stacked bar)
    barGroups
      .append('rect')
      .attr('class', 'bar-country')
      .attr('x', 0)
      .attr('width', (d) => xScale(d.country))
      .attr('height', yScale.bandwidth())
      .attr('fill', color('Country') as string);

    // Add "Other" bars (right part of each stacked bar, positioned after the "Country" bar)
    barGroups
      .append('rect')
      .attr('class', 'bar-other')
      .attr('x', (d) => xScale(d.country))
      .attr('width', (d) => xScale(d.other))
      .attr('height', yScale.bandwidth())
      .attr('fill', color('Other') as string);

    // X-axis for percentages
    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format(".0%")));

    // Y-axis for entity names
    svg.append('g').call(d3.axisLeft(yScale));

    // Add legend
    svg
      .append('text')
      .attr('x', 0)
      .attr('y', -10)
      .attr('fill', color('Country') as string)
      .text('Country');
      
    svg
      .append('text')
      .attr('x', xScale(0.5))
      .attr('y', -10)
      .attr('fill', color('Other') as string)
      .text('Other');
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default StackedBarChart3;
