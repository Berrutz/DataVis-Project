import * as d3 from 'd3';
import { Colors, Data } from './interfaces';
import { updateTooltipPosition } from '../../lib/utils';
import { fahrenheitToCelsius } from './utils';

export function groupByDecade(data: Data[]) {
  const groupedData: Record<string, { values: number[] }> = {};

  // Raggruppa i dati per decadi
  data.forEach((d) => {
    const decade = Math.floor(d.year / 10) * 10; // Calcola il decennio
    if (!groupedData[decade]) {
      groupedData[decade] = { values: [] }; // Inizializza l'array per il decennio se non esiste
    }
    // Aggiungi il valore al decennio appropriato
    groupedData[decade].values.push(d.value);
  });

  return groupedData;
}

export function handleMouseMove(
  event: MouseEvent,
  svgRef: React.MutableRefObject<SVGSVGElement | null>,
  innerWidth: number,
  innerHeight: number,
  tooltip: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  colors: Colors,
  selectedCountryCode: string,
  minDecades: Record<
    string,
    {
      values: number[];
    }
  >
) {
  // Get the category
  const targetElement = event.target as HTMLElement;
  const category = targetElement.getAttribute('data-category');

  // Get tooltip data
  const minAverageT = d3.mean(minDecades[category!].values);

  // Update tooltip
  const tooltipCoordinates = updateTooltipPosition(
    event,
    svgRef,
    innerWidth,
    innerHeight,
    tooltip
  );

  tooltip
    .html(
      `
        <div style="display: flex; flex-direction: column;">
          <div style="font-weight: bold; margin-bottom: 5px;">
            Decade ${category} - ${selectedCountryCode}
          </div>
            <div> 
              Average minimum temperature: <a style="font-weight: bold">${minAverageT?.toFixed(
                1
              )} °F</a> (${fahrenheitToCelsius(minAverageT!).toFixed(1)} °C)
            </div>
          </div>
        </div>
      `
    )
    .style('left', `${tooltipCoordinates.x}px`)
    .style('top', `${tooltipCoordinates.y}px`)
    .style('display', 'block')
    .style('opacity', 1)
    .style('border-color', colors.colorStroke);

  // Highlight the hovered curve
  d3.selectAll('.maxDensityPath')
    .filter(function () {
      return d3.select(this).attr('data-category') === category;
    })
    .transition()
    .duration(200)
    .style('opacity', 0.3);

  d3.select(targetElement)
    .transition()
    .duration(200)
    .style('opacity', 1)
    .style('fill', colors.colorHovered);
}

export function handleMouseOut(
  event: MouseEvent,
  tooltip: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  colors: Colors,
  defaultOpacity: number
) {
  const targetElement = event.target as HTMLElement;

  tooltip
    .style('display', 'none')
    .style('opacity', 0)
    .style('border-color', '#ddd');

  // Reset opacity for all the curves
  d3.selectAll('.maxDensityPath')
    .transition()
    .duration(100)
    .style('opacity', defaultOpacity);

  d3.select(targetElement)
    .transition()
    .duration(100)
    .style('opacity', defaultOpacity)
    .style('fill', colors.colorFill);
}
