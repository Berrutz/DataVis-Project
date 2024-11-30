'use client';
import { useEffect, useState } from 'react';
import AssignmentPage from '../_components/assignment-page';

import {
  ChartContainer,
  ChartHeading,
  ChartSection,
  ChartH1Title,
  ChartH2Title,
  ChartBody
} from '../_components/chart-section';

import Alluvial from './_components/Alluvial';

export default function Assignment2() {
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
    <AssignmentPage title={'Analysis of Energy Consumption EU-27'}>
      <ChartSection
        asidename="Single Year Energy Comparison"
        id="single-energy"
        asidekey="Analysis of Energy Consumption EU Country 2021"
      >
        <ChartHeading>
          <ChartH1Title>
            Single year comparison of energy consumption by source
          </ChartH1Title>
          <p>
            This chart compares, in terms of primary energy, the energy
            consumption mix of the 7 European Union (EU-27) member countries
            with the highest energy consumption (TWh) for a given year; the
            countries are ranked in descending order of consumption.
          </p>
        </ChartHeading>
        <ChartBody>
          <ChartContainer asidename="Chart" asidekey="chart-1" id="chart-1">
            <Alluvial
              newWidth={
                windowWidth < 768 ? 600 : windowWidth < 1024 ? 700 : 850
              }
            />
          </ChartContainer>
          <ChartContainer
            asidename="Comment"
            id="comment-1"
            asidekey="comment-1"
          >
            <ChartH2Title>Comment</ChartH2Title>
            <p>
              Let's take the year 2023. From the graph it is immediately evident
              the great dependence of European countries on oil, although it is
              almost no longer used for the production of electricity, its use
              is dominant in the transport sector. Another observation that can
              be made is on the high consumption of energy from methane gas,
              this is due to its widespread use for residential buildings (e.g.
              heating) and the fact that in many countries it is an important
              source for the production of electricity. Unfortunately,
              low-carbon sources cover a minority part of total energy
              consumption. From the graph one could conclude that in the year
              2023 Italy did not consume energy produced by nuclear fission,
              this is not true, the graph shows the energy consumption based on
              gross generation and does not account for cross-border electricity
              supply.
            </p>
          </ChartContainer>
        </ChartBody>
      </ChartSection>
    </AssignmentPage>
  );
}
