"use client"

import { useSectionInView } from "@/hooks/use-section-in-view"
import { cn } from "@/lib/utils";
import { useScroll, useTransform, motion, useInView, inView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type AssignmentDataType = {
  name: string;
  shortDescription: string;
}

const assignmentsData: AssignmentDataType[] = [
  {
    name: "Assignment 1",
    shortDescription: "This is the content of the assignment 1",
  },
  {
    name: "Assignment 2",
    shortDescription: "This is the content of the assignment",
  },
  {
    name: "Assignment 3",
    shortDescription: "This is the content of the assignment",
  },
  {
    name: "Assignment 4",
    shortDescription: "This is the content of the assignment",
  },
  {
    name: "Assignment 5",
    shortDescription: "This is the content of the assignment",
  },
]

export default function AssignmentsSection() {
  const { ref } = useSectionInView("Assignments", 0.3);
  const { scrollYProgress } = useScroll({
    //@ts-expect-error expected ref assignment error 
    target: ref,
    offset: ["start start", "end end"]
  });

  const assignmentsXTranslate = useTransform(scrollYProgress, [0.46, 0.9], ["100%", "-150%"]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // This is needed to disable scroll animation used in small screens 
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)');
    const handleResize = () => setIsSmallScreen(!mediaQuery.matches);

    handleResize();
    mediaQuery.addEventListener('change', handleResize);

    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  return (
    <section ref={ref} id="assignments" className="flex scroll-m-48 flex-col items-center">

      <div className="mb-12 h-[200vh] w-full sm:flex sm:h-fit sm:justify-center">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-24 overflow-clip sm:relative sm:h-fit sm:w-full sm:max-w-[1200px] sm:flex-row sm:items-start sm:overflow-visible">

          <motion.div className="flex gap-24 sm:my-[50vh] sm:flex-col sm:justify-between sm:gap-24"
            style={{
              translateX: isSmallScreen ? assignmentsXTranslate : 0,
            }}
          >
            {
              assignmentsData.map((value, index) =>
                <AssignmentTitle
                  key={index}
                  assignmentData={value}
                  isSmallScreen={isSmallScreen} />
              )
            }
          </motion.div>

          <div className="sm:sticky sm:top-0">
            <div className="sm:flex sm:h-screen sm:items-center sm:justify-center">
              <div className="aspect-square h-[250px] rounded-md bg-gradient-to-br from-background to-gray-200" />
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}

interface AssignmentTitlePorps {
  isSmallScreen: boolean;
  assignmentData: AssignmentDataType;
};

const AssignmentTitle = ({ assignmentData, isSmallScreen }: AssignmentTitlePorps) => {

  const ref = useRef();
  //@ts-expect-error expected ref assignment error
  const bigView = useInView(ref, {
    margin: "-45% 0px -45% 0px",
  });

  //@ts-expect-error expected ref assignment error
  const smallView = useInView(ref, {
    margin: "0px -40% 0px -40%"
  });

  const isInView = isSmallScreen ? smallView : bigView;

  return (
    //@ts-expect-error expected ref assignment error 
    <div ref={ref} className="w-[250px] text-center sm:max-w-[250px]">
      <h2
        className={cn(
          "duration-400 mb-3 font-serif text-4xl font-bold text-gray-400 transition-colors",
          isInView && "text-foreground",
        )}>{assignmentData.name}</h2>
      <h3
        className={cn(
          "duration-400 text-xl font-medium leading-4 text-gray-200 transition-colors",
          isInView && "text-gray-500",
        )}
      >{assignmentData.shortDescription}</h3>
    </div>
  )
}














