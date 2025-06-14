import Container from '@/components/container';
import SectionTitle from './section-title';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function FinalProject() {
  return (
    <section className="scroll-mt-24" id="final-project">
      <Container className="px-4 sm:px-10 md:px-12">
        <SectionTitle>
          What's the digitalization level of EU countries?
        </SectionTitle>
        <p className="text-lg text-justify pt-6 md:px-10">
          The internet has evolved at an unprecedented pace, transforming from a
          simple communication tool into a fundamental pillar of modern society.
          Alongside digitalization, it now permeates nearly every aspect of
          daily life, from education and work to social interactions and
          entertainment. This rapid expansion has created countless
          opportunities but also challenges for individuals and businesses
          alike. Navigating this digital world effectively requires the right
          skills, as technological literacy is becoming increasingly essential.
          Our group has chosen the European Union as its area of interest and
          has decided to try to answer three questions about this phenomenon.
        </p>
        <div className="px-3 w-[min(300px,_100%)] mx-auto pt-12">
          <Button
            asChild
            className="w-full text-lg rounded-[calc(theme(borderRadius.xl)_-_1px)]"
          >
            <Link href={'/final-project'} className="">
              Learn more <ChevronRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
