// Function to split text into multiple lines
export function splitText(
  text: string,
  maxLength: number,
  maxLines: number = 2
): string[] {
  const words = text.split(/[\s-]+/);
  let lines: string[] = [];
  let currentLine = '';

  // There is only one not splittable word
  if (words.length === 1) {
    lines.push(words[0]);
    if (words[0].length > maxLength) {
      lines[0] = words[0].slice(0, maxLength - 3) + '...';
    }
    return lines;
  }

  words.forEach((word) => {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine);

  // If the lines exceed maxLines, truncate and add '...'
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    const lastLine = lines[maxLines - 1];
    lines[maxLines - 1] = lastLine.slice(0, maxLength - 3) + '...'; // Ensure space for "..."
  }

  return lines;
}

// Function to calculate the maximum number of characters per line based on a lenght in pixel
export function calculateMaxLength(width: number, fontSize: number): number {
  const charWidth = fontSize * 8; // Approximate character width based on font size
  return Math.floor(width / charWidth);
}
