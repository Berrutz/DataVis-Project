'use client';

import BarChart, { Point } from '@/components/charts/barchart';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import { foundOrFirst, getUnique } from '@/utils/general';
import { useGetD3Csv } from '@/hooks/use-get-d3-csv';
import ChartContainer from '@/components/chart-container';
import { H3 } from '@/components/headings';


export default function StackedBarcharAgeDigitalSkills() {
 
  return (
    <ChartContainer className="flex flex-col gap-8">
      <H3>Different countires compared by digital skill levels</H3>
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="sm:w-1/3">
          <label>Year</label>
        </div>
        <div className="sm:w-full">
          <label>Digital Skill Level</label>
        </div>
        <div className="sm:w-full">
          <label>Individuals Range</label>
        </div>
      </div>
    </ChartContainer>
  );
}
