import Link from "next/link";
import { MdHome } from "react-icons/md";

export default function AssignmentsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative">
      <Link
        href="/#assignments"
        className="flex absolute top-1 left-1 justify-center items-center text-2xl rounded-full border shadow-md sm:top-3 sm:left-3 z-[999] aspect-square h-[40px] bg-background/60 backdrop-blur-md xs:left-2 xs:top-2"
      >
        <MdHome />
      </Link>
      {children}
    </div>
  );
}
