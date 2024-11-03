import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Data {
    country: string;
    code: string;
    year: string;
    emission: number;
}

const UEEmissionDecade = () => {
    const [data, setData] = useState<Data[]>([]);
    const [selectedDecade, setSelectedDecade] = useState<number>(2012); // Default decade
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const csvData = await d3.csv("/DataVis-Project/datasets/co-emissions-per-capita-ue.csv", (d) => ({
                country: d.Entity,
                code: d.Code,
                year: d.Year,
                emission: +d["Annual CO₂ emissions (per capita)"],
            }));
            setData(csvData);
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Define the decade range
        const startYear = selectedDecade;
        const endYear = startYear + 9;

        // Filter data to only include years in the selected decade
        const decadeData = data.filter(d => +d.year >= startYear && +d.year <= endYear);

        // Group data by country and calculate the average emissions for each country
        const decadeAverages = Array.from(
            d3.group(decadeData, d => d.code),
            ([code, values]) => ({
                code,
                averageEmission: d3.mean(values, d => d.emission) || 0,
            })
        );

        // Sort countries by average emission in descending order
        decadeAverages.sort((a, b) => b.averageEmission - a.averageEmission);

        if (decadeAverages.length === 0) return;

        const width = 800;
        const height = 500;
        const margin = { top: 20, right: 30, bottom: 100, left: 90 };

        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3
            .scaleBand()
            .domain(decadeAverages.map(d => d.code))
            .range([0, width - margin.left - margin.right])
            .padding(0.2);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(decadeAverages, d => d.averageEmission)!])
            .nice()
            .range([height - margin.top - margin.bottom, 0]);

        svg
            .append('g')
            .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(x).tickSize(0))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        svg
            .append("g")
            .call(d3.axisLeft(y).tickFormat((d) => `${d} t`))
            .append("text")
            .attr("text-anchor", "end")
            .attr("fill", "black")
            .attr("font-weight", "bold")
            .attr("y", -10)
            .attr("x", -10);

        svg
            .selectAll('rect')
            .data(decadeAverages)
            .enter()
            .append('rect')
            .attr('x', d => x(d.code)!)
            .attr('y', d => y(d.averageEmission))
            .attr('width', x.bandwidth())
            .attr('height', d => height - margin.top - margin.bottom - y(d.averageEmission))
            .attr('fill', '#0F172A');
    }, [data, selectedDecade]);

    return (
        <div>
            <label>
                Select Decade:
                <input
                    type="number"
                    value={selectedDecade}
                    onChange={e => setSelectedDecade(parseInt(e.target.value))}
                    step={10} // Step by 10 for each decade
                />
            </label>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default UEEmissionDecade;
