"use client"

import { useSectionInView } from "@/hooks/use-section-in-view"
import { useScroll, useTransform, motion } from "framer-motion";
import { useEffect, useState } from "react";

type AssignmentDataType = {
  name: string;
}

const assignmentsData: AssignmentDataType[] = [
  {
    name: "Assignment 1"
  },
  {
    name: "Assignment 2"
  },
  {
    name: "Assignment 3"
  },
  {
    name: "Assignment 4"
  },
  {
    name: "Assignment 5"
  },
]

export default function AssignmentsSection() {
  const { ref } = useSectionInView("Assignments", 0.2);
  const { scrollYProgress } = useScroll({
    //@ts-expect-error expected ref assignment error 
    target: ref,
    offset: ["start start", "end end"]
  });

  const assignmentsXTranslate = useTransform(scrollYProgress, [0.3, 1], ["100%", "-150%"]);
  const [isScreenSmall, setIsScreenSmall] = useState(false);

  // This is needed to disable scroll animation used in small screens 
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)');
    const handleResize = () => setIsScreenSmall(mediaQuery.matches);

    handleResize();
    mediaQuery.addEventListener('change', handleResize);

    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  return (
    <section ref={ref} id="assignments" className="flex min-h-screen scroll-mt-32 flex-col items-center justify-center">

      <h1 className="z-20 mb-12 font-serif text-5xl font-medium">Assignments</h1>

      <div className="h-[300vh] w-full sm:flex sm:h-fit sm:justify-center">
        <div className="sticky top-0 mt-[-20vh] flex h-screen flex-col items-center justify-center gap-24 overflow-clip sm:relative sm:h-fit sm:w-full sm:max-w-[1200px] sm:flex-row sm:items-start sm:overflow-visible">

          <motion.div className="flex gap-64 text-center sm:mb-[50vh] sm:mt-[50vh] sm:h-[200vh] sm:flex-col sm:justify-between sm:gap-0 sm:text-start"
            style={{
              translateX: !isScreenSmall ? assignmentsXTranslate : 0,
            }}
          >
            {
              assignmentsData.map((assignment, index) =>
                <h2 key={index} className="font-serif text-4xl font-bold text-gray-400">{assignment.name}</h2>
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
