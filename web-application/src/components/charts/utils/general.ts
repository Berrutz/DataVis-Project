import { MutableRefObject } from 'react';

type TooltipPosition = {
  x: number;
  y: number;
};

export function tooltipPositionOnMouseMove(
  tooltipRef: React.MutableRefObject<HTMLDivElement | null>,
  containerRef: React.MutableRefObject<HTMLDivElement | null>,
  event: any,
  horizontalOffset: number,
  verticalOffset: number,
  chartWidth: number
) {
  const containerRect = containerRef.current?.getBoundingClientRect();

  if (tooltipRef.current) {
    const tooltipWidth = tooltipRef.current.offsetWidth || 0;

    var tooltipX =
      event.clientX - (containerRect?.left || 0) + horizontalOffset;
    const tooltipY = event.clientY - (containerRect?.top || 0) - verticalOffset;

    if (tooltipX + tooltipWidth > chartWidth) {
      tooltipX =
        event.clientX -
        (containerRect?.left || 0) -
        tooltipWidth -
        horizontalOffset;
    }

    tooltipRef.current.style.left = `${tooltipX}px`;
    tooltipRef.current.style.top = `${tooltipY}px`;
    tooltipRef.current.style.display = 'block';
    tooltipRef.current.style.opacity = '1';
  }
}

/**
 * Another version of a function to calculate tooltip position, this one move the tooltip from left to right
 * depending on the fact that the cursor is on the first or second half of the svg
 * Calculates the updated position of a tooltip within an SVG, ensuring it stays within the graph's width and height.
 *
 * @param event - The MouseEvent used to get the client's cursor position.
 * @param svgContainerRef - A reference to the SVG element.
 * @param innerWidth - The inner width of the graph (for overflow checks).
 * @param innerHeight - The inner height of the graph (for overflow checks).
 * @param horizontalOffset - The horizontal offset to position the tooltip.
 * @param verticalOffset - The vertical offset to position the tooltip.
 * @param tooltip - The D3 selection of the tooltip element.
 *
 * @returns An object containing the calculated x and y positions for the tooltip.
 */
export function updateTooltipPosition(
  event: MouseEvent,
  svgContainerRef: React.MutableRefObject<HTMLDivElement | null>,
  innerWidth: number,
  innerHeight: number,
  tooltip: MutableRefObject<HTMLDivElement | null>,
  horizontalOffset: number = 10,
  verticalOffset: number = 10
): TooltipPosition {
  if (tooltip.current) {
    const containerRect = svgContainerRef.current?.getBoundingClientRect();
    const tooltipWidth = tooltip.current.offsetWidth || 0;
    const tooltipHeight = tooltip.current.offsetHeight || 0;

    let tooltipX =
      event.clientX - (containerRect?.left || 0) + horizontalOffset;
    let tooltipY = event.clientY - (containerRect?.top || 0) - verticalOffset;

    // Check if the tooltip would overflow the graph's width and height
    if (tooltipX + tooltipWidth > innerWidth) {
      tooltipX =
        event.clientX -
        (containerRect?.left || 0) -
        tooltipWidth -
        horizontalOffset;
    }
    if (tooltipY + tooltipHeight > innerHeight) {
      tooltipY =
        event.clientY -
        (containerRect?.top || 0) -
        tooltipHeight -
        verticalOffset;
    }

    return { x: tooltipX, y: tooltipY };
  }

  return { x: 0, y: 0 };
}
