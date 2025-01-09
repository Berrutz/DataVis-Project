import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Tooltip from '../../_components/tooltip';
import DataSourceInfo from '../../_components/data-source';
import ShowMoreChartDetailsModalDialog from '../../_components/show-more-chart-details-modal-dialog';
import { getStaticFile } from '@/utils/general';
import { Data } from '../lib/interfaces';
import { Colors } from '../lib/interfaces';
import {
  groupByDecade,
  handleMouseMove,
  handleMouseOut
} from '../lib/ridgeline-chart';

interface RidgeLineSmallScreenPops {
  newWidth: number | string;
}

const RidgeLineChart: React.FC<RidgeLineSmallScreenPops> = ({ newWidth }) => {
  const [minData, setMinData] = useState<Data[]>([]);
  const [maxData, setMaxData] = useState<Data[]>([]);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const [selectedCountryCode, setSelectedCountryCode] =
    useState<string>('Alabama');

  const maxColors: Colors = {
    colorStroke: '#ff851a',
    colorFill: '#ffbb80',
    colorHovered: '#ff9233'
  };

  const minColors: Colors = {
    colorStroke: '#0055ff',
    colorFill: '#80aaff',
    colorHovered: '#3377ff'
  };

  // Legend items
  const legendData = [
    { label: 'Min Temperatures', color: minColors.colorStroke },
    { label: 'Max Temperatures', color: maxColors.colorStroke }
  ];

  useEffect(() => {
    const fetchData = async () => {
      // Caricamento dei dati per Min, Max, Avg con codice dello stato
      const minCsvData: Data[] = await d3.csv(
        getStaticFile('/datasets/assignment4/Min.csv'),
        (d: any) => ({
          year: +d.year,
          month: +d.month,
          value: +d.value,
          countryName: d.country
        })
      );
      setMinData(minCsvData);

      const maxCsvData: Data[] = await d3.csv(
        getStaticFile('/datasets/assignment4/Max.csv'),
        (d: any) => ({
          year: +d.year,
          month: +d.month,
          value: +d.value,
          countryName: d.country
        })
      );
      setMaxData(maxCsvData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!minData.length || !maxData.length) return;

    const width = +newWidth || 820;
    const height = 800;

    const margin = { top: 120, right: 50, bottom: 60, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const filteredMinData = minData.filter((d) =>
      selectedCountryCode ? d.countryName === selectedCountryCode : true
    );
    const filteredMaxData = maxData.filter((d) =>
      selectedCountryCode ? d.countryName === selectedCountryCode : true
    );

    // Group the data in decades
    const minDecades = groupByDecade(filteredMinData);
    const maxDecades = groupByDecade(filteredMaxData);

    // Define the categories ('1890', '1900', ...)
    const categories = [
      ...new Set(minData.map((d) => Math.floor(d.year / 10) * 10))
    ]
      .sort((a, b) => b - a)
      .map((d) => d.toString());

    const xExtent = d3.extent([
      ...filteredMinData.map((d) => d.value),
      ...filteredMaxData.map((d) => d.value)
    ]);

    const validXExtent =
      xExtent[0] !== undefined && xExtent[1] !== undefined
        ? xExtent
        : ([0, 100] as [number, number]); // Valori di default, es. [0, 100]

    const x = d3
      .scaleLinear()
      .domain([validXExtent[0] - 5, validXExtent[1] + 5])
      .range([0, innerWidth]);
    svg
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x))
      .style('font-size', '0.8rem');

    const y = d3.scaleLinear().domain([0, 0.7]).range([innerHeight, 0]);

    const yName = d3
      .scaleBand()
      .domain(categories)
      .range([0, innerHeight])
      .paddingInner(1);

    svg.append('g').call(d3.axisLeft(yName)).style('font-size', '0.8rem');

    const kde = kernelDensityEstimator(kernelEpanechnikov(3), x.ticks(40));
    const allDensity = categories.map((key) => ({
      key,
      minDensity: kde(minDecades[key].values).filter((v) => v !== undefined),
      maxDensity: kde(maxDecades[key].values).filter((v) => v !== undefined)
    }));

    // Create tooltip
    const tooltip = d3.select('#tooltip-ridge-chart');

    const defaultOpacity = 0.7;

    svg
      .selectAll('.minDensityPath')
      .data(allDensity)
      .join('path')
      .attr('class', 'minDensityPath')
      .attr('data-category', (d) => d.key) // Attach category to identify
      .attr('transform', (d) => {
        return `translate(0, ${yName(d.key)! - innerHeight})`;
      })
      .datum((d) => d.minDensity)
      .attr('fill', minColors.colorFill)
      .attr('opacity', defaultOpacity)
      .attr('stroke', minColors.colorStroke)
      .attr('stroke-width', 1)
      .attr(
        'd',
        d3
          .line()
          .curve(d3.curveBasis)
          .x((d) => x(d[0]))
          .y((d) => y(d[1]))
      )
      .on('mousemove', (event) => {
        handleMouseMove(
          event,
          svgRef,
          innerWidth,
          innerHeight,
          tooltip,
          minColors,
          selectedCountryCode,
          minDecades
        );
      })
      .on('mouseout', (event) => {
        handleMouseOut(event, tooltip, minColors, defaultOpacity);
      });

    svg
      .selectAll('.maxDensityPath')
      .data(allDensity)
      .join('path')
      .attr('class', 'maxDensityPath')
      .attr('data-category', (d) => d.key) // Attach category to identify
      .attr('transform', (d) => `translate(0, ${yName(d.key)! - innerHeight})`)
      .datum((d) => d.maxDensity)
      .attr('fill', maxColors.colorFill)
      .attr('opacity', 0.7)
      .attr('stroke', maxColors.colorStroke)
      .attr('stroke-width', 1)
      .attr(
        'd',
        d3
          .line()
          .curve(d3.curveBasis)
          .x((d) => x(d[0]))
          .y((d) => y(d[1]))
      )
      .on('mousemove', (event) => {
        handleMouseMove(
          event,
          svgRef,
          innerWidth,
          innerHeight,
          tooltip,
          maxColors,
          selectedCountryCode,
          maxDecades
        );
      })
      .on('mouseout', (event) => {
        handleMouseOut(event, tooltip, maxColors, defaultOpacity);
      });

    categories.forEach((category) => {
      // Add horizontal baseline for zero density
      svg
        .append('line')
        .attr('x1', x.range()[0]) // Start of the line
        .attr('x2', x.range()[1]) // End of the line
        .attr('y1', yName(category)!) // Align with decade
        .attr('y2', yName(category)!) // Align with decade
        .attr('opacity', 1)
        .attr('stroke', '#d9d9d9') // Use the single gradient
        .attr('stroke-width', 2)
        .attr('stroke-linecap', 'round'); // Optional: Rounded edges
    });

    svg
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 50)
      .attr('text-anchor', 'middle')
      .attr('font-size', '1rem')
      .text('Temperature (°F)');

    // Add the legend group
    const legendXOffSet = 161;
    const legendGroup = svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${innerWidth / 2 - legendXOffSet}, -80)`);

    const legendSpacing = 165;

    // Add legend items
    legendGroup
      .selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (_, i) => `translate(${i * legendSpacing}, 0)`) // Adjust spacing between legend items
      .each(function (d) {
        const group = d3.select(this);

        // Add colored rectangle
        group
          .append('rect')
          .attr('x', -10)
          .attr('y', -8)
          .attr('width', 15)
          .attr('height', 15)
          .attr('fill', d.color);

        // Add legend text
        group
          .append('text')
          .attr('x', 10)
          .attr('y', 0)
          .attr('dy', '0.35em') // Center the text vertically
          .attr('font-size', '1rem')
          .attr('text-anchor', 'start')
          .text(d.label);
      });

    function kernelDensityEstimator(
      kernel: (v: number) => number,
      X: number[]
    ) {
      return function (V: number[]) {
        return X.map((x) => [
          x,
          d3.mean(V, (v) => kernel(x - v)) as number
        ]).filter((d): d is [number, number] => d !== undefined);
      };
    }

    function kernelEpanechnikov(k: number) {
      return function (v: number) {
        return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
      };
    }

    return () => {
      d3.select(svgRef.current).selectAll('*').remove();
    };
  }, [minData, maxData, selectedCountryCode, newWidth]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative w-full mb-2">
        <div className="flex relative justify-center items-center w-full">
          <div className="relative overflow-x-auto h-full w-fit">
            <svg ref={svgRef} />
            <Tooltip id="tooltip-ridge-chart" />
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
      <div className="mt-3">
        <label htmlFor="ridge-chart-country">Select country: </label>
        <select
          id="ridge-chart-country"
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

export default RidgeLineChart;
