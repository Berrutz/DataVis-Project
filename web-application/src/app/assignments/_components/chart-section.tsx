import { cn } from "@/lib/utils";

// SECTION
interface ChartSectionProps extends React.HTMLAttributes<HTMLDivElement> { }
export function ChartSection({ children, className }: ChartSectionProps) {
    return (
        <section className={cn("mt-24 flex flex-col gap-12", className)}>
            {children}
        </section>
    );
}

// HEADING
interface ChartHeadingProps extends React.HTMLAttributes<HTMLDivElement> { }
export function ChartHeading({ children, className }: ChartHeadingProps) {
    return (
        <div className={cn("flex flex-col gap-3 text-pretty", className)}>
            {children}
        </div>
    );
}

// BODY
interface ChartBodyProps extends React.HTMLAttributes<HTMLDivElement> { }
export function ChartBody({ children, className }: ChartBodyProps) {
    return (
        <div className={cn("flex flex-col gap-3 text-pretty", className)}>
            {children}
        </div>
    );
}

// H1
interface ChartH1TitleProps extends React.HTMLAttributes<HTMLElement> { }
export function ChartH1Title({ children, className }: ChartH1TitleProps) {
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

// H2
interface ChartH2TitleProps extends React.HTMLAttributes<HTMLElement> { }
export function ChartH2Title({ children, className }: ChartH2TitleProps) {
    return (
        <h2 className={cn("font-sans text-xl font-bold", className)}>{children}</h2>
    );
}

// CONTAINER
interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> { }
export function ChartContainer({ children, className }: ChartContainerProps) {
    return <div className={cn(className)}>{children}</div>;
}
