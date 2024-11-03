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

import UEEmission1Year from "./_components/UE-emission-1year-plot";

export default function Assignment1() {
    return (
        <AssignmentPage title={"Analysis of CO2 emissions per capita EU-27"}>
            {/* <UEEmission1Year /> */}
            <ChartSection
                asideName="Single Year Comparison of CO2"
                id="single-co2"
                asideKey="single-co2"
            >
                <ChartHeading>
                    <ChartH1Title>
                        Single year comparison of CO2 emissions per capita
                    </ChartH1Title>
                    <p>
                        This graph compares the CO2 emissions per capita of the member
                        countries of the European Union (EU-27) for a specific year, the
                        countries are sorted by their emissions per capita in descending
                        order.
                    </p>
                </ChartHeading>
                <ChartBody>
                    <ChartContainer
                        asideName="Used Metodologies"
                        id="metodo-1"
                        asideKey="metodo-1"
                    >
                        <ChartH2Title>Used Medotologies</ChartH2Title>
                        <p>
                            From the database provided by Our World In Data containing the
                            data of per capita CO2 emissions of all countries, only the data
                            concerning the European Union (EU-27) countries were extracted.
                        </p>
                    </ChartContainer>
                    <ChartContainer
                        asideName="Comment"
                        id="comment-1"
                        asideKey="comment-1"
                    >
                        <ChartH2Title>Comment</ChartH2Title>
                    </ChartContainer>
                </ChartBody>
            </ChartSection>

            <ChartSection asideName="CO2 Comparison 2012-2022" asideKey="co2-comp-1">
                <ChartHeading>
                    <ChartH1Title>
                        Comparison of CO2 emissions per capita of the decade 2012-2022
                    </ChartH1Title>
                    <p>
                        This graph shows the CO2 emissions per capita of the European Union
                        (EU-27) member countries in the decade 2012-2022, the countries are
                        sorted by per capita emissions in descending order.
                    </p>
                </ChartHeading>
                <ChartBody>
                    <ChartContainer asideName="Used Metodologies" asideKey="usd-2">
                        <ChartH2Title>Used Medotologies</ChartH2Title>
                        <p>
                            From the database provided by Our World In Data containing the
                            data on per capita CO2 emissions of all countries, only the data
                            regarding the countries of the European Union (EU-27) were
                            extracted and an average of the per capita emissions was made in
                            the decade 2012-2022
                        </p>
                    </ChartContainer>
                    <ChartContainer asideName="Comment" asideKey="com-2">
                        <ChartH2Title>Comment</ChartH2Title>
                    </ChartContainer>
                </ChartBody>
            </ChartSection>
            <div className="h-[400vh]" />
        </AssignmentPage>
    );
}
