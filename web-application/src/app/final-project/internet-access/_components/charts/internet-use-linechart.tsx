import LineChart, { Line } from '@/components/charts/linechart';
import { getStaticFile } from '@/utils/general';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';

interface Data {
  country: string;
  year: string;
  value: number;
}

interface InternetUseLineChartProps {
  newWidth: number;
  newHeight: number;
}

const InternetUseLineChart: React.FC<InternetUseLineChartProps> = ({
  newWidth,
  newHeight
}) => {
  const [csvData, setData] = useState<Data[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('Italy'); // Set default year here
  const [lines, setLines] = useState<Line[]>([]);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const csvData = await d3.csv(
        getStaticFile('/datasets/internet-access-level/internet-use.csv'),
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
    const filteredData = csvData.filter((d) => d.country === selectedCountry);

    if (filteredData.length === 0) return;

    filteredData.sort((a, b) => +a.year - +b.year);

    // Create line
    setLines([
      {
        x: filteredData.map((d) => d.year),
        y: filteredData.map((d) => d.value),
        color: '#eb4034',
        tag: selectedCountry,
        scatter: false
      }
    ]);
  }, [csvData, newWidth, newHeight, selectedCountry]);
  if (csvData.length <= 0 || lines.length <= 0) return;

  return (
    <div className="flex flex-col justify-center items-center">
      <LineChart
        data={lines}
        width={newWidth}
        height={newHeight}
        unitOfMeasurement="%"
        ml={40}
        xLabelsFontSize="0.7rem"
      ></LineChart>
      <div className="mt-3">
        <label htmlFor="country">Select Country: </label>
        <select
          id="country"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="py-1 px-2 ml-2 rounded-md border bg-background"
        >
          {[...new Set(csvData.map((d) => d.country))].map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InternetUseLineChart;
