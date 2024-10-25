"use client"

import { ThemeSwitcherButton } from "@/components/theme-button";
import { cn } from "@/lib/utils";
import Link from "next/link"
import { Key, useState } from "react"

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
        className={cn("text-sm font-medium font-sans px-2 py-1 rounded-full text-foreground/30", selected && "bg-primary text-primary-foreground")}
        href={link}>
        {name}
      </Link>);
  }

  return <div className="absolute px-6 pt-3 left-0 top-0 right-0 flex items-center justify-center">

    <nav className="p-3 flex items-center justify-center flex-wrap gap-3 bg-foreground/[0.025] dark:bg-foreground/20 backdrop-blur shadow-md rounded-full ">
      {
        links.map((link, index) => <NavLink key={index} name={link.name} link={link.link} index={index} selected={navSelection === index} />)
      }
    </nav>

    <ThemeSwitcherButton classNames="absolute right-0 top-0 m-4" />
  </div>
}
