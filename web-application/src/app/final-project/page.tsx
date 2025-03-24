'use client';

import InternetAccessBarChart from './internet-access/_components/charts/internet-access-barchart';
import InternetAccessFacetedBarChart from './internet-access/_components/charts/internet-access-faceted-barchart';
import InternetAccessMap from './internet-access/_components/charts/internet-access-map';
import InternetUseAlluvial from './internet-access/_components/charts/internet-use-alluvial';
import InternetUseLineChart from './internet-access/_components/charts/internet-use-linechart';

/*
 * Final Project:
 * The idea is to create 3 folders under this `final-project` folder that subdivide the
 * project as proposed to the professor. So anyone of us works on his folder.
 *
 * If you want to see how the chars are while working on them, please create another page
 * and/or add it here but DONT PUSH THE CHART!! (or at least the all the debug to see how the
 * charts are while you are developing) Please BERRU i know... °L°
 *
 * At the end when we finish to make all the charts we import them into this page
 * and we create the final project page with all the charts.
 *
 * If you want you can create also sections describing your results for the charts,
 * this is highly suggested.
 *
 * In any case write me (ALEX) for more detail on how to structure the final project,
 * we can also discuss on discord.
 *
 * Or you can do whatever you want and make this more messy (o_o)
 */

import Useoftheinternet from './use-of-the-internet/Useoftheinternet';
import ComputerUseAlluvial from './internet-access/_components/charts/computer-use-alluvial';
import StackedBarChartTest from './internet-access/_components/charts/stacked-barchart-test';
import MapContainer from '@/components/map-switch-container';
import { getStaticFile } from '@/utils/general';
import Arguments from './_components/arguments';
import { H1, H2 } from '@/components/headings';
import HeroFinalProject from './_components/hero';
import IntroductionFinalProject from './_components/introduction';

export default function FinalProject() {
  return (
    <main>
      <HeroFinalProject />
      <IntroductionFinalProject />
      <Arguments />
      {/*       <div className="relative">
        <MapContainer
          className="sm:relative overflow-hidden"
          components={[
            {
              buttonText: 'Bars',
              component: (
                <InternetAccessBarChart
                  newWidth={800}
                  newHeight={550}
                ></InternetAccessBarChart>
              )
            },
            {
              buttonText: 'Map',
              component: (
                <InternetAccessMap
                  newWidth={800}
                  newHeight={600}
                ></InternetAccessMap>
              )
            }
          ]}
        ></MapContainer>
      </div> */}
    </main>
  );
}
