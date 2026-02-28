
export enum DisposalCategory {
  RECYCLABLE = 'Recyclable',
  COMPOSTABLE = 'Compostable',
  LANDFILL = 'Landfill'
}

export interface MaterialPart {
  part: string;
  material: string;
}

export interface NearbyCenter {
  name: string;
  address: string;
  mapsUrl: string;
  isOpen?: boolean;
  status?: string;
}

export interface WolframData {
  decompositionTime?: string;
  carbonFootprint?: string;
  recyclingFact?: string;
  isOpenNow?: string;
}

export interface EcoScanResult {
  item: string;
  category: DisposalCategory;
  reason: string;
  confidence: number;
  materials: MaterialPart[];
  observations: string[];
  wolfram?: WolframData;
  nearbyCenters?: NearbyCenter[];
}

export interface HistoryItem {
  id: string;
  result: EcoScanResult;
  previewUrl: string;
}

export interface AppState {
  status: 'idle' | 'loading' | 'success' | 'error';
  result?: EcoScanResult;
  error?: string;
  previewUrl?: string;
}
