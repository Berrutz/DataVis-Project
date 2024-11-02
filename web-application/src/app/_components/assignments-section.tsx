"use client"

import { useSectionInView } from "@/hooks/use-section-in-view"
import { useScroll, useTransform, motion } from "framer-motion";
import { useState } from "react";
import { Assignment1Card, Assignment2Card, Assignment3Card, Assignment4Card, Assignment5Card, NoAssignmentCard } from "./assignment-section-components/assignment-card";
import { AssignmentTitle } from "./assignment-section-components/assignment-title";
import { useIsScreen } from "@/hooks/use-is-screen";
import { assignmentsData } from "../assignments/_data/assignment-data";

export type CurrentAssignmentType = typeof assignmentsData[number]["name"];

export default function AssignmentsSection() {

  // Scroll animation for small screens (only assignments title) 
  const { ref } = useSectionInView("Assignments", 0.3);
  const { scrollYProgress } = useScroll({
    //@ts-expect-error expected ref assignment error 
    target: ref,
    offset: ["start start", "end end"]
  });
  const assignmentsXTranslate = useTransform(scrollYProgress, [0.50, 0.83], ["100%", "-150%"]);
  const isSmallScreen = useIsScreen("small");

  const [currentFocusedAss, setCurrentFocusedAss] = useState<CurrentAssignmentType[]>([]);

  return (
    <section ref={ref} id="assignments" className="mb-[calc(-50vh_+_165px)] mt-[calc(-50vh_+_125px)] flex scroll-m-[-100px] flex-col items-center sm:mb-[calc(-50vh_+_125px)] sm:scroll-mt-44">

      <div className="mb-12 w-full sm:flex sm:justify-center sm:mb-0 h-[200vh] sm:h-fit">
        <div className="flex sticky top-0 flex-col gap-24 justify-center items-center h-screen sm:overflow-visible sm:relative sm:flex-row sm:items-start sm:w-full overflow-clip sm:h-fit sm:max-w-[1200px]">

          <motion.div className="flex gap-24 items-end h-full sm:flex-col sm:justify-between sm:w-full sm:my-[50vh]"
            style={{
              translateX: isSmallScreen ? assignmentsXTranslate : 0,
            }}
          >
            {
              assignmentsData.map((value, index) =>
                <AssignmentTitle
                  setSelectedAss={setCurrentFocusedAss}
                  key={index}
                  assignmentData={value}
                  isSmallScreen={isSmallScreen} />
              )
            }
          </motion.div>

          <div className="relative w-full h-full sm:sticky sm:top-0 sm:h-screen">
            <NoAssignmentCard selectedAssignment={currentFocusedAss.at(0)} />
            <Assignment1Card selectedAssignment={currentFocusedAss.at(0)} />
            <Assignment2Card selectedAssignment={currentFocusedAss.at(0)} />
            <Assignment3Card selectedAssignment={currentFocusedAss.at(0)} />
            <Assignment4Card selectedAssignment={currentFocusedAss.at(0)} />
            <Assignment5Card selectedAssignment={currentFocusedAss.at(0)} />
          </div>

        </div>
      </div>
    </section>
  );
}
