import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";

const sectionVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export interface AsideChartProps {
  asidename: string;
  asidekey: string;
}

// SECTION
export interface ChartSectionProps
  extends AsideChartProps,
    HTMLMotionProps<"section"> {}
export function ChartSection({
  children,
  className,
  ...props
}: ChartSectionProps) {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn("mt-24 flex flex-col gap-3", className)}
      {...props}
    >
      {children}
    </motion.section>
  );
}

// HEADING
export interface ChartHeadingProps extends HTMLMotionProps<"div"> {}
export function ChartHeading({
  children,
  className,
  ...props
}: ChartHeadingProps) {
  return (
    <motion.div
      variants={childVariants}
      className={cn("flex flex-col gap-3 text-pretty", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// BODY
export interface ChartBodyProps extends HTMLMotionProps<"div"> {}
export function ChartBody({ children, className, ...props }: ChartBodyProps) {
  return (
    <motion.div
      variants={childVariants}
      className={cn("flex flex-col gap-3 text-pretty", className)}
      {...props}
    >
      {children}
    </motion.div>
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
  extends HTMLMotionProps<"div">,
    AsideChartProps {}
export function ChartContainer({
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <motion.div variants={childVariants} className={cn(className)} {...props}>
      {children}
    </motion.div>
  );
}
