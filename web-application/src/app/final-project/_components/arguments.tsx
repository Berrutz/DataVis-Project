import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getStaticFile } from '@/utils/general';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type AssignmentData = {
  assignmentHref: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
};

const assignmentData: AssignmentData[] = [
  {
    assignmentHref: '/assignments/assignment-1',
    imageSrc: getStaticFile('/barchart-ass1.png'),
    imageAlt: 'Barchart of assignment 1',
    title: 'Internet Access',
    description:
      'In this section we analyze the variation in the diffusion of the Internet and its use over time and between EU countries.'
  },
  {
    assignmentHref: '/assignments/assignment-2',
    imageSrc: getStaticFile('/alluvial-chart-ass2.png'),
    imageAlt: 'Alluvial chart of assignment 2',
    title: 'Internet Use',
    description:
      'In this section we analyse the use of the internet in different aspects of society and the relationship of users with it over time and between different EU countries.'
  },
  {
    assignmentHref: '/assignments/assignment-3',
    imageSrc: getStaticFile('/map-chart-ass3.png'),
    imageAlt: 'Map chart of assignment 3',
    title: 'Digital Skills',
    description:
      'In this section we analyze the level of ICT skills of EU countries over time.'
  }
];

interface ArgumentsProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Arguments: React.FC<ArgumentsProps> = ({ className }) => {
  return (
    <section
      className={cn(
        'flex flex-wrap items-center justify-center overflow-x-hidden pt-32 pb-9 scroll-mt-24 xs:mx-8 gap-8',
        className
      )}
      id="arguments"
    >
      {assignmentData.map((ass, index) => (
        <Link
          href={ass.assignmentHref}
          key={index}
          className="inline-block w-[min(375px,_100%)]"
        >
          <div
            className={cn(
              'bg-card rounded-2xl shadow-lg overflow-hidden border w-full h-[450px] px-3 xs:transition-transform xs:duration-300 xs:hover:scale-105 xs:hover:bg-gray-100'
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
            <div className="flex flex-col justify-between pt-6 pb-3 h-1/2">
              <div className="px-6">
                <h1 className="text-2xl font-semibold">{ass.title}</h1>
                <p className="mt-3">{ass.description}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
};

export default Arguments;
