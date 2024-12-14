import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ComponentType = {
  buttonText: string;
  component: React.ReactNode;
};

interface MapContainerProps {
  components: ComponentType[];
}

/**
 * Map Chart Container to display multiple charts in a single component.
 * It has a tab button to switch between the charts.
 *
 * @param {MapContainerProps} MapContainerProps - The props of the react component.
 * @param {List<ComponentType>} props.components - The list of components to display.
 * @throws {Error} - Error when no components are provided.
 * @returns {React.ReactNode} The react component.
 */
const MapContainer: React.FC<MapContainerProps> = ({
  components
}: MapContainerProps): React.ReactNode => {
  if (components.length === 0) {
    throw new Error(
      'Please provide at least one component, (set the property `components`)'
    );
  }

  const [activeComponentIdex, setActiveComponentIdex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTabChange = (newActiveIndex: number) => {
    // We dont want to re-activate the component thats already active
    if (activeComponentIdex !== newActiveIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveComponentIdex(newActiveIndex);
        setIsTransitioning(false);
      }, 300);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl rounded-2xl border shadow-md bg-background">
      {/* Tab buttons */}
      <div className="flex">
        {components.map((component, index) => (
          <Button
            key={index}
            variant={activeComponentIdex === index ? 'default' : 'ghost'}
            onClick={() => handleTabChange(index)}
            className={cn(
              'flex-1 text-lg font-medium rounded-none hover:scale-100',
              index === 0 && `rounded-tl-2xl`,
              index === components.length - 1 &&
                `rounded-tr-2xl ${activeComponentIdex !== components.length - 1 && 'border-l'}`,
              index > 0 &&
                index < components.length - 1 &&
                activeComponentIdex !== index &&
                'border-l',
              activeComponentIdex !== index && 'border-b'
            )}
          >
            {component.buttonText}
          </Button>
        ))}
      </div>

      {/* Graph container */}
      <div
        className={`p-4 transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div
          className={cn(
            'transition-transform duration-300',
            isTransitioning ? 'translate-y-[10px]' : 'translate-y-0'
          )}
        >
          {components[activeComponentIdex].component}
        </div>
      </div>
    </div>
  );
};

export default MapContainer;
