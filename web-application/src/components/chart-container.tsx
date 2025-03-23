import { cn } from '@/lib/utils';

export interface ChartContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export default function ChartContainer({
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <div className="px-2 sm:px-4">
      <div
        className={cn(
          'sm:p-10 mx-auto rounded-xl sm:border sm:shadow-md max-w-[1200px]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
