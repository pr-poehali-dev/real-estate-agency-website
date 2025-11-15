/**
 * Типы для работы с недвижимостью
 */

export interface Property {
  id?: number;
  title: string;
  description: string;
  property_type: string;
  transaction_type: string;
  price: number;
  currency: string;
  area: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  total_floors: number;
  year_built: number;
  district: string;
  address: string;
  
  // Новые поля для структурированного адреса
  street_name?: string;
  house_number?: string;
  apartment_number?: string;
  
  latitude: number;
  longitude: number;
  features: string[];
  images: string[];
  badges?: string[];
  pets_allowed?: string;
  children_allowed?: string;
  is_new_building?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyFormData extends Omit<Property, 'id' | 'created_at' | 'updated_at'> {
  id?: number;
}

export interface PropertyFilter {
  selectedDistrict: string;
  selectedType: string;
  selectedTransaction: string;
  priceRange: { min: string; max: string };
  streetSearch: string;
}

export interface AddressComponents {
  street_name: string;
  house_number: string;
  apartment_number?: string;
  district: string;
  formatted_address?: string;
}

export interface LocationPoint {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formatted_address: string;
  components: {
    street_name?: string;
    house_number?: string;
    district?: string;
    city?: string;
  };
}