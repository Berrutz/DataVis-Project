"use client"

import { ThemeSwitcherButton } from "@/components/theme-button";
import { cn } from "@/lib/utils";
import Link from "next/link"
import { useState } from "react"

const links = [
  {
    name: "Who are we",
    link: "#"
  },
  {
    name: "Assignments",
    link: "#"
  },
  {
    name: "Final Project",
    link: "#"
  },
  {
    name: "Tecnological stack",
    link: "#"
  },
]
export default function HomepageNavbar() {
  const [navSelection, setNavSelection] = useState<number>(0);
  console.log(navSelection);
  const NavLink = ({ name, link, index: index, selected }: { name: string, link: string, index: number, selected: boolean }) => {
    return (
      <Link
        onClick={() => setNavSelection(index)}
        className={cn("text-sm font-medium font-sans px-2 py-1 rounded-md text-foreground/60", selected && "bg-primary text-primary-foreground")}
        href={link}>
        {name}
      </Link>);
  }

  return <div className="fixed px-6 pt-6 left-0 top-0 right-0 flex items-center justify-center">

    <nav className="dark:border p-3 flex items-center justify-center flex-wrap gap-3 bg-background/60 backdrop-blur shadow-xl rounded-md">
      {
        links.map((link, index) => <NavLink key={index} name={link.name} link={link.link} index={index} selected={navSelection === index} />)
      }
    </nav>

    <ThemeSwitcherButton classNames="absolute right-0 top-0 m-3" />
  </div>
}
