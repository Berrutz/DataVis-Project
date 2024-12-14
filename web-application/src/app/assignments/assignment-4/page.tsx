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
      <ChartSection
        asidename="Line Chart CO2 Emissions"
        asidekey="line-chart-co2-emissions"
      >
        <ChartHeading>
          <ChartH1Title>CO2 Emissions by Year</ChartH1Title>
          <p>
            This chart shows the CO2 emissions by year for different metrics
            (Min, Max, Avg).
          </p>
        </ChartHeading>
        <ChartBody>
          <ChartContainer
            asidename="Chart"
            asidekey="line-chart-co2-emissions-chart"
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
        </ChartBody>
      </ChartSection>
    </AssignmentPage>
  );
}
