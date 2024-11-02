import { cn } from "@/lib/utils";

interface ChartSectionProps extends React.HTMLAttributes<HTMLDivElement> { }
export function ChartSection({ children, className }: ChartSectionProps) {
    return (
        <section className={cn("mt-24 flex flex-col gap-12", className)}>
            {children}
        </section>
    );
}

interface ChartHeadingProps extends React.HTMLAttributes<HTMLDivElement> { }
export function ChartHeading({ children, className }: ChartHeadingProps) {
    return (
        <div className={cn("flex flex-col gap-3 text-pretty", className)}>
            {children}
        </div>
    );
}

interface ChartTitleProps extends React.HTMLAttributes<HTMLElement> { }
export function ChartTitle({ children, className }: ChartTitleProps) {
    return (
        <h1
            className={cn(
                "font-sans text-2xl/6 sm:text-3xl/6 font-bold text-pretty",
                className,
            )}
        >
            {children}
        </h1>
    );
}

interface ChartDescriptionProps
    extends React.ParamHTMLAttributes<HTMLParagraphElement> { }
export function ChartDescription({
    children,
    className,
}: ChartDescriptionProps) {
    return <p className={cn(className)}>{children}</p>;
}

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> { }
export function Chart({ children, className }: ChartProps) {
    return (
        <div className={cn("w-full min-h-[350px] border rounded-md", className)}>
            {children}
        </div>
    );
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
}
export function ChartFinalComment({
    children,
    title,
    className,
}: ChartContainerProps) {
    return (
        <div className={cn(className)}>
            <h2 className="font-sans text-xl font-bold">{title}</h2>
            {children}
        </div>
    );
}
