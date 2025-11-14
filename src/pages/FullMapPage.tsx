import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import YerevanMapLeaflet from '@/components/YerevanMapLeaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Properties } from '@/lib/api';
import type { Property as ApiProperty } from '@/lib/api';
import FloatingContactButtons from '@/components/FloatingContactButtons';

interface Property extends ApiProperty {
  id: number;
  created_at: string;
  updated_at: string;
}

const FullMapPage: React.FC = () => {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [transactionFilter, setTransactionFilter] = useState('');
  const navigate = useNavigate();

  const propertyRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const loadProperties = async () => {
    setLoading(true);
    setError('');

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

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  const filteredProperties = allProperties.filter(property => {
    const matchesSearch = !searchQuery || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.street_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = !priceFilter || 
      (priceFilter === 'low' && property.price < 150000) ||
      (priceFilter === 'medium' && property.price >= 150000 && property.price < 500000) ||
      (priceFilter === 'high' && property.price >= 500000);
    
    const matchesType = !typeFilter || property.property_type === typeFilter;
    const matchesTransaction = !transactionFilter || property.transaction_type === transactionFilter;
    
    return matchesSearch && matchesPrice && matchesType && matchesTransaction;
  });



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

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setShowSidebar(true);
  };

  const handlePropertyClick = (propertyId: number) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="h-screen flex bg-white relative overflow-hidden">
      {/* Sidebar with properties list */}
      <aside 
        className={`absolute left-0 top-0 bottom-0 w-full sm:w-[380px] md:w-[420px] bg-white shadow-2xl z-[1001] transform transition-transform duration-300 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="border-b px-3 sm:px-4 py-3 bg-white sticky top-0 z-10 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Объявления ({filteredProperties.length})</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Поиск по адресу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm"
              />
            </div>
            
            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  showFilters ? 'bg-[#FF7A00] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon name="SlidersHorizontal" size={16} />
                Фильтры
              </button>
              
              {(priceFilter || typeFilter || transactionFilter || searchQuery) && (
                <button
                  onClick={() => {
                    setPriceFilter('');
                    setTypeFilter('');
                    setTransactionFilter('');
                    setSearchQuery('');
                  }}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Сбросить
                </button>
              )}
            </div>
            
            {/* Expandable Filters */}
            {showFilters && (
              <div className="space-y-2 pt-2 border-t">
                <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                  <SelectTrigger className="w-full h-9 text-sm">
                    <SelectValue placeholder="Тип сделки" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все сделки</SelectItem>
                    <SelectItem value="rent">Аренда</SelectItem>
                    <SelectItem value="daily_rent">Посуточно</SelectItem>
                    <SelectItem value="sale">Продажа</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full h-9 text-sm">
                    <SelectValue placeholder="Тип недвижимости" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    <SelectItem value="apartment">Квартира</SelectItem>
                    <SelectItem value="house">Дом</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="w-full h-9 text-sm">
                    <SelectValue placeholder="Цена" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Любая цена</SelectItem>
                    <SelectItem value="low">До 150,000</SelectItem>
                    <SelectItem value="medium">150,000 - 500,000</SelectItem>
                    <SelectItem value="high">От 500,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Properties List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            {filteredProperties.length > 0 ? (
              <div className="space-y-3">
                {filteredProperties
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((property) => (
                    <div
                      key={property.id}
                      ref={(el) => { propertyRefs.current[property.id] = el; }}
                      className={`group bg-white rounded-lg overflow-hidden border hover:shadow-md transition-all duration-200 cursor-pointer ${
                        selectedProperty?.id === property.id ? 'ring-2 ring-[#FF7A00] shadow-md' : 'border-gray-200'
                      }`}
                      onClick={() => handlePropertyClick(property.id)}
                      onMouseEnter={() => setSelectedProperty(property)}
                    >
                      <div className="relative">
                        {property.images && property.images.length > 0 ? (
                          <>
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            {property.images.length > 1 && (
                              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                <Icon name="Image" size={12} />
                                {property.images.length}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-36 bg-gray-200 flex items-center justify-center">
                            <Icon name="ImageOff" size={32} className="text-gray-400" />
                          </div>
                        )}
                        
                        <div className="absolute top-2 left-2 bg-[#FF7A00] text-white text-xs font-semibold px-2 py-1 rounded">
                          {property.transaction_type === 'rent' ? 'Аренда' : property.transaction_type === 'daily_rent' ? 'Посуточно' : 'Продажа'}
                        </div>
                      </div>
                      
                      <div className="p-3">
                        <p className="text-lg font-bold text-[#FF7A00] mb-1.5">
                          {formatPrice(property.price, property.currency)}
                          {property.transaction_type === 'rent' && <span className="text-xs font-normal text-gray-600"> /мес</span>}
                        </p>
                        
                        <p className="text-gray-900 font-medium mb-2 line-clamp-2 text-sm">
                          {property.title}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                          {property.rooms && (
                            <div className="flex items-center gap-0.5">
                              <Icon name="Bed" size={14} />
                              <span>{property.rooms}</span>
                            </div>
                          )}
                          {property.area && (
                            <div className="flex items-center gap-0.5">
                              <Icon name="Maximize" size={14} />
                              <span>{property.area} м²</span>
                            </div>
                          )}
                          {property.floor && (
                            <div className="flex items-center gap-0.5">
                              <Icon name="Building" size={14} />
                              <span>{property.floor} эт.</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Icon name="MapPin" size={12} className="flex-shrink-0" />
                          <span className="truncate">
                            {property.street_name ? `${property.street_name} ${property.house_number || ''}` : property.district}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Icon name="Search" size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm font-medium mb-1">Объекты не найдены</p>
                <p className="text-xs">Попробуйте изменить фильтры</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Toggle sidebar button */}
      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="absolute left-3 sm:left-4 top-3 sm:top-4 z-[1000] bg-white hover:bg-gray-50 text-gray-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-lg transition-all hover:shadow-xl flex items-center gap-2"
        >
          <Icon name="List" size={18} className="sm:w-5 sm:h-5" />
          <span className="font-medium text-sm sm:text-base">Объявления ({filteredProperties.length})</span>
        </button>
      )}
      
      {/* Map Controls */}
      <div className="absolute right-3 sm:right-4 top-3 sm:top-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('map-locate-user'));
          }}
          className="bg-white hover:bg-gray-50 p-2.5 sm:p-3 rounded-lg shadow-lg transition-all hover:shadow-xl"
          title="Моё местоположение"
        >
          <Icon name="Locate" size={18} className="sm:w-5 sm:h-5 text-gray-700" />
        </button>
      </div>

      {/* Back button */}
      <Link 
        to="/"
        className="absolute left-3 sm:left-4 bottom-20 sm:bottom-24 z-[1000] bg-white hover:bg-gray-50 text-gray-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-lg transition-all hover:shadow-xl flex items-center gap-2"
      >
        <Icon name="ArrowLeft" size={18} className="sm:w-5 sm:h-5" />
        <span className="font-medium text-sm sm:text-base">Назад</span>
      </Link>

      {/* Map - Full screen */}
      <div className="w-full h-full">
        <YerevanMapLeaflet
          properties={filteredProperties}
          selectedProperty={selectedProperty}
          onPropertySelect={handlePropertySelect}
          openOnClick={true}
        />
      </div>

      {error && (
        <div className="absolute top-4 right-4 z-[1000] bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 shadow-lg">
          <Icon name="AlertCircle" size={20} />
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadProperties}
            className="ml-2"
          >
            Повторить
          </Button>
        </div>
      )}
      
      <FloatingContactButtons />
    </div>
  );
};

export default FullMapPage;