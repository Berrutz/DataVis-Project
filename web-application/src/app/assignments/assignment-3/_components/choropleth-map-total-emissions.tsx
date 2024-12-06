import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';
import DataSourceInfo from '../../_components/data-source';
import ShowMoreChartDetailsModalDialog from '../../_components/show-more-chart-details-modal-dialog';

/*
  import { sankey, sankeyLinkHorizontal, SankeyNodeMinimal } from 'd3-sankey';
  import {
  generateLegend,
  handleResize,
  highlightLinks,
  mouseOverLinks,
  mouseOverNodes,
  resetHighlight,
  updateLegendLayout
} from '../lib/alluvial'; 
 */

interface ChoroplethMapTotalEmisionsOneSmallScreenPops {
  newWidth: number | string;
}

interface Data {
  country: string; // Country name
  year: number; // year considered
  total_emission: number; // Total emission per capita
  fossil_emissions: number;
  annual_emission_density: number;
}

const ChoroplethMapTotalEmission: React.FC<
  ChoroplethMapTotalEmisionsOneSmallScreenPops
> = ({ newWidth }) => {
  const [data, setData] = useState<Data[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('2021'); // Set default year here
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [geoData, setGeoData] =
    useState<GeoJSON.FeatureCollection<GeoJSON.Geometry> | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // size of the zoom

  useEffect(() => {
    const fetchData = async () => {
      const csvData = await d3.csv(
        getStaticFile('/datasets/assignment3/World-data.csv'),
        (d) => ({
          country: d.country_name,
          year: +d.year,
          total_emission: +d['total_emissions'],
          fossil_emissions: +d['fossil_emissions'],
          annual_emission_density: +d['annual_emission_density']
        })
      );
      setData(csvData);

      // Load GeoJSON data about the World
      const geoJson = await d3.json<
        GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
      >(getStaticFile('/datasets/assignment3/world-borders.json'));

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
    if (!data || data.length === 0 || !geoData) return;

    //console.log("Data arrived : ",data);

    const svg = d3.select(svgRef.current);
    const width = +newWidth || 820;
    const height = 550;

    svg.attr('width', width).attr('height', height);

    const margin = { top: 20, right: 80, bottom: 50, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous SVG contents to prevent overlapping graphs
    svg.selectAll('*').remove();

    const filteredData = data
      .filter((d) => d.year === +selectedYear)
      .filter((d) => d.country !== 'World') // Exclude "World" country
      .filter((d) => d.country !== 'Upper-middle-income countries') // Exclude Upper middle income countries
      .filter((d) => d.country !== 'High-income countries'); // Exclude High income countries

    //console.log("Filtered Data :",filteredData);

    // TODO : Complete

    // Map country names to emission values
    const emissionsByCountry = new Map(
      filteredData.map((d) => [d.country, d.total_emission])
    );

    // console.log('emissionsByCountry Data :', emissionsByCountry);

    const colorScale = d3
      .scaleSequential(d3.interpolateReds)
      .domain(
        d3.extent(filteredData, (d) => d.total_emission) as [number, number]
      );

    console.log(
      d3.extent(filteredData, (d) => d.total_emission) as [number, number]
    );

    // Create projection of Mercator
    const projection = d3
      .geoMercator()
      .fitSize([innerWidth, innerHeight], geoData);
    // Path generator
    const pathGenerator = d3.geoPath().projection(projection);

    // Draw the map
    const mapGroup = svg.append('g'); // Zoomable group

    mapGroup
      .selectAll('path')
      .data(geoData?.features || [])
      .join('path')
      .attr(
        'd',
        (d: GeoJSON.Feature<GeoJSON.Geometry, any>) => pathGenerator(d) || ''
      )
      .attr('fill', (d: any) => {
        const countryName = d.properties.name;
        const value = emissionsByCountry.get(countryName);
        return value != null ? colorScale(value) : '#ccc';
      })
      .attr('stroke', '#000')
      .attr('stroke-width', 0.5)
      .on('mouseover', function (event, d: any) {
        const countryName = d.properties.name;
        var value = emissionsByCountry.get(countryName);
        value = value != null ? value / 1e6 : 0;

        d3.select(this).attr('stroke', '#000').attr('stroke-width', 1.5);

        // Tooltip logic here
        if (tooltipRef.current) {
          const svgRect = svgRef.current?.getBoundingClientRect();
          const horizontalOffset = 3;
          const verticalOffset = 55;

          const tooltipX =
            event.clientX - (svgRect?.left || 0) - horizontalOffset;
          const tooltipY = event.clientY - (svgRect?.top || 0) - verticalOffset;
          tooltipRef.current.style.borderRadius = '0.5rem';
          tooltipRef.current.style.borderStyle = 'solid';
          tooltipRef.current.style.borderWidth = '1px';
          tooltipRef.current.style.borderColor = 'hsl(var(--border))';
          tooltipRef.current.style.left = `${tooltipX}px`;
          tooltipRef.current.style.top = `${tooltipY}px`;
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.innerHTML = `
          <strong>Country:</strong> ${countryName}<br>
          <strong>Mt of CO₂:</strong> ${
            value != null ? value.toFixed(2) : 'N/A'
          }
        `;
        }
      })
      .on('mousemove', function (event) {
        if (tooltipRef.current) {
          // Get the bounding box of the SVG container
          const svgRect = svgRef.current?.getBoundingClientRect();
          const horizontalOffset = 3;
          const verticalOffset = 55;

          // Adjust tooltip position dynamically
          const tooltipX =
            event.clientX - (svgRect?.left || 0) + horizontalOffset;
          const tooltipY = event.clientY - (svgRect?.top || 0) - verticalOffset;

          tooltipRef.current.style.left = `${tooltipX}px`;
          tooltipRef.current.style.top = `${tooltipY}px`;
        }
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', '#000').attr('stroke-width', 0.5);
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '0';
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

    const legendWidth = 300;
    const legendHeight = 20;

    // Gradient
    const defs = svg.append('defs');
    const linearGradient = defs
      .append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');

    linearGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', d3.interpolateReds(0)); // Minimum color

    linearGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', d3.interpolateReds(1)); // Maximum color

    // Legend rectangle
    legendGroup
      .append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)');

    // Legend scale
    const legendScale = d3
      .scaleLinear()
      .domain(colorScale.domain().map((d) => d / 1e9)) // Match the domain of the color scale
      .range([0, legendWidth]);

    const legendAxis = d3
      .axisBottom(legendScale)
      .ticks(5)
      .tickFormat((d) => `${d} Gt`);

    legendGroup
      .append('g')
      .attr('transform', `translate(0, ${legendHeight})`) // Position below the rectangle
      .call(legendAxis);
  }, [zoomLevel, data, geoData, selectedYear, newWidth]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative w-full mb-2">
        {/* Mappa */}
        <div className="flex relative justify-center items-center w-full">
          <div className="relative overflow-x-auto h-full w-fit">
            <svg ref={svgRef} />
            {/* Pulsanti di zoom */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
              <button
                className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-3xl"
                onClick={() => setZoomLevel((prev) => Math.min(prev * 1.5, 15))} // Zoom in
              >
                +
              </button>
              <button
                className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-3xl"
                onClick={() => setZoomLevel((prev) => Math.max(prev / 1.5, 1))} // Zoom out
              >
                -
              </button>
            </div>
          </div>
          <div
            ref={tooltipRef}
            className="absolute bg-white text-sm text-gray-800 p-2 rounded shadow-lg pointer-events-none"
            style={{
              opacity: 0,
              position: 'absolute',
              pointerEvents: 'none'
            }}
          ></div>
        </div>
      </div>
      <DataSourceInfo>
        Global Carbon Budget (2024);{' '}
        <ShowMoreChartDetailsModalDialog>
          <div className="mt-1 mb-4 mr-4 ml-4">
            <h2 className="mt-4 mb-4 font-serif text-xl xs:text-2xl sm:text-3xl">
              What you should know about this data
            </h2>
            <ul className="list-disc pl-5">
              <li>The total CO2 emissions exclude land-use change.</li>
              <li>
                This data is based on territorial emissions, which do not
                account for emissions embedded in traded goods.
              </li>
              <li>
                Emissions from international aviation and shipping are not
                included in any country or region's emissions. They are only
                included in the global total emissions.
              </li>
            </ul>
            <h2 className="font-serif mt-4 mb-2 text-xl xs:text-2xl sm:text-3xl">
              Methodologies
            </h2>
            <p>
              To create the maps, the geographical data of the various countries
              were coupled with the database provided by "Our World In Data"
              containing data on the total CO2 emissions of all countries. The
              data are displayed on request depending on the selected year.
            </p>
            <h2 className="font-serif mt-4 mb-2 text-xl xs:text-2xl sm:text-3xl">
              Data Source
            </h2>
            <p>
              Global Carbon Budget (2024) - with major processing by Our World
              in Data. “Annual CO₂ emissions - GCB” [dataset]. Global Carbon
              Project, “Global Carbon Budget” [original data].
            </p>
          </div>
        </ShowMoreChartDetailsModalDialog>
      </DataSourceInfo>
      <div>
        <label htmlFor="year">Select Year: </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="py-1 px-2 ml-2 rounded-md border bg-background"
        >
          {[...new Set(data.map((d) => d.year))].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ChoroplethMapTotalEmission;
