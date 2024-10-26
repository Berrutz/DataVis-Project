"use client"

import { useInView } from "react-intersection-observer";
import { useActiveSectionContext } from "../context/active-section-context-provider";
import { useEffect } from "react";

export default function FinalProjectSection() {
  const { setActiveSection } = useActiveSectionContext();
  const { ref, inView } = useInView({threshold:0.75});

  useEffect(() => {
    if (inView) {
      setActiveSection("Final Project");
    }
  }, [inView])

  return (
    <section ref={ref} id="final-project" className="h-screen flex items-center justify-center bg-cyan-50">
      <h1 className="text-6xl font-medium font-serif">Final Project</h1>
    </section>
  );
}
