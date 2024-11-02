import Link from "next/link";
import { MdHome } from "react-icons/md";

export default function AssignmentsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (<div className="relative">
    <Link href="/" className="absolute left-1 top-1 z-[999] flex aspect-square h-[40px] items-center justify-center rounded-full border bg-background/60 text-2xl shadow-md backdrop-blur-md xs:left-2 xs:top-2 sm:left-3 sm:top-3"><MdHome /></Link>
    {children}
  </div>
  );
}
