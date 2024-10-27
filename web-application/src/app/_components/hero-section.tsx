"use client"

import { useSectionInView } from "@/hooks/use-section-in-view"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const hVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0
  },
};

export default function HeroSection() {
  const {ref} = useSectionInView("Home", 0.3);
  const scrollRef = useRef();

  const { scrollYProgress } = useScroll({
    //@ts-expect-error expected ref assignment error 
    target: scrollRef,
    offset: ["start start", "end end"]
  })
  const scaleTransform = useTransform(scrollYProgress, [0, 1], [1, 10]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const textScrollOpacityTransofrm = useTransform(scrollYProgress, [0, 0.005], [1, 0]);

  return <section ref={ref} id="home">
    {/* @ts-expect-error expected ref assignment error */}
    <div ref={scrollRef} className="relative h-[300vh] overflow-clip">
      <motion.div style={{ scale: scaleTransform, opacity: opacityTransform }} className="sticky flex items-center justify-center flex-col h-dvh top-0">
        <div className="w-fit">
          <motion.h1
            variants={hVariants}
            initial="hidden"
            animate="visible"
            className="grad-text text-5xl xs:text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-serif font-semibold md:font-bold">
            IncApache
          </motion.h1>

          <motion.h2
            variants={hVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="block pr-[3px] text-2xl xs:text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-serif font-medium text-end leading-[0px] xs:leading-[0px] sm:leading-[0px] md:leading-[0px] xl:leading-[0px]">
            group
          </motion.h2>
        </div>

        <motion.a
          variants={hVariants}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 1, delayChildren: 1 }}
          style={{ opacity: textScrollOpacityTransofrm }}
          href="#who-we-are"
          className="absolute bottom-0 flex flex-col items-center justify-center">

          <motion.div
            animate={{ y: -10 }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeatType: "mirror",
              repeat: Infinity
            }}
            className="flex flex-col items-center justify-center">
            <p className="text-xs font-thin mb-[-10px]">Scroll down!</p>
            <MdKeyboardArrowDown className="h-[50px] w-[50px] text-primary" />
            <MdKeyboardArrowDown className="mt-[-40px] h-[50px] w-[50px] text-primary" />
          </motion.div>

        </motion.a>

      </motion.div>

    </div>
  </section>
}
