import React from 'react';
import DataSourceInfo from '../assignments/_components/data-source';
import ShowMoreChartDetailsModalDialog from '../assignments/_components/show-more-chart-details-modal-dialog';

export interface DatasetDatasourceSourceProps {
  displayedName: string;
  datasetInfos?: React.ReactNode;
  metodologies?: React.ReactNode;
  dataSources?: React.ReactNode;
}

export default function DatasetDataSource(props: DatasetDatasourceSourceProps) {
  const { displayedName, datasetInfos, metodologies, dataSources } = props;

  return (
    <DataSourceInfo>
      {displayedName};{'   '}
      <ShowMoreChartDetailsModalDialog>
        <div className="mt-1 mb-4 mr-4 ml-4">
          {datasetInfos && (
            <>
              <h2 className="mt-4 mb-4 font-serif text-xl xs:text-2xl sm:text-3xl">
                What you should know about this data
              </h2>
              <div className="text-base">{datasetInfos}</div>
            </>
          )}
          {metodologies && (
            <>
              <h2 className="font-serif mt-4 mb-2 text-xl xs:text-2xl sm:text-3xl">
                Methodologies
              </h2>
              <div className="text-base">{metodologies}</div>
            </>
          )}
          {dataSources && (
            <>
              <h2 className="font-serif mt-4 mb-2 text-xl xs:text-2xl sm:text-3xl">
                Data Sources
              </h2>
              <div className="text-base">{dataSources}</div>
            </>
          )}
        </div>
      </ShowMoreChartDetailsModalDialog>
    </DataSourceInfo>
  );
}
