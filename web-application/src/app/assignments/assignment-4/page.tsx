'use client';

import AssignmentPage from '../_components/assignment-page';
import {
  ChartBody,
  ChartContainer,
  ChartH1Title,
  ChartHeading,
  ChartSection
} from '../_components/chart-section';

import { useEffect, useState } from 'react';
import LineChart from './_components/LineChart';
import MapContainer from '@/components/map-switch-container';

export default function Assignment3() {
  const [windowWidth, setWindowWidth] = useState<number>(1200);
  const [selectedYear, setSelectedYear] = useState<string>('2021');

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  var chartsWidth =
    windowWidth < 480
      ? 450
      : windowWidth < 768
        ? 600
        : windowWidth < 1024
          ? 720
          : 820;

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
              components={[
                {
                  buttonText: 'Total',
                  component: <LineChart newWidth={chartsWidth} />
                },
                {
                  buttonText: 'Per Capita',
                  component: <LineChart newWidth={chartsWidth} />
                }
              ]}
            />
          </ChartContainer>
        </ChartBody>
      </ChartSection>
    </AssignmentPage>
  );
}
