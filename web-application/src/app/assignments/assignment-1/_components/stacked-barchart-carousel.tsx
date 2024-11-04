import { Button } from '@/components/ui/button';
import { useState } from 'react';
import StackedBarChart from './UE-emission-top5-StackedBarChart';
import StackedBarChart2 from './UE-emission-top5-StackedBarChart-2';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StackedBarChartCarousel = () => {
    // Track the current slide index
    const [currentIndex, setCurrentIndex] = useState(0);
    const svgComponents = [<StackedBarChart />, <StackedBarChart2 />];

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % svgComponents.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + svgComponents.length) % svgComponents.length);
    };

    return (
        <div>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}  // Start off-screen
                    animate={{ opacity: 1, x: 0 }}    // Slide in
                    exit={{ opacity: 0, x: -100 }}    // Slide out
                    transition={{ duration: 0.3 }}    // Adjust duration as needed
                    className="w-full h-full"
                >
                    <div className="overflow-x-auto">
                        {svgComponents[currentIndex]}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-2">
                <Button
                    onClick={handlePrevious}
                    variant={"default"}
                    size={"lg"}
                >
                    <ChevronLeft />
                </Button>
                <Button
                    onClick={handleNext}
                    variant={"default"}
                    size={"lg"}
                >
                    <ChevronRight />
                </Button>
            </div>
        </div>
    );
};

export default StackedBarChartCarousel;
