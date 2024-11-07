import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import StackedBarChart from './eu-emission-stacked-bar-chart';
import StackedBarChart2 from './eu-emission-stacked-bar-chart-2';
import StackedBarChart3 from './eu-emission-stacked-bar-chart-3';
import DataSourceInfo from '../../_components/data-source';

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
            <div className="overflow-x-auto">{svgComponents[currentIndex]}</div>
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
      <DataSourceInfo>
        Global Carbon Budget (2023); Population based on various sources (2023)
      </DataSourceInfo>
    </div>
  );
};

export default StackedBarChartCarousel;
