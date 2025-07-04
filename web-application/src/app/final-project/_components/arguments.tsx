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
    assignmentHref: '/final-project/internet-access',
    imageSrc: getStaticFile('/final-project/section-internet-access.png'),
    imageAlt: 'Faceted bar chart of internet access page',
    title: 'Internet Access',
    description:
      'In this section we analyze the variation in the diffusion of the Internet and its use over time and between EU countries.'
  },
  {
    assignmentHref: '/final-project/use-of-the-internet',
    imageSrc: getStaticFile('/final-project/section-internet-use.png'),
    imageAlt: 'Bubble chart of internet use page',
    title: 'Internet Use',
    description:
      'In this section we analyse the use of the internet in different aspects of society and the relationship of users with it over time and between different EU countries.'
  },
  {
    assignmentHref: '/final-project/digital-skills',
    imageSrc: getStaticFile('/final-project/section-digital-skills.png'),
    imageAlt: 'Grouped bar chart of digital skills page',
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
        'flex flex-wrap items-center justify-center overflow-x-hidden pt-12 sm:pt-20 pb-16 lg:pt-32 lg:pb-16 scroll-mt-24 xs:mx-8 gap-10',
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
