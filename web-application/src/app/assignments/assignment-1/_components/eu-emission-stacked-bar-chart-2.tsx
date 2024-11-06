import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';

interface EmissionData {
  entity: string;
  country: number;
  other: number;
}

const StackedBarChart2 = () => {
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
        .filter((d) => d.entity !== 'Others') // Ignore "Others" initially
        .sort((a, b) => b.emission - a.emission);

      // Get top 5 emitters
      const top5 = sortedData.slice(0, 5);

      // Find the "Others" row
      const othersData = csvData.find((d) => d.entity === 'Others');
      if (!othersData) {
        console.error("No 'Others' data found in the dataset.");
        return;
      }

      // Prepare structured data for each top emitter and the corresponding "Other" category
      const structuredData = top5.map((emitter) => {
        const otherSum =
          othersData.emission +
          top5
            .filter((d) => d.entity !== emitter.entity) // Exclude the current emitter
            .reduce((sum, d) => sum + d.emission, 0);

          // Uncomment if you want to check if the values are right
          //console.log(`${emitter.entity} Others Sum: ${otherSum}`);

        return {
          entity: emitter.entity,
          country: emitter.emission,
          other: otherSum
        };
      });

      // Calculate max "Other" sum and normalize data
      const maxSumOther = d3.max(structuredData, (d) => d.other);
      if (!maxSumOther) {
        console.error("No 'Others' data found in the dataset.");
        return;
      }

      const normalizedData = structuredData.map((d) => ({
        entity: d.entity,
        country: d.country / maxSumOther,
        other: d.other / maxSumOther
      }));

      // Uncomment if you want to check if the values are right
      //console.log('Normalized Data:', normalizedData);

      setData(normalizedData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data.length) return;

    const width = 800;
    const height = 400;
    const margin = { top: 50, bottom: 50 , right: 50, left: 100 , middle: 50 };

    const color = d3
    .scaleOrdinal()
    .domain(['Country', 'Other'])
    .range(['#1f77b4', '#ff7f0e']);

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // The height of the y axis depend of top and bottom margin
    const height_y_axis = height - margin.top - margin.bottom  

    // Create separate y scales for "Country" and "Other"

    const width_x_axis = ( (width - margin.right - margin.left) / 2) 
    const translation_on_x = (width - margin.left - margin.right) / 2 

    // Define the x-axis scale with a common domain for both charts

    const xCountry = d3
      .scaleLinear()
      .domain([0, 1])   // Since values are normalized by maxSumOther, the range is 0 to 1
      .range([0, width_x_axis ]);   

    const xOther = d3
    .scaleLinear()
    .domain([0, 1])   // Since values are normalized by maxSumOther, the range is 0 to 1
    .range([0, width_x_axis ]);   

    const yCountry = d3
      .scaleBand()
      .domain(data.map((d) => d.entity))
      .range([0, height_y_axis])                      
      .padding(0.2);
  
    const yOther = d3
      .scaleBand()
      .domain(data.map((d) => d.entity))
      .range([0, height_y_axis])                    // 300 quanto è alta la scala Y di Country    
      .padding(0.2);
    
    
    // Add "Country" bars on the left side
    svg
      .selectAll('.bar-country')
      .data(data)
      .join('rect')
      .attr('class', 'bar-country')
      .attr('y', (d) => yCountry(d.entity) ?? 0)
      .attr('x', 0)
      .attr('width', (d) => xCountry(d.country))
      .attr('height', yCountry.bandwidth())
      .attr('fill', color('Country') as string);

    // Add "Other" bars on the right side
    svg
      .selectAll('.bar-other')
      .data(data)
      .join('rect')
      .attr('class', 'bar-other')
      .attr('y', (d) => yCountry(d.entity) ?? 0)
      .attr('x', translation_on_x )
      .attr('width', (d) => xOther(d.other))
      .attr('height', yOther.bandwidth())
      .attr('fill', color('Other') as string);

    // Y-axis for "Country" (left side)
    svg.append('g').call(d3.axisLeft(yCountry));

    // Y-axis for "Other" (right side)
    svg
      .append('g')
      .attr(
        'transform',
        `translate(${
          translation_on_x
        }, 0)`
      ).call(d3.axisRight(yOther).tickFormat(() => '')); // This hides the labels

    // Position and add a label for "Country" above the left bar chart
    const position_country_label = (width / 6)
    const position_other_label = (width / 2 ) + margin.middle

    svg
      .append('text')
      .attr('x', position_country_label) // Position above the first chart
      .attr('y', -20) // Position above the chart area
      .attr('text-anchor', 'middle')
      .style('fill', color('Country') as string)
      .style('font-weight', 'bold')
      .text('Country');

    // Position and add a label for "Other" above the right bar chart
    svg
      .append('text')
      .attr('x', position_other_label) // Position above the second chart
      .attr('y', -20) // Position above the chart area
      .attr('text-anchor', 'middle')
      .style('fill', color('Other') as string)
      .style('font-weight', 'bold')
      .text('Other');


  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default StackedBarChart2;
