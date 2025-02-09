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
