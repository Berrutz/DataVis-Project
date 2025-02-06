import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';
import Tooltip from '@/components/tooltip';

interface InternetAccessMapProps {
  newWidth: number | string;
}

interface Data {
  country: string;
  year: string;
  value: number;
}

const InternetAccessMap: React.FC<InternetAccessMapProps> = ({ newWidth }) => {
  const [data, setData] = useState<Data[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('2021'); // Set default year here
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode | null>(
    null
  );
  const [geoData, setGeoData] =
    useState<GeoJSON.FeatureCollection<GeoJSON.Geometry> | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // size of the zoom

  useEffect(() => {
    const fetchData = async () => {
      const csvData = await d3.csv(
        getStaticFile('/datasets/internet-access-level/internet-access.csv'),
        (d) => ({
          country: d.Country,
          year: d.Year,
          value: +d.Value
        })
      );
      setData(csvData);

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

    // Filter for the selected year and exclude not country values and countries not visible on the map
    var filteredData = data
      .filter((d) => d.year === selectedYear)
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
        console.log(value);
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
          const svgRect = svgRef.current?.getBoundingClientRect();
          const horizontalOffset = 3;
          const verticalOffset = 55;
          const tooltipWidth = tooltipRef.current.offsetWidth || 0;
          const tooltipHeight = tooltipRef.current.offsetHeight || 0;

          // Adjust tooltip position dynamically
          let tooltipX =
            event.clientX - (svgRect?.left || 0) + horizontalOffset;
          let tooltipY = event.clientY - (svgRect?.top || 0) - verticalOffset;

          // Check if the tooltip would overflow the graph's width and height
          if (tooltipX + tooltipWidth > innerWidth) {
            tooltipX =
              event.clientX -
              (svgRect?.left || 0) -
              tooltipWidth -
              horizontalOffset;
          }
          if (tooltipY + tooltipHeight > innerHeight) {
            tooltipY =
              event.clientY -
              (svgRect?.top || 0) -
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
  }, [zoomLevel, data, geoData, selectedYear, newWidth]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative overflow-x-auto h-full w-fit">
        <svg ref={svgRef} />
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

export default InternetAccessMap;
