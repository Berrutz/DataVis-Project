'use client';

import Container from '@/components/container';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const navLinks = [
  {
    displayedName: 'Homepage',
    href: '#home'
  },
  {
    displayedName: 'Who We Are',
    href: '#who-we-are'
  },
  {
    displayedName: 'Assignments',
    href: '#assignments'
  },
  {
    displayedName: 'Final Project',
    href: '#final-project'
  }
];

const ulVariants = {
  hidden: {
    opacity: 0,
    height: 0
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      delayChildren: 0.1,
      staggerChildren: 0.1
    }
  }
};

const liVariants = {
  hidden: { opacity: 0, y: -3 },
  visible: { opacity: 1, y: 0 }
};

export default function Header() {
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);
  const [showHeader, setShowHeader] = useState<boolean>(false);
  const [navOpen, setNavOpen] = useState<boolean>(false);

  useEffect(() => {
    const checkLargeScreen = () => {
      const lgScreenPx = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--lg-screen')
          .trim(),
        10
      );
      setIsLargeScreen(window.innerWidth >= lgScreenPx);
    };

    checkLargeScreen();
    window.addEventListener('resize', checkLargeScreen);

    return () => {
      window.removeEventListener('resize', checkLargeScreen);
    };
  }, []);

  useEffect(() => {
    if (isLargeScreen) {
      setNavOpen(false);
    }
  }, [setNavOpen, isLargeScreen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const hasScrolled = scrollPosition > 200;
      setShowHeader(hasScrolled);
      setNavOpen((prev) => {
        if (!hasScrolled) {
          return false;
        }
        return prev;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setNavOpen, setShowHeader]);

  return (
    <motion.header
      initial={{ opacity: 0, translateY: '-100%' }}
      animate={{
        translateY: showHeader ? 0 : '-100%',
        opacity: showHeader ? 1 : 0
      }} // Animazione show/hide
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed top-0 w-full border-b z-[999] text-foreground bg-background/60 backdrop-blur-md"
    >
      <Container>
        <nav>
          <div className="flex justify-between items-center p-1 sm:p-3 xs:p-2">
            <h1 className="text-lg font-bold">IncApache</h1>
            <div className="inline-flex gap-3 lg:gap-12">
              {isLargeScreen && (
                <ul className="inline-flex gap-6 items-center text-sm">
                  {navLinks.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href}>{link.displayedName}</Link>
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => setNavOpen((prev) => !prev)}
                className="lg:hidden"
              >
                <ChevronDown
                  className={cn(
                    'transition-transform duration-300 ease-in-out',
                    navOpen && 'rotate-180'
                  )}
                />
              </button>
              <Button asChild className="py-1 font-bold rounded-full">
                <Link href="#assignments">Our Works</Link>
              </Button>
            </div>
          </div>
          <AnimatePresence>
            {navOpen && (
              <motion.ul
                variants={ulVariants}
                initial="hidden"
                animate="visible"
                exit={{
                  height: 0,
                  opacity: 0,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.1
                  }
                }}
                className="px-1 text-xs sm:px-3 xs:px-2 overflow-clip"
              >
                {navLinks.map((link, index) => (
                  <motion.li
                    exit={{ x: -3, opacity: 0 }}
                    variants={liVariants}
                    key={index}
                    className="mb-2"
                  >
                    <Link
                      href={link.href}
                      className="flex py-1 px-2 w-full rounded-xl transition-all hover:bg-primary/5"
                    >
                      {link.displayedName}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </nav>
      </Container>
    </motion.header>
  );
}
