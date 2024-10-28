"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link"
import { useState } from "react"
import { MdClose, MdMenu } from "react-icons/md"
import { motion } from "framer-motion";
import { useActiveSectionContext } from "@/context/active-section-context-provider";

export const links = [
  {
    name: "Home",
    link: "#home"
  },
  {
    name: "Who we are",
    link: "#who-we-are"
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
  const { activeSection, setActiveSection, setTimeLastClick } = useActiveSectionContext();
  const [navOpened, setOpened] = useState<boolean>(false);

  return <div className="top-0 left-0 z-[999] fixed flex justify-center w-full">

    <Button
      variant={"outline"}
      size={"icon"}
      className="top-0 right-0 z-[1000] absolute md:hidden m-6"
      onClick={() => setOpened(prev => !prev)}
    >
      {navOpened ? <MdClose /> : <MdMenu />}
    </Button>

    <motion.nav

      initial={{
        y: -20,
        opacity: 0
      }}

      animate={{
        y: 0,
        opacity: 1,
      }}

      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}

      className={cn("flex-col md:flex-row w-full md:w-fit md:m-6 py-3 px-12 rounded-b-xl md:rounded-full flex flex-wrap justify-center items-center gap-6 shadow-md bg-background/60 backdrop-blur-md", navOpened ? "flex" : "hidden md:flex")}>
      {
        links.map((value, index) =>
          <Link key={index}
            href={value.link}
            className={cn("relative opacity-50 px-2 py-1 transition-all duration-300", value.name === activeSection && "opacity-100 text-primary-foreground")}
            onClick={() => {
              setActiveSection(value.name);
              setTimeLastClick(Date.now);
            }}
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
    </motion.nav>
  </div>
}
