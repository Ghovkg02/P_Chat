export interface EnvironmentalData {
  sunPath: {
    azimuth: number;
    elevation: number;
    exposure: number;
  };
  wind: {
    direction: string;
    speed: number;
  };
  soil: {
    bdod: number;
    soc: number;
    clay: number;
    nitrogen: number;
    depth: number;
  };
  elevation: {
    height: number;
    slope: number;
  };
  disturbances: {
    type: string;
    severity: number;
  }[];
  climate: {
    temperature: number;
    humidity: number;
    precipitation: number;
  };
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}