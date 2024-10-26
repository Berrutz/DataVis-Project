"use client"

import { useSectionInView } from "@/hooks/use-section-in-view"

export default function AssignmentsSection() {
  var secRef = useSectionInView("Assignments");

  return (
    <section ref={secRef} id="assignments" className="h-screen flex items-center justify-center bg-blue-50">
      <h1 className="text-6xl font-medium font-serif">Assignments</h1>
    </section>
  );
}
