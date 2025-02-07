'use client';

import AssignmentPage from '../../assignments/_components/assignment-page';
import {
    ChartBody,
    ChartContainer,
    ChartH1Title,
    ChartH2Title,
    ChartHeading,
    ChartSection
  } from '../../assignments/_components/chart-section';

import Frequencies from './_components/frequencies';
import Financial from './_components/financial';
import DegradingMessages from './_components/degrading_messages';
import Purchase from './_components/purchase';
import Activities from './_components/activities';

export default function Useoftheinternet() {

    return (
    <AssignmentPage title={'Use of the Internet'}>
       {/* ALLUVIAL & BAR CHART - FREQUENCIES */}
       <ChartSection
        asidename="Line Chart Temperatures"
        asidekey="line-chart-temperatures"
        id="line-chart-temperatures"
        >
        <ChartHeading>
          <ChartH1Title>
          Individuals frequencies of access over the internet
          </ChartH1Title>
          <p>
            These graphs show 
          </p>
        </ChartHeading>
        <ChartBody>
          <ChartContainer
            asidename="Frequency"
            asidekey="Alluvional-chart"
            id="Alluvional-chart"
          >
          <Frequencies></Frequencies>
         </ChartContainer>
        </ChartBody>
        <ChartContainer
          asidename="Comment"
          id="line-chart-temperatures-chart-comment-1"
          asidekey="line-chart-temperatures-chart-comment-1"
        >
          <ChartH2Title>Comment</ChartH2Title>
          <p>
            Viewing average maximum and minimum temperatures for a single year
            does not allow us to comment on trends or patterns except for
            typical seasonal variations, with colder months (winter) at the
            start and end of the year and warmer months (summer) in the middle
            of the year.
          </p>
        </ChartContainer>
      </ChartSection>
       {/* LINE CHART - FOR WHAT PEOPLE USE INTERNET */}
       <ChartSection
        asidename="Activities on the Internet"
        asidekey="activities-on-the-Internet"
        id="activities-on-the-Internet"
        >
        <ChartHeading>
          <ChartH1Title>
            Individual Activities on the Internet
          </ChartH1Title>
          <p>
            These graph show on a selected country from the EU the percentage of invididuals that 
            search information about good and services , sell good and services and partecipate in the
            social network along the years . On the X-axis there the years while the Y-axis is related 
            to the percentage of the population that perform the selected activity .

          </p>
        </ChartHeading>
        <ChartBody>
          <ChartContainer
            asidename="LineChart"
            asidekey="LineChart-chart"
            id="LineChart-chart"
          >
          <Activities></Activities>
         </ChartContainer>
        </ChartBody>
        <ChartContainer
          asidename="Comment"
          id="line-chart-activities-chart-comment-1"
          asidekey="line-chart-activities-chart-comment-1"
        >
          <ChartH2Title>Comment</ChartH2Title>
          <p>
            Observing the charts related to the select country in general in the EU we observe
            an increasing trend from 2013 to 2024 in the perctange of individuals that partecipate in 
            social network activities or search for information about goods and services and 
            sell goods and services .
          </p>
        </ChartContainer>
      </ChartSection>
      {/* BUBBLE - FINANCIAL*/}
      <ChartSection
        asidename="Bubble Chart Financial"
        asidekey="bubble-chart-financial"
        id="bubble-chart-financial"
        >
        <ChartHeading>
          <ChartH1Title>
          Bubble Chart Financial
          </ChartH1Title>
          <p>

          </p>
        </ChartHeading>
        <ChartBody>
          <ChartContainer
            asidename="Financial"
            asidekey="Bubble-chart"
            id="Bubble-chart"
          >
          <Financial></Financial>
         </ChartContainer>
        </ChartBody>
        <ChartContainer
          asidename="Comment"
          id="line-chart-temperatures-chart-comment-1"
          asidekey="line-chart-temperatures-chart-comment-1"
        >
          <ChartH2Title>Comment</ChartH2Title>
          <p>
          </p>
        </ChartContainer>
      </ChartSection>
      {/* FACETED BAR CHART - DEGRADING MESSAGES */}
      <ChartSection
        asidename="Stacked Bar Chart Degrading Messages"
        asidekey="stacked-bar-chart-degrading-messages"
        id="stacked-bar-chart-degrading-messages"
        >
        <ChartHeading>
          <ChartH1Title>
          Stacked Bar Chart Degrading Messages
          </ChartH1Title>
          <p>
            These graphs show the maximum (max), minimum (min) and average (avg)
            temperatures month by month over a year. The y-axis displays the
            temperature values in degrees Fahrenheit (°F), while the x-axis
            indicates the month. The graph provides the option to select the
            year and state you want to view. The data can be displayed using a
            Line chart or a Radar chart.
          </p>
        </ChartHeading>
        <ChartBody>
          <ChartContainer
            asidename="Degrading Messages"
            asidekey="Stacked Bar Chart"
            id="stacked-bar-chart"
          >
          <DegradingMessages></DegradingMessages>
         </ChartContainer>
        </ChartBody>
        <ChartContainer
          asidename="Comment"
          id="stacked-bar-chart-degrading-messages-comment-1"
          asidekey="stacked-bar-chart-degrading-messages-comment-1"
        >
          <ChartH2Title>Comment</ChartH2Title>
          <p>
            Viewing average maximum and minimum temperatures for a single year
            does not allow us to comment on trends or patterns except for
            typical seasonal variations, with colder months (winter) at the
            start and end of the year and warmer months (summer) in the middle
            of the year.
          </p>
        </ChartContainer>
      </ChartSection>
      {/* BAR CHART - PURCHASE */}
      <ChartSection
        asidename="Bar Chart Purchase"
        asidekey="Bar-Chart-Purchase"
        id="Bar-Chart-Purchase"
        >
        <ChartHeading>
          <ChartH1Title>
          Percentage of individual that purchase online in the last 3 month of the year in the Europe Continent from 2010 to 2024
          </ChartH1Title>
          <p>
          This graph compares the percentage of individuals that purchase online in the last 3 month of one of the selected country in the Europe Continent . 
          On the x-axis the are the years related to the country and the corresponding percentage on the y-axis .
          </p>
        </ChartHeading>
        <ChartBody>
          <ChartContainer
            asidename="Degrading Messages"
            asidekey="Stacked Bar Chart"
            id="stacked-bar-chart"
          >
          <Purchase></Purchase>
         </ChartContainer>
        </ChartBody>
        <ChartContainer
          asidename="Comment"
          id="stacked-bar-chart-degrading-messages-comment-1"
          asidekey="stacked-bar-chart-degrading-messages-comment-1"
        >
          <ChartH2Title>Comment</ChartH2Title>
          <p>
            Viewing average maximum and minimum temperatures for a single year
            does not allow us to comment on trends or patterns except for
            typical seasonal variations, with colder months (winter) at the
            start and end of the year and warmer months (summer) in the middle
            of the year.
          </p>
        </ChartContainer>
      </ChartSection>
    </AssignmentPage>
    );
}