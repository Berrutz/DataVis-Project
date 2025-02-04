import BarChart from '@/components/charts/barchart';
import { getStaticFile } from '@/utils/general';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';

interface Data {
  country: string;
  year: string;
  value: number;
}

interface InternetAccessBarChartProps {
  newWidth: number;
  newHeight: number;
}

const InternetAccessBarChart: React.FC<InternetAccessBarChartProps> = ({
  newWidth,
  newHeight
}) => {
  const [csvData, setData] = useState<Data[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('2022'); // Set default year here
  const [x, setX] = useState<string[]>([]);
  const [y, setY] = useState<number[]>([]);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const csvData = await d3.csv(
        getStaticFile('/datasets/internet-access-level/internet-access.csv'),
        (d) => ({
          country: d.Country,
          year: d.Year,
          value: +d.Value
        })
      );
      setData(csvData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter data based on the selected year
    const filteredData = csvData.filter((d) => d.year === selectedYear);

    if (filteredData.length === 0) return;

    filteredData.sort((a, b) => b.value - a.value);

    // Extract country names into an array
    setX(filteredData.map((d) => d.country));

    // Extract values into an array
    setY(filteredData.map((d) => d.value));
  }, [csvData, newWidth, newHeight, selectedYear]);
  if (csvData.length <= 0 || x.length <= 0 || y.length <= 0) return;

  return (
    <div className="flex flex-col justify-center items-center">
      <BarChart
        x={x}
        y={y}
        width={newWidth}
        height={newHeight}
        colorInterpoaltor={d3.interpolateReds}
        ml={40}
        mb={70}
        yLabelsSuffix="%"
      ></BarChart>
      <div className="mt-3">
        <label htmlFor="year">Select Year: </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="py-1 px-2 ml-2 rounded-md border bg-background"
        >
          {[...new Set(csvData.map((d) => d.year))].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InternetAccessBarChart;
