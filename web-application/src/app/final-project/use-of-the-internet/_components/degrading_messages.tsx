'use client';

import MapContainer from '@/components/map-switch-container';
import { useEffect, useState } from 'react';
import { DegradingData } from '../lib/interfaces';
import * as d3 from 'd3';
import { getStaticFile } from '@/utils/general';

import FacetedBarChart from '@/components/charts/FacetedBarChart';
import FacetedBarChart1 from '@/components/charts/FacetedBarChart1';

import ChartContainer from '@/components/chart-container';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Sidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { Pencil } from 'lucide-react';
import { useGetD3Csv } from '@/hooks/use-get-d3-csv';
import { ChartSidebar } from '@/components/chart-sidebar';

// Definiamo il tipo atteso da FacetedBarChart
interface ChartData {
  category: string;
  group: string;
  value: number;
}

////// new /////// 

interface FacetedGroup {
  name: string; // Reason name
  value: number; // Percentage of people that don't have internet for the specific reason
}

interface FacetedGroupedData {
  groups: FacetedGroup[]; // reasons and their values
  category: string; // Countries
}

export interface FacetedPoint {
  group: string; // The data on y axis
  category: string; // The data on x axis
  value: number; // The value
}

export default function DegradingMessages() {

    const [windowWidth, setWindowWidth] = useState<number>(1200);
    
    const [countries, setCountries] = useState<string[]>([]);
    const [csvData, setCsvData] = useState<DegradingData[]>([]);

    const [selectedCountries, setSelectedCountries] = useState<FacetedGroupedData[]>([]);
    const [facetedData, setFacetedData] = useState<FacetedGroupedData[]>([]);
    const defaulCountiresSelected = 15;


        useEffect(() => {
          const fetchData = async () => {
            try{
              //console.log("Fetching data...");
      
              // Load of the data
              const DegradeCsvData: DegradingData[] = await d3.csv(
              getStaticFile('datasets/final-project/use-of-the-internet/degrading/percentage_people_degrading_online_mex.csv'),
                (d: any) => ({
                    reason : d.reason_to_discriminate,
                    country: d.Country,
                    value: d.percentage_of_individual,
                })
              );
              setCsvData(DegradeCsvData);

              console.log("Degrading CSV : ",DegradeCsvData);

              // Filter data based on the selected year
              const filteredData = DegradeCsvData.sort((a, b) => b.value - a.value);

          
              if (filteredData.length === 0) return;
          
              // Cast the data into an object usefull for the FacetedBarChart
              const groupedFacetedData: FacetedGroupedData[] = Object.values(
                filteredData.reduce((acc, { reason , country, value }) => {
                  if (!acc[country]) {
                    acc[country] = { category: country, groups: [] };
                  }
          
                  acc[country].groups.push({ name: reason, value });
          
                  return acc;
                }, {} as Record<string, FacetedGroupedData>)
              );
      
              setFacetedData(groupedFacetedData);
          
              setSelectedCountries(groupedFacetedData.slice(0, defaulCountiresSelected));
              
            }catch (error) {
              console.error("Error", error);
            }
      
          };
      
          fetchData();
          }, []);


          // The csv is not yet loaded or
          // the default selection has not already initializated or
          // neither one of the x value and y value state for the barchart has been initializated
          if (
            csvData === null ||
            facetedData === null ||
            selectedCountries === null
          ) {
            return (
              <ChartContainer>
                <Skeleton className="w-full bg-gray-200 rounded-xl h-[500px]" />
              </ChartContainer>
            );
          }
      
        
          // Toggle countries selection
          const handleCountriesSelection = (point: FacetedGroupedData) => {
            setSelectedCountries((prev) => {
              // Check if the country is already selected
              if (prev.some((d) => d.category === point.category)) {
                return prev.filter((c) => c.category !== point.category); // Remove if already selected
              } else {
                // Add the new country and sort by category
                return [...prev, point].sort((a, b) =>
                  a.category.localeCompare(b.category)
                );
              }
            });
          };
        
          // Create all countries group and sort them alphabetically by country name
          const allCountriesGroup = facetedData.sort((a, b) =>
            a.category.localeCompare(b.category)
          );
        
          const selectedCountriesGroup = allCountriesGroup.filter((facetedPoint) =>
            selectedCountries.some((d) => d.category === facetedPoint.category)
          );
        
          const transformToFacetedPoints = (
            data: FacetedGroupedData[]
          ): FacetedPoint[] =>
            data.flatMap(({ category, groups }) =>
              groups.map(({ name , value }) => ({
                group: name, // 'reason' becomes the group (y-axis)
                category, // 'country' becomes the category (x-axis)
                value // 'value' remains the same
              }))
            );



return(
  <ChartContainer className="sm:relative flex flex-col overflow-hidden gap-8">
        <Sidebar>
          <div className="flex justify-end">
                    <SidebarTrigger
                      variant={'outline'}
                      className="font-medium text-base w-full xs:w-64"
                    >
                      <div className="flex items-center">
                        <Pencil className="min-w-5 min-h-5 mr-2 text-gray-500" />
                        Edit countries and regions
                      </div>
                    </SidebarTrigger>
          </div>
          <FacetedBarChart1 data={transformToFacetedPoints(selectedCountries)} width={725} height={600} ml={120} />
          {/* Sidebar Content */}
          <ChartSidebar
            items={allCountriesGroup}
            selectedItems={selectedCountriesGroup}
            onSelectionChange={handleCountriesSelection}
            onClearSelection={() => setSelectedCountries([])}
            displayKey="category"
            isChecked={(facetedPoint) =>
              selectedCountries.some((d) => d.category === facetedPoint.category)
            }
            chartid="internet-access-faceted-barchart"
          />
        </Sidebar>
  </ChartContainer>
  );
            
}
          