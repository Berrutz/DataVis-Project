import React from 'react';

const DataSourceInfo = ({ children }: { children?: React.ReactNode }) => (
  <span className="mb-3 text-sm text-gray-500">
    <span className="font-medium text-gray-800">Data source: </span>
    {children}
  </span>
);

export default DataSourceInfo;
