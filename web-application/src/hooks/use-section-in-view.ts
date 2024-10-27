import {
  SectionName,
  useActiveSectionContext,
} from "@/context/active-section-context-provider";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export function useSectionInView(
  sectionName: SectionName,
  threshold: number = 0.75,
) {
  const { ref, inView } = useInView({ threshold: threshold });
  const { setActiveSection, timeLastClick } = useActiveSectionContext();

  useEffect(() => {
    if (inView && Date.now() - timeLastClick > 1000) {
      setActiveSection(sectionName);
    }
  }, [inView, timeLastClick, sectionName, setActiveSection]);

  return ref;
}
