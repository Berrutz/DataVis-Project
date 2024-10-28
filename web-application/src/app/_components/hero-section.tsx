"use client";

import { useSectionInView } from "@/hooks/use-section-in-view";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const hVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function HeroSection() {
  const { ref } = useSectionInView("Home", 0.3);
  const scrollRef = useRef();

  const { scrollYProgress } = useScroll({
    //@ts-expect-error expected ref assignment error
    target: scrollRef,
    offset: ["start start", "end end"],
  });
  const scaleTransform = useTransform(scrollYProgress, [0, 1], [1, 10]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const textScrollOpacityTransofrm = useTransform(
    scrollYProgress,
    [0, 0.005],
    [1, 0],
  );

  return (
    <section ref={ref} id="home">
      {/* @ts-expect-error expected ref assignment error */}
      <div ref={scrollRef} className="relative h-[300vh] overflow-clip">
        <motion.div
          style={{ scale: scaleTransform, opacity: opacityTransform }}
          className="top-0 sticky flex flex-col justify-center items-center h-dvh"
        >
          <div className="w-fit">
            <motion.h1
              variants={hVariants}
              initial="hidden"
              animate="visible"
              className="font-semibold font-serif md:font-bold text-5xl sm:text-8xl md:text-9xl lg:text-[10rem] xs:text-7xl grad-text"
            >
              IncApache
            </motion.h1>

            <motion.h2
              variants={hVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="block pr-[3px] font-medium font-serif text-2xl text-end sm:text-5xl md:text-6xl xs:text-4xl xl:text-7xl leading-[0px] sm:leading-[0px] md:leading-[0px] xl:leading-[0px] xs:leading-[0px]"
            >
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
            className="bottom-0 absolute flex flex-col justify-center items-center"
          >
            <motion.div
              animate={{ y: -10 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeatType: "mirror",
                repeat: Infinity,
              }}
              className="flex flex-col justify-center items-center"
            >
              <p className="mb-[-10px] font-thin text-xs">Scroll down!</p>
              <MdKeyboardArrowDown className="w-[50px] h-[50px] text-primary" />
              <MdKeyboardArrowDown className="mt-[-40px] w-[50px] h-[50px] text-primary" />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
