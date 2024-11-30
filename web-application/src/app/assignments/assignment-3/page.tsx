'use client';

import AssignmentPage from '../_components/assignment-page';
import {
  ChartBody,
  ChartContainer,
  ChartH1Title,
  ChartH2Title,
  ChartHeading,
  ChartSection
} from '../_components/chart-section';

import { useEffect, useState } from 'react';
import ChoroplethMapDensityOne from './_components/choropleth_map_density_one';
import ChoroplethMapDensityTwo from './_components/choropleth_map_density_two';
import ChoroplethMapTotalEmisionsOne from './_components/choropleth_map_total_emissions_one';
import ChoroplethMapTotalEmisionsTwo from './_components/choropleth_map_total_emissions_two';

export default function Assignment3() {

  const [windowWidth, setWindowWidth] = useState<number>(1200);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AssignmentPage title={'Analysis of CO2 Per Capita and based on Density'}>
      {/* CHOROPLETH MAP TOTAL EMISSION ONE & TWO (both are in the same section since both refears to the same data) */}
      <ChartSection
        asidename="Choropleth Map Total Emission per capita"
        asidekey="choropleth-map-total-emission-per-capita"
      >
        <ChartHeading>
          <ChartH1Title>
            {/* TODO: CHANGE TITLE*/}
            Total CO2 emissions Per Capita
          </ChartH1Title>
          <p>Some words here</p>
        </ChartHeading>
        <ChartBody>
          <ChartContainer
            asidename="Chart"
            asidekey="choropleth-map-total-emission-per-capita-chart"
          >
            <ChoroplethMapTotalEmisionsOne 
            newWidth={
              windowWidth < 768 ? 600 : windowWidth < 1024 ? 700 : 850
            }
            />
            <ChoroplethMapTotalEmisionsTwo 
            
            />
          </ChartContainer>
          <ChartContainer
            asidename="Comment"
            asidekey="choropleth-map-total-emission-per-capita-comment"
          >
            <ChartH2Title>Comment</ChartH2Title>
            <p>The final comment here</p>
          </ChartContainer>
        </ChartBody>
      </ChartSection>

      {/* CHOROPLETH MAP TOTAL EMISSION DENSITY ONE & TWO (both are in the same section since both refears to the same data) */}
      <ChartSection
        asidename="Choropleth Map Desity Total Emission"
        asidekey="choropleth-map-density-total-emission"
      >
        <ChartBody>
          <ChartHeading>
            <ChartH1Title>
              {/* TODO: CHANGE TITLE*/}
              Total CO2 emissions scaled by country side from different
              perspectives
            </ChartH1Title>
            <p>Some words here</p>
          </ChartHeading>
          <ChartContainer
            asidename="Chart"
            asidekey="choropleth-map-density-total-emission-chart"
          >
            <ChoroplethMapDensityOne />
            <ChoroplethMapDensityTwo />
          </ChartContainer>
          <ChartContainer
            asidename="Comment"
            asidekey="choropleth-map-density-total-emission-chart"
          >
            <ChartH2Title>Comment</ChartH2Title>
            <p>The final comment here</p>
          </ChartContainer>
        </ChartBody>
      </ChartSection>
    </AssignmentPage>
  );
}
