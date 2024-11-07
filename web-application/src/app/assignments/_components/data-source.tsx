import React from 'react';

const DataSourceInfo = ({ children }: { children?: React.ReactNode }) => (
  <p className="text-sm text-gray-500 mb-3">
    <a className="font-medium text-gray-800">Data source: </a>
    {children}
  </p>
);

export default DataSourceInfo;
