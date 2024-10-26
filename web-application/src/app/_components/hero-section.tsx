"use client"

import { useSectionInView } from "@/hooks/use-section-in-view"

export default function HeroSection() {
  var secRef = useSectionInView("Home")

  return <section ref={secRef} id="home" className="relative min-h-dvh flex flex-col p-6">
    <div className="flex justify-center mt-36 sm:mt-[20%]"> 
      <div className="w-fit">
        <h1 className="grad-text text-6xl sm:text-8xl lg:text-[10rem] font-serif font-semibold md:font-bold">IncApache</h1>
        <h2 className="mb-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-end leading-[10px] sm:leading-[6px] lg:leading-[2px] pr-[2px]">group</h2>
      </div>
    </div>
  </section>
}
