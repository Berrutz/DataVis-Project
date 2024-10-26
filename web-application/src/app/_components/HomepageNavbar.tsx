"use client"

import { cn } from "@/lib/utils";
import Link from "next/link"
import { useState } from "react"

const links = [
  {
    name: "Home",
    link: "#home"
  },
  {
    name: "Who are we",
    link: "#who-are-we"
  },
  {
    name: "Assignments",
    link: "#assignments"
  },
  {
    name: "Final Project",
    link: "#final-project"
  },
  {
    name: "Technological Stack",
    link: "#technological-stack"
  },
]


export default function HomepageNavbar() {
  const [navSelection, setNavSelection] = useState<number>(0);

  return <div className="z-[999] fixed left-0 top-0 w-full flex justify-center">

    <nav className="m-6 w-fit py-3 px-12 rounded-full flex flex-wrap justify-center items-center gap-6 shadow-md bg-background/60 backdrop-blur-md">
      {
        links.map((value, index) => 
          <Link key={index} 
            href={value.link}
            className={cn("opacity-50 px-2 py-1 rounded-full", index==navSelection && "opacity-100 bg-primary text-primary-foreground")}
            onClick={() => setNavSelection(index)}
          >
            {value.name}
          </Link>)
      }
    </nav>
  </div>
}
