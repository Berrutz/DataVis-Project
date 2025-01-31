import LineChart, { Line } from '@/components/charts/linechart';
import { getStaticFile } from '@/utils/general';
import d3 from 'd3';
import { useEffect, useState } from 'react';

interface Data {
  year: number;
  month: number;
  value: number;
  countryName: string;
}

interface InternetAccessProps {
  newWidth: number | string;
}

const InternetAccess: React.FC<InternetAccessProps> = ({ newWidth }) => {
  const [lines, setLines] = useState<Line[]>([]);

  const width = +newWidth;
  const height = 400;

  const max = {
    x: ['1', '2', '3', '4'],
    y: [10, 20, 15, 25],
    color: '#ff851a',
    tag: 'max'
  };
  const min = {
    x: ['1', '2', '3', '4'],
    y: [-5, 8, 15, 45],
    color: '#b35300',
    tag: 'min'
  };

  useEffect(() => {
    const aux: Line[] = [
      {
        x: max.x,
        y: max.y,
        color: max.color,
        tag: max.tag,
        scatter: false
      },
      {
        x: min.x,
        y: min.y,
        color: min.color,
        tag: min.tag,
        scatter: true
      }
    ];
    setLines(aux);
  }, [newWidth]);
  if (lines.length <= 0) return;

  return (
    <div>
      <LineChart
        data={lines}
        width={width}
        height={height}
        yUpperBound={50}
        yLowerBound={-10}
        yFullTags={['Puppo', 'Verri', 'Pippo', 'Odone']}
        unitOfMeasurement="t"
        mt={20}
        mr={80}
        mb={80}
        ml={40}
      ></LineChart>
    </div>
  );
};

export default InternetAccess;
