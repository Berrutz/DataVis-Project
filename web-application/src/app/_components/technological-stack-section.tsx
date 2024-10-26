"use client"

import { useSectionInView } from "@/hooks/use-section-in-view";

export default function TechnologicalStachSection() {
  var secRef = useSectionInView("Technological Stack");

  return (
    <section ref={secRef} id="technological-stack" className="h-screen flex items-center justify-center bg-orange-50">
      <h1 className="text-6xl font-medium font-serif">Technological Stack</h1>
    </section>
  );
}
