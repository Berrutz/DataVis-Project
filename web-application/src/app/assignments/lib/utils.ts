type TooltipPosition = {
  x: number;
  y: number;
};

/**
 * Calculates the updated position of a tooltip within an SVG, ensuring it stays within the graph's width and height.
 *
 * @param event - The MouseEvent used to get the client's cursor position.
 * @param svgRef - A reference to the SVG element.
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
  svgRef: React.RefObject<SVGSVGElement>,
  innerWidth: number,
  innerHeight: number,
  tooltip: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  horizontalOffset: number = 10,
  verticalOffset: number = 10
): TooltipPosition {
  const svgRect = svgRef.current?.getBoundingClientRect();
  const tooltipWidth = (tooltip.node() as HTMLElement)?.offsetWidth || 0;
  const tooltipHeight = (tooltip.node() as HTMLElement)?.offsetHeight || 0;

  let tooltipX = event.clientX - (svgRect?.left || 0) + horizontalOffset;
  let tooltipY = event.clientY - (svgRect?.top || 0) - verticalOffset;

  // Check if the tooltip would overflow the graph's width and height
  if (tooltipX + tooltipWidth > innerWidth) {
    tooltipX =
      event.clientX - (svgRect?.left || 0) - tooltipWidth - horizontalOffset;
  }
  if (tooltipY + tooltipHeight > innerHeight) {
    tooltipY =
      event.clientY - (svgRect?.top || 0) - tooltipHeight - verticalOffset;
  }

  return { x: tooltipX, y: tooltipY };
}
