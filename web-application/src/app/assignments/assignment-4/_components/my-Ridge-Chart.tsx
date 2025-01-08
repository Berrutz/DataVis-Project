import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Tooltip from '../../_components/tooltip';
import DataSourceInfo from '../../_components/data-source';
import ShowMoreChartDetailsModalDialog from '../../_components/show-more-chart-details-modal-dialog';
import { getStaticFile } from '@/utils/general';
import { Data } from '../lib/interfaces';
import { groupByDecade } from '../lib/ridge-chart';

interface RidgeLineSmallScreenPops {
  newWidth: number | string;
}

const MyRidgeLineChart: React.FC<RidgeLineSmallScreenPops> = ({ newWidth }) => {
  const [minData, setMinData] = useState<Data[]>([]);
  const [maxData, setMaxData] = useState<Data[]>([]);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const [selectedCountryCode, setSelectedCountryCode] =
    useState<string>('Alabama');

  const maxColorStroke = '#ff851a';
  const maxColorFill = '#ffbb80';
  const minColorStroke = '#0055ff';
  const minColorFill = '#80aaff';

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

    const margin = { top: 60, right: 30, bottom: 20, left: 110 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    /*     svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`); */

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
    console.log(categories);

    const x = d3.scaleLinear().domain([0, 100]).range([0, innerWidth]);
    svg
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x));

    const y = d3.scaleLinear().domain([0, 0.6]).range([innerHeight, 0]);

    const yName = d3
      .scaleBand()
      .domain(categories)
      .range([0, innerHeight])
      .paddingInner(1);

    svg.append('g').call(d3.axisLeft(yName));

    const kde = kernelDensityEstimator(kernelEpanechnikov(3), x.ticks(40));
    const allDensity = categories.map((key) => ({
      key,
      minDensity: kde(minDecades[key].values).filter((v) => v !== undefined),
      maxDensity: kde(maxDecades[key].values).filter((v) => v !== undefined)
    }));

    console.log(allDensity);

    svg
      .selectAll('.minDensityPath')
      .data(allDensity)
      .join('path')
      .attr('class', 'minDensityPath')
      .attr('transform', (d) => {
        console.log(d.key);
        console.log(yName(d.key)! + innerHeight);
        return `translate(0, ${yName(d.key)! - innerHeight})`;
      })
      .datum((d) => d.minDensity)
      .attr('fill', minColorFill)
      .attr('opacity', 0.7)
      .attr('stroke', minColorStroke)
      .attr('stroke-width', 1)
      .attr(
        'd',
        d3
          .line()
          .curve(d3.curveBasis)
          .x((d) => x(d[0]))
          .y((d) => y(d[1]))
      );

    svg
      .selectAll('.maxDensityPath')
      .data(allDensity)
      .join('path')
      .attr('class', 'maxDensityPath') // Add a class for maxDensity paths
      .attr('transform', (d) => `translate(0, ${yName(d.key)! - innerHeight})`)
      .datum((d) => d.maxDensity)
      .attr('fill', maxColorFill)
      .attr('opacity', 0.7)
      .attr('stroke', maxColorStroke)
      .attr('stroke-width', 1)
      .attr(
        'd',
        d3
          .line()
          .curve(d3.curveBasis)
          .x((d) => x(d[0]))
          .y((d) => y(d[1]))
      );

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
            <svg ref={svgRef}></svg>
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
    </div>
  );
};

export default MyRidgeLineChart;
