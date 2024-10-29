import { cn } from "@/lib/utils";
import Link from "next/link";
import { CurrentAssignmentType } from "../assignments-section";
import { AnimatePresence, motion } from "framer-motion";

interface BaseAssignmentCardProps {
  className?: string,
  children?: React.ReactNode,
  isSelected?: boolean,
}

function BaseAssignmentCard({ className, children, isSelected }: BaseAssignmentCardProps) {
  return (isSelected &&
    <div
      className={cn(
        "absolute left-1/2 top-0 aspect-square h-[250px] -translate-x-1/2 rounded-md sm:left-0 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0",
        isSelected ? "opacity-100" : "opacity-0",
        className
      )}>
      {children}
    </div>
  );
}


interface LinkAssignmentCardProps extends BaseAssignmentCardProps {
  href: string;
}

function LinkAssignmentCard({ href, ...props }: LinkAssignmentCardProps) {
  return <BaseAssignmentCard
    className={cn("shadow-sm", props.className)}
    isSelected={props.isSelected}>
    <Link href={href} className="absolute inset-0">
      {props.children}
      <motion.div
        className="absolute bottom-2 right-2 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground"
        layoutId="go-to-ass-btn">
        Go to assignment
      </motion.div>
    </Link>
  </BaseAssignmentCard>
}


interface SpecificAssignmentCardProps {
  selectedAssignment?: CurrentAssignmentType;
}

export const NoAssignmentCard = ({ selectedAssignment }: SpecificAssignmentCardProps) => {
  return (
    <BaseAssignmentCard
      isSelected={selectedAssignment === undefined || selectedAssignment === null}
      className="bg-gradient-to-br from-background to-gray-200">
      <motion.div className="absolute bottom-2 right-2 aspect-square h-[20px] rounded-md bg-primary/50" layoutId="go-to-ass-btn" />
    </BaseAssignmentCard>
  )
}

export const Assignment1Card = ({ selectedAssignment }: SpecificAssignmentCardProps) => {
  return (
    <LinkAssignmentCard href="#assignments" isSelected={selectedAssignment == "Assignment 1"} className="bg-gradient-to-br from-background to-orange-200">

    </LinkAssignmentCard>
  )
}


export const Assignment2Card = ({ selectedAssignment }: SpecificAssignmentCardProps) => {
  return (
    <LinkAssignmentCard href="#assignments" isSelected={selectedAssignment == "Assignment 2"} className="bg-gradient-to-br from-background to-blue-200">

    </LinkAssignmentCard>
  )
}


export const Assignment3Card = ({ selectedAssignment }: SpecificAssignmentCardProps) => {
  return (
    <LinkAssignmentCard href="#assignments" isSelected={selectedAssignment == "Assignment 3"} className="bg-gradient-to-br from-background to-emerald-200">

    </LinkAssignmentCard>
  )
}


export const Assignment4Card = ({ selectedAssignment }: SpecificAssignmentCardProps) => {
  return (
    <LinkAssignmentCard href="#assignments" isSelected={selectedAssignment == "Assignment 4"} className="bg-gradient-to-br from-background to-red-200">

    </LinkAssignmentCard>
  )
}


export const Assignment5Card = ({ selectedAssignment }: SpecificAssignmentCardProps) => {
  return (
    <LinkAssignmentCard href="#assignments" isSelected={selectedAssignment == "Assignment 5"} className="bg-gradient-to-br from-background to-yellow-200">

    </LinkAssignmentCard>
  )
}
