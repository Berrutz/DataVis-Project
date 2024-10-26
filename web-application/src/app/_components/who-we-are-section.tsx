"use client"

import { useSectionInView } from "@/hooks/use-section-in-view"

export default function WhoWeAreSection() {
  var secRef = useSectionInView("Who we are")

  return (
    <section ref={secRef} id="who-we-are" className="h-screen flex items-center justify-center bg-red-50">
      <h1 className="text-6xl font-medium font-serif">Who we are</h1>
    </section>
  );
}
