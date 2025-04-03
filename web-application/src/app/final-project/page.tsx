'use client';

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
import Arguments from './_components/arguments';
import FinalPageNav from './_components/final-page-nav';
import HeroFinalProject from './_components/hero';
import IntroductionFinalProject from './_components/introduction';

export default function FinalProject() {
  return (
    <main>
      <FinalPageNav />
      <HeroFinalProject />
      <IntroductionFinalProject />
      <Arguments />
    </main>
  );
}
