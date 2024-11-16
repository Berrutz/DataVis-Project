import { getStaticFile } from '@/utils/general';
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import DataSourceInfo from '../../_components/data-source';

interface CSVRow {
  country: string;
  year: number;
  emissionWithLandUsage: number;
}

function parseCSVRow(csvRawRow: d3.DSVRowString<string>): CSVRow {
  return {
    country: csvRawRow['country'],
    year: +csvRawRow['year'],
    emissionWithLandUsage: +csvRawRow['annual_emission_with_land_usage']
  };
}

async function fetchCSVData(): Promise<d3.DSVParsedArray<CSVRow>> {
  return await d3.csv(
    getStaticFile(
      '/datasets/assignment1/eu-countries-emission-including-land-usage.csv'
    ),
    parseCSVRow
  );
}

type YearRange = {
  from: number;
  to: number;
};

export default function EUEmissionWithLandUsage() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [possibleYearRanges, setPossibleYearRanges] = useState<
    YearRange[] | null
  >(null);
  const [currentYearRange, setCurrentYearRange] = useState<YearRange | null>(
    null
  );
  const [csvData, setCsvData] = useState<d3.DSVParsedArray<CSVRow> | null>(
    null
  );

  useEffect(() => {
    fetchCSVData().then((data) => {
      setCsvData(data);
      const maxYear = d3.max(data, (row) => row.year) || 0;
      const minYear = d3.min(data, (row) => row.year) || 0;
      const auxRanges: YearRange[] = [];
      for (var i = maxYear; i > minYear; i -= 10) {
        auxRanges.push({
          from: i - 10 > minYear ? i - 10 : minYear,
          to: i
        });
      }
      setPossibleYearRanges(auxRanges);
      setCurrentYearRange(auxRanges[0]);
    });
  }, []);

  useEffect(() => {
    if (!csvData || !currentYearRange) {
      return;
    }

    // Get the data in the years of interest
    var data = csvData.filter(
      (row) =>
        row.year >= currentYearRange.from && row.year <= currentYearRange.to
    );

    // Group by country and do the mean of the emissions
    // to get the first 10 coutries that have the highest emission.
    // Sort them in descending order by average emission
    // and take the first 10 countries name.
    var countriesOfInterest = Array.from(
      d3.group(data, (row) => row.country),
      ([country, groupedRow]) => ({
        country: country,
        avgEmission:
          d3.mean(groupedRow, (row) => row.emissionWithLandUsage) || 0 // Should never have 0
      })
    )
      .sort((a, b) => b.avgEmission - a.avgEmission)
      .slice(0, 10)
      .map((row) => row.country);

    // Get the data relative to the coutries of intereset discarding other coutries
    data = data.filter((row) => countriesOfInterest.includes(row.country));

    // Extract years and coutries as lists/arrays
    const years = [...new Set(data.map((row) => row.year))];
    const countries = [...new Set(data.map((row) => row.country))];

    // Create the heatmap
    var margin = { top: 40, right: 0, bottom: 80, left: 80 },
      width = 500 - margin.left - margin.right,
      height = 550 - margin.top - margin.bottom;

    // Clear the previous svg
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Build X scales and axis
    const x = d3.scaleBand<number>([0, width]).domain(years).padding(0.05);
    svg
      .append('g')
      .attr('transform', `translate(0,-20)`)
      .call(d3.axisBottom(x).tickSize(0))
      .select('.domain')
      .remove();

    // Build Y scales and axis:
    const y = d3.scaleBand().range([height, 0]).domain(countries).padding(0.05);
    svg.append('g').call(d3.axisLeft(y).tickSize(0)).select('.domain').remove();

    // Build color scale
    const colorScale = d3.scaleSequential(d3.interpolateReds).domain([
      d3.min(csvData, (row) => row.emissionWithLandUsage) || 0, // Should never be 0 here
      d3.max(csvData, (row) => row.emissionWithLandUsage) || 0 // Should never be 0 here
    ]);

    // add the squares
    svg
      .selectAll()
      .data(data, function (d) {
        return d?.year + ':' + d?.country;
      })
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return x(d.year) || 0;
      })
      .attr('y', function (d) {
        return y(d.country) || '';
      })
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', function (d) {
        return colorScale(d.emissionWithLandUsage);
      })
      .style('stroke-width', 4)
      .style('stroke', 'none')
      .style('opacity', 0.8)
      .on('mouseover', function (event, d) {
        const svgRect = svgRef.current?.getBoundingClientRect();
        const scrollOffset = svgRef.current?.parentElement?.scrollLeft || 0;
        const horizontalOffset = window.innerWidth < 640 ? 85 : 20;
        const verticalOffset = 35;

        if (tooltipRef.current) {
          tooltipRef.current.style.left = `${
            event.clientX -
            (svgRect?.left || 0) -
            horizontalOffset -
            scrollOffset
          }px`;
          tooltipRef.current.style.top = `${
            event.clientY - (svgRect?.top || 0) - verticalOffset
          }px`;
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.textContent = `${d.country}, ${d.year}: ${(
            d.emissionWithLandUsage / 1e6
          ).toFixed(2)} Mt`;
        }
        d3.select(event.target)
          .style('stroke', 'black')
          .style('stroke-width', '2');
      })
      .on('mouseleave', function () {
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '0';
        }
        d3.select(this).style('stroke', 'none');
      });

    // ********************Legend***********************
    const legendWidth = width;
    const legendHeight = 30;
    const legendMargin = { top: 10, right: 80, bottom: 20, left: 80 };

    const legendSvg = d3
      .select(svgRef.current)
      .append('g')
      .attr(
        'transform',
        `translate(${margin.left}, ${height + margin.top + legendMargin.top})`
      );

    const legendGradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');

    legendGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', colorScale(colorScale.domain()[0]));

    legendGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', colorScale(colorScale.domain()[1]));

    legendSvg
      .append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)');

    const legendScale = d3
      .scaleLinear()
      .domain(colorScale.domain().map((d) => d / 1e6))
      .range([0, legendWidth]);

    legendSvg
      .append('g')
      .attr('transform', `translate(0, ${legendHeight})`)
      .call(
        d3
          .axisBottom(legendScale)
          .ticks(6)
          .tickFormat((d) => `${d} Mt`)
      )
      .select('.domain')
      .remove();
  }, [currentYearRange, setCurrentYearRange, csvData, setCsvData, svgRef]);

  if (!csvData || !currentYearRange || !possibleYearRanges)
    return <h1>Loading ...</h1>;

  return (
    <div className="flex flex-col relative justify-center items-center p-3 w-full">
      <div className="flex relative justify-center items-center w-full">
        <div className="overflow-x-auto h-full w-fit">
          <svg ref={svgRef} />
        </div>
        <div
          ref={tooltipRef}
          className="absolute px-2 py-1 text-sm bg-white border border-gray-400 rounded shadow opacity-0 pointer-events-none"
        ></div>
      </div>
      <DataSourceInfo>
        Global Carbon Budget (2023) - with major processing by Our World in Data
      </DataSourceInfo>
      <div className="inline-flex gap-3 justify-center items-center">
        <label>Select Decade: </label>
        <select
          value={`${currentYearRange.from}-${currentYearRange.to}`}
          onChange={(selection) => {
            const splitYearSelection = selection.target.value.split('-');
            setCurrentYearRange({
              from: +splitYearSelection[0],
              to: +splitYearSelection[1]
            });
          }}
          className="py-1 px-2 ml-2 rounded-md border bg-background"
        >
          {possibleYearRanges.map((range) => (
            <option
              key={`${range.from}-${range.to}`}
              value={`${range.from}-${range.to}`}
            >
              {`${range.from}-${range.to}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
