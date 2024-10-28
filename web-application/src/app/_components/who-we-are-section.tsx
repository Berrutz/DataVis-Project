"use client"

import { useSectionInView } from "@/hooks/use-section-in-view"
import { motion, useAnimation } from "framer-motion";
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
  const control = useAnimation();

  return (
    <section
      ref={ref}
      id="who-we-are" className="relative mt-[-60vh] min-h-screen p-6 md:mt-[-70vh] flex flex-col items-center justify-center">

      <div className="z-30 flex flex-col items-center gap-6 sm:flex-row justify-center flex-wrap lg:gap-12">
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
    <div className="bg-background flex flex-col items-center p-6 border rounded-md shadow-md w-[300px] text-center">
      <Image src={values.imageUri} alt={values.name} width={200} height={200} className="rounded-full aspect-square w-[80px] bg-red-50" />
      <h1 className="font-medium text-xl mt-6">{values.name}</h1>
      <div className="mt-3 h-full flex items-center justify-center">
        <p>{values.content}</p>
      </div>
    </div>
  );
}
