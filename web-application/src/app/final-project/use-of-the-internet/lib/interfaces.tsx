// freq,indic_is,unit,ind_type,geo,TIME_PERIOD,OBS_VALUE
export interface FrequencyData {
  country: string;
  year: string;
  percentage: number;
}

export interface FinancialData {
  country: string;
  year: number;
  percentage: number;
  population: number;
}

export interface DegradingData {
  reason: string;
  country: string;
  value: number;
}

export interface PurchaseData {
  country: string;
  year: string;
  percentage: number;
}

export interface ActivitiesData {
  forwhat: string;
  country: string;
  year: string;
  percentage: number;
}
