import React from 'react';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  children?: React.ReactNode;
  className?: string;
}

const Tooltip = React.forwardRef < HTMLDivElement, TooltipProps> (
  ({ children, className }, ref) => {
    return (
      <div
        className={cn(
          'absolute p-4 bg-background text-foreground rounded-xl shadow-xl pointer-events-none border border-border',
          className
        )}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

export default Tooltip;
