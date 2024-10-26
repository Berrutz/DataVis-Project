"use client"

import { useSectionInView } from "@/hooks/use-section-in-view";

export default function TechnologicalStachSection() {
  const secRef = useSectionInView("Technological Stack");

  return (
    <section ref={secRef} id="technological-stack" className="h-screen flex items-center justify-center">
      <h1 className="text-4xl font-medium font-serif items-center">Technological Stack</h1>
    </section>
  );
}
