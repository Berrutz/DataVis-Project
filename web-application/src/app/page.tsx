import Assignments from './_components/assignments';
import Header from './_components/header';
import Hero from './_components/hero';
import WhoWeAre from './_components/who-we-are';
import FinalProject from './_components/final-project';
import TeckStack from './_components/tech-stack';

export default function Homepage() {
  return (
    <main>
      <Header />
      <Hero />
      <Assignments />
      <FinalProject />
      <WhoWeAre />
      <TeckStack />
    </main>
  );
}
