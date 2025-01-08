import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import Tooltip from '../../_components/tooltip';
import DataSourceInfo from '../../_components/data-source';
import ShowMoreChartDetailsModalDialog from '../../_components/show-more-chart-details-modal-dialog';

interface RidgeLineChartProps {
  dataUrl: string;
  width: number;
  height: number;
}

const RidgeLineChart: React.FC<RidgeLineChartProps> = ({
  dataUrl,
  width,
  height
}) => {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const margin = { top: 60, right: 30, bottom: 20, left: 110 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    d3.csv(dataUrl).then((data) => {
      if (!data.columns) return;

      const categories = data.columns;
      console.log(categories);
      const n = categories.length;

      console.log(data);

      const x = d3.scaleLinear().domain([-10, 140]).range([0, innerWidth]);
      svg
        .append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(x));

      const y = d3.scaleLinear().domain([0, 0.4]).range([innerHeight, 0]);

      const yName = d3
        .scaleBand()
        .domain(categories)
        .range([0, innerHeight])
        .paddingInner(1);

      svg.append('g').call(d3.axisLeft(yName));

      console.log('x.ticks:', x.ticks(40));

      const kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40));
      const allDensity = categories.map((key) => ({
        key,
        density: kde(
          data.map((d) => parseFloat(d[key])).filter((v) => !isNaN(v))
        )
      }));

      console.log(allDensity);

      svg
        .selectAll('path')
        .data(allDensity)
        .join('path')
        .attr('transform', (d) => {
          console.log(d.key);
          console.log(yName(d.key)! + innerHeight);
          return `translate(0, ${yName(d.key)! - innerHeight})`;
        })
        .datum((d) => d.density)
        .attr('fill', '#69b3a2')
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .attr(
          'd',
          d3
            .line()
            .curve(d3.curveBasis)
            .x((d) => x(d[0]))
            .y((d) => y(d[1]))
        );
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
      d3.select(chartRef.current).selectAll('*').remove();
    };
  }, [dataUrl, width, height]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative w-full mb-2">
        <div className="flex relative justify-center items-center w-full">
          <div className="relative overflow-x-auto h-full w-fit">
            <svg ref={chartRef}></svg>
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

export default RidgeLineChart;
