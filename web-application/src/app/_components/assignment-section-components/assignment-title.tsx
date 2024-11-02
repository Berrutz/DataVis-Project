import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import {
  AssignmentDataType,
  CurrentAssignmentType,
} from "../assignments-section";
import { useInView } from "framer-motion";

interface AssignmentTitlePorps {
  isSmallScreen: boolean;
  assignmentData: AssignmentDataType;
  setSelectedAss: React.Dispatch<React.SetStateAction<CurrentAssignmentType[]>>;
}

export const AssignmentTitle = ({
  assignmentData,
  isSmallScreen,
  setSelectedAss,
}: AssignmentTitlePorps) => {
  const ref = useRef();
  //@ts-expect-error expected ref assignment error
  const bigView = useInView(ref, {
    margin: "-45% 0px -45% 0px",
  });

  //@ts-expect-error expected ref assignment error
  const smallView = useInView(ref, {
    margin: "0px -38% 0px -38%",
  });

  const isInView = isSmallScreen ? smallView : bigView;

  useEffect(() => {
    if (isInView) {
      setSelectedAss((prev) => [assignmentData.name, ...prev]);
    }

    if (!isInView) {
      setSelectedAss((prev) =>
        prev.filter((name) => name !== assignmentData.name),
      );
    }
  }, [isInView, setSelectedAss]);

  return (
    //@ts-expect-error expected ref assignment error
    <div
      ref={ref}
      className={cn(
        "w-[250px] text-center transition-transform sm:max-w-[250px]",
        isInView && "scale-105",
      )}
    >
      <h1
        className={cn(
          "duration-400 mb-3 font-serif text-4xl font-bold text-gray-400 transition-colors",
          isInView && "text-foreground",
        )}
      >
        {assignmentData.name}
      </h1>
      <h2
        className={cn(
          "duration-400 text-xl font-medium leading-4 text-gray-200 transition-colors",
          isInView && "text-gray-500",
        )}
      >
        {assignmentData.shortDescription}
      </h2>
    </div>
  );
};
