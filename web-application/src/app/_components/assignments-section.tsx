"use client"

import { useSectionInView } from "@/hooks/use-section-in-view"
import Image from "next/image";
import React, { ReactNode, HTMLAttributes } from "react";

export default function AssignmentsSection() {
  const secRef = useSectionInView("Assignments");

  return (
    <section ref={secRef} id="assignments" className="h-screen flex items-center justify-center bg-blue-50">
      <h1 className="text-6xl font-medium font-serif">Assignments</h1>
      <AssignmentCard imgSrc="/DataVis-Project/bg1.png">
        <h3 className="text-xl font-bold mb-2">Assignment1: comparison</h3>
        <p>
          Comparison of country's emission per capita
        </p>
      </AssignmentCard>
    </section>
  );
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  imgSrc: string;
}

function AssignmentCard({ children, imgSrc, ...props }: CardProps) {
  return (
    <div {...props}
      className="relative max-w-xs overflow-hidden rounded-2xl shadow-lg group"
    >
      <Image width={1000} height={1000}
        src={imgSrc}
        alt="Assignment1"
        className="transition-transform group-hover:scale-110 duration-200"
      />
      <div className="absolute inset-0 flex items-end
            bg-gradient-to-t from-black/60 to-transparent">
        <div className="p-4 text-white">{children}</div>
      </div>
    </div >
  )
}
