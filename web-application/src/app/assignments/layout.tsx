import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MdHome } from "react-icons/md";

export default function AssignmentsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative">
      <nav className="p-3 w-full border-b">
        <Button asChild>
          <Link href="/#assignments">
            <MdHome className="mr-2" />
            Back to homepage
          </Link>
        </Button>
      </nav>
      {children}
      <footer className="mt-auto min-h-[100vh]">
        <div className="min-h-[50vh]" />
        <div className="flex justify-evenly p-6 min-h-[50vh] bg-primary text-primary-foreground">
          <div className="w-full">
            <div className="w-fit">
              <h1 className="font-serif font-bold text-lg/3">IncApache</h1>
              <h2 className="font-serif text-xs/3 text-end">Group</h2>
            </div>
          </div>
          <p className="w-full text-end text-base/4">
            <span className="font-semibold">University of Genova</span>
            <br /> project for Data Visualization Exam
          </p>
        </div>
      </footer>
    </div>
  );
}
