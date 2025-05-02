'use client'

import { H1, H2 } from '@/components/headings';
import BarchartCountriesDigitalSkills from './_components/barchart-contry-digital-skills';
import StackedBarchartICTEducationBySex from './_components/stacked-barchart-ict-education-by-sex';
import StackedBarChartAgeDigitalSkills from './_components/stacked-bar-chart-digital-skill-age';
import FinalPageSectionsNav from '../_components/final-page-sections-nav';
import GroupedBarChartICTSkillsByEdu from './_components/grouped-barchart-ict-skills-edu-level';
import AlluvialDigitalSkills from './_components/alluvial-chart-digital-skills';
import { useScreenSize } from '@/hooks/use-screen-sizes';
import { ChartContainer, ChartH1Title, ChartH2Title, ChartHeading } from '@/app/assignments/_components/chart-section';

export default function DigitalSkills() {
  const screenSize = useScreenSize();
  console.log(screenSize)
  return (
    <div>
      <FinalPageSectionsNav />
      <main className="px-2 mx-auto sm:px-4 min-h-dvh max-w-[1200px]">
        <H1 className="my-12">Digital Skills</H1>
          <div>
            <ChartHeading>
              <ChartH1Title>
              Digital Skills divided by age groups
              </ChartH1Title>
              <p>
              Let's start by looking how the digital skills are distributed among age groups in the EU countries.
              The below chart shows how age groups are related to each individual digital skills.
              For simplicity we are going to see Italy. 
              </p>
            </ChartHeading>
            <div className="my-6">
              <AlluvialDigitalSkills />
            </div>
            <ChartContainer
              asidename="Comment"
              id="bar-map-chart-internet-access-comment-1"
              asidekey="bar-map-chart-internet-access-comment-1"
            >
              <ChartH2Title>Comment</ChartH2Title>
              <p>
                By looking at the alluvial chart we can immediatly see how older people (65+ years) tends to not use internet (not using in the last 3 months). In this situation the dataset that we used does not asses the digital skill of the individuals since cannot be estimated. For us this information is important because infer that in most of the cases younger people tends to use more internet then older people.   

              Another aspect that shows the above chart is that, as older people tends to not use internet and so the digital skills cannot be assesed, younger people tends to have better digital skills (basic or above basic digital skills).
              </p>
            </ChartContainer>
          </div>




        <div className="flex flex-col gap-24">
          <div>
            <H2 className="mb-8">
              Age interval and digital skill comparison for country
            </H2>
            <AlluvialDigitalSkills />
          </div>

          <div>
            <H2 className="mb-8">
              Different countires compared by digital skill levels
            </H2>
            <BarchartCountriesDigitalSkills />
          </div>

          <div>
            <H2 className="mb-8">Employed persons with ICT education by age</H2>
            <StackedBarChartAgeDigitalSkills newWidth={900} newHeight={600} />
          </div>

          <div>
            <H2 className="mb-8">
              Percentage of employed males and females with ICT education
            </H2>
            <StackedBarchartICTEducationBySex />
          </div>

          <div>
            <H2 className="mb-8">
              Percentage of employed persons with ICT education by educational
              attainment level
            </H2>
            <GroupedBarChartICTSkillsByEdu />
          </div>
        </div> 
      </main>
    </div>
  );
}
