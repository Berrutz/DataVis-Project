import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Tooltip from '../../_components/tooltip';
import DataSourceInfo from '../../_components/data-source';
import ShowMoreChartDetailsModalDialog from '../../_components/show-more-chart-details-modal-dialog';
import { getStaticFile } from '@/utils/general';
import {
  dxAdjustments,
  getAngleDeg,
  monthNames,
  shortMonthNames
} from '../lib/utils';
import { Data, MonthData } from '../lib/interfaces';
import { handleMouseMove, handleMouseOut } from '../lib/radar-chart';

interface RadarChartProps {
  newWidth: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ newWidth }) => {
  const [minData, setMinData] = useState<Data[]>([]);
  const [maxData, setMaxData] = useState<Data[]>([]);
  const [avgData, setAvgData] = useState<Data[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [selectedCountryCode, setSelectedCountryCode] =
    useState<string>('Alabama');
  const svgRef = useRef<SVGSVGElement | null>(null);

  const maxColor = '#ff851a';
  const minColor = '#b35300';
  const avgColor = '#ffd000';

  useEffect(() => {
    const fetchData = async () => {
      const minCsvData: Data[] = await d3.csv(
        getStaticFile('/datasets/assignment4/Min.csv'),
        (d: any) => ({
          year: +d.year,
          month: +d.month,
          value: d.value,
          countryName: d.country
        })
      );
      setMinData(minCsvData);

      const maxCsvData: Data[] = await d3.csv(
        getStaticFile('/datasets/assignment4/Max.csv'),
        (d: any) => ({
          year: +d.year,
          month: +d.month,
          value: d.value,
          countryName: d.country
        })
      );
      setMaxData(maxCsvData);

      const avgCsvData: Data[] = await d3.csv(
        getStaticFile('/datasets/assignment4/Avg.csv'),
        (d: any) => ({
          year: +d.year,
          month: +d.month,
          value: d.value,
          countryName: d.country
        })
      );
      setAvgData(avgCsvData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!minData.length || !maxData.length || !avgData.length) return;

    const width = newWidth || 500;
    const height = 500;
    const radius = Math.min(width, height) / 2 - 40;
    const innerWidth = width;
    const innerHeight = height;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const filteredMinData = minData.filter(
      (d) => d.year === selectedYear && d.countryName === selectedCountryCode
    );
    const filteredMaxData = maxData.filter(
      (d) => d.year === selectedYear && d.countryName === selectedCountryCode
    );
    const filteredAvgData = avgData.filter(
      (d) => d.year === selectedYear && d.countryName === selectedCountryCode
    );

    const allData = [filteredMinData, filteredMaxData, filteredAvgData];

    const monthDataMap: Map<number, MonthData> = new Map();

    allData.forEach((data, i) => {
      data.forEach((d) => {
        const month = d.month;
        if (!monthDataMap.has(month)) {
          monthDataMap.set(month, { min: null, max: null, avg: null });
        }
        const currentMonthData = monthDataMap.get(month);
        if (i === 0) currentMonthData!.min = d.value;
        if (i === 1) currentMonthData!.max = d.value;
        if (i === 2) currentMonthData!.avg = d.value;
      });
    });

    const chartGroup = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const angleScale = d3
      .scaleBand()
      .domain(d3.range(12).map(String)) // 12 months, 0 to 11
      .range([0, 2 * Math.PI]);

    const fixedMaxValue = 110; // Maximum value on the radial axis (fixed)
    const radiusScale = d3
      .scaleLinear()
      .domain([0, fixedMaxValue]) // Use the fixed max value
      .range([0, radius]);

    // Implementation for for radiusScale scaled on the max value of the data
    /*     const radiusScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          [...filteredMinData, ...filteredMaxData, ...filteredAvgData],
          (d) => d.value
        ) || 0
      ])
      .range([0, radius]); */

    // Draw radial grid lines
    chartGroup
      .selectAll('.grid-circle')
      .data(radiusScale.ticks(5))
      .enter()
      .append('circle')
      .attr('r', (d) => radiusScale(d))
      .attr('fill', 'none')
      .attr('stroke', '#ccc');

    // Draw axes
    chartGroup
      .selectAll('.axis-line')
      .data(d3.range(12)) // 12 months
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr(
        'x2',
        (d) => radius * Math.cos(angleScale(d.toString())! - Math.PI / 2)
      )
      .attr(
        'y2',
        (d) => radius * Math.sin(angleScale(d.toString())! - Math.PI / 2)
      )
      .attr('stroke', 'gray');

    // Add labels at the end of the axis
    chartGroup
      .selectAll('.axis-label')
      .data(d3.range(12))
      .enter()
      .append('text')
      .attr(
        'x',
        (d) => radius * Math.cos(angleScale(d.toString())! - Math.PI / 2)
      )
      .attr(
        'y',
        (d) => radius * Math.sin(angleScale(d.toString())! - Math.PI / 2)
      )
      .attr('text-anchor', 'middle')
      .text((d) => {
        const monthName = shortMonthNames[d] || 'Unknown'; // Fallback for safety
        return `${monthName}`;
      })
      .attr('dy', (d) => {
        const angleDeg = getAngleDeg(angleScale(d.toString())!);

        // Adjust 'dy' based on the angle (above or below the axis)
        if (angleDeg > 0 && angleDeg < 180) {
          return '1.1em';
        } else if (angleDeg == 0 || angleDeg == 180) {
          return '0.3em';
        } else {
          return '-0.4em';
        }
      })
      .attr('dx', (d) => {
        const angleDeg = Math.round(getAngleDeg(angleScale(d.toString())!));
        // Use the lookup object for 'dx' adjustments or return the default value
        return dxAdjustments[angleDeg.toString()] || '0em'; // Default case
      })
      .on('mousemove', function (event, d) {
        handleMouseMove(
          event,
          d,
          monthDataMap,
          tooltip,
          svgRef,
          innerWidth,
          innerHeight,
          colors,
          selectedYear,
          monthNames,
          labels
        );
      })
      .on('mouseout', function () {
        handleMouseOut(tooltip);
      });

    const line = d3
      .lineRadial<Data>()
      .angle((d) => angleScale((d.month - 1).toString())!)
      .radius((d) => radiusScale(d.value));

    const colors = [minColor, maxColor, avgColor];
    const labels = ['Min', 'Max', 'Avg'];

    allData.forEach((data, i) => {
      chartGroup
        .append('path')
        .datum(data)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', colors[i])
        .attr('stroke-width', 2);
    });

    // Create tooltip
    const tooltip = d3.select('#tooltip');

    // Add points
    allData.forEach((data, i) => {
      chartGroup
        .selectAll(`.point-${i}`)
        .data(data)
        .enter()
        .append('circle')
        .attr(
          'cx',
          (d) =>
            radiusScale(d.value) *
            Math.cos(angleScale((d.month - 1).toString())! - Math.PI / 2)
        )
        .attr(
          'cy',
          (d) =>
            radiusScale(d.value) *
            Math.sin(angleScale((d.month - 1).toString())! - Math.PI / 2)
        )
        .attr('r', 4)
        .attr('fill', colors[i])
        .on('mousemove', function (event, d) {
          handleMouseMove(
            event,
            d,
            monthDataMap,
            tooltip,
            svgRef,
            innerWidth,
            innerHeight,
            colors,
            selectedYear,
            monthNames,
            labels
          );
        })
        .on('mouseout', function () {
          handleMouseOut(tooltip);
        });
    });

    const radiantLabels = chartGroup
      .selectAll('.grid-label')
      .data(radiusScale.ticks(5).filter((d) => d !== 0))
      .enter()
      .append('g') // Group each label with its background
      .attr('transform', (d) => `translate(5, ${-radiusScale(d)})`); // Set the position for both text and rect

    radiantLabels
      .append('rect')
      .attr('x', 0) // Small padding on the left
      .attr('y', -8) // Shift rect above the text
      .attr('width', (d) => `${(d.toString().length + 2) * 7}px`) // Dynamic width based on text length
      .attr('height', 15) // Slightly taller than the font size
      .attr('fill', 'hsl(var(--background))'); // Background color for the text

    radiantLabels
      .append('text')
      .attr('x', 0) // Keep the same x offset for text
      .attr('dy', '0.35em') // Center the text vertically
      .attr('fill', '#666')
      .style('font-size', '0.8rem')
      .style('font-weight', '800')
      .text((d) => `${d}°F`);

    /*     chartGroup
      .selectAll('.grid-label')
      .data(radiusScale.ticks(5))
      .enter()
      .append('text')
      .attr('x', 5) // Offset to position the text just to the right of the circles
      .attr('y', (d) => -radiusScale(d)) // Position the text relative to the circle radius
      .attr('dy', '0.35em') // Vertical alignment
      .attr('fill', '#666')
      .style('font-size', '0.8rem')
      .style('font-weight', '800')
      .text((d) => `${d}°F`); // Add °F unit to each label */

    // Legend
    const legendGroup = svg.append('g').attr('transform', `translate(20, 20)`);
    labels.forEach((label, i) => {
      const legendItem = legendGroup
        .append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendItem
        .append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', colors[i]);

      legendItem.append('text').attr('x', 20).attr('y', 12).text(label);
    });
  }, [minData, maxData, avgData, selectedYear, selectedCountryCode, newWidth]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative w-full mb-2">
        <div className="flex relative justify-center items-center w-full">
          <div className="relative overflow-x-auto h-full w-fit">
            <svg ref={svgRef} />
            <Tooltip id="tooltip" />
          </div>
        </div>
      </div>
      <DataSourceInfo>
        National Centers for Environmental Information (NCEI);{' '}
        <ShowMoreChartDetailsModalDialog>
          <div className="mt-1 mb-3 mr-4 ml-4">
            <h2 className="font-serif mt-4 mb-2 text-xl xs:text-2xl sm:text-3xl">
              Methodologies
            </h2>
            <p>
              From the database provided by the National Centers for
              Environmental Information containing data on minimum, maximum and
              average temperatures, only those relating to the states and nation
              have been extracted. The data are displayed on request depending
              on the selected year.
            </p>
          </div>
        </ShowMoreChartDetailsModalDialog>
      </DataSourceInfo>
      <div>
        <label htmlFor="year">Select Year: </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="py-1 px-2 ml-2 rounded-md border bg-background"
        >
          {[...new Set(minData.map((d) => d.year))].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3">
        <label htmlFor="country">Select country: </label>
        <select
          id="country"
          value={selectedCountryCode}
          onChange={(e) => setSelectedCountryCode(e.target.value)} // Nessuna conversione a number
          className="py-1 px-2 ml-2 rounded-md border bg-background"
        >
          {[...new Set(minData.map((d) => d.countryName))].map(
            (countryName) => (
              <option key={countryName} value={countryName}>
                {countryName}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );
};

export default RadarChart;
