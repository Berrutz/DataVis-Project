"use client"

import { useSectionInView } from "@/hooks/use-section-in-view"
import { cn } from "@/lib/utils";
import { useScroll, useTransform, motion, useInView } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type AssignmentDataType = {
  name: string;
  shortDescription: string;
}

const assignmentsData: AssignmentDataType[] = [
  {
    name: "Assignment 1",
    shortDescription: "Comparing categories",
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

type CurrentAssignmentType = typeof assignmentsData[number]["name"];

export default function AssignmentsSection() {
  const { ref } = useSectionInView("Assignments", 0.3);
  const { scrollYProgress } = useScroll({
    //@ts-expect-error expected ref assignment error 
    target: ref,
    offset: ["start start", "end end"]
  });

  const assignmentsXTranslate = useTransform(scrollYProgress, [0.46, 0.85], ["100%", "-150%"]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [currentFocusedAss, setCurrentFocusedAss] = useState<CurrentAssignmentType[]>([]);

  // This is needed to disable scroll animation used in small screens 
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)');
    const handleResize = () => setIsSmallScreen(!mediaQuery.matches);

    handleResize();
    mediaQuery.addEventListener('change', handleResize);

    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  return (
    <section ref={ref} id="assignments" className="mb-[calc(-50vh_+_165px)] mt-[calc(-50vh_+_125px)] flex scroll-m-36 flex-col items-center sm:mb-[calc(-50vh_+_125px)] sm:scroll-mt-44">

      <div className="mb-12 h-[200vh] w-full sm:mb-0 sm:flex sm:h-fit sm:justify-center">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-24 overflow-clip sm:relative sm:h-fit sm:w-full sm:max-w-[1200px] sm:flex-row sm:items-start sm:overflow-visible">

          <motion.div className="flex h-full items-end gap-24 sm:my-[50vh] sm:w-full sm:flex-col sm:justify-between"
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

          <div className="relative h-full w-full sm:sticky sm:top-0 sm:h-screen">
            <NoAssignmentCard currentAssignment={currentFocusedAss.at(0)} />
            <Assignment1Card currentAssignment={currentFocusedAss.at(0)} />
            <Assignment2Card currentAssignment={currentFocusedAss.at(0)} />
            <Assignment3Card currentAssignment={currentFocusedAss.at(0)} />
            <Assignment4Card currentAssignment={currentFocusedAss.at(0)} />
            <Assignment5Card currentAssignment={currentFocusedAss.at(0)} />
          </div>

        </div>
      </div>

    </section>
  );
}

interface AssignmentTitlePorps {
  isSmallScreen: boolean;
  assignmentData: AssignmentDataType;
  setSelectedAss: React.Dispatch<React.SetStateAction<CurrentAssignmentType[]>>;
};

const AssignmentTitle = ({ assignmentData, isSmallScreen, setSelectedAss }: AssignmentTitlePorps) => {

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

  useEffect(() => {
    if (isInView) {
      setSelectedAss((prev) => [assignmentData.name, ...prev]);
    }

    if (!isInView) {
      setSelectedAss((prev) => prev.filter(name => name !== assignmentData.name));
    }

  }, [isInView, setSelectedAss])

  return (
    //@ts-expect-error expected ref assignment error 
    <div ref={ref} className={cn(
      "w-[250px] text-center transition-transform sm:max-w-[250px]",
      isInView && "scale-105"
    )}>
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


interface AssignmentCardProps {
  className?: string;
  children?: React.ReactNode;
  href: string;
  isSelected: boolean;
};

const AssignmentCard = ({ className, children, href, isSelected, ...props }: AssignmentCardProps) => {
  return (
    isSelected &&
    <Link
      href={href}
      className={cn(
        "absolute left-1/2 top-0 aspect-square h-[250px] -translate-x-1/2 rounded-md transition-[shadow] sm:left-0 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0",
        isSelected ? "opacity-100 shadow-sm" : "opacity-0",
        className
      )}>
      <div className="absolute bottom-2 right-2 rounded-md bg-primary px-2 py-1 text-sm text-primary-foreground shadow-md">Go to the assignment</div>
    </Link>
  )
}

interface SpecificAssignmentCardProps {
  currentAssignment?: CurrentAssignmentType;
}

const NoAssignmentCard = (props: SpecificAssignmentCardProps) => {
  return (
    <div
      className={cn(
        "absolute left-1/2 top-0 aspect-square h-[250px] -translate-x-1/2 rounded-md bg-gradient-to-br from-background to-gray-200 transition-[shadow] sm:left-0 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0",
        props.currentAssignment === undefined ? "opacity-100" : "opacity-0",
      )}>
    </div>
  )
}

const Assignment1Card = (props: SpecificAssignmentCardProps) => {
  return (
    <AssignmentCard href="#assignments" isSelected={props.currentAssignment == "Assignment 1"} className="bg-gradient-to-br from-background to-orange-200">

    </AssignmentCard>
  )
}


const Assignment2Card = (props: SpecificAssignmentCardProps) => {
  return (
    <AssignmentCard href="#assignments" isSelected={props.currentAssignment == "Assignment 2"} className="bg-gradient-to-br from-background to-blue-200">

    </AssignmentCard>
  )
}


const Assignment3Card = (props: SpecificAssignmentCardProps) => {
  return (
    <AssignmentCard href="#assignments" isSelected={props.currentAssignment == "Assignment 3"} className="bg-gradient-to-br from-background to-emerald-200">

    </AssignmentCard>
  )
}


const Assignment4Card = (props: SpecificAssignmentCardProps) => {
  return (
    <AssignmentCard href="#assignments" isSelected={props.currentAssignment == "Assignment 4"} className="bg-gradient-to-br from-background to-red-200">

    </AssignmentCard>
  )
}


const Assignment5Card = (props: SpecificAssignmentCardProps) => {
  return (
    <AssignmentCard href="#assignments" isSelected={props.currentAssignment == "Assignment 5"} className="bg-gradient-to-br from-background to-yellow-200">

    </AssignmentCard>
  )
}

