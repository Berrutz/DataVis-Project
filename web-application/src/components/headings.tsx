import { cn } from '@/lib/utils'; // Una funzione helper per concatenare classi (se usi Tailwind)

interface HeadingProps extends React.HTMLAttributes<HTMLHeadElement> {}

export const H1 = ({ children, className, ...props }: HeadingProps) => (
  <h1 className={cn('text-6xl font-bold font-serif', className)} {...props}>
    {children}
  </h1>
);

export const H2 = ({ children, className, ...props }: HeadingProps) => (
  <h2 className={cn('text-4xl font-semibold', className)} {...props}>
    {children}
  </h2>
);

export const H3 = ({ children, className, ...props }: HeadingProps) => (
  <h3 className={cn('text-3xl font-medium', className)} {...props}>
    {children}
  </h3>
);

export const H4 = ({ children, className, ...props }: HeadingProps) => (
  <h4 className={cn('text-2xl font-normal', className)} {...props}>
    {children}
  </h4>
);
