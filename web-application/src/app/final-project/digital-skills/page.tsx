'use client';

import { H1, H2 } from '@/components/headings';
import BarchartCountriesDigitalSkills from './_components/barchart-contry-digital-skills';
import StackedBarchartICTEducationBySex from './_components/stacked-barchart-ict-education-by-sex';
import StackedBarChartAgeDigitalSkills from './_components/stacked-bar-chart-digital-skill-age';
import FinalPageSectionsNav from '../_components/final-page-sections-nav';
import GroupedBarChartICTSkillsByEdu from './_components/grouped-barchart-ict-skills-edu-level';
import AlluvialDigitalSkills from './_components/alluvial-chart-digital-skills';
import {
  ChartContainer,
  ChartH1Title,
  ChartH2Title,
  ChartHeading
} from '@/app/assignments/_components/chart-section';

export default function DigitalSkills() {
  return (
    <div>
      <FinalPageSectionsNav />
      <main className="px-2 mx-auto sm:px-4 min-h-dvh max-w-[1200px]">
        <H1 className="my-12">Digital Skills</H1>
        {/* Digital skills Barchart */}
        <div className="mb-24">
          <ChartHeading>
            <ChartH1Title>
              Different countires compared by digital skill levels
            </ChartH1Title>
            <p>
              The chart visualizes different EU countries for a digital skill
              level and age group. We analyze the percentage of individuals with
              no digital skills across different EU countries, considering the
              age group "all individuals". It highlights the extent of digital
              exclusion in each country, providing a comparative overview of how
              widespread the lack of basic digital competence is within the
              general population of each nation.
            </p>
          </ChartHeading>
          <div className="my-6">
            <BarchartCountriesDigitalSkills />
          </div>
          <ChartContainer
            asidename="Comment"
            id="bar-map-chart-internet-access-comment-1"
            asidekey="bar-map-chart-internet-access-comment-1"
          >
            <ChartH2Title>Comment</ChartH2Title>
            <p>
              From the graph, we observe that Romania has by far the highest
              proportion of individuals with no digital skills among EU
              countries, followed by Bulgaria and Italy. These countries exhibit
              a significant digital divide, suggesting limited access to digital
              tools or insufficient digital education across their populations.
              Another insight could be that those countries has the most number
              of old people, since usually oldest people does not have digital
              skills.
              <br />
              <br />
              On the opposite end, countries like Croatia, Netherlands, Ireland,
              and Finland show the lowest percentages, indicating stronger
              digital inclusion and a generally higher baseline of digital
              literacy.
              <br />
              <br />A broader insight from the chart is the visible geographical
              pattern: many Southern and Eastern European countries (such as
              Romania, Bulgaria, and Greece) tend to have higher levels of
              digital illiteracy compared to Northern and Western countries
              (like Sweden, Finland, and the Netherlands). This disparity may
              point to systemic differences in education, infrastructure, and
              access to technology.
            </p>
          </ChartContainer>
        </div>

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

        {/* Stacked bar chart male and female*/}
        <div className="mb-24">
          <ChartHeading>
            <ChartH1Title>
              Percentage of employed males and females with ICT education
            </ChartH1Title>
            <p>
              The chart illustrates the percentage of employed individuals with
              an ICT education across various EU countries, divided by gender.
              The data provides a side-by-side comparison of male (blue) and
              female (pink) employment, highlighting gender distribution.
            </p>
          </ChartHeading>
          <div className="my-6">
            <StackedBarchartICTEducationBySex />
          </div>
          <ChartContainer
            asidename="Comment"
            id="bar-map-chart-internet-access-comment-1"
            asidekey="bar-map-chart-internet-access-comment-1"
          >
            <ChartH2Title>Comment</ChartH2Title>
            <p>
              The graph shows a clear gender disparity in ICT education among
              the employed population across all EU countries. In every country
              presented, men with ICT education make up a significantly larger
              share of the employed group compared to women. The disparity is
              particularly pronounced in countries like Italy, Slovakia, and the
              Netherlands, where the male share exceeds 80%.
              <br />
              On the other end, countries such as Bulgaria, Greece, and Romania
              show a comparatively smaller gender gap, with women making up a
              larger proportion of those employed with ICT education than in
              other countries—though men still remain the majority.
              <br />
              <br />
              Overall, the chart highlights a consistent underrepresentation of
              women among those with ICT education in the workforce across the
              EU. This suggests that fewer women may be pursuing ICT education
              or that they face additional barriers to employment after earning
              such qualifications.
            </p>
          </ChartContainer>
        </div>

        {/* Stacked bar chart male and female*/}
        <div className="mb-24">
          <ChartHeading>
            <ChartH1Title>
              Percentage of employed persons with ICT education by educational
              attainment level
            </ChartH1Title>
            <p>
              This chart presents the percentage of employed persons in various
              EU countries who have an ICT (Information and Communication
              Technology) education, categorized by their educational attainment
              level. The data distinguishes between those who have completed
              tertiary education (levels 5–8, shown in blue) and those with
              upper secondary or post-secondary non-tertiary education (levels 3
              and 4, shown in orange). Importantly, the chart reflects the
              education level of employed individuals with ICT training,
              regardless of the sector in which they are employed.
            </p>
          </ChartHeading>
          <div className="my-6">
            <GroupedBarChartICTSkillsByEdu />
          </div>
          <ChartContainer
            asidename="Comment"
            id="bar-map-chart-internet-access-comment-1"
            asidekey="bar-map-chart-internet-access-comment-1"
          >
            <ChartH2Title>Comment</ChartH2Title>
            <p>
              The chart reveals that in most EU countries, the majority of
              employed persons with ICT education have attained tertiary
              education. Countries such as Ireland, Bulgaria, Lithuania,
              Belgium, and Austria show the highest percentages—close to or
              exceeding 90%—of ICT-educated workers coming from tertiary
              education backgrounds, with very few from lower education levels.
              <br />
              Conversely, countries like Hungary, Poland, Malta, and Portugal
              show a more balanced or even reversed trend, where a significant
              proportion of employed individuals with ICT education come from
              upper secondary or post-secondary non-tertiary levels. Hungary, in
              particular, stands out with nearly 40% of ICT-educated employees
              having a lower level of education, the highest among the countries
              displayed.
              <br />
              <br />
              This variation across countries suggests different national
              pathways into ICT-related education and employment. In some
              nations, ICT careers appear to be strongly tied to
              university-level education, while in others, vocational or
              secondary programs may play a more prominent role in preparing
              individuals for employment.
            </p>
          </ChartContainer>
        </div>
      </main>
    </div>
  );
}
