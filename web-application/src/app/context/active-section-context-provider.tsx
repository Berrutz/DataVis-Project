"use client"

import { createContext, useContext, useState } from "react";
import { links } from "../_components/homepage-nav";

type SectionName = typeof links[number]["name"];

// Props for ActiveSectionContextProvider
type ActiveSectionContextProviderProps = {
  children: React.ReactNode;
}

// The type for the context 
type ActiveSectionContextType = {
  activeSection: SectionName,
  setActiveSection: React.Dispatch<React.SetStateAction<SectionName>>;
}

// The actual react context
export const ActiveSectionContext = createContext<ActiveSectionContextType | null>(null);

export default function ActiveSectionContextProvider({ children }: ActiveSectionContextProviderProps) {
  const [activeSection, setActiveSection] = useState<SectionName>("Home");
  return <ActiveSectionContext.Provider
    value={{
      activeSection,
      setActiveSection
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
