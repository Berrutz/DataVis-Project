import FacetedBarChart1, {
  FacetedPoint
} from '@/components/charts/FacetedBarChart1';
import { getStaticFile } from '@/utils/general';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';

interface Data {
  reason: string;
  country: string;
  year: number;
  value: number;
}

interface InternetAccessFacetedBarChartProps {
  newWidth: number;
  newHeight: number;
}

const InternetAccessFacetedBarChart: React.FC<
  InternetAccessFacetedBarChartProps
> = ({ newWidth, newHeight }) => {
  const [csvData, setData] = useState<Data[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('2019'); // Set default year here
  const [facetedData, setFacetedData] = useState<FacetedPoint[]>([]);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const csvData = await d3.csv(
        getStaticFile(
          '/datasets/internet-access-level/reasons-not-have-internet-access.csv'
        ),
        (d) => ({
          reason: d.Reason,
          country: d.Country,
          year: +d.Year,
          value: +d.Value
        })
      );
      setData(csvData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter data based on the selected year
    const filteredData = csvData.filter((d) => d.year === +selectedYear);

    if (filteredData.length === 0) return;

    // Cast the data into an object usefull for the FacetedBarChart
    setFacetedData(
      filteredData.map((d) => {
        return {
          group: d.reason,
          category: d.country,
          value: d.value
        };
      })
    );
  }, [csvData, newWidth, newHeight, selectedYear]);
  if (csvData.length <= 0 || facetedData.length <= 0) return;

  return (
    <div className="flex flex-col justify-center items-center">
      <FacetedBarChart1
        data={facetedData}
        width={newWidth}
        height={newHeight}
        unitOfMeasurement="%"
        ml={100}
      ></FacetedBarChart1>
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

export default InternetAccessFacetedBarChart;
