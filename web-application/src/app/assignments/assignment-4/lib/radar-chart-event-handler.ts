import { updateTooltipPosition } from '../../lib/utils';
import { Data, MonthData } from './interfaces';

export function handleMouseMove(
  event: MouseEvent,
  d: Data | number,
  monthDataMap: Map<number, MonthData>,
  tooltip: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  svgRef: React.MutableRefObject<SVGSVGElement | null>,
  innerWidth: number,
  innerHeight: number,
  colors: string[],
  selectedYear: number,
  monthNames: string[],
  labels = ['Min', 'Max', 'Avg']
): void {
  let monthName: string | undefined;
  let monthData: MonthData | undefined;

  // Handle acis and point
  if (typeof d === 'object' && d !== null && 'month' in d && 'year' in d) {
    monthName = monthNames[d.month - 1];
    monthData = monthDataMap.get(d.month);
  } else {
    monthName = monthNames[d];
    monthData = monthDataMap.get(d + 1);
  }

  updateTooltip(
    event,
    svgRef,
    innerWidth,
    innerHeight,
    tooltip,
    selectedYear,
    monthName,
    colors,
    labels,
    monthData
  );
}

export function handleMouseOut(
  tooltip: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
): void {
  tooltip.style('display', 'none').style('opacity', 0);
}

function updateTooltip(
  event: MouseEvent,
  svgRef: React.MutableRefObject<SVGSVGElement | null>,
  innerWidth: number,
  innerHeight: number,
  tooltip: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  selectedYear: number,
  monthName: string,
  colors: string[],
  labels: string[],
  monthData: MonthData | undefined
) {
  const tooltipCoordinates = updateTooltipPosition(
    event,
    svgRef,
    innerWidth,
    innerHeight,
    tooltip
  );

  // Tooltip content for min, max, and avg (for points) or for the specific month (for axis)
  const content = `
        <div style="font-weight: bold; margin-bottom: 5px;">${selectedYear} - ${monthName}</div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <div style="width: 15px; height: 15px; background-color: ${
              colors[1]
            };"></div>
            <span>${labels[1]}: <a style="font-weight: bold">${
    monthData!.max
  } °F</a></span>
          </div>
            
          <div style="display: flex; align-items: center; gap: 5px;">
            <div style="width: 15px; height: 15px; background-color: ${
              colors[2]
            };"></div>
            <span>${labels[2]}: <a style="font-weight: bold">${
    monthData!.avg
  } °F</a></span>
          </div>
        <div style="display: flex; align-items: center; gap: 5px;">
            <div style="width: 15px; height: 15px; background-color: ${
              colors[0]
            };"></div>
            <span>${labels[0]}: <a style="font-weight: bold">${
    monthData!.min
  } °F</a></span>
          </div>
      `;

  tooltip
    .html(content)
    .style('left', `${tooltipCoordinates.x}px`)
    .style('top', `${tooltipCoordinates.y}px`)
    .style('display', 'block')
    .style('opacity', 1);
}
