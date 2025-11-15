import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Properties } from '@/lib/api';
import type { Property as ApiProperty } from '@/lib/api';
import SEO from '@/components/SEO';
import MapFilters from '@/components/map/MapFilters';
import MapSection from '@/components/map/MapSection';
import PropertyGrid from '@/components/map/PropertyGrid';
import { loadFilters, saveFilters, type MapFilters as MapFiltersType } from '@/lib/mapFiltersStorage';
import FloatingContactButtons from '@/components/FloatingContactButtons';

interface Property extends ApiProperty {
  id: number;
  created_at: string;
  updated_at: string;
}

const MapPage: React.FC = () => {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const propertyRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  
  const initialFilters = loadFilters();
  const [selectedType, setSelectedType] = useState<string>(initialFilters.selectedType);
  const [selectedTransaction, setSelectedTransaction] = useState<string>(initialFilters.selectedTransaction);
  const [selectedDistrict, setSelectedDistrict] = useState<string[]>(Array.isArray(initialFilters.selectedDistrict) ? initialFilters.selectedDistrict : []);
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);
  const [currency, setCurrency] = useState(initialFilters.currency);
  const [rooms, setRooms] = useState<string>(initialFilters.rooms);
  const [amenities, setAmenities] = useState<string>(typeof initialFilters.amenities === 'string' ? initialFilters.amenities : '');
  const [petsAllowed, setPetsAllowed] = useState<string>(typeof initialFilters.petsAllowed === 'string' ? initialFilters.petsAllowed : '');
  const [childrenAllowed, setChildrenAllowed] = useState<string>(typeof initialFilters.childrenAllowed === 'string' ? initialFilters.childrenAllowed : '');
  const [streetSearch, setStreetSearch] = useState(initialFilters.streetSearch);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const loadProperties = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await Properties.list();
      const props = (response.properties || []) as Property[];
      const propsWithDates = props.map(p => ({
        ...p,
        created_at: p.created_at || new Date().toISOString()
      }));
      setAllProperties(propsWithDates);
    } catch (err: any) {
      console.error('Error loading properties:', err);
      setError(err.message || 'Не удалось загрузить объекты');
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = useMemo(() => {
    const filtered = allProperties.filter((prop) => {
      if (selectedType && prop.property_type !== selectedType) return false;
      if (selectedTransaction && prop.transaction_type !== selectedTransaction) return false;
      if (selectedDistrict.length > 0 && !selectedDistrict.includes(prop.district || '')) return false;
      
      if (streetSearch.trim()) {
        const searchLower = streetSearch.toLowerCase();
        const streetMatch = (prop.street_name || '').toLowerCase().includes(searchLower);
        const addressMatch = (prop.address || '').toLowerCase().includes(searchLower);
        if (!streetMatch && !addressMatch) return false;
      }
      
      const propPrice = Number(prop.price);
      const propCurrency = prop.currency || 'AMD';
      
      if (minPrice) {
        if (currency && propCurrency !== currency) {
          return true;
        }
        if (propPrice < Number(minPrice)) return false;
      }
      
      if (maxPrice) {
        if (currency && propCurrency !== currency) {
          return true;
        }
        if (propPrice > Number(maxPrice)) return false;
      }
      
      if (rooms && rooms !== 'any' && prop.rooms !== Number(rooms)) return false;
      
      if (amenities && amenities !== 'any') {
        const propAmenities = prop.amenities || [];
        if (!propAmenities.includes(amenities)) return false;
      }
      
      if (petsAllowed && petsAllowed !== 'any') {
        if (prop.pets_allowed !== petsAllowed) return false;
      }
      
      if (childrenAllowed && childrenAllowed !== 'any') {
        if (prop.children_allowed !== childrenAllowed) return false;
      }
      
      return true;
    });

    return filtered.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      
      if (dateA !== dateB) {
        return dateB - dateA;
      }
      
      return b.id - a.id;
    });
  }, [allProperties, selectedType, selectedTransaction, selectedDistrict, minPrice, maxPrice, rooms, amenities, petsAllowed, childrenAllowed, streetSearch]);

  useEffect(() => {
    const filters: MapFiltersType = {
      selectedType,
      selectedTransaction,
      selectedDistrict,
      minPrice,
      maxPrice,
      currency,
      rooms,
      amenities,
      petsAllowed,
      childrenAllowed,
      streetSearch
    };
    saveFilters(filters);
  }, [selectedType, selectedTransaction, selectedDistrict, minPrice, maxPrice, currency, rooms, amenities, petsAllowed, childrenAllowed, streetSearch]);

  const resetFilters = () => {
    setSelectedType('');
    setSelectedTransaction('');
    setSelectedDistrict([]);
    setMinPrice('');
    setMaxPrice('');
    setCurrency('AMD');
    setRooms('');
    setAmenities('');
    setPetsAllowed('');
    setChildrenAllowed('');
    setStreetSearch('');
  };

  const activeFiltersCount = [
    selectedType,
    selectedTransaction,
    selectedDistrict.length > 0,
    minPrice,
    maxPrice,
    rooms,
    amenities,
    petsAllowed,
    childrenAllowed,
    streetSearch
  ].filter(Boolean).length;

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    if (selectedProperty && propertyRefs.current[selectedProperty.id]) {
      propertyRefs.current[selectedProperty.id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [selectedProperty]);

  return (
    <div className="h-screen flex bg-white relative">
      <SEO 
        title="Карта недвижимости Еревана - WSE.AM"
        description="Интерактивная карта недвижимости в Ереване. Найди квартиры для аренды и продажи с точными локациями на карте. Удобные фильтры по цене, району и параметрам."
        keywords="карта недвижимости Ереван, квартиры на карте Ереван, аренда квартир карта, районы Еревана недвижимость"
      />
      
      {isFiltersOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsFiltersOpen(false)}
        />
      )}
      
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 
        transform transition-transform duration-300 ease-in-out
        ${isFiltersOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <MapFilters
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          rooms={rooms}
          setRooms={setRooms}
          amenities={amenities}
          setAmenities={setAmenities}
          childrenAllowed={childrenAllowed}
          setChildrenAllowed={setChildrenAllowed}
          petsAllowed={petsAllowed}
          setPetsAllowed={setPetsAllowed}
          currency={currency}
          setCurrency={setCurrency}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          resetFilters={resetFilters}
          loading={loading}
          filteredCount={filteredProperties.length}
          onClose={() => setIsFiltersOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-white px-4 md:px-6 py-3 md:py-4 flex items-center justify-between relative">
          <a href="/" className="text-lg md:text-2xl font-black hover:opacity-80 transition-opacity" style={{ color: '#FF7A00' }}>WSE.AM</a>
          <h1 className="hidden sm:block text-base md:text-2xl font-bold text-gray-900 absolute left-[140px] sm:left-[200px] md:left-[280px]">Карта недвижимости Еревана</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFiltersOpen(true)}
              className="md:hidden relative"
            >
              <Icon name="SlidersHorizontal" size={18} />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF7A00] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>
        </header>

        {error && (
          <div className="mx-6 mt-4 bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
            <Icon name="AlertCircle" size={20} />
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadProperties}
              className="ml-auto"
            >
              Повторить
            </Button>
          </div>
        )}

        <MapSection
          properties={filteredProperties}
          isExpanded={isMapExpanded}
          onToggleExpand={() => setIsMapExpanded(!isMapExpanded)}
          onPropertySelect={setSelectedProperty}
        />

        <div className="flex-1 overflow-y-auto bg-gray-50 p-3 sm:p-4">
          <PropertyGrid
            properties={filteredProperties}
            selectedPropertyId={selectedProperty?.id || null}
            propertyRefs={propertyRefs}
          />
        </div>
      </div>
      
      <FloatingContactButtons />
    </div>
  );
};

export default MapPage;