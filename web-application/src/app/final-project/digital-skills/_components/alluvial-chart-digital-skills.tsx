'use client';

import BarChart, { Point } from '@/components/charts/barchart';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import { foundOrFirst, getUnique } from '@/utils/general';
import { useGetD3Csv } from '@/hooks/use-get-d3-csv';
import ChartContainer from '@/components/chart-container';
import Alluvial, {
  AlluvialData,
  CustomLink,
  CustomNode,
  LinkData
} from '@/components/charts/alluvial';
import { SankeyLink, SankeyNodeMinimal } from 'd3-sankey';
import { useScreenSize } from '@/hooks/use-screen-sizes';

export default function AlluvialDigitalSkills() {
  // Represent a year and country selection for the user
  const [year, setYear] = useState<string>();
  const [country, setCountry] = useState<string>();

  // The current state of the alluvial
  const [alluvialState, setAlluvialState] = useState<AlluvialData | null>(null);

  // Get the current screen size to change the chart size accordingly
  const screenSize = useScreenSize();

  // Get the data from the csv file using D3
  const csvData = useGetD3Csv(
    'digital-skills/individual-level-of-digital-skills-2021.csv',
    (d) => ({
      year: +d.time_period,
      country: d.geo,
      indic_is: d.indic_is,
      value: +d.obs_value,
      ind_type: d.ind_type
    })
  );

  // Choose the default selection values when the csv is loaded and fullfilled
  useEffect(() => {
    if (csvData === null || csvData.length <= 0) return;

    const years = csvData.map((value) => value.year);
    const selectedYear = Math.max(...years);

    const countries = csvData.map((value) => value.country);
    const selectedCountry = foundOrFirst('Italy', countries);

    // Set the first default selection for the year
    setYear(selectedYear.toString());
    setCountry(selectedCountry);
  }, [csvData]);

  // Change the chart state based on the current user selection
  useEffect(() => {
    if (!year || !country || csvData === null) return;

    const filteredData = csvData
      .filter(
        (value) =>
          value.year === +year &&
          value.country === country &&
          value.ind_type !== 'All individuals'
      )
      .sort((a, b) => b.value - a.value);

    const filterIndicTypeName = (value: string) => {
      return value.replace('Individuals,', '').trim();
    };

    const uniqueIndType = getUnique(
      filteredData.map((value) => filterIndicTypeName(value.ind_type))
    );

    const uniqueIndicIs = getUnique(
      filteredData.map((value) => value.indic_is)
    );

    const nodes = [uniqueIndType, uniqueIndicIs];
    const linkData: LinkData[] = [];
    filteredData.forEach((value) => {
      linkData.push({
        source: filterIndicTypeName(value.ind_type),
        target: value.indic_is,
        value: value.value
      });
    });

    setAlluvialState({
      nodes: nodes,
      links: linkData
    });
  }, [year, country, csvData]);

  // The csv is not yet loaded or
  // the default selection has not already initializated or
  // neither one of the x value and y value state for the barchart has been initializated
  if (!year || csvData === null || alluvialState === null) {
    return (
      <ChartContainer>
        <Skeleton className="w-full bg-gray-200 rounded-xl h-[500px]" />
      </ChartContainer>
    );
  }

  // The csv is loaded but no data has been found
  if (csvData.length <= 0) {
    throw Error('Cannot retrieve the data from the csv');
  }

  const uniqueYears = getUnique(
    csvData.map((value) => value.year),
    (a, b) => b - a
  );
  const uniqueCountries = getUnique(csvData.map((value) => value.country));

  const colors = [
    '#E63946',
    '#A8DADC',
    '#ffb3ba',
    '#ffdfba',
    '#baffc9',
    '#bae1ff'
  ];

  const width = screenSize == 'sm' && 500 || screenSize == 'md' && 610 || screenSize == 'lg' && 700 || 1000;

  let ml = 120
  if (screenSize !== 'xl') {
    ml = 0
  }

  let mb = 0
  if (screenSize === 'xl') {
    mb = 90
  }

  return (
    <ChartContainer className="flex flex-col gap-8">
      <Alluvial
        data={alluvialState}
        tooltipSuffix="%"
        SecondLayerNodesTooltipMapper={TooltipSecondLayerNodes}
        linksTooltipMapper={TooltipMouseOverLinks}
        width={width}
        height={800}
        colors={colors}
        mb={mb}
        mr={0}
        mt={0}
        ml={ml}
      />
      <div className="gap-6 md:flex">
        <div className="w-full">
          <label>Year</label>
          <Select onValueChange={setYear} defaultValue={year.toString()}>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {uniqueYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <label>Country</label>
          <Select onValueChange={setCountry} defaultValue={country}>
            <SelectTrigger>
              <SelectValue placeholder="country" />
            </SelectTrigger>
            <SelectContent>
              {uniqueCountries.map((country) => (
                <SelectItem key={country} value={country.toString()}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </ChartContainer>
  );
}

function TooltipSecondLayerNodes(
  nodeData: CustomNode,
  relatedLinks: CustomLink[],
  nodes: CustomNode[],
  suffix: string,
  scalingFactor: number,
  floatPrecision: number
): JSX.Element {
  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {nodeData.name}
      </div>
      {relatedLinks.map((link, index) => (
        <div key={index}>
          {nodes[link.source].name}: {link.value.toFixed(floatPrecision)}%
        </div>
      ))}
    </div>
  );
}

function TooltipMouseOverLinks(
  hoveredLink: SankeyLink<CustomNode, CustomLink>,
  relatedLinks: SankeyLink<CustomNode, CustomLink>[],
  nodes: CustomNode[],
  linkPaths: d3.Selection<
    d3.BaseType | SVGPathElement,
    SankeyLink<CustomNode, CustomLink>,
    SVGGElement,
    unknown
  >
) {
  const targetNode = hoveredLink.target as CustomNode;
  if (targetNode.index == undefined) {
    throw new Error('index undefined');
  }

  // Highlight effect
  if (linkPaths !== undefined) {
    linkPaths
      .transition()
      .duration(200)
      .attr('opacity', (link) => {
        const linkTarget = link.target as SankeyNodeMinimal<
          CustomNode,
          CustomLink
        >;
        return linkTarget.index === targetNode.index ? 1 : 0.2;
      });
  }

  // Filter and sort related source links
  const relatedSourceLinks = relatedLinks
    .filter((link) => link.target === targetNode.index)
    .sort((a, b) => b.value - a.value);

  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {targetNode.name}
      </div>
      {relatedSourceLinks.map((link, index) => {
        const sourceNode = nodes[link.source as number]; // Assuming `source` is an index
        return (
          <div key={sourceNode.name + index}>
            {sourceNode.name}: {link.value.toFixed(2)}%<br />
          </div>
        );
      })}
    </div>
  );
}

export function mouseOverLinks(
  d: SankeyLink<CustomNode, CustomLink>,
  links: SankeyLink<CustomNode, CustomLink>[],
  linkPaths: d3.Selection<
    d3.BaseType | SVGPathElement,
    SankeyLink<CustomNode, CustomLink>,
    SVGGElement,
    unknown
  >,
  nodes: CustomNode[],
  tooltipMapper:
    | ((
        hoveredLink: SankeyLink<CustomNode, CustomLink>,
        links: SankeyLink<CustomNode, CustomLink>[],
        nodes: CustomNode[],
        linkPaths: d3.Selection<
          d3.BaseType | SVGPathElement,
          SankeyLink<CustomNode, CustomLink>,
          SVGGElement,
          unknown
        >
      ) => JSX.Element)
    | undefined,
  suffix: string,
  scalingFactor: number,
  floatPrecision: number
): JSX.Element {
  const targetNode = d.target as CustomNode;
  if (targetNode.index == undefined) {
    throw new Error('index undefined');
  }

  // Filter and sort related source links
  const relatedSourceLinks = links
    .filter((link) => link.target === targetNode.index)
    .sort((a, b) => b.value - a.value);

  if (tooltipMapper != undefined) {
    return tooltipMapper(d, relatedSourceLinks, nodes, linkPaths);
  }

  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {targetNode.name}
      </div>
      {relatedSourceLinks.map((link, index) => {
        const sourceNode = nodes[link.source as number]; // Assuming `source` is an index
        return (
          <div key={sourceNode.name + index}>
            {sourceNode.name}: {link.value.toFixed(floatPrecision)}
            {suffix}
            <br></br>
          </div>
        );
      })}
    </div>
  );
}
