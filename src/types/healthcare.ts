export type SectorType = 'government' | 'private' | 'diagnostic';

export type DivisionType = 'Rayachoti' | 'Madanapalle' | 'Rajampet';

export interface HealthcareFacility {
  id: string;
  sNo: number;
  name: string;
  sector: SectorType;
  category: string;
  doctorInCharge: string;
  contact: string;
  mandal: string;
  address: string;
  lat: number;
  lng: number;
  servicesOrAffiliation: string;
  sourceReference: string;
  tags?: string[];
  is24x7?: boolean;
  hasEmergency?: boolean;
}

export interface MandalInfo {
  name: string;
  division: DivisionType;
  headquarters: string;
  lat: number;
  lng: number;
  majorTownsOrVillages: string[];
  panchayatCount: number;
  highlightNote?: string;
}

export interface FilterState {
  searchQuery: string;
  selectedSectors: SectorType[];
  selectedMandal: string;
  selectedDivision: string;
  selectedCategory: string;
  only24x7: boolean;
  onlyEmergency: boolean;
}
