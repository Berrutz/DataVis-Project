'use client';

import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/container';
import { Button } from '@/components/ui/button';
import { getStaticFile } from '@/utils/general';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const generalVariants = {
  hidden: { opacity: 1 },
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      ease: 'easeOut',
      duration: 0.3
    }
  }
};

const itemVariant1 = {
  hidden: {
    opacity: 0,
    y: -5
  },
  visible: {
    opacity: 1,
    y: 0
  }
};

const itemVariant2 = {
  hidden: {
    opacity: 0,
    x: 5
  },
  visible: {
    opacity: 1,
    x: 0
  }
};

export default function Hero() {
  return (
    <section id="home">
      <Container>
        <motion.div
          variants={itemVariant1}
          initial="hidden"
          animate="visible"
          className="flex justify-between items-center p-2 w-full sm:p-3 xs:p-2"
        >
          <h1 className="text-xl font-bold">IncApache</h1>
          <Button asChild className="py-1 font-bold rounded-full">
            <Link href="#assignments">Our Works</Link>
          </Button>
        </motion.div>
        <div className="flex flex-col items-center lg:flex-row lg:gap-6 lg:mt-24">
          <motion.div
            variants={itemVariant2}
            initial="hidden"
            animate="visible"
            className="hidden lg:block lg:w-2/5"
          >
            <Image
              height={500}
              width={500}
              alt="Spongebob"
              src={getStaticFile('/spongebob_hero_img.jpg')}
            />
          </motion.div>
          <div className="flex flex-col gap-12 items-center lg:w-3/5">
            <motion.div
              variants={generalVariants}
              initial="hidden"
              animate="visible"
              className="w-fit"
            >
              <motion.h1
                variants={itemVariant1}
                className="font-serif text-6xl font-bold sm:text-8xl md:text-9xl xs:text-7xl"
              >
                <span className="text-primary">Inc</span>Apache
              </motion.h1>
              <motion.h2
                variants={itemVariant2}
                className="font-thin text-xl/3 text-end xs:text-2xl/3 sm:text-4xl/3 md:text-5xl/3"
              >
                group
              </motion.h2>
            </motion.div>
            <motion.div
              variants={generalVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.h3
                variants={itemVariant1}
                className="text-2xl font-semibold sm:text-4xl"
              >
                We would like to take{' '}
                <span className="underline underline-offset-8 text-primary">
                  30
                </span>
              </motion.h3>
              <motion.h4
                variants={itemVariant1}
                className="font-medium text-xl/3 sm:text-2xl3"
              >
                Or just a good grade
              </motion.h4>
            </motion.div>
          </div>
          <motion.div
            variants={itemVariant2}
            initial="hidden"
            animate="visible"
            className="mt-12 lg:hidden max-w-[400px]"
          >
            <Image
              height={500}
              width={500}
              alt="Spongebob"
              src={getStaticFile('/spongebob_hero_img.jpg')}
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
