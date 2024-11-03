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
            <ChartSection>
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
                    <UEEmission1Year />
                    <ChartContainer>
                        <ChartH2Title>Used Medotologies</ChartH2Title>
                        <p>
                            From the database provided by Our World In Data containing data
                            on per capita CO2 emissions of all countries, only those relating
                            to the countries of the European Union (EU-27) have been extracted.
                            The data are displayed on request depending on the selected year.
                        </p>
                    </ChartContainer>
                    <ChartContainer>
                        <ChartH2Title>Comment</ChartH2Title>dsadsads
                    </ChartContainer>
                </ChartBody>
            </ChartSection>

            <ChartSection>
                <ChartHeading>
                    <ChartH1Title>
                        Decade comparison of CO2 emissions per capita
                    </ChartH1Title>
                    <p>
                        This graph compares the CO2 emissions per capita of the European Union
                        (EU-27) member countries in a given decade, the countries are
                        sorted by per capita emissions in descending order.
                    </p>
                </ChartHeading>
                <ChartBody>
                    <UEEmissionDecade />
                    <ChartContainer>
                        <ChartH2Title>Used Medotologies</ChartH2Title>
                        <p>
                            From the database provided by Our World In Data containing data on per
                            capita CO2 emissions of all countries, only those concerning the
                            countries of the European Union (EU-27) were extracted, subsequently
                            an average of the per capita emissions in the selected decade was carried out.
                        </p>
                    </ChartContainer>
                    <ChartContainer>
                        <ChartH2Title>Comment</ChartH2Title>dsadsads
                    </ChartContainer>
                </ChartBody>
            </ChartSection>
        </AssignmentPage>
    );
}
