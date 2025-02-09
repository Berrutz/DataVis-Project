export function tooltipPositionOnMouseMove(
  tooltipRef: React.MutableRefObject<HTMLDivElement | null>,
  containerRef: React.MutableRefObject<HTMLDivElement | null>,
  event: any,
  horizontalOffset: number,
  verticalOffset: number
) {
  const containerRect = containerRef.current?.getBoundingClientRect();

  if (tooltipRef.current) {
    const tooltipX =
      event.clientX - (containerRect?.left || 0) + horizontalOffset;
    const tooltipY = event.clientY - (containerRect?.top || 0) - verticalOffset;

    tooltipRef.current.style.left = `${tooltipX}px`;
    tooltipRef.current.style.top = `${tooltipY}px`;
    tooltipRef.current.style.display = 'block';
    tooltipRef.current.style.opacity = '1';
  }
}
