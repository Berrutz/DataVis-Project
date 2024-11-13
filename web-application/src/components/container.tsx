import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> { }
export default function Container({ children, className }: ContainerProps) {
    return (
        <div className={cn('max-w-[1200px] mx-auto', className)}>{children}</div>
    );
}
