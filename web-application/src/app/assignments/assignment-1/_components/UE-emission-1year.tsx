import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Data {
    country: string;
    code: string;
    year: string;
    emission: number;
}

const UEEmission1Year = () => {
    const [data, setData] = useState<Data[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>("2022"); // Set default year here
    const svgRef = useRef<SVGSVGElement | null>(null);

    const yearStart = 1957;
    const yearEnd = 2022;

    // Fetch data from the API when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            const csvData = await d3.csv(
                "/DataVis-Project/datasets/co-emissions-per-capita-ue.csv",
                (d) => ({
                    country: d.Entity,
                    code: d.Code,
                    year: d.Year,
                    emission: +d["Annual CO₂ emissions (per capita)"],
                }),
            );
            setData(csvData);
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Filter data based on the selected year
        const filteredData = data.filter((d) => d.year === selectedYear);

        if (filteredData.length === 0) return;

        filteredData.sort((a, b) => b.emission - a.emission);

        const width = 800;
        const height = 500;
        const margin = { top: 20, right: 0, bottom: 40, left: 30 };

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3
            .scaleBand()
            .domain(filteredData.map((d) => d.code))
            .range([0, width - margin.left - margin.right])
            .padding(0.2);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(filteredData, (d) => d.emission)!])
            .nice()
            .range([height - margin.top - margin.bottom, 0]);

        svg
            .append("g")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(x).tickSize(0))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg
            .append("g")
            .call(d3.axisLeft(y).tickFormat((d) => `${d} t`)) // Add unit measure
            .append("text")
            .attr("text-anchor", "end")
            .attr("fill", "black")
            .attr("font-weight", "bold")
            .attr("y", -10)
            .attr("x", -10);

        svg
            .selectAll("rect")
            .data(filteredData)
            .enter()
            .append("rect")
            .attr("x", (d) => x(d.code)!)
            .attr("y", (d) => y(d.emission))
            .attr("width", x.bandwidth())
            .attr(
                "height",
                (d) => height - margin.top - margin.bottom - y(d.emission),
            )
            .attr("fill", "#0F172A");

    }, [data, selectedYear]);

    const yearOptions = Array.from(
        { length: yearEnd - yearStart + 1 },
        (_, i) => `${yearStart + i}`,
    );

    return (
        <div className="flex relative justify-center items-center w-full">
            <div className="absolute top-0 right-0 sm:top-4 sm:right-4">
                <label>Selected Year: </label>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="py-1 px-2 ml-2 rounded-md border bg-background"
                >
                    {yearOptions.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <div className="overflow-x-auto h-full w-fit">
                <svg ref={svgRef} />
            </div>
            {/*             <p className="absolute -bottom-8 left-0 text-sm text-gray-500">
                <a className="font-medium text-gray-800">Data source: </a>
                Global Carbon Budget (2023); Population based on various sources (2023)
            </p> */}
            {/*             <div className="mt-4 block xs:hidden">
                <label>Selected Year: </label>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="py-1 px-2 ml-2 rounded-md border bg-background"
                >
                    {yearOptions.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div> */}
        </div>
    );
};

export default UEEmission1Year;
