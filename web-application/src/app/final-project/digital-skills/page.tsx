'use client';

import { H1, H2 } from '@/components/headings';
import BarchartCountriesDigitalSkills from './_components/barchart-contry-digital-skills';
import StackedBarchartICTEducationBySex from './_components/stacked-barchart-ict-education-by-sex';
import StackedBarChartAgeDigitalSkills from './_components/stacked-bar-chart-digital-skill-age';
import FinalPageSectionsNav from '../_components/final-page-sections-nav';
import GroupedBarChartICTSkillsByEdu from './_components/grouped-barchart-ict-skills-edu-level';
import AlluvialDigitalSkills from './_components/alluvial-chart-digital-skills';
import { useScreenSize } from '@/hooks/use-screen-sizes';
import {
  ChartContainer,
  ChartH1Title,
  ChartH2Title,
  ChartHeading
} from '@/app/assignments/_components/chart-section';

export default function DigitalSkills() {
  const screenSize = useScreenSize();
  console.log(screenSize);
  return (
    <div>
      <FinalPageSectionsNav />
      <main className="px-2 mx-auto sm:px-4 min-h-dvh max-w-[1200px]">
        <H1 className="my-12">Digital Skills</H1>

        {/* Alluvial Chart*/}
        <div className="mb-24">
          <ChartHeading>
            <ChartH1Title>Digital Skills divided by age groups</ChartH1Title>
            <p>
              Let's explore how digital skills are distributed across different
              age groups in EU countries. The alluvial chart below illustrates
              the relationship between age and the level of individual digital
              skills. For simplicity, we will focus on the case of Italy.
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
              By analyzing the alluvial chart, we can clearly observe that
              younger individuals, especially those aged 16 to 24, exhibit the
              highest level of digital competence, with a majority possessing
              basic or above basic digital skills. This suggests a strong
              familiarity and comfort with digital tools among the younger
              generation.
              <br />
              <br />
              The 25 to 54 age group also shows a large proportion with good
              digital skills, although their distribution is slightly more
              varied, with some individuals falling into limited or lower skill
              levels. This could reflect a wider range of digital exposure and
              education levels within that broader working-age category.
              <br />
              <br />
              In contrast, digital exclusion becomes much more pronounced from
              age 55 onward. Individuals aged 65 and above, in particular, are
              far more likely not to have used the internet in the past three
              months, making it impossible to assess their digital skills. This
              is visually evident from the thick red flows leading from those
              age brackets.
              <br />
              <br />
              This generational divide underscores how digital literacy is
              strongly age-dependent. While younger individuals not only use the
              internet more but also demonstrate higher skill levels, older age
              groups often face barriers to both access and competence.
              <br />
              <br />
              These patterns highlight the need for targeted digital inclusion
              policies, especially focused on the 55+ population, to bridge the
              gap and promote digital participation across all age groups.
            </p>
          </ChartContainer>
        </div>

        {/* Eductaion by age */}
        <div className="mb-24">
          <ChartHeading>
            <ChartH1Title>
              Employed persons with ICT education by age
            </ChartH1Title>
            <p>
              The below plot illustrates the distribution of employed
              individuals with ICT education across two age groups: younger
              individuals (15 to 34 years old) and older individuals (35 to 74
              years old).
            </p>
          </ChartHeading>
          <div className="my-6">
            <StackedBarChartAgeDigitalSkills />
          </div>
          <ChartContainer
            asidename="Comment"
            id="bar-map-chart-internet-access-comment-1"
            asidekey="bar-map-chart-internet-access-comment-1"
          >
            <ChartH2Title>Comment</ChartH2Title>
            <p>
              Based on the plot above, we can observe that in most countries,
              the majority of employed individuals with ICT education are
              relatively young, specifically between the ages of 15 and 34. This
              suggests that younger people are more likely to hold jobs that
              utilize ICT skills compared to older individuals. <br />
              <br />
              An exception to this trend is Finland, where the proportion of
              older and younger ICT-educated workers is nearly equal. This could
              indicate that Finland began investing in ICT education earlier
              than other EU countries, leading to a more balanced age
              distribution in the sector.
              <br />
              <br />
              In conclusion, the data suggests that younger individuals tend to
              apply their ICT skills more actively in the workforce,
              highlighting both the growing relevance of ICT education and the
              importance of continuous investment in digital skills across
              generations.
            </p>
          </ChartContainer>
        </div>

        {/* <div className="flex flex-col gap-24"> */}
        {/*   <div> */}
        {/*     <H2 className="mb-8"> */}
        {/*       Different countires compared by digital skill levels */}
        {/*     </H2> */}
        {/*     <BarchartCountriesDigitalSkills /> */}
        {/*   </div> */}
        {/**/}
        {/*   <div> */}
        {/*     <H2 className="mb-8">Employed persons with ICT education by age</H2> */}
        {/*     <StackedBarChartAgeDigitalSkills newWidth={900} newHeight={600} /> */}
        {/*   </div> */}
        {/**/}
        {/*   <div> */}
        {/*     <H2 className="mb-8"> */}
        {/*       Percentage of employed males and females with ICT education */}
        {/*     </H2> */}
        {/*     <StackedBarchartICTEducationBySex /> */}
        {/*   </div> */}
        {/**/}
        {/*   <div> */}
        {/*     <H2 className="mb-8"> */}
        {/*       Percentage of employed persons with ICT education by educational */}
        {/*       attainment level */}
        {/*     </H2> */}
        {/*     <GroupedBarChartICTSkillsByEdu /> */}
        {/*   </div> */}
        {/* </div> */}
      </main>
    </div>
  );
}
