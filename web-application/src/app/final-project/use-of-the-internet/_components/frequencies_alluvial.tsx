import ChartContainer from '@/components/chart-container';
import { ChartSidebar } from '@/components/chart-sidebar';
import BarChart, { Point } from '@/components/charts/barchart';
import { H3 } from '@/components/headings';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Sidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetD3Csv } from '@/hooks/use-get-d3-csv';
import { getUnique } from '@/utils/general';
import * as d3 from 'd3';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

import { FrequencyData } from '../lib/interfaces';
import Alluvial, { AlluvialData } from '@/components/charts/alluvial';

interface FrequenciesAlluvialProps {
    newWidth: number;
    newHeight: number;
}

interface Data {
    // TODO
}

const FrequenciesAlluvial: React.FC<FrequenciesAlluvialProps> = ({
    newWidth,
    newHeight
  }) => {

    const [selectedCountries, setSelectedCountries] = useState<Point[]>([]);
    //const [AllData, setAllData] = useState<FrequencyData[]>([]);
    const [alluvialData, setData] = useState<AlluvialData>();

    const colors = ['#ffb3ba', '#ffdfba', '#baffc9', '#bae1ff'];

    // Get the data from the csv file using D3
    const csvData = useGetD3Csv(
        'final-project/use-of-the-internet/freq/annual_percentage_of_internet_access_per_EU_country_13_24.csv',
        (d) => ({
            country: d.Country,
            year: d.Years,
            percentage: d.percentage,
        })
    );




    return (
        <ChartContainer className="sm:relative flex flex-col overflow-hidden gap-8">
          <Sidebar>
            {/*<H3>Different countries compared by internet access level</H3>*/}
            <div className="flex justify-end">
              <SidebarTrigger
                variant={'outline'}
                className="font-medium text-base w-full xs:w-64"
              >
                <div className="flex items-center">
                  <Pencil className="min-w-5 min-h-5 mr-2 text-gray-500" />
                  Edit countries and regions
                </div>
              </SidebarTrigger>
            </div>
            {/* Alluvial
            <Alluvial
                    data={alluvialData}
                    width={newWidth}
                    height={newHeight}
                    colors={colors}
                    tooltipSuffix="k individuals"
                    scalingFactor={1000}
                    ml={50}
            ></Alluvial>
            {/* Bar Chart 
            <BarChart
              x={selectedCountries.map((point) => point.x)}
              y={selectedCountries.map((point) => point.y)}
              width={newWidth}
              height={newHeight}
              colorInterpoaltor={d3.interpolateReds}
              ml={55}
              mr={15}
              mb={70}
              yLabelsSuffix="%"
              vertical={true}
            ></BarChart>
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="sm:w-1/3">
                <label>Year</label>
                <Select
                  onValueChange={setSelectedYear}
                  defaultValue={selectedYear.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
             */}
            {/* Sidebar Content 
            <ChartSidebar
              items={allCountriesGroup}
              selectedItems={selectedCountriesGroup}
              onSelectionChange={handleCountriesSelection}
              onClearSelection={() => setSelectedCountries([])}
              displayKey="x" // The field to display
              isChecked={(point) => selectedCountries.some((d) => d.x === point.x)}
              chartid="internet-access-barchart"
            />
            */}
          </Sidebar>
        </ChartContainer>
      );
};

export default FrequenciesAlluvial;
