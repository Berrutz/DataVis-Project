import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getStaticFile, getUnique } from '@/utils/general';
import Tooltip from '@/components/tooltip';
import { useGetD3Csv } from '@/hooks/use-get-d3-csv';
import ChartContainer from '@/components/chart-container';
import { Skeleton } from '@/components/ui/skeleton';
import ChartScrollableWrapper from '@/components/chart-scrollable-wrapper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { H3 } from '@/components/headings';
import ShowMoreChartDetailsModalDialog from '@/app/assignments/_components/show-more-chart-details-modal-dialog';
import DataSourceInfo from '@/app/assignments/_components/data-source';

interface InternetAccessMapProps {
  newWidth: number;
  newHeight: number;
}

interface Data {
  country: string;
  year: string;
  value: number;
}

const InternetAccessMap: React.FC<InternetAccessMapProps> = ({
  newWidth,
  newHeight
}) => {
  // The ref of the chart created by d3
  const svgRef = useRef<SVGSVGElement | null>(null);

  // The container of the svg
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedYear, setSelectedYear] = useState<string>();
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode | null>(
    null
  );
  const [geoData, setGeoData] =
    useState<GeoJSON.FeatureCollection<GeoJSON.Geometry> | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // size of the zoom

  const csvData = useGetD3Csv(
    'internet-access-level/internet-access.csv',
    (d) => ({
      lastInternetUse: d['Last internet use'],
      ageGroup: d['Age group'],
      country: d.Country,
      year: +d.Year,
      value: +d.Value,
      population: +d.Population
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      // Load GeoJSON data about the World
      const geoJson = await d3.json<
        GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
      >(getStaticFile('/datasets/internet-access-level/europe.geojson'));

      // Check if geoJson is valid (not undefined)
      if (geoJson) {
        setGeoData(geoJson);
      } else {
        console.error('Failed to load GeoJSON data');
        setGeoData(null); // Optionally set null or handle error state
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (csvData === null || csvData.length === 0 || !geoData) return;

    // As default choose the most recent year
    const years = csvData.map((value) => value.year);
    const selectedYear = Math.max(...years);

    // Set the first default selection for the first barchart visualization
    setSelectedYear(selectedYear.toString());
  }, [csvData, geoData]);

  useEffect(() => {
    // Clear the svg in case of re-rendering
    d3.select(svgRef.current).selectAll('*').remove();

    if (csvData === null || csvData.length === 0 || !geoData || !selectedYear)
      return;

    // The csv is loaded but no data has been found
    if (csvData.length <= 0) {
      throw Error('Cannot retrieve the data from the csv');
    }

    const svg = d3.select(svgRef.current);
    const width = newWidth || 820;
    const height = newHeight;

    svg.attr('width', width).attr('height', height);

    const margin = { top: 20, right: 80, bottom: 50, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Filter for the selected year and exclude not country values and countries not visible on the map
    var filteredData = csvData
      .filter((d) => d.year === +selectedYear)
      .filter((d) => d.country !== 'EU-27(from 2020)')
      .filter((d) => d.country !== 'EU-28(2013-2020)');

    // Map country names to emission values
    const emissionsByCountry = new Map(
      filteredData.map((d) => [d.country, d.value])
    );

    const colorScale = d3
      .scaleSequential(d3.interpolateBlues)
      .domain(d3.extent(filteredData, (d) => d.value) as [number, number]);

    // Create projection of Lambert
    const projection = d3
      .geoConicEqualArea()
      .fitSize([innerWidth, innerHeight], geoData);

    // Path generator
    const pathGenerator = d3.geoPath().projection(projection);

    // Draw the map
    const mapGroup = svg.append('g'); // Zoomable group

    const tooltipMapper = (country: string, value: number | undefined) => {
      return (
        <p>
          <strong>Country:</strong> {country}
          <br />
          <strong>Households with internet access:</strong>{' '}
          {value != null ? value.toFixed(2) : 'N/A'}
        </p>
      );
    };

    mapGroup
      .selectAll('path')
      .data(geoData?.features || [])
      .join('path')
      .attr(
        'd',
        (d: GeoJSON.Feature<GeoJSON.Geometry, any>) => pathGenerator(d) || ''
      )
      .attr('fill', (d: any) => {
        const countryName = d.properties.NAME;
        const value = emissionsByCountry.get(countryName);
        return value != null ? colorScale(value) : '#ccc';
      })
      .attr('stroke', '#000')
      .attr('stroke-width', 0.5)
      .on('mousemove', function (event, d: any) {
        const countryName: string = d.properties.NAME;
        var value = emissionsByCountry.get(countryName);

        d3.select(this).attr('stroke', '#000').attr('stroke-width', 1.5);

        if (tooltipRef.current) {
          // Get the bounding box of the SVG container
          const containerRect = containerRef.current?.getBoundingClientRect();
          const horizontalOffset = 3;
          const verticalOffset = 80;
          const tooltipWidth = tooltipRef.current.offsetWidth || 0;
          const tooltipHeight = tooltipRef.current.offsetHeight || 0;

          // Adjust tooltip position dynamically
          let tooltipX =
            event.clientX - (containerRect?.left || 0) + horizontalOffset;
          let tooltipY =
            event.clientY - (containerRect?.top || 0) - verticalOffset;

          // Check if the tooltip would overflow the graph's width and height
          if (tooltipX + tooltipWidth > innerWidth) {
            tooltipX =
              event.clientX -
              (containerRect?.left || 0) -
              tooltipWidth -
              horizontalOffset;
          }
          if (tooltipY + tooltipHeight > innerHeight) {
            tooltipY =
              event.clientY -
              (containerRect?.top || 0) -
              tooltipHeight -
              verticalOffset;
          }

          tooltipRef.current.style.left = `${tooltipX}px`;
          tooltipRef.current.style.top = `${tooltipY}px`;
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.style.display = 'block';
          setTooltipContent(tooltipMapper!(countryName, value));
        }
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', '#000').attr('stroke-width', 0.5);
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '0';
          tooltipRef.current.style.display = 'none';
        }
      });

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 15])
      .on('zoom', (event) => {
        mapGroup.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    const svgTransition = svg.transition() as unknown as d3.Transition<
      SVGSVGElement,
      unknown,
      null,
      undefined
    >;

    svgTransition.call(zoom.transform, d3.zoomIdentity.scale(zoomLevel));

    // Legend
    const legendGroup = svg
      .append('g')
      .attr(
        'transform',
        `translate(${margin.left}, ${height - margin.bottom})`
      );

    const legendWidth = 350;
    const legendHeight = 20;

    // Gradient
    const defs = svg.append('defs');
    const linearGradient = defs
      .append('linearGradient')
      .attr('id', 'density-legend-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');

    linearGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', d3.interpolateBlues(0)); // Minimum color

    linearGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', d3.interpolateBlues(1)); // Maximum color

    // Legend rectangle
    legendGroup
      .append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#density-legend-gradient)');

    // Legend scale
    const legendScale = d3
      .scaleLinear()
      .domain(colorScale.domain().map((d) => d)) // Match the domain of the color scale
      .range([0, legendWidth]);

    const legendAxis = d3
      .axisBottom(legendScale)
      .ticks(5)
      .tickFormat((d) => `${d}%`);

    legendGroup
      .append('g')
      .attr('transform', `translate(0, ${legendHeight})`) // Position below the rectangle
      .call(legendAxis)
      .style('font-size', '0.8rem');
  }, [zoomLevel, selectedYear, newWidth, newHeight]);

  return (
    <div>
      {!selectedYear || csvData === null || geoData === null ? (
        <Skeleton className="w-full bg-gray-200 rounded-xl h-[500px]" />
      ) : (
        <div className="flex flex-col gap-8">
          <H3>Europe countries compared by internet access level</H3>
          <div className="relative" ref={containerRef}>
            <ChartScrollableWrapper>
              <svg ref={svgRef} />
            </ChartScrollableWrapper>
            <Tooltip ref={tooltipRef}>{tooltipContent}</Tooltip>
            <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
              <button
                className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-3xl"
                onClick={() => setZoomLevel((prev) => Math.min(prev * 1.5, 15))} // Zoom in
              >
                +
              </button>
              <button
                className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-3xl"
                onClick={() => setZoomLevel((prev) => Math.max(prev / 1.5, 1))} // Zoom out
              >
                -
              </button>
            </div>
          </div>
          <DataSourceInfo>
            Eurostat, Households - level of internet access (2024);{' '}
            <ShowMoreChartDetailsModalDialog>
              <div className="mt-1 mb-4 mr-4 ml-4">
                <h2 className="mt-4 mb-4 font-serif text-xl xs:text-2xl sm:text-3xl">
                  What you should know about this data
                </h2>
                <ul className="list-disc pl-5 text-base">
                  <li>
                    The survey population of Households consists of all private
                    households having at least one member in the age group 16 to
                    74 years.
                  </li>
                </ul>
                <h2 className="font-serif mt-4 mb-2 text-xl xs:text-2xl sm:text-3xl">
                  Methodologies
                </h2>
                <p className="text-base">
                  To create the charts, the geographical data of the various
                  countries were coupled with the databases provided by
                  "Eurostats" containing data on the percentage of households
                  with internet access for all EU countries. The data are
                  displayed on request depending on the selected year.
                </p>
                <h2 className="font-serif mt-4 mb-2 text-xl xs:text-2xl sm:text-3xl">
                  Data Sources
                </h2>
                <ul className="list-disc pl-5 text-base">
                  <li>
                    Eurostat: Households - level of internet access (id
                    isoc_ci_in_h, last data update: 17/12/2024).
                  </li>
                </ul>
              </div>
            </ShowMoreChartDetailsModalDialog>
          </DataSourceInfo>
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="sm:w-1/3">
              <label>Year</label>
              <Select
                onValueChange={setSelectedYear}
                defaultValue={selectedYear.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {getUnique(
                    csvData.map((value) => value.year),
                    (a, b) => b - a
                  ).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternetAccessMap;
