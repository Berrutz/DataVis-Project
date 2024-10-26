import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

type DataRow = {
    country: string;
    year: number;
    emission: number;
};

export default function DataDisplay() {
    const [data, setData] = useState<DataRow[]>([]);
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        // Define async function to load and parse CSV
        const fetchData = async () => {
            const csvData = await d3.csv("/data.csv", (d) => {
                return {
                    country: d.country as string,
                    year: +d.value!,
                    emission: +d.emission!
                } as DataRow;
            });
            setData(csvData);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data.length === 0) return; // Avoid drawing until data is available

        const svg = d3.select(svgRef.current);
        const width = 500;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 50, left: 40 };

        svg.attr("width", width).attr("height", height);

        // Define xScale for country names
        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d.country))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        // Define yScale for emission values
        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.emission) as number])
            .range([height - margin.bottom, margin.top]);

        // Draw bars
        svg
            .selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", (d) => xScale(d.country)!)
            .attr("y", (d) => yScale(d.emission))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => height - margin.bottom - yScale(d.emission))
            .attr("fill", "teal");

        // Add labels to the bars
        svg
            .selectAll(".label")
            .data(data)
            .join("text")
            .attr("class", "label")
            .attr("x", (d) => xScale(d.country)! + xScale.bandwidth() / 2)
            .attr("y", (d) => yScale(d.emission) - 5)
            .attr("text-anchor", "middle")
            .text((d) => d.emission);

        // Create the x-axis
        svg
            .append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Create the y-axis
        svg
            .append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale));

    }, [data]);

    return <svg ref={svgRef}></svg>;
}