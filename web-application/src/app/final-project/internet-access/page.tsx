'use client';

import AssignmentPage from '@/app/assignments/_components/assignment-page';
import {
  ChartBody,
  ChartContainer,
  ChartH1Title,
  ChartH2Title,
  ChartHeading,
  ChartSection
} from '@/app/assignments/_components/chart-section';
import MapContainer from '@/components/map-switch-container';
import InternetAccessBarChart from './_components/charts/internet-access-barchart';
import InternetAccessMap from './_components/charts/internet-access-map';
import InternetAccessFacetedBarChart from './_components/charts/internet-access-faceted-barchart';
import InternetUseLineChart from './_components/charts/internet-use-linechart';
import ComputerUseAlluvial from './_components/charts/computer-use-alluvial';

export default function FinalProjectInternetAccess() {
  return (
    <AssignmentPage title={'Internet Access - EU'}>
      {/* BAR AND MAP CHARTS */}
      <ChartSection
        asidename="Internet Coverage Charts"
        asidekey="bar-map-chart-internet-access"
        id="bar-map-chart-internet-access"
      >
        <ChartHeading>
          <ChartH1Title>
            What's the percentage of households with internet access at home?
          </ChartH1Title>
          <p>
            Let's start by understanding first what the state of the art is for
            EU countries. <br></br>
            These charts compare the percentage of households with an internet
            connection at home across EU countries.
          </p>
        </ChartHeading>
        <ChartBody>
          <MapContainer
            components={[
              {
                buttonText: 'Bar',
                component: (
                  <InternetAccessBarChart newWidth={700} newHeight={550} />
                )
              },
              {
                buttonText: 'Map',
                component: <InternetAccessMap newWidth={700} newHeight={550} />
              }
            ]}
          />
        </ChartBody>
        <ChartContainer
          asidename="Comment"
          id="bar-map-chart-internet-access-comment-1"
          asidekey="bar-map-chart-internet-access-comment-1"
        >
          <ChartH2Title>Comment</ChartH2Title>
          <p>
            As we can see from the graph for EU countries today (2024) almost
            all private homes have an internet connection, this is no longer
            true if we go back even just ten years where the disparity in the
            levels of digitalization between the countries of Northern Europe
            compared to those of the South and East was quite evident. This
            graph gives us an idea of the speed and capillarity with which the
            internet has spread, becoming today a tool within everyone's reach.
          </p>
        </ChartContainer>
      </ChartSection>
      {/* FACETED BAR CHART */}
      <ChartSection
        asidename="Reasons for not having Internet Access"
        asidekey="reasons-internet-access"
        id="reasons-internet-access"
      >
        <ChartHeading>
          <ChartH1Title>
            What are the reasons why people don't have internet at home?
          </ChartH1Title>
          <p>
            Now that we have an idea of the number of private households that
            have internet at home, let's try to investigate why these people do
            not have internet. This faceted bar chart shows the results of a
            survey conducted annually until 2019 regarding the reasons why an
            individual does not have an internet connection at home, the
            expected answers in the survey were the following: access costs are
            too high (telephone, etc.), broadband is not available in the area,
            access elsewhere, equipment costs are too high, access not needed
            (content is not useful, interesting, etc.), other reasons, privacy
            or security concerns and lack of skills.
          </p>
        </ChartHeading>
        <ChartBody>
          <InternetAccessFacetedBarChart
            newWidth={700}
            newHeight={500}
          ></InternetAccessFacetedBarChart>
        </ChartBody>
        <ChartContainer
          asidename="Comment"
          id="reasons-internet-access-comment-1"
          asidekey="reasons-internet-access-comment-1"
        >
          <ChartH2Title>Comment</ChartH2Title>
          <p>
            Looking carefully at the graph, it is possible to notice a more or
            less marked trend depending on the country, in 2019 compared to
            2011, the percentage of people who do not have internet due to lack
            of skill or because they do not want to have it is higher. This fact
            is positive because it tells us that people do not have internet at
            home by choice and not because access is prohibitive for example due
            to the cost.
          </p>
        </ChartContainer>
      </ChartSection>
      {/* LINE CHART */}
      <ChartSection
        asidename="People that has Never Used Internet"
        asidekey="people-that-use-internet"
        id="people-that-use-internet"
      >
        <ChartHeading>
          <ChartH1Title>
            How has the percentage of people who have never used the internet
            changed?
          </ChartH1Title>
          <p>
            Let's analyze the capillarity of the diffusion of the internet,
            therefore of digitalization, from another point of view and ask
            ourselves how many people have never used the internet. This
            linechart shows the percentage of people who have never used the
            internet from 2005 to 2024 for each EU country.
          </p>
        </ChartHeading>
        <ChartBody>
          <InternetUseLineChart
            newWidth={700}
            newHeight={550}
          ></InternetUseLineChart>
        </ChartBody>
        <ChartContainer
          asidename="Comment"
          id="people-that-use-internet-comment-1"
          asidekey="people-that-use-internet-comment-1"
        >
          <ChartH2Title>Comment</ChartH2Title>
          <p>
            Looking at the graph, we can see how over the years the percentage
            of people who have never used the Internet has decreased
            significantly in all countries, further confirming the growing
            adoption of digital. In 2024, most countries seem to have reached
            very low levels, suggesting almost universal Internet use in many EU
            nations. There is a very important aspect to highlight and we will
            do so by taking Italy as an example: from 2005 to 2024 the
            percentage of people who have never used the Internet has decreased
            by almost 50%. This also allows us to understand the importance of
            educating the population in the use of these new technologies, given
            the short time interval that many users have had to familiarize
            themselves with it.
          </p>
        </ChartContainer>
      </ChartSection>
      {/* FACETED BAR CHART - DEGRADING MESSAGES */}
      <ChartSection
        asidename="Frequency of Computer Use"
        asidekey="frequency-of-computer-use"
        id="frequency-of-computer-use"
      >
        <ChartHeading>
          <ChartH1Title>Frequency of Computer Use</ChartH1Title>
          <p>
            The dataset used for the stacked bar chart was preprocessed to
            retain only the relevant information. <br></br>
            Initially, unnecessary columns such as metadata and flags were
            removed. <br></br>
            The dataset was then analyzed to determine the unique categories for
            key attributes: the basis of discrimination, the percentage of the
            population which has been effectively discriminated and the
            geographical area .<br></br>
            Filtering was applied to include only individuals born in non-EU
            countries and measured in terms of percentage values. <br></br>
            The final dataset contains the percentage of individuals in each EU
            country who encountered degrading messages online in 2023,
            categorized by the reason for discrimination.
            <br></br>
            This stacked bar chart visually represents the extent and
            distribution of online discrimination faced by non-EU-born
            individuals across different EU countries, highlighting key social
            issues related to digital interactions.
          </p>
        </ChartHeading>
        <ChartBody>
          <ComputerUseAlluvial
            newWidth={700}
            newHeight={600}
          ></ComputerUseAlluvial>
        </ChartBody>
        <ChartContainer
          asidename="Comment"
          id="frequency-of-computer-use-comment-1"
          asidekey="frequency-of-computer-use-comment-1"
        >
          <ChartH2Title>Comment</ChartH2Title>
          <p>
            The chart shows that among the European Union countries, the
            Netherlands ranks first, with 48.7% of respondents stating that they
            have encountered degrading or discriminatory messages online
            targeting a group of people in the last three months. Additionally,
            looking at the last stacked chart, it can be observed that among
            these people, 25.37% believed that the attacks were due to religious
            opinions or beliefs.
          </p>
        </ChartContainer>
      </ChartSection>
    </AssignmentPage>
  );
}
