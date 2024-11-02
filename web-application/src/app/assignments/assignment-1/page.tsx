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
            {<UEEmission1Year />}
            <ChartSection>
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
                    <ChartContainer>
                        <ChartH2Title>Used Medotologies</ChartH2Title>dsadsadsa
                    </ChartContainer>
                    <ChartContainer>
                        <ChartH2Title>Comment</ChartH2Title>dsadsads
                    </ChartContainer>
                </ChartBody>
            </ChartSection>
        </AssignmentPage>
    );
}
