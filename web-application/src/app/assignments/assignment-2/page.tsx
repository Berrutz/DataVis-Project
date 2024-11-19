'use client';
import AssignmentPage from '../_components/assignment-page';

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
  return (
    <AssignmentPage title={'Analysis of Energy Consumption EU Countries 2021 '}>
      <ChartSection
        asidename="Single Year Energy Comparison"
        id="single-energy"
        asidekey="Analysis of Energy Consumption EU Country 2021"
      >
        <ChartHeading>
          <ChartH1Title>
            Single year comparison of energy consumption mix
          </ChartH1Title>
          <p>
            This chart compares, in terms of primary energy, the energy
            consumption mix of the 10 European Union (EU-27) member countries
            with the highest energy consumption (TWh) for a given year; the
            countries are ranked in descending order of consumption. It's
            important to note that the energy consumption is based on gross
            generation and does not account for cross-border electricity supply.
          </p>
        </ChartHeading>
        <ChartBody>
          <ChartContainer asidename="Chart" asidekey="chart-1" id="chart-1">
            {<AlluvionalPlot />}
          </ChartContainer>
          <ChartContainer
            asidename="Used Methodologies"
            id="used-metodologies-1"
            asidekey="used-Methodologies-1"
          >
            <ChartH2Title>Used Methodologies</ChartH2Title>
            <p>
              From the database provided by "Our World In Data" containing data
              on energy consumption divided by energy source for all countries,
              only those relating to the countries of the European Union (EU-27)
              have been extracted. The data are displayed on request depending
              on the selected year.
            </p>
          </ChartContainer>
          <ChartContainer
            asidename="Comment"
            id="comment-1"
            asidekey="comment-1"
          >
            <ChartH2Title>Comment</ChartH2Title>
            <p>
              From the graph it is possible to observe the energy consumption
              mix and in a given year. Taking the most recent year (2022) it is
              possible to note how Energy Consumption per capita vary
              considerably between countries that have an energy mix based
              largely on fossil fuels, such as Germany (DEU) and Poland (POL),
              and countries that mainly use low carbon energy sources such as
              France (FRA).
            </p>
          </ChartContainer>
        </ChartBody>
      </ChartSection>
    </AssignmentPage>
  );
}
