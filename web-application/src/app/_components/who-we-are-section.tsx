"use client"

import { useSectionInView } from "@/hooks/use-section-in-view"
import { motion } from "framer-motion";

export default function WhoWeAreSection() {
  const {ref} = useSectionInView("Who we are")
  
  return (
    <motion.section 
      ref={ref} 
      id="who-we-are" className="h-screen bg-primary mt-[-70vh]">

      <h1 className="text-5xl font-medium font-serif text-center">Who we are</h1>

    </motion.section>
  );
}
