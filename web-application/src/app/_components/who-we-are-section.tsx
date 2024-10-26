"use client"

import { useSectionInView } from "@/hooks/use-section-in-view"

export default function WhoWeAreSection() {
  var secRef = useSectionInView("Who are we")

  return (
    <section ref={secRef} id="who-are-we" className="h-screen flex items-center justify-center bg-red-50">
      <h1 className="text-6xl font-medium font-serif">Who are we</h1>
    </section>
  );
}
