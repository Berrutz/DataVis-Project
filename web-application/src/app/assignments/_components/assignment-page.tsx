"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import React from "react";
import { PageAsideNavigation, parseChildren } from "./assignment-aside";
import ActiveAsideSectionProvider from "@/context/active-aside-section-assignments";

export interface AssignmentPageProps {
  title: string;
  children?: React.ReactNode;
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function AssignmentPage({
  title,
  children,
}: AssignmentPageProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { newChildren, asideContent } = parseChildren(children);

  return (
    <ActiveAsideSectionProvider>
      <main className="flex relative flex-col items-center p-3 sm:p-6 md:p-12 min-h-dvh">
        <Button
          onClick={() => setIsOpen((prev) => !prev)}
          variant={"outline"}
          size="icon"
          className="fixed top-3 right-3 z-[999]"
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
        <PageAsideNavigation isOpen={isOpen} asideContent={asideContent} />
        <div className="flex flex-col items-center w-full">
          <div className="w-[min(100%,_850px)]">
            <motion.h1
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="font-serif text-4xl font-bold sm:text-5xl md:text-5xl text-pretty"
            >
              {title}
            </motion.h1>
            {newChildren}
          </div>
        </div>
      </main>
    </ActiveAsideSectionProvider>
  );
}
