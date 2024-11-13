'use client';

import Container from '@/components/container';
import SectionTitle from './section-title';
import { getStaticFile } from '@/utils/general';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HTMLMotionProps, motion, motionValue } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type AssignmentData = {
  assignmentHref: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  description: string;
};

const assignmentData: AssignmentData[] = [
  {
    assignmentHref: '/assignments/assignment-1',
    imageSrc: getStaticFile('/barchart-ass1.png'),
    imageAlt: 'Barchart of assignment 1',
    title: 'Assignment 1',
    subtitle: 'Comparing Categories',
    description:
      'In this assignment multiple charts compare emissions of cities of the European Union.'
  },
  {
    assignmentHref: '/assignments/assignment-2',
    imageSrc: getStaticFile(''),
    imageAlt: '',
    title: 'Assignment 2',
    subtitle: 'Assignment 2 - Subtitle',
    description: ''
  },
  {
    assignmentHref: '/assignments/assignment-3',
    imageSrc: getStaticFile(''),
    imageAlt: '',
    title: 'Assignment 3',
    subtitle: 'Assignment 3 - Subtitle',
    description: ''
  },
  {
    assignmentHref: '/assignments/assignment-4',
    imageSrc: getStaticFile(''),
    imageAlt: '',
    title: 'Assignment 4',
    subtitle: 'Assignment 4 - Subtitle',
    description: ''
  }
];

export default function Assignments() {
  const [currentFocusAssignment, setCurrentFocusAssignment] =
    useState<number>(0);

  return (
    <section className="overflow-x-hidden pt-32 scroll-mt-24" id="assignments">
      <Container>
        <AssignmentCarousel
          currentFocusAssignment={currentFocusAssignment}
          setCurrentFocusAssignment={setCurrentFocusAssignment}
        />
        <div className="flex gap-6 justify-center items-center py-12 w-full">
          <Button
            onClick={() =>
              setCurrentFocusAssignment((prev) => (prev <= 0 ? 0 : prev - 1))
            }
            variant={'ghost'}
            className="p-1 rounded-full transition-all scale-150 hover:scale-[1.50]"
          >
            <ChevronLeft />
          </Button>
          <div className="inline-flex gap-1">
            {assignmentData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFocusAssignment(index)}
                className={cn('rounded-full size-[5px] bg-gray-200')}
              >
                {index === currentFocusAssignment && (
                  <motion.span
                    layoutId="assignment-dot"
                    className="block bg-gray-500 rounded-full size-full"
                  />
                )}
              </button>
            ))}
          </div>
          <Button
            onClick={() =>
              setCurrentFocusAssignment((prev) =>
                prev >= assignmentData.length - 1
                  ? assignmentData.length - 1
                  : prev + 1
              )
            }
            variant={'ghost'}
            className="p-1 rounded-full transition-all ease-in-out scale-150 hover:scale-[1.50]"
          >
            <ChevronRight />
          </Button>
        </div>
      </Container>
    </section>
  );
}

interface AssignmentCarouselProps extends HTMLMotionProps<'div'> {
  setCurrentFocusAssignment: React.Dispatch<React.SetStateAction<number>>;
  currentFocusAssignment: number;
}
const AssignmentCarousel = ({
  setCurrentFocusAssignment,
  currentFocusAssignment
}: AssignmentCarouselProps) => {
  const dragX = motionValue(0);

  const handleDrag = () => {
    const THRESHOLD = 35;
    if (
      dragX.get() < -THRESHOLD &&
      currentFocusAssignment < assignmentData.length - 1
    ) {
      setCurrentFocusAssignment((prev) => prev + 1);
    } else if (dragX.get() > THRESHOLD && currentFocusAssignment > 0) {
      setCurrentFocusAssignment((prev) => prev - 1);
    }
  };

  return (
    <div className="relative translate-x-[calc(50%_-_min(200px,_50%))]">
      <motion.div
        drag={'x'}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDrag}
        animate={{
          translateX: `calc(min(400px, 100%) * -${currentFocusAssignment})`
        }}
        style={{
          x: dragX
        }}
        transition={{
          duration: 0.2,
          ease: 'easeInOut'
        }}
        className="flex relative"
      >
        {assignmentData.map((ass, index) => (
          <div key={index} className="min-w-[min(400px,_100%)] px-3">
            <motion.div
              className={cn(
                'flex flex-col rounded-2xl bg-card size-full opacity-30 transition-all duration-500',
                index === currentFocusAssignment &&
                'opacity-100 sm:shadow-xl sm:scale-105 sm:border'
              )}
            >
              <div className="px-3 pt-3 h-1/2">
                <Image
                  src={ass.imageSrc}
                  width={1000}
                  height={1000}
                  alt={ass.imageAlt}
                  className="object-cover bg-gray-50 border size-full rounded-[calc(theme(borderRadius.2xl)_-_1px)]"
                />
              </div>
              <div className="flex flex-col justify-between py-3 h-1/2">
                <div className="px-6">
                  <h1 className="text-2xl font-semibold">{ass.title}</h1>
                  <h2 className="font-medium text-sm/3 text-foreground/50">
                    {ass.subtitle}
                  </h2>
                  <p className="mt-3">{ass.description}</p>
                </div>
                <div className="px-3 w-full">
                  <Button
                    asChild
                    className="w-full rounded-[calc(theme(borderRadius.xl)_-_1px)]"
                  >
                    <Link
                      href={ass.assignmentHref}
                      aria-disabled={!(index === currentFocusAssignment)}
                      tabIndex={
                        index === currentFocusAssignment ? undefined : -1
                      }
                      className={cn(
                        'pointer-events-none',
                        index === currentFocusAssignment &&
                        'pointer-events-auto'
                      )}
                    >
                      Go to the assignment <ChevronRight className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
