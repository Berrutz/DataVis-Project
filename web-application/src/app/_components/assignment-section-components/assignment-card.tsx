import { cn } from "@/lib/utils";
import Link from "next/link";
import { CurrentAssignmentType } from "../assignments-section";
import { motion } from "framer-motion";
import UEEmission1Year from "@/app/assignments/assignment-1/_components/eu-emission-1year";
import Image from "next/image";

interface BaseAssignmentCardProps {
  className?: string;
  children?: React.ReactNode;
  isSelected?: boolean;
}

function BaseAssignmentCard({
  className,
  children,
  isSelected,
}: BaseAssignmentCardProps) {
  return (
    isSelected && (
      <div
        className={cn(
          "absolute left-1/2 top-0 aspect-square h-[250px] -translate-x-1/2 rounded-md sm:left-0 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0",
          isSelected ? "opacity-100" : "opacity-0",
          className,
        )}
      >
        {children}
      </div>
    )
  );
}

interface LinkAssignmentCardProps extends BaseAssignmentCardProps {
  href: string;
}

function LinkAssignmentCard({ href, ...props }: LinkAssignmentCardProps) {
  return (
    <BaseAssignmentCard
      className={cn("shadow-sm", props.className)}
      isSelected={props.isSelected}
    >
      <Link href={href} className="absolute inset-0">
        {props.children}
        <motion.div
          transition={{ duration: 0.2 }}
          className="absolute right-2 bottom-2 py-1 px-2 text-xs rounded-md bg-primary text-primary-foreground"
          layoutId="go-to-ass-btn"
        >
          Go to assignment
        </motion.div>
      </Link>
    </BaseAssignmentCard>
  );
}

interface SpecificAssignmentCardProps {
  selectedAssignment?: CurrentAssignmentType;
}

export const NoAssignmentCard = ({
  selectedAssignment,
}: SpecificAssignmentCardProps) => {
  return (
    <BaseAssignmentCard
      isSelected={
        selectedAssignment === undefined || selectedAssignment === null
      }
      className="bg-gradient-to-br to-gray-200 from-background"
    >
      <motion.div
        transition={{ duration: 0.2 }}
        layoutId="go-to-ass-btn"
        className="absolute right-2 bottom-2 rounded-md aspect-square h-[20px] bg-primary/50"
      />
    </BaseAssignmentCard>
  );
};

export const Assignment1Card = ({
  selectedAssignment,
}: SpecificAssignmentCardProps) => {
  return (
    <LinkAssignmentCard
      href="/assignments/assignment-1"
      isSelected={selectedAssignment == "Assignment 1"}
      className="bg-gradient-to-br from-orange-50 to-orange-200 shadow-xl"
    >
      <div className="p-4 size-full">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          className="p-3 font-serif font-bold rounded-md shadow-xl text-lg/4 text-pretty bg-background text-foreground"
        >
          Analysis of CO2 emissions per capita EU-27
        </motion.h1>
        <motion.div
          initial={{ scale: 0.5, opacity: 0, x: 5 }}
          whileHover={{ scale: 1.05 }}
          whileInView={{ scale: 1, opacity: 1, x: 0 }}
          className="absolute right-4 rounded-md shadow-xl top-[6.8rem] aspect-square size-24 overflow-clip"
        >
          <Image
            className="object-cover size-full"
            src={"DataVis-Project/barchart-ass1.png"}
            width={500}
            height={500}
            alt="barchart assignment 1"
          />
        </motion.div>
        <motion.div
          initial={{ rotate: 10, scale: 0.5, opacity: 0, y: 5 }}
          whileHover={{ scale: 1.05 }}
          whileInView={{ scale: 1, rotate: 0, opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="absolute left-8 top-32 rounded-md shadow-xl aspect-square size-16 overflow-clip"
        >
          <Image
            className="object-cover size-full"
            src={"DataVis-Project/barchart-ass1.png"}
            width={500}
            height={500}
            alt="barchart assignment 1"
          />
        </motion.div>
      </div>
    </LinkAssignmentCard>
  );
};

export const Assignment2Card = ({
  selectedAssignment,
}: SpecificAssignmentCardProps) => {
  return (
    <LinkAssignmentCard
      href="/assignments/assignment-2"
      isSelected={selectedAssignment == "Assignment 2"}
      className="bg-gradient-to-br to-blue-200 from-background"
    ></LinkAssignmentCard>
  );
};

export const Assignment3Card = ({
  selectedAssignment,
}: SpecificAssignmentCardProps) => {
  return (
    <LinkAssignmentCard
      href="/assignments/assignment-3"
      isSelected={selectedAssignment == "Assignment 3"}
      className="bg-gradient-to-br to-emerald-200 from-background"
    ></LinkAssignmentCard>
  );
};

export const Assignment4Card = ({
  selectedAssignment,
}: SpecificAssignmentCardProps) => {
  return (
    <LinkAssignmentCard
      href="/assignments/assignment-4"
      isSelected={selectedAssignment == "Assignment 4"}
      className="bg-gradient-to-br to-red-200 from-background"
    ></LinkAssignmentCard>
  );
};

export const Assignment5Card = ({
  selectedAssignment,
}: SpecificAssignmentCardProps) => {
  return (
    <LinkAssignmentCard
      href="/assignments/assignment-5"
      isSelected={selectedAssignment == "Assignment 5"}
      className="bg-gradient-to-br to-yellow-200 from-background"
    ></LinkAssignmentCard>
  );
};
