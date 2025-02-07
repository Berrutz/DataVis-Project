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

export default function Useoftheinternet() {

    return (
    <AssignmentPage title={'Use of the Internet'}>
       {/* <BarChart x={} ></BarChart> */}
       <ChartSection
        asidename="Line Chart Temperatures"
        asidekey="line-chart-temperatures"
        id="line-chart-temperatures"
        >
        <ChartHeading>
          <ChartH1Title>
            Maximum, Minimum and Average Monthly Temperatures per Year
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
            Viewing average maximum and minimum temperatures for a single year
            does not allow us to comment on trends or patterns except for
            typical seasonal variations, with colder months (winter) at the
            start and end of the year and warmer months (summer) in the middle
            of the year.
          </p>
        </ChartContainer>
      </ChartSection>
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