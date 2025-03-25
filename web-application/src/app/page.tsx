import Header from './_components/header';
import Hero from './_components/hero';
import WhoWeAre from './_components/who-we-are';
import FinalProject from './_components/final-project';
import TeckStack from './_components/tech-stack';
import React, { Suspense } from 'react';

const Assignments = React.lazy(() => import('./_components/assignments'));

export default function Homepage() {
  return (
    <main>
      <Header />
      <Hero />
      <Suspense fallback={<div>Loading...</div>}>
        <Assignments />
      </Suspense>
      <FinalProject />
      <WhoWeAre />
    </main>
  );
}
