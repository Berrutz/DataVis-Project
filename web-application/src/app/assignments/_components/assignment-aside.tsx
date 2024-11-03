import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import React, { ReactElement, useEffect, useRef } from "react";
import { ReactNode } from "react";
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
import Link from "next/link";
import { useActiveAsideSectionContext } from "@/context/active-aside-section-assignments";

type AsideElement = {
  id?: string;
  asidekey: string;
  name: string;
};

type AsideSection = {
  elem: AsideElement;
  children: AsideElement[];
};

export const PageAsideNavigation = ({
  isOpen,
  asideContent,
}: {
  isOpen: boolean;
  asideContent: AsideSection[];
}) => {
  const { activeAsideSection } = useActiveAsideSectionContext();

  return (
    <aside
      className={cn(
        "fixed right-0 top-0 border-l bottom-0 bg-background w-[min(100%,_400px)] p-3 pt-16",
        !isOpen && "hidden",
      )}
    >
      {asideContent.map((sec, secIndex) => (
        <div className="mb-12" key={secIndex}>
          <div className="flex mb-3 w-full">
            <Link
              className="relative z-20 py-1 px-2 w-full font-bold"
              href={`#${sec.elem.id}` || "#"}
            >
              {sec.elem.name}
              {activeAsideSection?.sectionkey === sec.elem.asidekey && (
                <motion.span
                  layoutId="section-aside-lid"
                  className="absolute inset-0 bg-gray-300 rounded-md z-[-10]"
                />
              )}
            </Link>
          </div>

          <div className="flex flex-col gap-3 w-full">
            {sec.children.map((subsec, elemIndex) => (
              <Link
                className="relative z-20 py-1 pl-6"
                href={`#${subsec.id}` || "#"}
                key={`${secIndex}-${elemIndex}`}
              >
                {subsec.name}
                {activeAsideSection?.subsectionkey === subsec.asidekey && (
                  <motion.span
                    layoutId="container-aside-lid"
                    className="absolute inset-0 bg-gray-100 rounded-md z-[-10]"
                  />
                )}
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

export const parseChildren = (children: ReactNode) => {
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
    chartSection.props.children as ReactElement,
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
  const wrappedChartSection = (
    <SectionInViewWrapper sectionAsideKey={newChartSection.props.asidekey}>
      {newChartSection}
    </SectionInViewWrapper>
  );

  const asideSection: AsideSection = {
    elem: {
      asidekey: chartSection.props.asidekey,
      id: chartSection.props.id,
      name: chartSection.props.asidename,
    },
    children: asideSectionChildren,
  };

  return { wrappedChartSection, asideSection };
}

function parseChartHeading(chartHeading: ReactElement<ChartHeadingProps>) {
  const asideElements: AsideElement[] = [];

  const chartHeadingChildren = React.Children.map(
    chartHeading.props.children as ReactElement,
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
    chartBody.props.children as ReactElement,
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
    name: chartContainer.props.asidename,
    asidekey: chartContainer.props.asidekey,
    id: chartContainer.props.id,
  };

  const wrappedChartContainer = (
    <ContainerInViewWrapper containerAsideKey={chartContainer.props.asidekey}>
      {chartContainer}
    </ContainerInViewWrapper>
  );
  return {
    wrappedChartContainer,
    asideElement,
  };
}

interface ContainerInViewWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  containerAsideKey: string;
}
function ContainerInViewWrapper({
  children,
  containerAsideKey,
}: ContainerInViewWrapperProps) {
  const { setActiveAsideSection, timeLastClick } =
    useActiveAsideSectionContext();
  const ref = useRef(null);
  const isInView = useInView(ref, {
    margin: "0px 0px -98% 0px",
  });

  useEffect(() => {
    console.log("Is in view: ", isInView);

    if (isInView && Date.now() - timeLastClick > 1000) {
      setActiveAsideSection((prev) => {
        return {
          subsectionkey: containerAsideKey,
          sectionkey: prev?.sectionkey || "",
        };
      });
    }
  }, [isInView, timeLastClick, containerAsideKey, setActiveAsideSection]);

  return <div ref={ref}>{children}</div>;
}

interface SectionInViewWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sectionAsideKey: string;
}
function SectionInViewWrapper({
  children,
  sectionAsideKey,
}: SectionInViewWrapperProps) {
  const { setActiveAsideSection, timeLastClick } =
    useActiveAsideSectionContext();
  const ref = useRef(null);
  const isInView = useInView(ref, {
    margin: "0px 0px -98% 0px",
  });

  useEffect(() => {
    console.log("Is in view: ", isInView);
    if (isInView && Date.now() - timeLastClick > 1000) {
      setActiveAsideSection((prev) => {
        return {
          subsectionkey: prev?.subsectionkey || "",
          sectionkey: sectionAsideKey,
        };
      });
    }
  }, [isInView, timeLastClick, sectionAsideKey, setActiveAsideSection]);

  return <div ref={ref}>{children}</div>;
}
