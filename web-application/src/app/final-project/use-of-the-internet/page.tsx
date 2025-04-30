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

import Financial from './_components/financial';
import DegradingMessages from './_components/degrading_messages';
import Purchase from './_components/purchase';
import Activities from './_components/activities';

import InternetUseAlluvial from './_components/frequencies_alluvial_b';
import FinalPageSectionsNav from '../_components/final-page-sections-nav';
import { H1 } from '@/components/headings';

export default function FinalProjectUseOfInternet() {
  return (
    <div>
      <FinalPageSectionsNav />
      <main className="px-2 mx-auto sm:px-4 min-h-dvh max-w-[1200px]">
        <H1 className="my-12">Use of the Internet</H1>
        <div className="flex flex-col gap-24">
          {/* ALLUVIAL - FREQUENCIES */}
          <div>
            <ChartHeading>
              <ChartH1Title>
                Frequency of internet use divided by age groups
              </ChartH1Title>
              <p>
                This is an alluvial chart that represents the distribution of
                internet usage across different age groups and categories of
                last internet use. <br></br>
                On the left side, there are four age groups: 16 to 24, 25 to 54,
                55 to 70, and 70 and older. On the right side, there are four
                categories indicating the last time individuals used the
                internet: in the last 3 months, never, more than a year ago, and
                between 3 and 12 months ago. <br></br>
                The thickness of each flow between groups and categories
                represents the number of people in each combination. Users can
                filter the data by selecting the year and country through a
                selector.
              </p>
            </ChartHeading>
            <div className="my-6">
              {/* Alluvial */}
              <InternetUseAlluvial
                newWidth={900}
                newHeight={500}
              ></InternetUseAlluvial>
            </div>
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
                For example, in Italy in 2023, a total of 40,000 people used the
                internet in the last three months across all age groups. The
                largest share, around 21,000 users, belonged to the 25 to 54 age
                group, which is also the most numerous demographic in the
                country. <br></br>
                This pattern reflects not only digital habits but also
                population distribution, as larger age groups naturally
                contribute more to overall internet usage.
              </p>
            </ChartContainer>
          </div>
          {/* LINE CHART - FOR WHAT PEOPLE USE INTERNET */}
          <div>
            <ChartHeading>
              <ChartH1Title>Individual Activities on the Internet</ChartH1Title>
              <p>
                This LineChart displays data for a selected EU country, showing
                the percentage of individuals who search for information about
                goods and services, sell goods and services, and participate in
                social networks over the years. The X-axis represents the years
                from 2013 to 2023, while the Y-axis indicates the percentage of
                the population engaged in the selected activity. A country
                selector allows users to choose the country they want to
                analyze.
              </p>
            </ChartHeading>
            <div className="my-6">
              <Activities></Activities>
            </div>
            <ChartContainer
              asidename="Comment"
              id="line-chart-activities-chart-comment-1"
              asidekey="line-chart-activities-chart-comment-1"
            >
              <ChartH2Title>Comment</ChartH2Title>
              <p>
                Observing the charts for the selected country and, more
                generally, across the EU, we notice a steady increasing trend
                from 2013 to 2024 in the percentage of individuals engaging in
                social network activities, searching for information about goods
                and services , and selling goods and services. This upward trend
                suggests a growing reliance on digital platforms for both social
                interactions and economic activities.
              </p>
            </ChartContainer>
          </div>
          {/* BUBBLE - FINANCIAL*/}
          <div>
            <ChartHeading>
              <ChartH1Title>Bubble Chart Financial</ChartH1Title>
              <p>
                The following graph is a Bubble Chart, and its concept is
                outlined below. The idea is to merge two datasets from EUROSTAT
                to determine the percentage of individuals investing and what
                they invest in , depending on the country. <br></br>
                The datasets used include the percentage of people who bought or
                sold shares or other investments from 2013 to 2024 across Europe
                and the percentage of people living in the selected country .{' '}
                <br></br>
                The goal is to visualize this information through a Bubble
                Chart, where the bubble size represents the ratio between the
                percentage of investors and the country's population,
                highlighting which countries contribute the most in absolute
                numbers. <br></br>
                The bubble color corresponds to the country, while the number of
                bubbles varies by year, meaning multiple bubbles of the same
                color exist for different years. <br></br>
                The bubble positions are dynamically arranged, ensuring an
                intuitive representation of financial engagement across
                different nations and years. This chart ultimately aims to
                illustrate which country, in which year, had the highest number
                of individuals actively participating in the financial market.
              </p>
            </ChartHeading>
            <div className="my-6">
              <Financial></Financial>
            </div>
            <ChartContainer
              asidename="Comment"
              id="line-chart-temperatures-chart-comment-1"
              asidekey="line-chart-temperatures-chart-comment-1"
            >
              <ChartH2Title>Comment</ChartH2Title>
              <p>
                The Bubble Chart illustrates the distribution of individuals
                engaging in financial investments across different European
                countries and years. Notably, Sweden in 2016 has one of the
                largest bubbles, despite having fewer absolute investors
                compared to other countries. This is due to the fact that, in
                terms of percentage, Sweden had the highest proportion of its
                population participating in financial investments that year. The
                chart effectively highlights how a country's investment activity
                can be significant not only in raw numbers but also in relation
                to its total population.
              </p>
            </ChartContainer>
          </div>
          {/* FACETED BAR CHART - DEGRADING MESSAGES */}
          <div>
            <ChartHeading>
              <ChartH1Title>Stacked Bar Chart Degrading Messages</ChartH1Title>
              <p>
                The dataset used for the stacked bar chart was preprocessed to
                retain only the relevant information. <br></br>
                Initially, unnecessary columns such as metadata and flags were
                removed. <br></br>
                The dataset was then analyzed to determine the unique categories
                for key attributes: the basis of discrimination, the percentage
                of the population which has been effectively discriminated and
                the geographical area .<br></br>
                Filtering was applied to include only individuals born in non-EU
                countries and measured in terms of percentage values. <br></br>
                The final dataset contains the percentage of individuals in each
                EU country who encountered degrading messages online in 2023,
                categorized by the reason for discrimination.
                <br></br>
                This stacked bar chart visually represents the extent and
                distribution of online discrimination faced by non-EU-born
                individuals across different EU countries, highlighting key
                social issues related to digital interactions.
              </p>
            </ChartHeading>
            <div className="my-6">
              <DegradingMessages></DegradingMessages>
            </div>
            <ChartContainer
              asidename="Comment"
              id="stacked-bar-chart-degrading-messages-comment-1"
              asidekey="stacked-bar-chart-degrading-messages-comment-1"
            >
              <ChartH2Title>Comment</ChartH2Title>
              <p>
                The chart shows that among the European Union countries, the
                Netherlands ranks first, with 48.7% of respondents stating that
                they have encountered degrading or discriminatory messages
                online targeting a group of people in the last three months.
                Additionally, looking at the last stacked chart, it can be
                observed that among these people, 25.37% believed that the
                attacks were due to religious opinions or beliefs.
              </p>
            </ChartContainer>
          </div>
          {/* BAR CHART - PURCHASE */}
          <div>
            <ChartHeading>
              <ChartH1Title>
                Percentage of individual that purchase online in the last 3
                month of the year in the Europe Continent from 2010 to 2024
              </ChartH1Title>
              <p>
                This graph compares the percentage of individuals that purchase
                online in the last 3 month of one of the selected country in the
                Europe Continent . On the x-axis the are the years related to
                the country and the corresponding percentage on the y-axis .
                After preprocessing, we obtain a clean and structured dataset
                that consolidates data from two separate CSV files into a
                single, unified file. This final dataset provides the percentage
                of individuals who made an online purchase in the last three
                months across European countries, covering the period from 2010
                to 2024. The data is organized by country and year, enabling
                easy analysis of trends over time. By merging the two sources,
                we ensure continuity in tracking the evolution of online
                purchasing behavior before and after 2019, offering a
                comprehensive view of digital commerce adoption across Europe.
              </p>
            </ChartHeading>
            <div className="my-6">
              <Purchase></Purchase>
            </div>
            <ChartContainer
              asidename="Comment"
              id="stacked-bar-chart-degrading-messages-comment-1"
              asidekey="stacked-bar-chart-degrading-messages-comment-1"
            >
              <ChartH2Title>Comment</ChartH2Title>
              <p>
                Observing the chart for Italy as the selected country, we notice
                a clear upward trend in the percentage of individuals making
                online purchases over the years. The percentage rises from
                around 10% in 2010 to nearly 40% in 2024. This growth can be
                attributed to several factors, including increased internet
                penetration, improved digital literacy, and the growing
                availability of e-commerce platforms. In earlier years, fewer
                people had internet access, and online shopping was less
                widespread. However, as digital services expanded and became
                more accessible, a larger portion of the population started
                purchasing goods and services online. In recent years, this
                growth appears to have reached a plateau around 40%, suggesting
                that most of the population willing and able to shop online has
                already transitioned, with further increases likely happening at
                a slower rate .
              </p>
            </ChartContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
