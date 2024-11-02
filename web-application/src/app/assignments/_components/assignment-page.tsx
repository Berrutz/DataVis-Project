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
        <main className="p-3 sm:p-6 md:p-12 min-h-dvh">
            <div className="flex flex-col gap-3 items-center w-full">
                <div className="text-center max-w-[750px] text-pretty">
                    <motion.h1
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className="font-serif text-3xl font-bold sm:text-4xl md:text-5xl"
                    >
                        {title}
                    </motion.h1>
                </div>
            </div>
            {children}
        </main>
    );
}
