"use client"

import { useSectionInView } from "@/hooks/use-section-in-view"

export default function HeroSection() {
  const secRef = useSectionInView("Home")

  return <section ref={secRef} id="home" className="relative flex flex-col items-center min-h-dvh p-6">
    <div className="absolute w-[75px] sm:w-[240px] aspect-square bg-red-300 rounded-full blur-[80px] opacity-40 top-1/2 left-1/2" />
    <div className="absolute w-[75px] sm:w-[240px] aspect-square bg-blue-600 right-[10%] rounded-full blur-[80px] opacity-40 hidden" />
    <div className="absolute z-[-200] w-[75px] sm:w-[240px] aspect-square bg-purple-400 rounded-full blur-[80px] opacity-40 hidden" />

    <div className="w-fit mt-20">
      <h1 className="grad-text text-5xl sm:text-8xl md:text-9xl lg:text-[10rem] font-serif font-semibold md:font-bold">IncApache</h1>
      <h2 className="mb-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-end leading-[10px] sm:leading-[6px] lg:leading-[2px] pr-[2px]">group</h2>
    </div>
  </section>
}
