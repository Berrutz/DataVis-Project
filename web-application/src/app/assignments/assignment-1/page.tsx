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
          {/* <ChartContainer asidename="Chart" asidekey="chart-2" id="chart-2">
            <UEEmissionDecade />
          </ChartContainer> */}
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
          </ChartContainer>
        </ChartBody>
      </ChartSection>
      <div className="h-[400vh]" />
    </AssignmentPage>
  );
}
