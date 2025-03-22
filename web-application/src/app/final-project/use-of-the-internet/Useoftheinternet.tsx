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

import FrequenciesAlluvial from './_components/frequencies_alluvial';
import InternetUseAlluvial from './_components/frequencies_alluvial_b';

export default function Useoftheinternet() {

    return (
    <AssignmentPage title={'Use of the Internet'}>
       {/* ALLUVIAL - FREQUENCIES */}
       <ChartSection
        asidename="Line Chart Temperatures"
        asidekey="line-chart-temperatures"
        id="line-chart-temperatures"
        >
        <ChartHeading>
          <ChartH1Title>
          Frequency of internet use divided by age groups
          </ChartH1Title>
          <p>  
          This is an alluvial chart that represents the distribution of internet usage across different age 
          groups and categories of last internet use. <br></br>
          On the left side, there are four age groups: 16 to 24, 25 to 54, 55 to 70, and 70 and older. 
          On the right side, there are four categories indicating the last time individuals used the internet: 
          in the last 3 months, never, more than a year ago, and between 3 and 12 months ago. <br></br>
          The thickness of each flow between groups and categories represents the number of people in each combination.
          Users can filter the data by selecting the year and country through a selector.  
        </p>
        </ChartHeading>
        <ChartBody>
          {/*
          <ChartContainer
            asidename="Frequency"
            asidekey="Alluvional-chart"
            id="Alluvional-chart"
          > 
          <Frequencies></Frequencies>
         </ChartContainer>
         */}
         {/* Alluvial */ }
         <InternetUseAlluvial
         newWidth={700} newHeight={500} 
         ></InternetUseAlluvial>

        </ChartBody>
        <ChartContainer
          asidename="Comment"
          id="line-chart-temperatures-chart-comment-1"
          asidekey="line-chart-temperatures-chart-comment-1"
        >
          <ChartH2Title>Comment</ChartH2Title>
          <p>
          This visualization allows users to observe how internet usage 
          patterns vary by country and year, highlighting the predominant 
          group of internet users and their frequency of use. <br></br>
          For example, in Italy in 2023, a total of 40,000 people used the internet 
          in the last three months across all age groups. 
          The largest share, around 21,000 users, belonged to the 25 to 54 age group, 
          which is also the most numerous demographic in the country. <br></br>
           This pattern reflects not only digital habits but also population distribution, 
           as larger age groups naturally contribute more to overall internet usage.  
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
          This LineChart displays data for a selected EU country, showing the percentage of individuals 
          who search for information about goods and services, sell goods and services, and participate 
          in social networks over the years. 
          The X-axis represents the years from 2013 to 2023, while the Y-axis indicates the percentage 
          of the population engaged in the selected activity. 
          A country selector allows users to choose the country they want to analyze.
          </p>
        </ChartHeading>
        <ChartBody>
          
          <Activities></Activities>
         
        </ChartBody>
        <ChartContainer
          asidename="Comment"
          id="line-chart-activities-chart-comment-1"
          asidekey="line-chart-activities-chart-comment-1"
        >
          <ChartH2Title>Comment</ChartH2Title>
          <p>
          Observing the charts for the selected country and, more generally, across the EU, 
          we notice a steady increasing trend from 2013 to 2024 in the percentage of individuals 
          engaging in social network activities, searching for information about goods and services , 
          and selling goods and services. 
          This upward trend suggests a growing reliance on digital platforms for both social interactions and economic activities.
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
          The following graph is a Bubble Chart, and its concept is outlined below. 
          The idea is to merge two datasets from EUROSTAT to determine the percentage of individuals investing and 
          what they invest in , depending on the country. <br></br>
          The datasets used include the percentage of people who bought or sold shares or other investments from 2013 to 2024 
          across Europe and the percentage of people living in the selected country . <br></br>
          The goal is to visualize this information through a Bubble Chart, where the bubble size represents the 
          ratio between the percentage of investors and the country's population, highlighting which countries contribute 
          the most in absolute numbers. <br></br>
          The bubble color corresponds to the country, while the number of bubbles varies by year, meaning multiple bubbles 
          of the same color exist for different years. <br></br>
          The bubble positions are dynamically arranged, ensuring an intuitive representation of financial 
          engagement across different nations and years. This chart ultimately aims to illustrate which country, in which year, 
          had the highest number of individuals actively participating in the financial market.
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
          The Bubble Chart illustrates the distribution of individuals engaging in financial 
          investments across different European countries and years. 
          Notably, Sweden in 2016 has one of the largest bubbles, despite having fewer absolute 
          investors compared to other countries. This is due to the fact that, in terms of percentage, 
          Sweden had the highest proportion of its population participating in financial investments that year. 
          The chart effectively highlights how a country's investment activity can be 
          significant not only in raw numbers but also in relation to its total population.
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