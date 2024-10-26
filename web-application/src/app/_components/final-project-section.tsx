"use client"

import { useSectionInView } from "@/hooks/use-section-in-view";

export default function FinalProjectSection() {
  var secRef = useSectionInView("Final Project");

  return (
    <section ref={secRef} id="final-project" className="h-screen flex items-center justify-center bg-cyan-50">
      <h1 className="text-6xl font-medium font-serif">Final Project</h1>
    </section>
  );
}
