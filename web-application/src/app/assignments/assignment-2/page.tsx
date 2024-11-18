

'use client';
import AssignmentPage from "../_components/assignment-page";
import { useEffect, useState } from 'react';

import {
    ChartContainer,
    ChartHeading,
    ChartSection,
    ChartH1Title,
    ChartH2Title,
    ChartBody
  } from '../_components/chart-section';

import AlluvionalPlot from './_components/Alluvional';
//import AlluvionalVertical from './_components/AlluvionalVertical';

export default function Assignment2() {

  const [windowWidth, setWindowWidth] = useState<number>(1024);
  const [isVertical, setIsVertical] = useState(false);

    useEffect(() => {
    const handleResize = () => {
        const currentWidth = window.innerWidth;
        setWindowWidth(currentWidth);
        setIsVertical(currentWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AssignmentPage title={'Analysis of Energy Consumption EU Country 2021 '}>
      <ChartSection
        asidename="Single Year Comparison of Energy"
        id="single-energy"
        asidekey="Analysis of Energy Consumption EU Country 2021"
      >
        <ChartHeading>
          <ChartH1Title>
            Single year comparison of Energy Consumption per capita
          </ChartH1Title>
          <p>
            This graph compares the Energy Consumption per capita of the member
            countries of the European Union (EU-27) in a given year, the
            countries are sorted by their Consumption per capita in descending
            order.
          </p>
        </ChartHeading>
        <ChartBody>
          <ChartContainer asidename="Chart" asidekey="chart-1" id="chart-1">
            {
              <AlluvionalPlot />
            }
          </ChartContainer>
          <ChartContainer
            asidename="Used Methodologies"
            id="used-metodologies-1"
            asidekey="used-Methodologies-1"
          >
            <ChartH2Title>Used Methodologies</ChartH2Title>
            <p>
              From the database provided by "Our World In Data" containing data
              on per capita Energy Consumption of all countries, only those relating
              to the countries of the European Union (EU-27) have been
              extracted. The data are displayed on request depending on the
              selected year.
            </p>
          </ChartContainer>
          <ChartContainer
            asidename="Comment"
            id="comment-1"
            asidekey="comment-1"
          >
            <ChartH2Title>Comment</ChartH2Title>
            <p>
              From the graph it is possible to observe only the Energy Consumption
              per capita in a given year, but this still allows us to make some
              considerations. Taking the most recent year (2022) it is possible
              to note how Energy Consumption per capita vary considerably between
              countries that have an energy mix based largely on fossil fuels,
              such as Germany (DEU) and Poland (POL), and countries that mainly
              use low carbon energy sources such as France (FRA). A further
              observation to make is that the country with the highest Energy
              Consumption per capita is Luxembourg (LUX), this is mainly due to
              the fact that it is a highly industrialized country, has a small
              population and is subject to the phenomenon of "fuel tourism", due
              to the reduced taxation on fuels many non-residents buy fuel in
              Luxembourg, thus artificially increasing fuel consumption and
              consequently the statistics on Energy Consumption of the country.
            </p>
          </ChartContainer>
        </ChartBody>
      </ChartSection>

    </AssignmentPage>
  );
}
