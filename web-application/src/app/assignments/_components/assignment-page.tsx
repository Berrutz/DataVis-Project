"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import {
    ChartBody,
    ChartBodyProps,
    ChartContainer,
    ChartContainerProps,
    ChartHeading,
    ChartHeadingProps,
    ChartSection,
    ChartSectionProps,
} from "./chart-section";
import React from "react";
import Link from "next/link";

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
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { newChildren, asideContent } = parseChildren(children);

    return (
        <main className="flex relative flex-col items-center p-3 sm:p-6 md:p-12 min-h-dvh">
            <Button
                onClick={() => setIsOpen((prev) => !prev)}
                variant={"ghost"}
                size="icon"
                className="fixed top-3 right-3 z-[999]"
            >
                {isOpen ? <X /> : <Menu />}
            </Button>
            <PageAsideNavigation isOpen={isOpen} asideContent={asideContent} />
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
                    {newChildren}
                </div>
            </div>
        </main>
    );
}

type AsideElement = {
    id?: string;
    name: string;
};

type AsideSection = {
    elem: AsideElement;
    children: AsideElement[];
};

const PageAsideNavigation = ({
    isOpen,
    asideContent,
}: {
    isOpen: boolean;
    asideContent: AsideSection[];
}) => {
    return (
        <aside
            className={cn(
                "fixed right-0 top-0 border-l bottom-0 bg-background w-[min(100%,_400px)] p-6",
                !isOpen && "hidden",
            )}
        >
            {asideContent.map((sec, secIndex) => (
                <div className="mb-12">
                    <div className="mb-3">
                        <Link
                            className="font-bold"
                            key={secIndex}
                            href={`#${sec.elem.id}` || "#"}
                        >
                            {sec.elem.name}
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3 pl-6 w-full">
                        {sec.children.map((elem, elemIndex) => (
                            <Link
                                href={`#${elem.id}` || "#"}
                                key={`${secIndex}-${elemIndex}`}
                            >
                                {elem.name}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </aside>
    );
};

function ensureValidReactElement<T>(
    child: ReactNode,
    type: React.JSXElementConstructor<T>,
) {
    return React.isValidElement(child) && child.type === type;
}

const parseChildren = (children: ReactNode) => {
    const asideContent: AsideSection[] = [];

    const newChildren = React.Children.map(children, (child) => {
        if (!ensureValidReactElement(child, ChartSection)) {
            return child;
        }

        const chartSection = child as React.ReactElement<ChartSectionProps>;
        const { wrappedChartSection, asideSection } =
            parseChartSection(chartSection);
        asideContent.push(asideSection);
        return wrappedChartSection;
    });

    return { newChildren, asideContent };
};

function parseChartSection(chartSection: ReactElement<ChartSectionProps>) {
    const asideSectionChildren: AsideElement[] = [];

    const chartSectionChildren = React.Children.map(
        chartSection.props.children,
        (child) => {
            if (ensureValidReactElement(child, ChartHeading)) {
                const chartHeading = child as React.ReactElement<ChartHeadingProps>;
                const { newChartHeading, asideElements } =
                    parseChartHeading(chartHeading);
                asideSectionChildren.push(...asideElements);
                return newChartHeading;
            }

            if (ensureValidReactElement(child, ChartBody)) {
                const chartBody = child as React.ReactElement<ChartBodyProps>;
                const { newChartBody, asideElements } = parseChartBody(chartBody);
                asideSectionChildren.push(...asideElements);
                return newChartBody;
            }

            return child;
        },
    );

    const newChartSection = React.cloneElement(chartSection, {
        children: chartSectionChildren,
    });
    const wrappedChartSection = <InViewWrapper>{newChartSection}</InViewWrapper>;

    const asideSection: AsideSection = {
        elem: {
            id: chartSection.props.id,
            name: chartSection.props.asideName,
        },
        children: asideSectionChildren,
    };

    return { wrappedChartSection, asideSection };
}

function parseChartHeading(chartHeading: ReactElement<ChartHeadingProps>) {
    const asideElements: AsideElement[] = [];

    const chartHeadingChildren = React.Children.map(
        chartHeading.props.children,
        (child) => {
            if (!ensureValidReactElement(child, ChartContainer)) {
                return child;
            }

            const chartContainer = child as React.ReactElement<ChartContainerProps>;
            const { wrappedChartContainer, asideElement } =
                parseChartContainer(chartContainer);

            asideElements.push(asideElement);
            return wrappedChartContainer;
        },
    );

    const newChartHeading = React.cloneElement(chartHeading, {
        children: chartHeadingChildren,
    });
    return {
        newChartHeading,
        asideElements,
    };
}

function parseChartBody(chartBody: ReactElement<ChartBodyProps>) {
    const asideElements: AsideElement[] = [];

    const chartHeadingChildren = React.Children.map(
        chartBody.props.children,
        (child) => {
            if (!ensureValidReactElement(child, ChartContainer)) {
                return child;
            }

            const chartContainer = child as React.ReactElement<ChartContainerProps>;
            const { wrappedChartContainer, asideElement } =
                parseChartContainer(chartContainer);

            asideElements.push(asideElement);
            return wrappedChartContainer;
        },
    );

    const newChartBody = React.cloneElement(chartBody, {
        children: chartHeadingChildren,
    });
    return {
        newChartBody,
        asideElements,
    };
}

function parseChartContainer(
    chartContainer: ReactElement<ChartContainerProps>,
) {
    const asideElement: AsideElement = {
        name: chartContainer.props.asideName,
        id: chartContainer.props.id,
    };

    const wrappedChartContainer = <InViewWrapper>{chartContainer}</InViewWrapper>;
    return {
        wrappedChartContainer,
        asideElement,
    };
}

interface InViewWrapperProps extends React.HTMLAttributes<HTMLDivElement> { }
function InViewWrapper({ children }: InViewWrapperProps) {
    const ref = useRef(null);
    const isInView = useInView(ref);

    useEffect(() => {
        console.log("Is in view: ", isInView);
    }, [isInView]);

    return <div ref={ref}>{children}</div>;
}
