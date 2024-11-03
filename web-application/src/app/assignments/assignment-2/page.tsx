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

import StackedBarChart from "./_components/UE-emission-top5-StackedBarChart";

export default function Assignment2() {
    return (
        <AssignmentPage title={"Analysis of CO2 emissions Top-5 emitter and other of 2022 "}>
            
            <ChartSection
                asideName="Single Year Comparison of CO2 Top-5 emitter and other"
                id="top5-co2"
                asideKey="top5-co2"
            >
                <ChartHeading>
                    <ChartH1Title>
                        2022 Year Comparison of CO2 between Top-5 emitter and other 
                    </ChartH1Title>
                    <p>
                        This graph compares the CO2 emissions per capita of the member
                        countries of the European Union (EU-27) in a given year, the
                        countries are sorted by their emissions per capita in descending
                        order.
                    </p>
                </ChartHeading>
                <ChartBody>
                    <ChartContainer asideName="Chart" asideKey="chart-1" id="chart-1">
                        <StackedBarChart />
                    </ChartContainer>
                    <ChartContainer
                        asideName="Used Metodologies"
                        id="metodo-1"
                        asideKey="metodo-1"
                    >
                        <ChartH2Title>Used Medotologies</ChartH2Title>
                        <p>
                            From the database provided by Our World In Data containing data
                            on per capita CO2 emissions of all countries, only those relating
                            to the countries of the European Union (EU-27) have been extracted.
                            The data are displayed on request depending on the selected year.
                        </p>
                    </ChartContainer>

                    <ChartContainer
                        asideName="Comment"
                        id="comment-1"
                        asideKey="comment-1"
                    >
                        <ChartH2Title>To add </ChartH2Title>
                    </ChartContainer>
                </ChartBody>
            </ChartSection>

            <div className="h-[400vh]" />
        </AssignmentPage>
    );
}
