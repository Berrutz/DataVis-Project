// freq,indic_is,unit,ind_type,geo,TIME_PERIOD,OBS_VALUE
export interface FrequencyData {
    freq: string;
    indic_is: string;
    ind_type: string;
    geo: string;
    TIME_PERIOD: string;
    OBS_VALUE: number;
  }

  export interface FinancialData {
    geo: string;
    TIME_PERIOD: string;
    OBS_VALUE: number;
    population: number;
  }

  export interface DegradingData {
    reason: string;
    country: string;
    percentage: number;
  }
  
  export interface PurchaseData {
    country: string;
    year: string;
    percentage: number;
  }

  export interface ActivitiesData{
    forwhat:string;
    country:string;
    year:string;
    percentage:number;
  }
  
  