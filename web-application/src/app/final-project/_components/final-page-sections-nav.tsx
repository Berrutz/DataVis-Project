import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  MdArrowBack,
  MdArrowForward,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight
} from 'react-icons/md';

export default function FinalPageSectionsNav() {
  return (
    <div className="relative">
      <nav className="p-3 w-full border-b">
        <Button asChild variant={'ghost'}>
          <Link href="./">
            <MdArrowBack className="mr-2" />
            Back to final project
          </Link>
        </Button>
      </nav>
    </div>
  );
}
