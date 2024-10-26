"use client"

import { useInView } from "react-intersection-observer";
import { useActiveSectionContext } from "../context/active-section-context-provider";
import { useEffect } from "react";

export default function TechnologicalStachSection() {
  const { setActiveSection } = useActiveSectionContext();
  const { ref, inView } = useInView({threshold:0.75});

  useEffect(() => {
    if (inView) {
      setActiveSection("Technological Stack");
    }
  }, [inView])

  return (
    <section ref={ref} id="technological-stack" className="h-screen flex items-center justify-center bg-orange-50">
      <h1 className="text-6xl font-medium font-serif">Technological Stack</h1>
    </section>
  );
}
