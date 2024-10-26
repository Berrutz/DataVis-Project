"use client"

import { createContext, useContext, useState } from "react";
import { links } from "../_components/homepage-nav";

export type SectionName = typeof links[number]["name"];

// Props for ActiveSectionContextProvider
type ActiveSectionContextProviderProps = {
  children: React.ReactNode;
}

// The type for the context 
type ActiveSectionContextType = {
  activeSection: SectionName,
  setActiveSection: React.Dispatch<React.SetStateAction<SectionName>>;

  timeLastClick: number;
  setTimeLastClick: React.Dispatch<React.SetStateAction<number>>;
}

// The actual react context
export const ActiveSectionContext = createContext<ActiveSectionContextType | null>(null);

export default function ActiveSectionContextProvider({ children }: ActiveSectionContextProviderProps) {
  const [activeSection, setActiveSection] = useState<SectionName>("Home");

  // Time of last navbar click (used to fix glitched animation when clicking on navbar item to go in section)
  const [timeLastClick, setTimeLastClick] = useState<number>(0);
  
  return <ActiveSectionContext.Provider
    value={{
      activeSection,
      setActiveSection,
      timeLastClick,
      setTimeLastClick
    }}>
    {children}
  </ActiveSectionContext.Provider>;
}

export function useActiveSectionContext(): ActiveSectionContextType {
  const context = useContext(ActiveSectionContext);
  if (context === null) {
    throw new Error("useActiveSectionContext have a null context, wrap the parent component with the provider");
  }

  return context;
}
