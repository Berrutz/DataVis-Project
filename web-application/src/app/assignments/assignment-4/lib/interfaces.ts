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

export interface Colors {
  colorStroke: string;
  colorFill: string;
  colorHovered: string;
}
