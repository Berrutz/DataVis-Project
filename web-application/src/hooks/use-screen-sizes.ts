import { useEffect, useState } from 'react';

export type ScreenSize = 'sm' | 'md' | 'lg' | 'xl';

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<ScreenSize>();

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      setScreenSize(() => {
        if (currentWidth === undefined || currentWidth === null) return 'xl';
        if (currentWidth < 640) return 'sm';
        if (currentWidth < 768) return 'md';
        if (currentWidth < 1279) return 'lg';
        return 'xl';
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}
