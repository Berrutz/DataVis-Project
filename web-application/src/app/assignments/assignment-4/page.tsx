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
import RadarChart from './_components/radar-chart';
import RidgeLine from './_components/RidgeLine';

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

  var lineChartWidth =
    windowWidth < 480
      ? 450
      : windowWidth < 768
      ? 600
      : windowWidth < 1024
      ? 720
      : 820;

  var radarChartsWidth =
    windowWidth < 480
      ? 350
      : windowWidth < 768
      ? 500
      : windowWidth < 1024
      ? 650
      : 800;

  return (
    <AssignmentPage title={'Analysis of Temperatures USA'}>
      <ChartSection
        asidename="Line Chart Temperatures"
        asidekey="line-chart-temperatures"
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
            asidekey="line-chart-temperatures-chart"
          >
            <MapContainer
              components={[
                {
                  buttonText: 'Line',
                  component: <LineChart newWidth={lineChartWidth} />
                },
                {
                  buttonText: 'Radar',
                  component: <RadarChart newWidth={radarChartsWidth} />
                }
              ]}
            />
          </ChartContainer>
        </ChartBody>
      </ChartSection>

      <ChartSection
        asidename="Ridgeline Chart Temperatures"
        asidekey="ridge-chart-temperatures"
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
            asidekey="ridge-chart-temperatures-chart"
          >
            <RidgeLine newWidth={lineChartWidth} />
          </ChartContainer>
        </ChartBody>
      </ChartSection>
    </AssignmentPage>
  );
}
