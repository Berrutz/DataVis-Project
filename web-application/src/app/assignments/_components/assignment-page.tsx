"use client";

import { motion } from "framer-motion";

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
    return (
        <main className="flex flex-col items-center p-3 sm:p-6 md:p-12 min-h-dvh">
            <div className="flex flex-col items-center w-full">
                <div className="max-w-[850px]">
                    <motion.h1
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className="font-serif text-4xl font-bold sm:text-5xl md:text-5xl text-pretty"
                    >
                        {title}
                    </motion.h1>
                    {children}
                </div>
            </div>
        </main>
    );
}
