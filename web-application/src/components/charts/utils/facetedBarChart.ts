// Function to split text into multiple lines
export function splitText(text: string, maxLength: number): string[] {
  const words = text.split(/[\s-]+/);
  let lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    if ((currentLine + ' ' + word).length > maxLength) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine += (currentLine ? ' ' : '') + word;
    }
  });
  if (currentLine) lines.push(currentLine);

  return lines;
}

// Function to calculate the maximum number of characters per line based on a lenght in pixel
export function calculateMaxLength(width: number, fontSize: number): number {
  const charWidth = fontSize * 8; // Approximate character width based on font size
  return Math.floor(width / charWidth);
}

export function tooltipPositionOnMouseMove(
  tooltipRef: React.MutableRefObject<HTMLDivElement | null>,
  svgRef: React.MutableRefObject<SVGSVGElement | null>,
  event: any,
  horizontalOffset: number,
  verticalOffset: number
) {
  const svgRect = svgRef.current?.getBoundingClientRect();

  if (tooltipRef.current) {
    const tooltipX = event.clientX - (svgRect?.left || 0) + horizontalOffset;
    const tooltipY = event.clientY - (svgRect?.top || 0) - verticalOffset;

    tooltipRef.current.style.left = `${tooltipX}px`;
    tooltipRef.current.style.top = `${tooltipY}px`;
    tooltipRef.current.style.display = 'block';
    tooltipRef.current.style.opacity = '1';
  }
}
