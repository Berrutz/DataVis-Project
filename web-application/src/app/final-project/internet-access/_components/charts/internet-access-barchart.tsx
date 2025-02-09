import ChartContainer from '@/components/chart-container';
import BarChart from '@/components/charts/barchart';
import { H3 } from '@/components/headings';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetD3Csv } from '@/hooks/use-get-d3-csv';
import { getUnique } from '@/utils/general';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';

interface BarchartDataWrap {
  x: string[];
  y: number[];
}

interface InternetAccessBarChartProps {
  newWidth: number;
  newHeight: number;
}

const InternetAccessBarChart: React.FC<InternetAccessBarChartProps> = ({
  newWidth,
  newHeight
}) => {
  const [selectedYear, setSelectedYear] = useState<string>();
  const [barchartData, setBarchartData] = useState<BarchartDataWrap | null>(
    null
  );

  // Get the data from the csv file using D3
  const csvData = useGetD3Csv(
    'internet-access-level/internet-access.csv',
    (d) => ({
      country: d.Country,
      year: +d.Year,
      value: +d.Value
    })
  );

  // Choose the default selection values when the csv is loaded and fullfilled
  useEffect(() => {
    if (csvData === null || csvData.length <= 0) return;

    // As default choose the most recent year
    const years = csvData.map((value) => value.year);
    const selectedYear = Math.max(...years);

    // Set the first default selection for the first barchart visualization
    setSelectedYear(selectedYear.toString());
  }, [csvData]);

  useEffect(() => {
    if (!selectedYear || csvData === null) return;

    const filteredData = csvData.filter((d) => d.year === +selectedYear);

    filteredData.sort((a, b) => b.value - a.value);

    // Set X and Y data to be passed to the BarChart component
    setBarchartData({
      x: filteredData.map((d) => d.country),
      y: filteredData.map((d) => d.value)
    });
  }, [selectedYear]);

  // The csv is not yet loaded or
  // the default selection has not already initializated or
  // neither one of the x value and y value state for the barchart has been initializated
  if (!selectedYear || csvData === null || barchartData === null) {
    return (
      <ChartContainer>
        <Skeleton className="w-full bg-gray-200 rounded-xl h-[500px]" />
      </ChartContainer>
    );
  }

  // The csv is loaded but no data has been found
  if (csvData.length <= 0) {
    throw Error('Cannot retrieve the data from the csv');
  }

  // Unique years to make the user input selections
  const uniqueYears = getUnique(
    csvData.map((value) => value.year),
    (a, b) => b - a
  );

  return (
    <ChartContainer className="relative flex flex-col gap-8">
      <H3>Different countires compared by internet access level</H3>
      {/* Sheet is inside ChartContainer */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open</Button>
        </SheetTrigger>

        {/* Overlay only inside ChartContainer */}
        <SheetOverlay className="absolute bg-black/20 rounded-lg" />

        {/* SheetContent slides out from the ChartContainer, NOT the full page */}
        <SheetContent className="right-0 top-0 h-full max-h-full w-[300px] bg-white shadow-lg border-l">
          <SheetHeader>
            <SheetTitle>Add/remove countries and regions</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      {/* Bar Chart*/}
      <BarChart
        x={barchartData.x}
        y={barchartData.y}
        width={newWidth}
        height={newHeight}
        colorInterpoaltor={d3.interpolateReds}
        ml={40}
        mb={70}
        yLabelsSuffix="%"
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
    </ChartContainer>
  );
};

export default InternetAccessBarChart;
