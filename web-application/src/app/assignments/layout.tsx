import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MdHome } from "react-icons/md";

export default function AssignmentsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative">
      <nav className="p-3 w-full shadow-md">
        <Button asChild>
          <Link href="/#assignments">
            <MdHome className="mr-2" />
            Back to homepage
          </Link>
        </Button>
      </nav>
      {children}
    </div>
  );
}
