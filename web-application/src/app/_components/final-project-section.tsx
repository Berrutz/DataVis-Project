"use client"

import { useSectionInView } from "@/hooks/use-section-in-view";

export default function FinalProjectSection() {
  const { ref } = useSectionInView("Final Project");

  return (
    <section ref={ref} id="final-project" className="flex h-screen justify-center">
      <h1 className="items-center font-serif text-5xl font-medium">Final Project</h1>
    </section>
  );
}
