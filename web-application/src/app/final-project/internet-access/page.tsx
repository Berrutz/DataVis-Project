'use client';

import {
  ChartContainer,
  ChartH1Title,
  ChartH2Title,
  ChartHeading
} from '@/app/assignments/_components/chart-section';
import MapContainer from '@/components/map-switch-container';
import InternetAccessBarChart from './_components/charts/internet-access-barchart';
import InternetAccessMap from './_components/charts/internet-access-map';
import InternetAccessFacetedBarChart from './_components/charts/internet-access-faceted-barchart';
import InternetUseLineChart from './_components/charts/internet-use-linechart';
import ComputerUseAlluvial from './_components/charts/computer-use-alluvial';
import FinalPageSectionsNav from '../_components/final-page-sections-nav';
import { H1 } from '@/components/headings';
import { useEffect, useState } from 'react';

export default function FinalProjectInternetAccess() {
  const smScreen = 640;
  const mdScreen = 768;
  const lgScreen = 1024;
  const xlScreen = 1280;

  const [windowWidth, setWindowWidth] = useState<number>(xlScreen);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      setWindowWidth(currentWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <FinalPageSectionsNav />
      <main className="px-2 mx-auto sm:px-4 min-h-dvh max-w-[1200px]">
        <H1 className="my-12">Internet Access</H1>
        <p className="mb-12">
          In this section we analyze the digitalization levels across EU
          countries using visualizations based on Eurostat datasets.
          Specifically, We compare households with access to the Internet at
          home acros member states, investigate the reasons why people don't
          have internet at home, observe how the percentage of people who are
          familiar with the internet or the digital world varies over the years,
          and if this variation is uniform acros age groups.
        </p>
        <div className="flex flex-col gap-24">
          {/* BAR AND MAP CHARTS */}
          <div>
            <ChartHeading>
              <ChartH1Title>
                What's the percentage of households with internet access at
                home?
              </ChartH1Title>
              <p>
                Let's start by understanding first what the state of the art is
                for EU countries. These charts compare the percentage of
                households with an internet connection at home across EU
                countries.
              </p>
            </ChartHeading>
            <div className="my-6">
              <MapContainer
                components={[
                  {
                    buttonText: 'Bar',
                    component: (
                      <InternetAccessBarChart
                        newWidth={
                          windowWidth < smScreen
                            ? 500
                            : windowWidth < mdScreen
                            ? 600
                            : windowWidth < lgScreen
                            ? 700
                            : 800
                        }
                        newHeight={550}
                      />
                    )
                  },
                  {
                    buttonText: 'Map',
                    component: (
                      <InternetAccessMap
                        newWidth={
                          windowWidth < smScreen
                            ? 500
                            : windowWidth < mdScreen
                            ? 600
                            : windowWidth < lgScreen
                            ? 700
                            : 800
                        }
                        newHeight={550}
                      />
                    )
                  }
                ]}
              />
            </div>
            <ChartContainer
              asidename="Comment"
              id="bar-map-chart-internet-access-comment-1"
              asidekey="bar-map-chart-internet-access-comment-1"
            >
              <ChartH2Title>Comment</ChartH2Title>
              <p>
                As we can see from the graph for EU countries today (2024)
                almost all private homes have an internet connection, this is no
                longer true if we go back even just ten years where the
                disparity in the levels of digitalization between the countries
                of Northern Europe compared to those of the South and East was
                quite evident. This graph gives us an idea of the speed and
                capillarity with which the internet has spread, becoming today a
                tool within everyone's reach.
              </p>
            </ChartContainer>
          </div>
          {/* FACETED BAR CHART */}
          <div>
            <ChartHeading>
              <ChartH1Title>
                What are the reasons why people don't have internet at home?
              </ChartH1Title>
              <p>
                Now that we have an idea of the number of private households
                that have internet at home, let's try to investigate why these
                people do not have internet. This faceted bar chart shows the
                results of a survey conducted annually until 2019 regarding the
                reasons why an individual does not have an internet connection
                at home, the expected answers in the survey were the following:
                access costs are too high (telephone, etc.), broadband is not
                available in the area, access elsewhere, equipment costs are too
                high, access not needed (content is not useful, interesting,
                etc.), other reasons, privacy or security concerns and lack of
                skills.
              </p>
            </ChartHeading>
            <div className="my-6">
              <InternetAccessFacetedBarChart
                newWidth={
                  windowWidth < smScreen
                    ? 600
                    : windowWidth < mdScreen
                    ? 700
                    : windowWidth < lgScreen
                    ? 800
                    : 1000
                }
                newHeight={500}
              ></InternetAccessFacetedBarChart>
            </div>
            <ChartH2Title>Comment</ChartH2Title>
            <p>
              Looking carefully at the graph, it is possible to notice a more or
              less marked trend depending on the country, in 2019 compared to
              2011, the percentage of people who do not have internet due to
              lack of skill or because they do not want to have it is higher.
              This fact is positive because it tells us that people do not have
              internet at home by choice and not because access is prohibitive
              for example due to the cost.
            </p>
          </div>
          {/* LINE CHART */}
          <div>
            <ChartHeading>
              <ChartH1Title>
                How has the percentage of people who have never used the
                internet changed?
              </ChartH1Title>
              <p>
                Let's analyze the capillarity of the diffusion of the internet,
                therefore of digitalization, from another point of view and ask
                ourselves how many people have never used the internet. This
                linechart shows the percentage of people who have never used the
                internet from 2005 to 2024 for each EU country.
              </p>
            </ChartHeading>
            <div className="my-6">
              <InternetUseLineChart
                newWidth={
                  windowWidth < mdScreen
                    ? 650
                    : windowWidth < lgScreen
                    ? 750
                    : 1000
                }
                newHeight={windowWidth < mdScreen ? 450 : 550}
              ></InternetUseLineChart>
            </div>
            <ChartContainer
              asidename="Comment"
              id="frequency-of-computer-use-comment-1"
              asidekey="frequency-of-computer-use-comment-1"
            >
              <ChartH2Title>Comment</ChartH2Title>
              <p>
                Looking at the graph, we can see how over the years the
                percentage of people who have never used the Internet has
                decreased significantly in all countries, further confirming the
                growing adoption of digital. In 2024, most countries seem to
                have reached very low levels, suggesting almost universal
                Internet use in many EU nations. There is a very important
                aspect to highlight and we will do so by taking Italy as an
                example: from 2005 to 2024 the percentage of people who have
                never used the Internet has decreased by almost 50%. This also
                allows us to understand the importance of educating the
                population in the use of these new technologies, given the short
                time interval that many users have had to familiarize themselves
                with it.
              </p>
            </ChartContainer>
          </div>
          {/* FACETED BAR CHART - DEGRADING MESSAGES */}
          <div>
            <ChartHeading>
              <ChartH1Title>
                Is the level of digitalization uniform across all age groups?
              </ChartH1Title>
              <p>
                We have observed how the use of the internet and digitalization
                have spread more and more and very quickly in the last 10-15
                years, but is this spread equivalent in all age groups?{' '}
                <br></br>
                This graph allows us to observe the various levels of
                digitalization of EU countries for the years between 2005 and
                2017 for the following age groups: 16 to 24 years old, 25 to 54
                years old, 55 to 74 years old and 75 years old or more. The
                indicator of the level of digitalization is represented by the
                last time an individual used a computer, the time frames are:
                within the last 3 months, between 3 and 12 months ago, more than
                a year ago and never.
              </p>
            </ChartHeading>
            <div className="my-6">
              <ComputerUseAlluvial
                newWidth={
                  windowWidth < smScreen
                    ? 550
                    : windowWidth < mdScreen
                    ? 650
                    : windowWidth < lgScreen
                    ? 750
                    : 1000
                }
                newHeight={windowWidth < mdScreen ? 500 : 600}
              ></ComputerUseAlluvial>
            </div>
            <ChartContainer
              asidename="Comment"
              id="frequency-of-computer-use-comment-1"
              asidekey="frequency-of-computer-use-comment-1"
            >
              <ChartH2Title>Comment</ChartH2Title>
              <p>
                As one might expect the digitalization is unevenly distributed
                across generations. For each country, it can be noted how the
                trend, more or less marked, of how digital literacy decreases
                with age. The more concerning trend appears as we move into the
                55 to 74 and especially 75+ age groups. Here, the number of
                individuals who have never used a computer becomes substantial,
                among those aged 75 and above, this group is the majority. This
                suggests that a digital divide still persists, not just in terms
                of access, but also in terms of familiarity, confidence, and
                perceived necessity of digital tools in daily life. This gap can
                have negative repercussions on everyday life, for example in
                access to services. (e.g. eHealth, banking, government portals).
              </p>
            </ChartContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
