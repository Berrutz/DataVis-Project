"use client";

import AssignmentPage from "../_components/assignment-page";
import {
  ChartContainer,
  ChartHeading,
  ChartSection,
  ChartH1Title,
  ChartH2Title,
  ChartBody,
} from "../_components/chart-section";

import UEEmission1Year from "./_components/UE-emission-1year";
import UEEmissionDecade from "./_components/UE-emission-decade";
import StackedBarChart from "./_components/UE-emission-top5-StackedBarChart";
import StackedBarChart2 from "./_components/UE-emission-top5-StackedBarChart-2";

export default function Assignment1() {
  return (
    <AssignmentPage title={"Analysis of CO2 emissions per capita EU-27"}>
      <ChartSection
        asidename="Single Year Comparison of CO2"
        id="single-co2"
        asidekey="Analysis of CO2 emissions per capita EU-27"
      >
        <ChartHeading>
          <ChartH1Title>
            Single year comparison of CO2 emissions per capita
          </ChartH1Title>
          <p>
            This graph compares the CO2 emissions per capita of the member
            countries of the European Union (EU-27) in a given year, the
            countries are sorted by their emissions per capita in descending
            order.
          </p>
        </ChartHeading>
        <ChartBody>
          <ChartContainer asidename="Chart" asidekey="chart-1" id="chart-1">
            <UEEmission1Year />
          </ChartContainer>
          <ChartContainer
            asidename="Used Metodologies"
            id="used-metodologies-1"
            asidekey="used-metodologies-1"
          >
            <ChartH2Title>Used Medotologies</ChartH2Title>
            <p>
              From the database provided by Our World In Data containing data on
              per capita CO2 emissions of all countries, only those relating to
              the countries of the European Union (EU-27) have been extracted.
              The data are displayed on request depending on the selected year.
            </p>
          </ChartContainer>
          <ChartContainer
            asidename="Comment"
            id="comment-1"
            asidekey="comment-1"
          >
            <ChartH2Title>Comment</ChartH2Title>
            <p>
              From the graph it is possible to observe only the CO2 emissions per
              capita in a given year, but this still allows us to make some considerations.
              Taking the most recent year (2022) it is possible to note how CO2
              emissions per capita vary considerably between countries that have
              an energy mix based largely on fossil fuels, such as Germany (DEU)
              and Poland (POL), and countries that mainly use low carbon energy
              sources such as France (FRA). A further observation to make is that
              the country with the highest CO2 emissions per capita is Luxembourg,
              this is mainly due to the fact that it is a highly industrialized
              country, has a small population and is subject to the phenomenon of
              "fuel tourism", due to the reduced taxation on fuels many non-residents
              buy fuel in Luxembourg, thus artificially increasing fuel consumption
              and consequently the statistics on CO2 emissions of the country.
            </p>
          </ChartContainer>
        </ChartBody>
      </ChartSection>

      <ChartSection
        asidename="CO2 Decade Comparison"
        id="CO2 Decade Comparison"
        asidekey="CO2 Decade Comparison"
      >
        <ChartHeading>
          <ChartH1Title>
            Decade comparison of CO2 emissions per capita
          </ChartH1Title>
          <p>
            This graph compares the CO2 emissions per capita of the European
            Union (EU-27) member countries in a given decade, the countries are
            sorted by per capita emissions in descending order.
          </p>
        </ChartHeading>
        <ChartBody>
          <ChartContainer asidename="Chart" asidekey="chart-2" id="chart-2">
            <UEEmissionDecade />
          </ChartContainer>
          <ChartContainer
            asidename="Used Metodologies"
            id="used-metodologies-2"
            asidekey="used-metodologies-2"
          >
            <ChartH2Title>Used Medotologies</ChartH2Title>
            <p>
              From the database provided by Our World In Data containing data on
              per capita CO2 emissions of all countries, only those concerning
              the countries of the European Union (EU-27) were extracted,
              subsequently an average of the per capita emissions in the
              selected decade was carried out.
            </p>
          </ChartContainer>
          <ChartContainer
            asidename="Comment"
            id="comment-2"
            asidekey="comment-2"
          >
            <ChartH2Title>Comment</ChartH2Title>
            <p>
              From the graph it is possible to observe the CO2 emissions per capita
              in a given decade, this allows us to make observations on a larger
              time scale. Taking into account the decade 2003-2012 and 2013-2022
              we can observe that in the latter there was a general decrease in
              emissions per capita in the EU countries, this decrease can be
              attributed to the efforts of the member countries to honor the Paris
              agreements signed in 2016.
            </p>
          </ChartContainer>
        </ChartBody>
      </ChartSection>


      <ChartSection
        asidename="CO2 StackedBarChart Comparison"
        id="CO2 StackedBarChart Comparison"
        asidekey="CO2 StackedBarChart Comparison"
      >
        <ChartHeading>
          <ChartH1Title>
            Comparison of CO2 emissions per capita top 5 emitters with the others country
          </ChartH1Title>
          <p>
            This chart compares the 5 EU countries with the highest per capita CO2
            emissions in 2022 with all other member countries.
          </p>
        </ChartHeading>
        <ChartBody>
          <ChartContainer asidename="Chart" asidekey="chart-3" id="chart-3">
            <StackedBarChart />
          </ChartContainer>
          <ChartContainer
            asidename="Used Metodologies"
            id="used-metodologies-3"
            asidekey="used-metodologies-3"
          >
            <ChartH2Title>Used Medotologies</ChartH2Title>
            <p>
              From the database provided by Our World in Data containing data on per
              capita CO2 emissions of all countries, only those relating to the countries
              of the European Union (EU-27) in the year 2022 were extracted, from there
              the 5 countries with the highest emissions were taken and a single entity
              containing the sum of the emissions of all countries was created.
            </p>
          </ChartContainer>
          <ChartContainer
            asidename="Comment"
            id="comment-3"
            asidekey="comment-3"
          >
            <ChartH2Title>Comment</ChartH2Title>
            <p>
              The information that can be extracted from this graph is that among
              the 27 member countries there is none whose per capita emissions are
              considerably higher than the others.
            </p>
          </ChartContainer>
        </ChartBody>
      </ChartSection>


      <ChartSection
        asidename="CO2 StackedBarChart Comparison"
        id="CO2 StackedBarChart Comparison"
        asidekey="CO2 StackedBarChart Comparison"
      >
        <ChartHeading>
          <ChartH1Title>
            StackedBarChart comparison of CO2 emissions per capita
          </ChartH1Title>
          <p>
            This graph compares the CO2 emissions per capita of the European
            Union (EU-27) member countries in a given StackedBarChart.
          </p>
        </ChartHeading>
        <ChartBody>
          <ChartContainer asidename="Chart" asidekey="chart-4" id="chart-4">
            <StackedBarChart2 />
          </ChartContainer>
          <ChartContainer
            asidename="Used Metodologies"
            id="used-metodologies-4"
            asidekey="used-metodologies-4"
          >
            <ChartH2Title>Used Medotologies</ChartH2Title>
            <p>
              From the database provided by Our World In Data containing data on
              per capita CO2 emissions of all countries, only those concerning
              the countries of the European Union (EU-27) were extracted .
            </p>
          </ChartContainer>
          <ChartContainer
            asidename="Comment"
            id="comment-4"
            asidekey="comment-4"
          >
            <ChartH2Title>Comment</ChartH2Title>
          </ChartContainer>
        </ChartBody>
      </ChartSection>



      <div className="h-[400vh]" />
    </AssignmentPage>
  );
}
