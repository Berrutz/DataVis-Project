import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Data {
    country: string;
    code: string;
    year: string;
    emission: number;
}

const StackedBarChart2 = () => {
    const [data, setData] = useState<Data[]>([]);
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        // Load and prepare the data
        const fetchData = async () => {
            const csvData = await d3.csv("/DataVis-Project/datasets/top5-emitter-and-other-2022-eu.csv", d => ({
                entity: d.Entity,
                code: d.Code,
                year: +d.Year,
                emission: +d["Annual CO₂ emissions (per capita)"]
            }));
            
            // Sort data to get top 5 emitters
            const sortedData = csvData
                .filter(d => d.entity !== "Others") // Ignore "Others" initially
                .sort((a, b) => b.emission - a.emission);

            // Get top 5 emitters
            const top5 = sortedData.slice(0, 5);

            // Find the "Others" row
            const othersData = csvData.find(d => d.entity === "Others");
            if (!othersData) {
                console.error("No 'Others' data found in the dataset.");
                return;
            }

            // Prepare structured data for each top emitter and the corresponding "Other" category
            const structuredData = top5.map(emitter => {

                const otherSum = othersData.emission + top5
                    .filter(d => d.entity !== emitter.entity) // Exclude the current emitter
                    .reduce((sum, d) => sum + d.emission, 0);
                
                return {
                    entity: emitter.entity,
                    country: emitter.emission,
                    other: otherSum
                };
            });

            // Calculate max "Other" sum and normalize data
            const maxSumOther = d3.max(structuredData, d => d.other);
            if (!maxSumOther) {
                console.error("No 'Others' data found in the dataset.");
                return;
            }

            const normalizedData = structuredData.map(d => ({
                entity: d.entity,
                country: d.country / maxSumOther,
                other: d.other / maxSumOther,
            }));

            setData(normalizedData);

        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!data.length) return;

        const width = 800;
        const height = 400;
        const margin = { top: 60, right: 40, bottom: 40, left: 120, middle: 50 };

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Create separate y scales for "Country" and "Other"
        const yCountry = d3.scaleBand()
            .domain(data.map(d => d.entity))
            .range([0, height - margin.top - margin.bottom])
            .padding(0.2);

        const yOther = d3.scaleBand()
            .domain(data.map(d => d.entity))
            .range([0, height - margin.top - margin.bottom])
            .padding(0.2);

        /*const xCountry = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.country)])
            .range([0, (width - margin.left - margin.right - margin.middle) / 2]);*/

        /*const xOther = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.other)])
            .range([0, (width - margin.left - margin.right - margin.middle) / 2]);*/

        // Define the x-axis scale with a common domain for both charts
        const x = d3.scaleLinear()
        .domain([0, 1])  // Since values are normalized by maxSumOther, the range is 0 to 1
        .range([0, (width - margin.left - margin.right) / 2 - margin.middle / 2]);


        const color = d3.scaleOrdinal()
            .domain(["Country", "Other"])
            .range(["#1f77b4", "#ff7f0e"]);

        // Add "Country" bars on the left side
        svg.selectAll(".bar-country")
            .data(data)
            .join("rect")
            .attr("class", "bar-country")
            .attr("y", d => yCountry(d.entity))
            .attr("x", 0)
            .attr("width", d => x(d.country))
            .attr("height", yCountry.bandwidth())
            .attr("fill", color("Country"));

        // Add "Other" bars on the right side
        svg.selectAll(".bar-other")
            .data(data)
            .join("rect")
            .attr("class", "bar-other")
            .attr("y", d => yOther(d.entity))
            .attr("x", (width - margin.left - margin.right) / 2 + margin.middle)
            .attr("width", d => x(d.other))
            .attr("height", yOther.bandwidth())
            .attr("fill", color("Other"));

        // Add X-axis for "Country" (left side)
        /*svg.append("g")
            .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(xCountry).ticks(5))
            .append("text")
            .attr("x", (width - margin.left - margin.right - margin.middle) / 4)
            .attr("y", 30)
            .attr("fill", "black")
            .text("CO₂ Emissions (Country)");*/

        // Add X-axis for "Other" (right side)
        /*svg.append("g")
            .attr("transform", `translate(${(width - margin.left - margin.right) / 2 + margin.middle}, ${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(xOther).ticks(5))
            .append("text")
            .attr("x", (width - margin.left - margin.right - margin.middle) / 4)
            .attr("y", 30)
            .attr("fill", "black")
            .text("CO₂ Emissions (Other)");*/

        // Y-axis for "Country" (left side)
        svg.append("g")
            .call(d3.axisLeft(yCountry));

        // Y-axis for "Other" (right side)
        svg.append("g")
        .attr("transform", `translate(${(width - margin.left - margin.right) / 2 + margin.middle}, 0)`)
        .call(d3.axisRight(yOther).tickFormat(() => ""));  // This hides the labels

        // Legend
        const legend = svg.append("g")
            .attr("transform", `translate(0, -50)`); // Position the legend above the x-axis

        // Position and add a label for "Country" above the left bar chart
        svg.append("text")
        .attr("x", (width - margin.left - margin.right) / 4)  // Position above the first chart
        .attr("y", -20)  // Position above the chart area
        .attr("text-anchor", "middle")
        .style("fill", color("Country"))
        .style("font-weight", "bold")
        .text("Country");

        // Position and add a label for "Other" above the right bar chart
        svg.append("text")
        .attr("x", (3 * (width - margin.left - margin.right)) / 4 + margin.middle)  // Position above the second chart
        .attr("y", -20)  // Position above the chart area
        .attr("text-anchor", "middle")
        .style("fill", color("Other"))
        .style("font-weight", "bold")
        .text("Other");

    }, [data]);

    return <svg ref={svgRef}></svg>;
};

export default StackedBarChart2;
