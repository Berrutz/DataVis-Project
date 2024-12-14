import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TooltipProps {
  id?: string;
  background?: string;
  foreground?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: string;
  boxShadow?: string;
  padding?: string;
  opacity?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  id = 'tooltip',
  background = 'hsl(var(--background))',
  foreground = 'hsl(var(--foreground))',
  borderColor = '#ddd',
  borderWidth = 1,
  borderRadius = '0.5rem',
  boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  padding = '1rem',
  opacity = 0
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!tooltipRef.current) return;

    d3.select(tooltipRef.current)
      .style('position', 'absolute')
      .style('padding', padding)
      .style('background', background)
      .style('color', foreground)
      .style('border', `${borderWidth}px solid ${borderColor}`)
      .style('border-radius', borderRadius)
      .style('box-shadow', boxShadow)
      .style('pointer-events', 'none')
      .style('opacity', opacity)
      .style('display', 'none');
  }, [
    background,
    foreground,
    borderColor,
    borderWidth,
    borderRadius,
    boxShadow,
    padding,
    opacity
  ]);

  return <div id={id} ref={tooltipRef} />;
};

export default Tooltip;
