import { H1, H2 } from '@/components/headings';
import BarchartCountriesDigitalSkills from './_components/barchart-contry-digital-skills';
import LinechartYearsDigitalSkills from './_components/linechart-year-comparison';
import StackedBarchartICTEducationBySex from './_components/stacked-barchart-ict-education-by-sex';
import StackedBarChartAgeDigitalSkills from './_components/stacked-bar-chart-digital-skill-age';

export default function DigitalSkills() {
  return (
    <main className="px-2 mx-auto sm:px-4 min-h-dvh max-w-[1200px]">
      <H1 className="my-12">Digital Skills</H1>

      <div className="flex flex-col gap-24">
        <div>
          <H2 className="mb-8">
            Different countires compared by digital skill levels
          </H2>
          <BarchartCountriesDigitalSkills />
        </div>

        <div>
          <H2 className="mb-8">Digital skills compared over the years</H2>
          <LinechartYearsDigitalSkills />
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
      </div>
    </main>
  );
}
