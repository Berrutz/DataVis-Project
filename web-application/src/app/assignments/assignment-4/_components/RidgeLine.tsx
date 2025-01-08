import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';
import DataSourceInfo from '../../_components/data-source';
import ShowMoreChartDetailsModalDialog from '../../_components/show-more-chart-details-modal-dialog';
import Tooltip from '../../_components/tooltip';

interface RidgeLineSmallScreenPops {
  newWidth: number | string;
}

interface Data {
  year: number;
  month: number;
  value: number;
  countryName: string;
}

const RidgeLine: React.FC<RidgeLineSmallScreenPops> = ({ newWidth }) => {
  const [minData, setMinData] = useState<Data[]>([]);
  const [maxData, setMaxData] = useState<Data[]>([]);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const [selectedCountryCode, setSelectedCountryCode] =
    useState<string>('Alabama');

  const maxColorStroke = '#ff851a';
  const maxColorFill = '#ffbb80';
  const minColorStroke = '#0055ff';
  const minColorFill = '#80aaff';

  useEffect(() => {
    const fetchData = async () => {
      // Caricamento dei dati per Min, Max, Avg con codice dello stato
      const minCsvData: Data[] = await d3.csv(
        getStaticFile('/datasets/assignment4/Min.csv'),
        (d: any) => ({
          year: +d.year,
          month: +d.month,
          value: +d.value,
          countryName: d.country
        })
      );
      setMinData(minCsvData);

      const maxCsvData: Data[] = await d3.csv(
        getStaticFile('/datasets/assignment4/Max.csv'),
        (d: any) => ({
          year: +d.year,
          month: +d.month,
          value: +d.value,
          countryName: d.country
        })
      );
      setMaxData(maxCsvData);
    };

    fetchData();
  }, []);

  // Funzione per raggruppare i dati per decadi e calcolare la media
  const groupByDecade = (data: Data[]) => {
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

    /*     // Calcola la media per ogni decennio
    const averages = Object.keys(groupedData).map((decade) => {
      const values = groupedData[decade].values;
      return {
        decade,
        average: d3.mean(values) // Calcola la media dei valori per ogni decennio
      };
    }); */

    return groupedData;
  };

  // Funzione di Kernel Density Estimation (KDE) usando il kernel di Epanechnikov
  const kernelDensityEstimator = (kernel: Function, X: number[]) => {
    return (V: number[]) => {
      return V.map((v) => {
        const weights = X.map((x) => kernel(v - x));
        const sum = d3.sum(weights);
        const densityValue = sum / X.length;

        // Return the valid [v, densityValue] pair or nothing if invalid
        return densityValue && !isNaN(densityValue)
          ? [v, densityValue]
          : undefined;
      }).filter((d): d is [number, number] => d !== undefined); // Remove invalid results
    };
  };

  // Funzione kernel di Epanechnikov
  const epanechnikovKernel = (u: number) => {
    return Math.abs(u) <= 1 ? 0.75 * (1 - u * u) : 0;
  };

  useEffect(() => {
    if (!minData.length || !maxData.length) return;

    const svg = d3.select(svgRef.current);
    const width = +newWidth || 820;
    const height = 1050;

    svg.attr('width', width).attr('height', height);

    const margin = { top: 20, right: 80, bottom: 50, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.selectAll('*').remove(); // Pulisce il contenuto precedente

    // Filtriamo i dati in base all'anno e al codice dello stato selezionato
    const filteredMinData = minData.filter((d) =>
      selectedCountryCode ? d.countryName === selectedCountryCode : true
    );
    const filteredMaxData = maxData.filter((d) =>
      selectedCountryCode ? d.countryName === selectedCountryCode : true
    );

    // Log dei dati filtrati e la dimensione
    console.log('Filtered Min Data:', filteredMinData.slice(0, 5)); // Stampa solo i primi 5 elementi
    console.log('Number of Filtered Min Data:', filteredMinData.length); // Stampa la dimensione totale

    console.log('Filtered Max Data:', filteredMaxData.slice(0, 5)); // Stampa solo i primi 5 elementi
    console.log('Number of Filtered Max Data:', filteredMaxData.length); // Stampa la dimensione totale

    // Raggruppa i dati per decadi
    const minAverages = groupByDecade(filteredMinData);
    const maxAverages = groupByDecade(filteredMaxData);

    // Log della struttura di minAverages e maxAverages
    console.log('Min Averages:', minAverages['1900'].values.slice(5)); // Mostra i primi 5 decenni e i loro valori medi
    console.log('Max Averages:', maxAverages['1900'].values.slice(5)); // Mostra i primi 5 decenni e i loro valori medi

    // Estrai i valori medi per la KDE
    /*     const minAvgValues = minAverages.map((d) => d.average ?? 0); // Usa 0 se `minAvg` è undefined
    const maxAvgValues = maxAverages.map((d) => d.average ?? 0); // Usa 0 se `maxAvg` è undefined
 */
    // Creiamo le scale
    const decades = [
      ...new Set(minData.map((d) => Math.floor(d.year / 10) * 10))
    ]
      .sort()
      .map((d) => d.toString());

    const xExtent = d3.extent([0, ...filteredMaxData.map((d) => d.value)]);

    const smallestValueElement = filteredMinData.reduce(
      (min, current) => (current.value < min.value ? current : min),
      filteredMinData[0]
    );

    console.log('min value:', smallestValueElement);

    const validXExtent =
      xExtent[0] !== undefined && xExtent[1] !== undefined
        ? xExtent
        : ([0, 100] as [number, number]); // Valori di default, es. [0, 100]

    const xScale = d3
      .scaleLinear()
      .domain(validXExtent) // Assicura che il dominio sia definito
      .range([0, innerWidth]); // Da sinistra a destra

    var yScale = d3.scaleLinear().domain([0, 0.4]).range([innerHeight, 0]);

    const yNameScale = d3
      .scaleBand()
      .domain(decades) // Decadi come categorie
      .range([innerHeight, 0]) // Da basso a alto
      .padding(0.4);

    // Applica la KDE per min, max e avg usando il kernel di Epanechnikov
    const kde = kernelDensityEstimator(epanechnikovKernel, xScale.ticks(40));
    const densityDataMin = decades.map((decade) => ({
      decade: decade,
      density: kde(minAverages[decade]?.values).filter((v) => v !== undefined)
    }));
    const densityDataMax = decades.map((decade) => ({
      decade,
      density: kde(maxAverages[decade]?.values).filter((v) => v !== undefined)
    }));

    densityDataMin.forEach((data) => {
      data.density.sort((a, b) => a[0] - b[0]);
    });
    densityDataMax.forEach((data) => {
      data.density.sort((a, b) => a[0] - b[0]);
    });

    // Log dei risultati della KDE
    console.log('densities: ', densityDataMin.slice(0, 5));

    [...densityDataMin, ...densityDataMax].forEach(({ decade, density }, i) => {
      const isMin = i < densityDataMin.length; // Check if it's min or max
      /*       console.log(
        (yScale(String(decade)) ?? 0) + yScale.bandwidth() / 2 + margin.top
      ); */
      const yOffset =
        (yNameScale(String(decade)) ?? 0) + // Default to 0 if undefined
        yNameScale.bandwidth() / 2 +
        margin.top;

      // Create the density line
      const lineGenerator = d3
        .line()
        .curve(d3.curveBasis) // Smooth curves
        .x(([x, _]: any) => xScale(x))
        .y(([_, y]: any) => yOffset - y * 1000); // Scale density height

      svg
        .append('path')
        .datum(density)
        .attr('fill', isMin ? minColorFill : maxColorFill)
        .attr('opacity', 0.7)
        .attr('stroke', isMin ? minColorStroke : maxColorStroke) // Use minColor for min, maxColor for max
        .attr('stroke-width', 1.2)
        .attr('d', lineGenerator);

      // Add horizontal baseline for zero density
      svg
        .append('line')
        .attr('x1', xScale(validXExtent[0] + 5)) // Start of the line
        .attr('x2', xScale(validXExtent[1])) // End of the line
        .attr('y1', yOffset) // Align with decade
        .attr('y2', yOffset) // Align with decade
        .attr('opacity', 0.5)
        .attr('stroke', 'gray') // Use the single gradient
        .attr('stroke-width', 1)
        .attr('stroke-linecap', 'round'); // Optional: Rounded edges
    });

    // Add X-axis
    svg
      .append('g')
      .attr(
        'transform',
        `translate(${margin.left}, ${margin.top + innerHeight})`
      )
      .call(d3.axisBottom(xScale).ticks(10).tickSizeOuter(0));

    // Add Y-axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(yNameScale).tickSizeOuter(0));

    // Add labels
    /*   svg
      .append('text')
      .attr('x', innerWidth / 2 + margin.left)
      .attr('y', margin.top - 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .text('Mean Monthly Temperature by Decade');
 */
    svg
      .append('text')
      .attr('x', innerWidth / 2 + margin.left)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text('Temperature (°F)');
  }, [minData, maxData, selectedCountryCode, newWidth]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative w-full mb-2">
        <div className="flex relative justify-center items-center w-full">
          <div className="relative overflow-x-auto h-full w-fit">
            <svg ref={svgRef} />
            <Tooltip id="tooltip" />
          </div>
        </div>
      </div>
      <DataSourceInfo>
        National Centers for Environmental Information (NCEI);{' '}
        <ShowMoreChartDetailsModalDialog>
          <div className="mt-1 mb-3 mr-4 ml-4">
            <h2 className="font-serif mt-4 mb-2 text-xl xs:text-2xl sm:text-3xl">
              Methodologies
            </h2>
            <p>
              From the database provided by the National Centers for
              Environmental Information containing data on minimum, maximum and
              average temperatures, only those relating to the states and nation
              have been extracted. The data are displayed on request depending
              on the selected year.
            </p>
          </div>
        </ShowMoreChartDetailsModalDialog>
      </DataSourceInfo>
      <div className="mt-3">
        <label htmlFor="country">Select country: </label>
        <select
          id="country"
          value={selectedCountryCode}
          onChange={(e) => setSelectedCountryCode(e.target.value)} // Nessuna conversione a number
          className="py-1 px-2 ml-2 rounded-md border bg-background"
        >
          {[...new Set(minData.map((d) => d.countryName))].map(
            (countryName) => (
              <option key={countryName} value={countryName}>
                {countryName}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );
};

export default RidgeLine;
