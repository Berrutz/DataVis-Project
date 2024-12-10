import React, { useState } from 'react';
import LineChart from './LineChart';

interface MapContainerProps {
  width: number | string;
}

const MapContainer: React.FC<MapContainerProps> = ({ width }) => {
  const [activeTab, setActiveTab] = useState<string>('total');
  const [isTransitioning, setIsTransitioning] = useState(false); // Track transition state

  const handleTabChange = (tab: string) => {
    if (activeTab !== tab) {
      setIsTransitioning(true); // Start transition
      setTimeout(() => {
        setActiveTab(tab);
        setIsTransitioning(false); // End transition after fade-out
      }, 300); // Match CSS animation duration
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      {/* Tab buttons */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === 'total'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
          onClick={() => handleTabChange('total')}
        >
         LineChart
        </button>
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === 'perCapita'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
          onClick={() => handleTabChange('perCapita')}
        >
         Radar
        </button>
      </div>

      {/* Graph container */}
      <div
        className={`p-4 transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        >
        {activeTab === 'total' && (
          <div className="graph-container">
            <LineChart newWidth={width} />
          </div>
        )}
        {activeTab === 'perCapita' && (
          <div className="graph-container">
            <LineChart newWidth={width} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MapContainer;
