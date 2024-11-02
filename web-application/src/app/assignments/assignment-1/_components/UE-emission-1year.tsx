import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Data {
    country: string;
    year: string;
    emission: number;
}

const UEEmission1Year = () => {
    const [data, setData] = useState<Data[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>("2020"); // Set default year here
    const svgRef = useRef<SVGSVGElement | null>(null);

    // Fetch data from the API when the component mounts
    useEffect(() => {
        const fetchData = async () => {
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
        // Filter data based on the selected year
        const filteredData = data.filter(d => d.year === selectedYear);

        if (filteredData.length === 0) return;

        const width = 800;
        const height = 500;
        const margin = { top: 20, right: 30, bottom: 40, left: 90 };

        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3
            .scaleBand()
            .domain(filteredData.map(d => d.country))
            .range([0, width - margin.left - margin.right])
            .padding(0.2);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(filteredData, d => d.emission)!])
            .nice()
            .range([height - margin.top - margin.bottom, 0]);

        svg
            .append('g')
            .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(x).tickSize(0))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        svg.append('g').call(d3.axisLeft(y));

        svg
            .selectAll('rect')
            .data(filteredData)
            .enter()
            .append('rect')
            .attr('x', d => x(d.country)!)
            .attr('y', d => y(d.emission))
            .attr('width', x.bandwidth())
            .attr('height', d => height - margin.top - margin.bottom - y(d.emission))
            .attr('fill', '#69b3a2');
    }, [data, selectedYear]);

    return (
        <div>
            <label>
                Select Year:
                <input
                    type="number"
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                />
            </label>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default UEEmission1Year;