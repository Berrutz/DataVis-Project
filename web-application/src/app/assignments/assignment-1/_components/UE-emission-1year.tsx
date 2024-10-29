import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Data {
    country: string;
    year: string;
    emission: number;
}

const UEEmission1Year = () => {
    const [data, setData] = useState<Data[]>([]);
    const svgRef = useRef<SVGSVGElement | null>(null);

    // Fetch data from the API when the component mounts
    useEffect(() => {
        const fetchData = async () => {

            // Transform data (parse emission as number)
            const csvData = await d3.csv("/DataVis-Project/datasets/co-emissions-per-capita.csv", (d) => ({
                country: d.Entity,
                year: d.Year,
                emission: +d["Annual CO₂ emissions (per capita)"],
            }));

            setData(csvData);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data.length === 0) return;

        // Set up chart dimensions
        const width = 800;
        const height = 500;
        const margin = { top: 20, right: 30, bottom: 40, left: 90 };

        // Clear existing content
        d3.select(svgRef.current).selectAll('*').remove();

        // Set up the SVG canvas
        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Set up scales
        const x = d3
            .scaleBand()
            .domain(data.map(d => d.country))
            .range([0, width - margin.left - margin.right])
            .padding(0.2);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.emission)!])
            .nice()
            .range([height - margin.top - margin.bottom, 0]);

        // X axis
        svg
            .append('g')
            .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(x).tickSize(0))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        // Y axis
        svg.append('g').call(d3.axisLeft(y));

        // Bars
        svg
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', d => x(d.country)!)
            .attr('y', d => y(d.emission))
            .attr('width', x.bandwidth())
            .attr('height', d => height - margin.top - margin.bottom - y(d.emission))
            .attr('fill', '#69b3a2');
    }, [data]);

    return <svg ref={svgRef}></svg>;
};

export default UEEmission1Year;