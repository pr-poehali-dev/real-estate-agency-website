import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import YerevanMapLeaflet from '@/components/YerevanMapLeaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import Icon from '@/components/ui/icon';
import { Properties } from '@/lib/api';
import type { Property as ApiProperty } from '@/lib/api';

interface Property extends ApiProperty {
  id: number;
  created_at: string;
  updated_at: string;
}

const FILTERS_KEY = 'map_filters';

interface MapFilters {
  selectedType: string;
  selectedTransaction: string;
  minPrice: string;
  maxPrice: string;
  rooms: string;
  amenities: string[];
  petsAllowed: string;
  childrenAllowed: string;
  streetSearch: string;
}

const loadFilters = (): MapFilters => {
  try {
    const saved = localStorage.getItem(FILTERS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load filters:', e);
  }
  return {
    selectedType: '',
    selectedTransaction: '',
    minPrice: '',
    maxPrice: '',
    rooms: '',
    amenities: [],
    petsAllowed: '',
    childrenAllowed: '',
    streetSearch: ''
  };
};

const saveFilters = (filters: MapFilters) => {
  try {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  } catch (e) {
    console.error('Failed to save filters:', e);
  }
};

const MapPage: React.FC = () => {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const propertyRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  
  const initialFilters = loadFilters();
  const [selectedType, setSelectedType] = useState<string>(initialFilters.selectedType);
  const [selectedTransaction, setSelectedTransaction] = useState<string>(initialFilters.selectedTransaction);
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);
  const [rooms, setRooms] = useState<string>(initialFilters.rooms);
  const [amenities, setAmenities] = useState<string[]>(initialFilters.amenities);
  const [petsAllowed, setPetsAllowed] = useState<string>(initialFilters.petsAllowed);
  const [childrenAllowed, setChildrenAllowed] = useState<string>(initialFilters.childrenAllowed);
  const [streetSearch, setStreetSearch] = useState(initialFilters.streetSearch);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const loadProperties = async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('admin_token');
    
    if (token && token.startsWith('demo-token-')) {
      const demoData = localStorage.getItem('demo_properties');
      const demoProps = demoData ? JSON.parse(demoData) : [];
      setAllProperties(demoProps);
      setLoading(false);
      return;
    }

    try {
      const response = await Properties.list();
      const props = (response.properties || []) as Property[];
      setAllProperties(props);
    } catch (err: any) {
      console.error('Error loading properties:', err);
      setError(err.message || 'Не удалось загрузить объекты');
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = useMemo(() => {
    return allProperties.filter((prop) => {
      if (selectedType && prop.property_type !== selectedType) return false;
      if (selectedTransaction && prop.transaction_type !== selectedTransaction) return false;
      
      if (streetSearch.trim()) {
        const searchLower = streetSearch.toLowerCase();
        const streetMatch = (prop.street_name || '').toLowerCase().includes(searchLower);
        const addressMatch = (prop.address || '').toLowerCase().includes(searchLower);
        if (!streetMatch && !addressMatch) return false;
      }
      
      const price = Number(prop.price);
      if (minPrice && price < Number(minPrice)) return false;
      if (maxPrice && price > Number(maxPrice)) return false;
      
      if (rooms && rooms !== 'any' && prop.rooms !== Number(rooms)) return false;
      
      if (amenities.length > 0) {
        const propAmenities = prop.amenities || [];
        const hasAllAmenities = amenities.every(a => propAmenities.includes(a));
        if (!hasAllAmenities) return false;
      }
      
      if (petsAllowed && petsAllowed !== 'any' && prop.pets_allowed !== petsAllowed) return false;
      if (childrenAllowed && childrenAllowed !== 'any' && prop.children_allowed !== childrenAllowed) return false;
      
      return true;
    });
  }, [allProperties, selectedType, selectedTransaction, minPrice, maxPrice, rooms, amenities, petsAllowed, childrenAllowed, streetSearch]);

  useEffect(() => {
    const filters: MapFilters = {
      selectedType,
      selectedTransaction,
      minPrice,
      maxPrice,
      rooms,
      amenities,
      petsAllowed,
      childrenAllowed,
      streetSearch
    };
    saveFilters(filters);
  }, [selectedType, selectedTransaction, minPrice, maxPrice, rooms, amenities, petsAllowed, childrenAllowed, streetSearch]);

  const resetFilters = () => {
    setSelectedType('');
    setSelectedTransaction('');
    setMinPrice('');
    setMaxPrice('');
    setRooms('');
    setAmenities([]);
    setPetsAllowed('');
    setChildrenAllowed('');
    setStreetSearch('');
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

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
    <div className="h-screen flex bg-white">
      {/* Left Sidebar - Filters */}
      <aside className="w-64 border-r bg-white overflow-y-auto flex-shrink-0">
        <div className="sticky top-0 bg-white border-b px-4 py-3 z-10">
          <Link to="/" className="flex items-center gap-2 text-gray-900 hover:text-[#FF7A00] transition-colors mb-4">
            <Icon name="ArrowLeft" size={20} />
            <span className="font-semibold">Назад</span>
          </Link>
          <h2 className="text-base font-bold text-gray-900">Фильтры</h2>
        </div>

        <div className="p-4 space-y-4">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Тип сделки</label>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedTransaction(selectedTransaction === 'rent' ? '' : 'rent')}
                className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  selectedTransaction === 'rent'
                    ? 'bg-[#FF7A00] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Аренда
              </button>
              <button
                onClick={() => setSelectedTransaction(selectedTransaction === 'sale' ? '' : 'sale')}
                className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  selectedTransaction === 'sale'
                    ? 'bg-[#FF7A00] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Продажа
              </button>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Тип недвижимости</label>
            <button
              onClick={() => setSelectedType(selectedType === 'apartment' ? '' : 'apartment')}
              className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                selectedType === 'apartment'
                  ? 'bg-[#FF7A00] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Квартира
            </button>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Цена</label>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Мин цена"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Макс цена"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Rooms */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Количество комнат</label>
            <Select value={rooms} onValueChange={setRooms}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Не важно</SelectItem>
                <SelectItem value="1">1 комната</SelectItem>
                <SelectItem value="2">2 комнаты</SelectItem>
                <SelectItem value="3">3 комнаты</SelectItem>
                <SelectItem value="4">4+ комнат</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Удобства</label>
            <MultiSelect
              options={[
                { label: 'Телевизор', value: 'tv' },
                { label: 'Кондиционер', value: 'ac' },
                { label: 'Интернет', value: 'internet' },
                { label: 'Холодильник', value: 'fridge' },
                { label: 'Плита', value: 'stove' },
                { label: 'Стиральная машина', value: 'washing_machine' },
                { label: 'Водонагреватель', value: 'water_heater' },
              ]}
              selected={amenities}
              onChange={setAmenities}
              placeholder="Выберите удобства"
              className="w-full"
            />
          </div>

          {/* Children Allowed */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Можно с детьми</label>
            <Select value={childrenAllowed} onValueChange={setChildrenAllowed}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Не важно" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Не важно</SelectItem>
                <SelectItem value="yes">Да</SelectItem>
                <SelectItem value="no">Нет</SelectItem>
                <SelectItem value="negotiable">По договоренности</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pets Allowed */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Можно с животными</label>
            <Select value={petsAllowed} onValueChange={setPetsAllowed}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Не важно" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Не важно</SelectItem>
                <SelectItem value="yes">Да</SelectItem>
                <SelectItem value="no">Нет</SelectItem>
                <SelectItem value="negotiable">По договоренности</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          {(selectedType || selectedTransaction || minPrice || maxPrice || rooms || amenities.length > 0 || petsAllowed || childrenAllowed) && (
            <Button
              onClick={resetFilters}
              variant="outline"
              className="w-full"
            >
              Сбросить фильтры
            </Button>
          )}

          {/* Results Count */}
          <div className="text-center text-sm text-gray-600 pt-4 border-t">
            {loading ? 'Загрузка...' : `Найдено объектов: ${filteredProperties.length}`}
          </div>
        </div>
      </aside>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-white px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Карта недвижимости Еревана</h1>
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

        {/* Map Section - Narrow horizontal strip */}
        <div className={`bg-gray-100 flex-shrink-0 border-b relative transition-all duration-300 ${isMapExpanded ? 'h-[50vh]' : 'h-[200px]'}`}>
          <YerevanMapLeaflet
            properties={filteredProperties}
            onPropertySelect={setSelectedProperty}
          />
          <button
            onClick={() => setIsMapExpanded(!isMapExpanded)}
            className="absolute top-4 right-4 z-[1000] bg-white hover:bg-gray-50 text-gray-700 p-2.5 rounded-lg shadow-lg transition-all hover:shadow-xl"
            title={isMapExpanded ? 'Свернуть карту' : 'Развернуть карту'}
          >
            <Icon name={isMapExpanded ? 'Minimize2' : 'Maximize2'} size={20} />
          </button>
        </div>

        {/* Property Cards Grid - 3x3 with scroll */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-3 gap-6 auto-rows-min">
              {filteredProperties
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((property) => (
                  <div
                    key={property.id}
                    ref={(el) => { propertyRefs.current[property.id] = el; }}
                    className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col ${
                      selectedProperty?.id === property.id ? 'ring-4 ring-[#FF7A00]' : ''
                    }`}
                    onClick={() => setSelectedProperty(property)}
                    onDoubleClick={() => window.location.href = `/property/${property.id}`}
                  >
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Нет фото</span>
                      </div>
                    )}
                    
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-xl font-bold text-[#FF7A00] mb-2">
                        {formatPrice(property.price, property.currency)}
                        {property.transaction_type === 'rent' && <span className="text-sm font-normal text-gray-600"> /мес</span>}
                      </p>
                      
                      <p className="text-gray-900 font-medium mb-2 line-clamp-2">
                        {property.title}
                      </p>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                        {property.rooms && <span>{property.rooms} комн.</span>}
                        {property.area && <span>• {property.area} м²</span>}
                        {property.floor && <span>• {property.floor} эт.</span>}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-auto">
                        <Icon name="MapPin" size={14} />
                        <span className="truncate">
                          {property.street_name ? `${property.street_name} ${property.house_number || ''}` : property.district}
                        </span>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Icon name="Search" size={64} className="mx-auto mb-4 opacity-30" />
              <p className="text-xl font-medium mb-2">Объекты не найдены</p>
              <p className="text-sm">Попробуйте изменить параметры фильтров</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;