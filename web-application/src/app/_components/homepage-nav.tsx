"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link"
import { useState } from "react"
import { MdClose, MdMenu } from "react-icons/md"
import { motion } from "framer-motion";
import { useActiveSectionContext } from "../context/active-section-context-provider";

export const links = [
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
  const {activeSection, setActiveSection} = useActiveSectionContext();
  const [navOpened, setOpened] = useState<boolean>(false);

  return <div className="z-[999] fixed left-0 top-0 w-full flex justify-center">

    <Button
      variant={"outline"}
      size={"icon"}
      className="md:hidden absolute right-0 top-0 m-6 z-[1000]"
      onClick={() => setOpened(prev => !prev)}
    >
      {navOpened ? <MdClose/> : <MdMenu/>}
    </Button>

    <nav className={cn("flex-col md:flex-row w-full md:w-fit md:m-6 py-3 px-12 rounded-b-xl md:rounded-full flex flex-wrap justify-center items-center gap-6 shadow-md bg-background/60 backdrop-blur-md", navOpened ? "flex" : "hidden md:flex")}>
      {
        links.map((value, index) =>
          <Link key={index}
            href={value.link}
            className={cn("relative opacity-50 px-2 py-1 transition-all duration-300", value.name === activeSection && "opacity-100 text-primary-foreground")}
            onClick={() => setActiveSection(value.name)}
          >
            {value.name === activeSection && 
              <motion.span 
                layoutId="activeSection"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30,
                }}
                className="absolute inset-0 bg-primary rounded-full" />}
            <span className="relative">{value.name}</span>
          </Link>)
      }
    </nav>
  </div>
}
