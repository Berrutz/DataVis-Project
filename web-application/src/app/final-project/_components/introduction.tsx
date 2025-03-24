import { H3 } from '@/components/headings';
import { getStaticFile } from '@/utils/general';
import Image from 'next/image';

type IntroductionData = {
  imageSrc: string;
  imageAlt: string;
};

const imagesData: IntroductionData[] = [
  {
    imageSrc: getStaticFile('/final-project/internet-access-spongebob.png'),
    imageAlt: 'From cave man Spongebob to futuristic Spongebob'
  },
  {
    imageSrc: getStaticFile('/final-project/internet-use-spongebob.png'),
    imageAlt: 'Patric indicates to Spongebob a computer'
  },
  {
    imageSrc: getStaticFile('/final-project/digital-skills-spongebob.png'),
    imageAlt: 'Spongebob working on a computer'
  }
];

export default function IntroductionFinalProject() {
  return (
    <section className="pt-16 mx-10">
      <p className="text-justify text-lg">
        The internet has evolved at an unprecedented pace, transforming from a
        simple communication tool into a fundamental pillar of modern society.
        Alongside digitalization, it now permeates nearly every aspect of daily
        life, from education and work to social interactions and entertainment.
        This rapid expansion has created countless opportunities but also
        challenges for individuals and businesses alike. Navigating this digital
        world effectively requires the right skills, as technological literacy
        is becoming increasingly essential. Our group has chosen the European
        Union as its area of interest and has decided to try to answer three
        questions about this phenomenon:
      </p>
      <div className="flex flex-col max-w-[1100px] items-center w-full gap-12 pt-16">
        <div className="flex gap-8 justify-center">
          <div className="flex flex-col gap-4">
            <H3>What's our digitalizaion level?</H3>
            <ul className="text-lg">
              <li>How many have access to the internet in their homes?</li>
              <li>
                What are the reasons why people do not have internet in their
                homes?
              </li>
              <li>How has usage changed over the years?</li>
              <li>How many people use a computer every day?</li>
            </ul>
          </div>
          <Image
            src={imagesData[0].imageSrc}
            width={600}
            height={500}
            alt={imagesData[0].imageAlt}
          />
        </div>

        <div className="flex gap-8">
          <Image
            src={imagesData[1].imageSrc}
            width={600}
            height={500}
            alt={imagesData[1].imageAlt}
            className="bg-gray-50 border rounded-[calc(theme(borderRadius.2xl)_-_1px)]"
          />
          <div className="flex flex-col justify-center gap-4">
            <H3>What do we use this internet for?</H3>
            <ul className="text-lg">
              <li>How many have access to the internet in their homes?</li>
              <li>
                What are the reasons why people do not have internet in their
                homes?
              </li>
              <li>How has usage changed over the years?</li>
              <li>How many people use a computer every day?</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col justify-center gap-4">
            <H3>How skilled we are in this digital world?</H3>
            <ul className="text-lg">
              <li>How many have access to the internet in their homes?</li>
              <li>
                What are the reasons why people do not have internet in their
                homes?
              </li>
              <li>How has usage changed over the years?</li>
              <li>How many people use a computer every day?</li>
            </ul>
          </div>
          <Image
            src={imagesData[2].imageSrc}
            width={600}
            height={500}
            alt={imagesData[2].imageAlt}
            className="bg-gray-50 border rounded-[calc(theme(borderRadius.2xl)_-_1px)]"
          />
        </div>
      </div>
    </section>
  );
}
