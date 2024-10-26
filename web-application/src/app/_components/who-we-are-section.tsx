"use client"

import { useSectionInView } from "@/hooks/use-section-in-view"

export default function WhoWeAreSection() {
  const secRef = useSectionInView("Who we are")

  return (
    <section ref={secRef} id="who-we-are" className="h-screen flex items-center justify-center bg-red-50">
      <h1 className="text-5xl font-medium font-serif text-center">Who we are</h1>
    </section>
  );
}
