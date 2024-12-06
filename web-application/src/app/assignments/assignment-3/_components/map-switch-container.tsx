import React, { useState } from 'react';
import ChoroplethMapEmisionsPerCapita from './choropleth-map-emissions-per-capita'; // Your first map component
import ChoroplethMapTotalEmission from './choropleth-map-total-emissions'; // Your second map component

interface MapContainerProps {
  width: number | string;
}

const MapContainer: React.FC<MapContainerProps> = ({ width }) => {
  const [activeTab, setActiveTab] = useState<string>('total'); // Default to the 'total' map

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
          onClick={() => setActiveTab('total')}
        >
          Total Emissions
        </button>
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === 'perCapita'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
          onClick={() => setActiveTab('perCapita')}
        >
          Emissions Per Capita
        </button>
      </div>

      {/* Graph container */}
      <div className="p-4">
        {activeTab === 'total' && (
          <div className="graph-container">
            <ChoroplethMapTotalEmission newWidth={width} />
          </div>
        )}
        {activeTab === 'perCapita' && (
          <div className="graph-container">
            <ChoroplethMapEmisionsPerCapita newWidth={width} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MapContainer;
