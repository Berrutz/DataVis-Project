"use client"

import { motion } from "framer-motion";

export interface AssignmentPageProps {
    title: string;
    shortDescription: string;
    children?: React.ReactNode;
}

const mainVariants = {
    hidden: {
        opacity: 0,
        y: -20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        }
    }
}

const itemVariants = {
    hidden: {
        opacity: 0,
        y: -20,
    },
    visible: {
        opacity: 1,
        y: 0,
    }
}

export default function AssignmentPage({ title, shortDescription, children }: AssignmentPageProps) {
    return <main className="min-h-screen p-1 pt-0 xs:p-3 xs:pt-0 md:p-6 md:pt-0">
        <div className="flex w-full justify-center">
            <motion.div
                variants={mainVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center gap-1 rounded-b-md bg-primary p-1 text-center text-primary-foreground xs:gap-3 xs:p-3 md:gap-6 md:p-6">

                <motion.h1
                    variants={itemVariants}
                    className="font-serif text-3xl font-bold xs:text-5xl sm:text-6xl md:text-7xl">
                    {title}
                </motion.h1>
                <motion.h2
                    variants={itemVariants}
                    className="xs:text-xl sm:text-2xl">
                    {shortDescription}
                </motion.h2>
            </motion.div>
        </div>
        {children}
    </main>
}
