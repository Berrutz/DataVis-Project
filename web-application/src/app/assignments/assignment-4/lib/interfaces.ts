export interface Data {
  year: number;
  month: number;
  value: number;
  countryName: string;
}

export interface MonthData {
  min: number | null;
  max: number | null;
  avg: number | null;
}
