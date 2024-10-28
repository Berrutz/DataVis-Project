"use client"

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

  return <div className="fixed left-0 top-0 z-[999] flex w-full justify-center">

    <div className="absolute right-0 top-0 z-[1000] m-6 aspect-square h-[40px] rounded-full bg-background/60 text-2xl shadow-md backdrop-blur-md md:hidden">
      <button
        className="flex aspect-square h-[40px] items-center justify-center rounded-full"
        onClick={() => setOpened(prev => !prev)}
      >
        {navOpened ? <MdClose /> : <MdMenu />}
      </button>
    </div>

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

      className={cn("flex w-full flex-col flex-wrap items-center justify-center gap-6 rounded-b-xl bg-background/60 px-6 py-3 shadow-md backdrop-blur-md md:m-6 md:w-fit md:flex-row md:rounded-full", navOpened ? "flex" : "hidden md:flex")}>
      {
        links.map((value, index) =>
          <Link key={index}
            href={value.link}
            className={cn("relative px-2 py-1 opacity-50 transition-all duration-300", value.name === activeSection && "text-primary-foreground opacity-100")}
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
                className="absolute inset-0 rounded-full bg-primary" />}
            <span className="relative">{value.name}</span>
          </Link>)
      }
    </motion.nav>
  </div>
}
