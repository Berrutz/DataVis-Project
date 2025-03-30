import { H1 } from '@/components/headings';
import BarchartCountriesDigitalSkills from './_components/barchart-contry-digital-skills';
import LinechartYearsDigitalSkills from './_components/linechart-year-comparison';
import StackedBarchartICTEducationBySex from './_components/stacked-barchart-ict-education-by-sex';
import StackedBarChartAgeDigitalSkills from './_components/stacked-bar-chart-digital-skill-age';

export default function DigitalSkills() {
  return (
    <main className="min-h-dvh">
      <H1>Digital Skills</H1>
      <BarchartCountriesDigitalSkills />
      <LinechartYearsDigitalSkills />
      <StackedBarChartAgeDigitalSkills newWidth={900} newHeight={600} />
      <StackedBarchartICTEducationBySex />
    </main>
  );
}
