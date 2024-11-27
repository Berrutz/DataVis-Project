import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import StackedBarChart from './eu-emission-stacked-bar-chart';
import StackedBarChart2 from './eu-emission-stacked-bar-chart-2';
import StackedBarChart3 from './eu-emission-stacked-bar-chart-3';
import DataSourceInfo from '../../_components/data-source';
import ShowMoreChartDetailsModalDialog from '../../_components/show-more-chart-details-modal-dialog';

const StackedBarChartCarousel = () => {
  // Track the current slide index
  const [currentIndex, setCurrentIndex] = useState(0);
  const svgComponents = [
    <StackedBarChart />,
    <StackedBarChart2 />,
    <StackedBarChart3 />
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % svgComponents.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + svgComponents.length) % svgComponents.length
    );
  };

  return (
    <div>
      <div className="flex flex-col justify-center">
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }} // Start off-screen
              animate={{ opacity: 1, x: 0 }} // Slide in
              exit={{ opacity: 0, x: -100 }} // Slide out
              transition={{ duration: 0.3 }} // Adjust duration as needed
              className="w-full h-full"
            >
              <div className="overflow-x-auto">
                {svgComponents[currentIndex]}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-2 mb-3">
            <Button onClick={handlePrevious} variant={'default'} size={'lg'}>
              <ChevronLeft />
            </Button>
            <Button onClick={handleNext} variant={'default'} size={'lg'}>
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
      <div className="text-center">
        <DataSourceInfo>
          Global Carbon Budget (2023); Population based on various sources
          (2023)
          {'; '}
          <ShowMoreChartDetailsModalDialog>
            <div className="text-left mt-1 mb-1 mr-4 ml-4">
              <h2 className="mb-4 font-serif text-xl xs:text-2xl sm:text-3xl">
                What you should know about this indicator
              </h2>
              <ul className="list-disc pl-5">
                <li>
                  Per capita emissions represent the emissions of an average
                  person in a country or region - they are calculated as the
                  total emissions divided by population
                </li>
                <li>
                  This data is based on territorial emissions, which do not
                  account for emissions embedded in traded goods
                </li>
                <li>
                  Emissions from international aviation and shipping are not
                  included in any country or region's emissions. They are only
                  included in the global total emissions.
                </li>
              </ul>
              <h2 className="mt-4 mb-2 text-xl xs:text-2xl sm:text-3xl">
                Methodologies
              </h2>
              <p>
                From the database provided by "Our World in Data" containing
                data on per capita CO2 emissions of all countries, only those
                relating to the countries of the European Union (EU-27) in the
                year 2022 were extracted, from there the 5 countries with the
                highest emissions were taken and a single entity containing the
                sum of the emissions of all countries was created.
              </p>
            </div>
          </ShowMoreChartDetailsModalDialog>
        </DataSourceInfo>
      </div>
    </div>
  );
};

export default StackedBarChartCarousel;
