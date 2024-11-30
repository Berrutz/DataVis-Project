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
  total_emission_per_capita : number; // Total emission per capita 
  fossil_emissions : number;
  annual_emission_density : number;
}

const ChoroplethMapTotalEmisionsOne: React.FC<ChoroplethMapTotalEmisionsOneSmallScreenPops> = ({ newWidth }) =>
{

  const [data, setData] = useState<Data[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('2021'); // Set default year here
  const [geoData, setGeoData] = useState<GeoJSON.FeatureCollection<GeoJSON.Geometry> | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // size of the zoom

  
  useEffect(() => {
    const fetchData = async () => {

      const csvData = await d3.csv(
        getStaticFile(
          '/datasets/assignment3/World-data.csv'   
        ),
        (d) => ({
          country: d.country_name,
          year: +d.year,
          total_emission_per_capita : +d['total_emission_per_capita'],
          fossil_emissions : +d['fossil_emissions'],
          annual_emission_density : +d['annual_emission_density']
          
        })
      );
      setData(csvData);

      // Load GeoJSON data about the World
      const geoJson = await d3.json(
      getStaticFile('/datasets/assignment3/world-borders.json')
    
      );

      setGeoData(geoJson);

    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    if(!geoData || geoData.lenght == 0) return ;

    //console.log("Data arrived : ",data);

    const svg = d3.select(svgRef.current);
    const width = +newWidth || 850;
    const height = 500;

    svg.attr('width', width).attr('height', height);

    const margin = { top: 20, right: 80, bottom: 50, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous SVG contents to prevent overlapping graphs
    svg.selectAll('*').remove();

    const filteredData = data.filter((d) => d.year === +selectedYear);

    //console.log("Filtered Data :",filteredData);

   // TODO : Complete 

    // Map country names to emission values
    const emissionsByCountry = new Map(
      filteredData.map((d) => 
      [d.country , d.total_emission_per_capita])
    );

    console.log("emissionsByCountry Data :",emissionsByCountry);

    const colorScale = d3
      .scaleSequential(d3.interpolateBlues)
      .domain(d3.extent(filteredData, (d) => 
      d.total_emission_per_capita) as [number, number]
      );

    // Create projection of Mercator
    const projection = d3.geoMercator().fitSize([innerWidth, innerHeight], geoData);
    // Path generator
    const pathGenerator = d3.geoPath().projection(projection);
    
     // Draw the map
     const g = svg.append('g');
     g.selectAll('path')
     .data(geoData?.features || [])
     .join('path')
     .attr('d', (d: GeoJSON.Feature<GeoJSON.Geometry, any>) => pathGenerator(d) || '')
     .attr('fill', (d: any) => {
       const countryName = d.properties.name;
       const value = emissionsByCountry.get(countryName);
       return value != null ? colorScale(value) : '#ccc';
     })
     .attr('stroke', '#000')
     .attr('stroke-width', 0.5)
     .on('mouseover', 
       function (event, d: any) {
       const countryName = d.properties.name;
       const value = emissionsByCountry.get(countryName);

       d3.select(this).attr('stroke', '#66c2a5')
       .attr('stroke-width', 1.5);

       // Tooltip logic here
     })
     .on('mouseout', function () {
       d3.select(this).attr('stroke', '#000')
       .attr('stroke-width', 0.5);
     });

    // Add a legend (optional)
    const legendHeight = 10;
    const legendWidth = 300;

    const legend = svg
      .append('g')
      .attr('transform', 
        `translate(${innerWidth - legendWidth - 10}, 
        ${innerHeight - legendHeight + 10})`);

    const legendScale = d3.scaleLinear()
      .domain(colorScale.domain())
      .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale).ticks(7);

    legend.append('g')
      .attr('transform', `translate(0, ${legendHeight})`)
      .call(legendAxis);

    const legendGradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'legendGradient')
      .attr('x1', '0%').attr('x2', '100%')
      .attr('y1', '0%').attr('y2', '0%');

    legendGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 
      colorScale(colorScale.domain()[0]));

    legendGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 
      colorScale(colorScale.domain()[1]));

    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legendGradient)');

      // Zoom 
      const zoom = d3.zoom()
      .scaleExtent([1, 15])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    svg.transition().call(
      zoom.transform, 
      d3.zoomIdentity.scale(zoomLevel)
    );

  }, [zoomLevel,data, geoData, selectedYear, newWidth]);


  return (
    <div className="flex flex-col justify-center items-center">
    <div className="relative w-full">
      {/* Pulsanti di zoom */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
            <button
              className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setZoomLevel((prev) => Math.min(prev * 1.5, 15))} // Zoom in
            >
              +
            </button>
            <button
              className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setZoomLevel((prev) => Math.max(prev / 1.5, 1))} // Zoom out
            >
              -
            </button>
        </div>
      {/* Mappa */}
      <div className="flex relative justify-center items-center w-full">
        <div className="overflow-x-auto h-full w-fit">
          <svg ref={svgRef} />
        </div>
      </div>
    </div>
    <DataSourceInfo>
      Energy Institute - Statistical Review of World Energy (2024) - with
      major processing by Our World in Data;{' '}
    </DataSourceInfo>
    <div className="mt-3">
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



export default ChoroplethMapTotalEmisionsOne;