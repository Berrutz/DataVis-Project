import { cn } from '@/lib/utils';

export interface SectionTitleProps {
  children?: React.ReactNode;
  className?: string;
}
export default function SectionTitle({
  children,
  className
}: SectionTitleProps) {
  return (
    <h1
      className={cn(
        'mt-24 mb-12 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-center',
        className
      )}
    >
      {children}
    </h1>
  );
}
