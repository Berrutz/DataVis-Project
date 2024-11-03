import { cn } from "@/lib/utils";

export interface AsideChartProps {
  asidename: string;
  asidekey: string;
}

// SECTION
export interface ChartSectionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    AsideChartProps {}
export function ChartSection({
  children,
  className,
  ...props
}: ChartSectionProps) {
  return (
    <section className={cn("mt-24 flex flex-col gap-3", className)} {...props}>
      {children}
    </section>
  );
}

// HEADING
export interface ChartHeadingProps
  extends React.HTMLAttributes<HTMLDivElement> {}
export function ChartHeading({
  children,
  className,
  ...props
}: ChartHeadingProps) {
  return (
    <div
      className={cn("flex flex-col gap-3 text-pretty", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// BODY
export interface ChartBodyProps extends React.HTMLAttributes<HTMLDivElement> {}
export function ChartBody({ children, className, ...props }: ChartBodyProps) {
  return (
    <div
      className={cn("flex flex-col gap-3 text-pretty", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// H1
export interface ChartH1TitleProps extends React.HTMLAttributes<HTMLElement> {}
export function ChartH1Title({
  children,
  className,
  ...props
}: ChartH1TitleProps) {
  return (
    <h1
      className={cn(
        "font-sans text-2xl/6 sm:text-3xl/6 font-bold text-pretty",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

// H2
export interface ChartH2TitleProps extends React.HTMLAttributes<HTMLElement> {}
export function ChartH2Title({
  children,
  className,
  ...props
}: ChartH2TitleProps) {
  return (
    <h2 className={cn("font-sans text-xl font-bold", className)} {...props}>
      {children}
    </h2>
  );
}

// CONTAINER
export interface ChartContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    AsideChartProps {}
export function ChartContainer({
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <div className={cn("scroll-mt-[100px]", className)} {...props}>
      {children}
    </div>
  );
}
