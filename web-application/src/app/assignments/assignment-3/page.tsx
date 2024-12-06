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
import ChoroplethMapTotalEmisionsTwo from './_components/choropleth_map_total_emissions_two';
import MapContainer from './_components/map-switch-container';

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
    <AssignmentPage
      title={'Global analysis of CO2 Emissions and Population Density'}
    >
      {/* CHOROPLETH MAP TOTAL EMISSION ONE & TWO (both are in the same section since both refears to the same data) */}
      <ChartSection
        asidename="Choropleth Map Total Emission per capita"
        asidekey="choropleth-map-total-emission-per-capita"
      >
        <ChartHeading>
          <ChartH1Title>
            Annual overview of per capita and total CO2 emissions of the world's
            countries
          </ChartH1Title>
          <p>
            The map gives a global view of the CO2 emissions per capita and
            total CO2 emissions for all the countries in a given year.
          </p>
        </ChartHeading>
        <ChartBody>
          <ChartContainer
            asidename="Chart"
            asidekey="choropleth-map-total-emission-per-capita-chart"
          >
            <MapContainer
              width={
                windowWidth < 480
                  ? 450
                  : windowWidth < 768
                  ? 600
                  : windowWidth < 1024
                  ? 720
                  : 820
              }
            />
          </ChartContainer>
          <ChartContainer
            asidename="Comment"
            asidekey="choropleth-map-total-emission-per-capita-comment"
          >
            <ChartH2Title>Comment</ChartH2Title>
            <p>
              Looking first at the total CO2 emissions of countries and then
              their emissions in relation to the number of inhabitants allows us
              to have a more complete view of the global situation. China is by
              far the country that emits the most tons of CO2 into the
              atmosphere, but if we relate its emissions to the population it is
              placed below other countries such as the USA.
            </p>
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
            <ChoroplethMapDensityOne
              newWidth={
                windowWidth < 480
                  ? 450
                  : windowWidth < 768
                  ? 600
                  : windowWidth < 1024
                  ? 720
                  : 820
              }
            />
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
