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
import LineChart from './_components/LineChart';
import MapContainer from '@/components/map-switch-container';
import RadarChart from './_components/radar-chart';
import RidgeLineChart from './_components/ridgeline-chart';

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

  var ridgeChartWidth =
    windowWidth < 480
      ? 400
      : windowWidth < 640
      ? 500
      : windowWidth < 768
      ? 600
      : windowWidth < 1024
      ? 720
      : 820;

  return (
    <AssignmentPage title={'Analysis of Temperatures USA'}>
      <ChartSection
        asidename="Line Chart Temperatures"
        asidekey="line-chart-temperatures"
      >
        <ChartHeading>
          <ChartH1Title>
            Maximum, Minimum and Average Monthly Temperatures per Year
          </ChartH1Title>
          <p>
            These graphs show the maximum (max), minimum (min) and average (avg)
            temperatures month by month over a year. The y-axis displays the
            temperature values in degrees Fahrenheit (°F), while the x-axis
            indicates the month. The graph provides the option to select the
            year and state you want to view. The data can be displayed using a
            Line chart or a Radar chart.
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
        <ChartContainer asidename="Comment" id="comment-1" asidekey="comment-1">
          <ChartH2Title>Comment</ChartH2Title>
          <p>
            Viewing average maximum and minimum temperatures for a single year
            does not allow us to comment on trends or patterns except for
            typical seasonal variations, with colder months (winter) at the
            start and end of the year and warmer months (summer) in the middle
            of the year.
          </p>
        </ChartContainer>
      </ChartSection>

      <ChartSection
        asidename="Ridgeline Chart Temperatures"
        asidekey="ridge-chart-temperatures"
      >
        <ChartHeading>
          <ChartH1Title>Temperature Distribution per Decade</ChartH1Title>
          <p>
            This graph visualizes the distribution of minimum (min) and maximum
            (max) temperatures recorded in a month over each decade, starting
            from 1890 through 2020. The blue ridgelines represent the
            distribution of minimum temperatures, while the orange ridgelines
            represent the maximum temperatures. The x-axis displays the
            temperature values in degrees Fahrenheit (°F), while the y-axis
            indicates the decades. The graph provides the option to select the
            state for which you want to display the temperature distribution.
          </p>
        </ChartHeading>
        <ChartBody>
          <ChartContainer
            asidename="Chart"
            asidekey="ridge-chart-temperatures-chart"
          >
            <RidgeLineChart newWidth={ridgeChartWidth}></RidgeLineChart>
          </ChartContainer>
        </ChartBody>
        <ChartContainer asidename="Comment" id="comment-2" asidekey="comment-2">
          <ChartH2Title>Comment</ChartH2Title>
          <p>
            Regardless of the state selected, looking at the graph, it is
            possible to notice a warming trend consistent with climate change
            over the decades. Focusing on maximum temperatures, it is possible
            to notice that the left tail of the distribution is shorter in the
            2020s, this indicates that in the winter months, higher maximum
            temperatures were recorded compared to other decades, for some
            states it is possible to notice new records of maximum temperatures
            or more pronounced peaks for high temperature values. Similar trends
            can also be noted for minimum temperatures.
          </p>
        </ChartContainer>
      </ChartSection>
    </AssignmentPage>
  );
}
