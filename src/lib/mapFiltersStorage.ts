export interface MapFilters {
  selectedType: string;
  selectedTransaction: string;
  selectedDistrict: string;
  minPrice: string;
  maxPrice: string;
  currency: string;
  rooms: string;
  amenities: string[];
  petsAllowed: string[];
  childrenAllowed: string[];
  streetSearch: string;
}

const FILTERS_KEY = 'map_filters';

export const loadFilters = (): MapFilters => {
  const defaults: MapFilters = {
    selectedType: '',
    selectedTransaction: '',
    selectedDistrict: '',
    minPrice: '',
    maxPrice: '',
    currency: 'AMD',
    rooms: '',
    amenities: [],
    petsAllowed: [],
    childrenAllowed: [],
    streetSearch: ''
  };
  
  try {
    const saved = localStorage.getItem(FILTERS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaults,
        ...parsed,
        currency: parsed.currency || 'AMD'
      };
    }
  } catch (e) {
    console.error('Failed to load filters:', e);
  }
  return defaults;
};

export const saveFilters = (filters: MapFilters) => {
  try {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  } catch (e) {
    console.error('Failed to save filters:', e);
  }
};