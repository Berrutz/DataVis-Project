"use client"

import { useSectionInView } from "@/hooks/use-section-in-view"

export default function HeroSection() {
  const secRef = useSectionInView("Home")

  return <section ref={secRef} id="home" className="relative flex flex-col items-center py-20 md:py-40">
  
    <div className="absolute w-[150px] md:w-[250px] aspect-square bg-red-300 rounded-full blur-[80px] opacity-40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ml-[-100px] md:ml-[-300px] z-[-200]" />
   
    <div className="absolute w-[150px] md:w-[250px] aspect-square bg-blue-300 rounded-full blur-[80px] opacity-40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ml-[100px] md:ml-[300px] z-[-200]" />
   
    <div className="absolute w-[150px] md:w-[250px] aspect-square bg-yellow-300 rounded-full blur-[80px] opacity-40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-[100px] md:mt-[200px] z-[-200]" />

   <div className="absolute w-[150px] md:w-[250px] aspect-square bg-sky-300 rounded-full blur-[80px] opacity-40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-[-100px] z-[-200]" />

    <div className="w-fit">
      <h1 className="grad-text text-5xl xs:text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-serif font-semibold md:font-bold">IncApache</h1>
      <h2 className="block pr-[3px] text-2xl xs:text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-serif font-medium text-end leading-[0px] xs:leading-[0px] sm:leading-[0px] md:leading-[0px] xl:leading-[0px]">group</h2>
    </div>
  </section>
}
