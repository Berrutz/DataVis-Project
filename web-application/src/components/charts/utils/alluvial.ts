import * as d3 from 'd3';
import { Margin } from '../_components/alluvialComponents';

export const handleResize = (updateLegendLayout: () => void) => {
  const handleResizeCallback = () => {
    updateLegendLayout();
  };

  window.addEventListener('resize', handleResizeCallback);

  // Cleanup function
  return () => {
    window.removeEventListener('resize', handleResizeCallback);
  };
}; // Function to wrap text into multiple lines
export function wrapTextLegend(
  textSelection: d3.Selection<d3.BaseType, string, SVGGElement, unknown>,
  maxTextWidth: number,
  lineHeight: number
) {
  textSelection.each(function (d) {
    const text = d3.select(this as SVGTextElement);
    const words = d.split(/\s+/); // Split text into words
    let line: string[] = [];
    let tspan = text.append('tspan').attr('x', 20).attr('dy', '0em');
    let lineIndex = 0;

    words.forEach((word) => {
      line.push(word);
      tspan.text(line.join(' '));

      if (tspan.node()!.getComputedTextLength() > maxTextWidth) {
        line.pop();
        tspan.text(line.join(' ')); // Keep the previous valid line

        // Start a new line
        line = [word];
        tspan = text
          .append('tspan')
          .attr('x', 20)
          .attr('dy', `${lineHeight}px`)
          .text(word);
        lineIndex++;
      }
    });

    // Set final text element height to fit multiple lines
    text.attr('data-line-count', lineIndex + 1);
  });
}
/**
 * Function to wrap text into multiple lines based on max width
 */

export function wrapTextNode(
  textElement: d3.Selection<SVGTextElement, unknown, null, undefined>,
  text: string,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(/\s+/);
  let line: string[] = [];
  let dy = 0; // Tracks vertical offset

  let tspan = textElement
    .append('tspan')
    .attr('x', textElement.attr('x'))
    .attr('dy', '0') // First line stays at dy = 0
    .attr('font-weight', '600')
    .text('');

  words.forEach((word) => {
    line.push(word);
    tspan.text(line.join(' ')); // Try adding the word to the current line

    if ((tspan.node()?.getComputedTextLength() ?? 0) > maxWidth) {
      // Remove the last word that caused overflow
      line.pop();
      tspan.text(line.join(' '));

      // Start a new line with the overflow word
      line = [word];
      dy += lineHeight; // Move down for the new line
      tspan = textElement
        .append('tspan')
        .attr('x', textElement.attr('x'))
        .attr('dy', `${dy}px`)
        .attr('font-weight', '600')
        .text(word);
    }
  });
}
export const updateLegendLayout = (
  legend: d3.Selection<SVGGElement, unknown, null, undefined>,
  legendItems: string[],
  colorScale: d3.ScaleOrdinal<string, string, never>,
  screenWidth: number,
  plotWidth: number,
  plotHeight: number,
  plotMargin: Margin
) => {
  const isLarge = screenWidth >= 1280; // xl

  const legendMarginX = 5;
  const maxTextWidth = 90; // Adjust max text width for wrapping
  const lineHeight = 14; // Adjust line height for readability

  if (isLarge) {
    const legendX = plotWidth + legendMarginX;

    legend.attr('transform', `translate(${legendX}, ${plotMargin.top})`);
    legend.selectAll('*').remove(); // Clear existing legend content

    // Add legend rectangles
    const rects = legend
      .selectAll('rect')
      .data(legendItems)
      .join('rect')
      .attr('x', 0)
      .attr('width', 16)
      .attr('height', 16)
      .attr('fill', (d) => colorScale(d));

    // Add legend text and apply wrapping
    const texts = legend
      .selectAll('text')
      .data(legendItems)
      .join('text')
      .attr('x', 20)
      .attr('font-size', '0.9rem')
      .attr('fill', '#000')
      .call((text) => wrapTextLegend(text, maxTextWidth, lineHeight));

    let currentY = 0; // Track the accumulated Y position

    texts.each(function (_, i) {
      const textElement = d3.select(this);
      const lineCount = +textElement.attr('data-line-count') || 1;
      const totalHeight = lineCount * lineHeight;

      textElement.attr('y', currentY + 12); // Adjust text y position
      rects.filter((_, j) => i === j).attr('y', currentY); // Adjust rect y position

      currentY += totalHeight + 10; // Update Y position for next item
    });
  } else {
    legend.selectAll('*').remove();
  }
};
