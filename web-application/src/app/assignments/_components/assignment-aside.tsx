import { cn } from '@/lib/utils';
import React, { ReactElement } from 'react';
import { ReactNode } from 'react';
import {
  ChartBody,
  ChartBodyProps,
  ChartContainer,
  ChartContainerProps,
  ChartHeading,
  ChartHeadingProps,
  ChartSection,
  ChartSectionProps
} from './chart-section';
import Link from 'next/link';

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
  asideContent
}: {
  isOpen: boolean;
  asideContent: AsideSection[];
}) => {
  return (
    <aside
      className={cn(
        'fixed right-0 top-0 overflow-y-auto 2xl:block 2xl:sticky 2xl:h-dvh 2xl:pt-3 z-[999] max-2xl:border-l bottom-0 bg-background w-[min(100%,_600px)] p-3 pt-16',
        !isOpen && 'hidden 2xl:block'
      )}
    >
      <h1 className="mb-2 text-lg font-bold">Table of contents:</h1>
      {asideContent.map((sec, secIndex) => (
        <div className="mb-3" key={secIndex}>
          <div className="flex w-full">
            <Link
              className="relative z-20 py-px w-full text-sm font-bold transition-[color]"
              href={`#${sec.elem.id}` || '#'}
            >
              {sec.elem.name}
            </Link>
          </div>

          <div className="flex flex-col gap-0 w-full">
            {sec.children.map((subsec, elemIndex) => (
              <Link
                className="relative z-20 pl-3 text-sm text-secondary-foreground"
                href={`#${subsec.id}` || '#'}
                key={`${secIndex}-${elemIndex}`}
              >
                {subsec.name}
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
  type: React.JSXElementConstructor<T>
) {
  return React.isValidElement(child) && child.type === type;
}

export const parseChildren = (children: ReactNode) => {
  const asideContent: AsideSection[] = [];

  React.Children.map(children, (child) => {
    if (!ensureValidReactElement(child, ChartSection)) {
      return child;
    }

    const chartSection = child as React.ReactElement<ChartSectionProps>;
    const asideSection = parseChartSection(chartSection);
    asideContent.push(asideSection);
  });

  return asideContent;
};

function parseChartSection(chartSection: ReactElement<ChartSectionProps>) {
  const asideSectionChildren: AsideElement[] = [];

  React.Children.map(chartSection.props.children as ReactElement, (child) => {
    if (ensureValidReactElement(child, ChartHeading)) {
      const chartHeading = child as React.ReactElement<ChartHeadingProps>;
      const asideElements = parseChartHeading(chartHeading);
      asideSectionChildren.push(...asideElements);
    }

    if (ensureValidReactElement(child, ChartBody)) {
      const chartBody = child as React.ReactElement<ChartBodyProps>;
      const asideElements = parseChartBody(chartBody);
      asideSectionChildren.push(...asideElements);
    }
  });

  return {
    elem: {
      asidekey: chartSection.props.asidekey,
      id: chartSection.props.id,
      name: chartSection.props.asidename
    },
    children: asideSectionChildren
  } as AsideSection;
}

function parseChartHeading(chartHeading: ReactElement<ChartHeadingProps>) {
  const asideElements: AsideElement[] = [];

  React.Children.map(chartHeading.props.children as ReactElement, (child) => {
    if (!ensureValidReactElement(child, ChartContainer)) {
      return child;
    }

    const chartContainer = child as React.ReactElement<ChartContainerProps>;
    const asideElement = parseChartContainer(chartContainer);
    asideElements.push(asideElement);
  });

  return asideElements;
}

function parseChartBody(chartBody: ReactElement<ChartBodyProps>) {
  const asideElements: AsideElement[] = [];

  React.Children.map(chartBody.props.children as ReactElement, (child) => {
    if (!ensureValidReactElement(child, ChartContainer)) {
      return child;
    }

    const chartContainer = child as React.ReactElement<ChartContainerProps>;
    const asideElement = parseChartContainer(chartContainer);
    asideElements.push(asideElement);
  });

  return asideElements;
}

function parseChartContainer(
  chartContainer: ReactElement<ChartContainerProps>
) {
  return {
    name: chartContainer.props.asidename,
    asidekey: chartContainer.props.asidekey,
    id: chartContainer.props.id
  } as AsideElement;
}
