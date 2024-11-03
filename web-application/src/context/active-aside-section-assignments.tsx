"use client";

import { createContext, ReactNode, useContext, useState } from "react";

export interface ActiveAsideSectionType {
  sectionkey: string;
  subsectionkey: string;
}
type ActiveAsideSectionContextType = {
  activeAsideSection: ActiveAsideSectionType;
  setActiveAsideSection: React.Dispatch<
    React.SetStateAction<ActiveAsideSectionType>
  >;

  timeLastClick: number;
  setTimeLastClick: React.Dispatch<React.SetStateAction<number>>;
};

export const ActiveAsideSectionContext =
  createContext<ActiveAsideSectionContextType | null>(null);

export interface ActiveAsideSectionProviderProps {
  children?: ReactNode;
}
export default function ActiveAsideSectionProvider({
  children,
}: ActiveAsideSectionProviderProps) {
  // The active section and subsection in the aside
  const [activeAsideSection, setActiveAsideSection] =
    useState<ActiveAsideSectionType>({
      sectionkey: "",
      subsectionkey: "",
    });
  const [timeLastClick, setTimeLastClick] = useState<number>(0);

  return (
    <ActiveAsideSectionContext.Provider
      value={{
        activeAsideSection,
        setActiveAsideSection,
        timeLastClick,
        setTimeLastClick,
      }}
    >
      {children}
    </ActiveAsideSectionContext.Provider>
  );
}

export function useActiveAsideSectionContext(): ActiveAsideSectionContextType {
  const context = useContext(ActiveAsideSectionContext);
  if (context === null) {
    throw new Error(
      "useActiveAsideSectionContext have a null context, wrap the parent component with the provider",
    );
  }

  return context;
}
