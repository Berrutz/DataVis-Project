import { cn } from '@/lib/utils';

export interface ChartScrollableWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export default function ChartScrollableWrapper({
  children,
  className,
  ...props
}: ChartScrollableWrapperProps) {
  return (
    <div className="overflow-hidden w-full">
      <div className={cn('overflow-x-auto', className)} {...props}>
        <div className="mx-auto w-fit">{children}</div>
      </div>
    </div>
  );
}
