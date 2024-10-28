"use client"

import { useSectionInView } from "@/hooks/use-section-in-view"
import { motion } from "framer-motion";
import Image from "next/image";

type WhoWeAreTypeData = {
  imageUri: string;
  name: string;
  content: string;
};

const imagePrefix = "/DataVis-Project/who-we-are";
const whoWeAreData: WhoWeAreTypeData[] = [
  {
    imageUri: imagePrefix + "/spongebob.png",
    name: "Alex Valle",
    content: "The front head of the IncApache group, he likes spongebob and listening to music. Whos don't like spongebob?",
  },
  {
    imageUri: imagePrefix + "/squiddi.png",
    name: "Diego Chiola",
    content: "The front head of the IncApache group, he likes spongebob and listening to music. Whos don't like spongebob?",
  },
  {
    imageUri: imagePrefix + "/patrik.png",
    name: "Gabriele Berruti",
    content: "The front head of the IncApache group, he likes spongebob and listening to music. Whos don't like spongebob?",
  },
]

const whoWeAreCardFadingInVariants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      ease: "easeInOut",
      duration: 0.4,
      delay: 0.2 * index,
    }
  }),
}

export default function WhoWeAreSection() {
  const { ref } = useSectionInView("Who we are")

  return (
    <section
      ref={ref}
      id="who-we-are" className="relative mt-[-60vh] flex min-h-screen flex-col items-center justify-center gap-24 p-6 md:mt-[-70vh]">
      <h1 className="font-serif text-5xl font-medium">Who we are</h1>
      <div className="z-30 flex flex-col flex-wrap items-center justify-center gap-6 sm:flex-row lg:gap-12">
        {whoWeAreData.map((item, index) =>
          <motion.div
            key={index}
            variants={whoWeAreCardFadingInVariants}
            initial="hidden"
            whileInView="visible"
            custom={index}
          >
            <WhoWeAreCard imageUri={item.imageUri} name={item.name} content={item.content} />
          </motion.div>
        )}
      </div>

    </section>
  );
}

const WhoWeAreCard = (values: WhoWeAreTypeData) => {
  return (
    <div className="flex w-[300px] flex-col items-center rounded-md border bg-background p-6 text-center shadow-md">
      <Image src={values.imageUri} alt={values.name} width={200} height={200} className="aspect-square w-[80px] rounded-full bg-red-50" />
      <h1 className="mt-6 text-xl font-medium">{values.name}</h1>
      <div className="mt-3 flex h-full items-center justify-center">
        <p>{values.content}</p>
      </div>
    </div>
  );
}
