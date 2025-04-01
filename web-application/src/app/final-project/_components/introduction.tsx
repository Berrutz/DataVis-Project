import Container from '@/components/container';
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
    <Container className="px-4 sm:px-10 md:px-12">
      <p className="text-lg text-center lg:text-justify">
        The internet has evolved at an unprecedented pace, transforming from a
        simple communication tool into a fundamental pillar of modern society.
        Alongside digitalization, it now permeates nearly every aspect of daily
        life, from education and work to social interactions and entertainment.
        This rapid expansion has created countless opportunities but also
        challenges for individuals and businesses alike. Navigating this digital
        world effectively requires the right skills, as technological literacy
        is becoming increasingly essential. Our group has chosen the European
        Union as its area of interest and has decided to try to answer three
        questions about this phenomenon.
      </p>

      <div className="flex flex-col gap-12 items-center pt-16 w-full text-center">
        <div className="flex gap-12 items-center overflow-clip">
          <div className="flex flex-col gap-4 lg:w-1/2">
            <H3>What's our digitalizaion level?</H3>
            <ul className="text-lg">
              <li>How many have access to the internet in their homes?</li>
              <li>
                What are the reasons why people do not have internet in their
                homes?
              </li>
              <li>
                How has the percentage of people who have never used the
                Internet changed over the years?
              </li>
              <li>How many people use a computer every day?</li>
            </ul>
          </div>
          <Image
            className="hidden object-contain p-4 w-1/2 rounded-2xl border shadow-sm lg:block"
            src={imagesData[0].imageSrc}
            width={600}
            height={500}
            alt={imagesData[0].imageAlt}
          />
        </div>

        <div className="flex gap-12 overflow-clip">
          <Image
            src={imagesData[1].imageSrc}
            width={600}
            height={500}
            alt={imagesData[1].imageAlt}
            className="hidden object-contain w-1/2 rounded-2xl lg:block"
          />
          <div className="flex flex-col gap-4 justify-center">
            <H3>What do we use this internet for?</H3>
            <ul className="text-lg">
              <li>How often do people use the Internet?</li>
              <li>Does the frequency of Internet use vary by age group?</li>
              <li>
                Do people come across derogatory messages while surfing the web?
              </li>
              <li>
                What percentage of people do financial activities on the
                internet?
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-12 overflow-clip">
          <div className="flex flex-col gap-4 justify-center">
            <H3>How skilled we are in this digital world?</H3>
            <ul className="text-lg">
              <li>
                What is our level of digital skills and how do these change over
                time?
              </li>
              <li>
                What is the distribution of male and female employees who
                possess ICT skills?
              </li>
              <li>*PLACE HOLDER*</li>
              <li>
                Does the number of people who have ICT skills change depending
                on their education level?
              </li>
            </ul>
          </div>
          <Image
            src={imagesData[2].imageSrc}
            width={600}
            height={500}
            alt={imagesData[2].imageAlt}
            className="hidden object-contain w-1/2 rounded-2xl lg:block"
          />
        </div>
      </div>
    </Container>
  );
}
