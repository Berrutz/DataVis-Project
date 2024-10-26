"use client"

import { useInView } from "react-intersection-observer";
import { useActiveSectionContext } from "../context/active-section-context-provider";
import { useEffect } from "react";

export default function WhoWeAreSection() {
  const { setActiveSection } = useActiveSectionContext();
  const { ref, inView } = useInView({threshold:0.75});
  
  useEffect(() => {
    if (inView) {
      setActiveSection("Who are we");
    }
  }, [inView])

  return (
    <section ref={ref} id="who-are-we" className="h-screen flex items-center justify-center bg-red-50">
      <h1 className="text-6xl font-medium font-serif">Who are we</h1>
    </section>
  );
}
