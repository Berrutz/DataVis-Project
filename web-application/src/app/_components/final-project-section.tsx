"use client"

import { useSectionInView } from "@/hooks/use-section-in-view";

export default function FinalProjectSection() {
  const {ref} = useSectionInView("Final Project");

  return (
    <section ref={ref} id="final-project" className="h-screen flex items-center justify-center">
      <h1 className="text-5xl font-medium font-serif items-center">Final Project</h1>
    </section>
  );
}
