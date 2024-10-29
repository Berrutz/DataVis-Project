import { useEffect, useState } from "react";

export type ScreenDimensionType = "small";
export function useIsScreen(screenDimension: ScreenDimensionType) {
  const [isScreen, setIsScreen] = useState<boolean>(false);

  // Convert screen dimension in pixels
  var screenPixels: string;
  switch (screenDimension) {
    case "small": {
      screenPixels = "640px";
      break;
    }
    default: throw new Error(`useIsSreen has recived an unsupported screen (value: ${screenDimension})`);
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${screenPixels})`);
    const handleResize = () => setIsScreen(!mediaQuery.matches);

    handleResize();
    mediaQuery.addEventListener('change', handleResize);

    return () => mediaQuery.removeEventListener('change', handleResize);
  })

  return isScreen;
}

