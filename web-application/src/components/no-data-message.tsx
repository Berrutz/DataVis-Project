import { cn } from '@/lib/utils';

export interface NoDataMessageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  height: number;
}

export default function NoDataMessage({
  height,
  className,
  children,
  ...props
}: NoDataMessageProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-center items-center text-center',
        className
      )}
      style={{ height: `${height}px` }}
      {...props}
    >
      <p className="text-xl font-semibold mb-1">{'No matching data'}</p>
      <p className="text-lg font-medium">
        {'Try adding countries and regions to display data.'}
      </p>
      {children}
    </div>
  );
}
