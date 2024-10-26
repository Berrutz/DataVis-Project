"use client"

import { useInView } from "react-intersection-observer";
import { useActiveSectionContext } from "../context/active-section-context-provider";
import { useEffect } from "react";

export default function AssignmentsSection() {
  const { setActiveSection } = useActiveSectionContext();
  const { ref, inView } = useInView({threshold:0.75});

  useEffect(() => {
    if (inView) {
      setActiveSection("Assignments");
    }
  }, [inView])

  return (
    <section ref={ref} id="assignments" className="h-screen flex items-center justify-center bg-blue-50">
      <h1 className="text-6xl font-medium font-serif">Assignments</h1>
    </section>
  );
}
