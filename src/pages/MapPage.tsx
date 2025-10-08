import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import YerevanMapLeaflet from '@/components/YerevanMapLeaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Properties } from '@/lib/api';
import type { Property as ApiProperty } from '@/lib/api';

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
  
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [streetSearch, setStreetSearch] = useState('');

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
      if (selectedType !== 'all' && prop.property_type !== selectedType) return false;
      if (selectedTransaction !== 'all' && prop.transaction_type !== selectedTransaction) return false;
      
      if (streetSearch.trim()) {
        const searchLower = streetSearch.toLowerCase();
        const streetMatch = (prop.street_name || '').toLowerCase().includes(searchLower);
        const addressMatch = (prop.address || '').toLowerCase().includes(searchLower);
        if (!streetMatch && !addressMatch) return false;
      }
      
      const price = Number(prop.price);
      if (minPrice && price < Number(minPrice)) return false;
      if (maxPrice && price > Number(maxPrice)) return false;
      
      return true;
    });
  }, [allProperties, selectedType, selectedTransaction, minPrice, maxPrice, streetSearch]);

  const resetFilters = () => {
    setSelectedType('all');
    setSelectedTransaction('all');
    setMinPrice('');
    setMaxPrice('');
    setStreetSearch('');
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'apartment': 'Квартира',
      'house': 'Дом',
      'commercial': 'Коммерция'
    };
    return labels[type] || type;
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'rent': 'Долгосрочная аренда',
      'daily_rent': 'Посуточная аренда',
      'sale': 'Продажа'
    };
    return labels[type] || type;
  };

  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 text-gray-900 hover:text-[#FF7A00] transition-colors">
          <Icon name="ArrowLeft" size={20} />
          <span className="font-semibold">Назад</span>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Карта недвижимости Еревана</h1>
        <div className="w-24"></div>
      </header>

      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedTransaction('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTransaction === 'all'
                ? 'bg-[#FF7A00] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-[#FF7A00]'
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setSelectedTransaction('rent')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTransaction === 'rent'
                ? 'bg-[#FF7A00] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-[#FF7A00]'
            }`}
          >
            Аренда
          </button>
          <button
            onClick={() => setSelectedTransaction('sale')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTransaction === 'sale'
                ? 'bg-[#FF7A00] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-[#FF7A00]'
            }`}
          >
            Продажа
          </button>

          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'all'
                ? 'bg-[#FF7A00] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-[#FF7A00]'
            }`}
          >
            Все типы
          </button>
          <button
            onClick={() => setSelectedType('apartment')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'apartment'
                ? 'bg-[#FF7A00] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-[#FF7A00]'
            }`}
          >
            Квартиры
          </button>
          <button
            onClick={() => setSelectedType('house')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'house'
                ? 'bg-[#FF7A00] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-[#FF7A00]'
            }`}
          >
            Дома
          </button>

          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          <Input
            type="number"
            placeholder="Мин цена"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-32 rounded-full border-gray-300"
          />
          <Input
            type="number"
            placeholder="Макс цена"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-32 rounded-full border-gray-300"
          />
          <Input
            type="text"
            placeholder="Улица..."
            value={streetSearch}
            onChange={(e) => setStreetSearch(e.target.value)}
            className="w-48 rounded-full border-gray-300"
          />

          {(selectedType !== 'all' || selectedTransaction !== 'all' || minPrice || maxPrice || streetSearch) && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Очистить
            </button>
          )}

          <div className="ml-auto text-sm text-gray-600">
            {loading ? 'Загрузка...' : `Найдено: ${filteredProperties.length}`}
          </div>
        </div>
      </div>

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

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-[2] relative">
          <YerevanMapLeaflet
            properties={filteredProperties}
            onPropertySelect={setSelectedProperty}
          />
        </div>

        <aside className="flex-1 overflow-y-auto border-l bg-white p-4 space-y-3">
          {filteredProperties.length > 0 ? (
            filteredProperties
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((property) => (
              <div
                key={property.id}
                className={`p-4 border rounded-xl cursor-pointer hover:shadow-md transition-all ${
                  selectedProperty?.id === property.id ? 'bg-orange-50 border-[#FF7A00] shadow-md' : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedProperty(property)}
              >
                {property.images && property.images.length > 0 && (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                
                <h3 className="font-semibold text-gray-900 mb-1 leading-tight">
                  {property.title}
                </h3>
                <p className="text-[#FF7A00] font-bold text-lg mb-2">
                  {formatPrice(property.price, property.currency)}
                </p>

                <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
                  {property.area && (
                    <span className="bg-gray-100 px-2 py-1 rounded-full">
                      {property.area} м²
                    </span>
                  )}
                  {property.rooms && (
                    <span className="bg-gray-100 px-2 py-1 rounded-full">
                      {property.rooms} комн.
                    </span>
                  )}
                  {property.floor && (
                    <span className="bg-gray-100 px-2 py-1 rounded-full">
                      {property.floor} этаж
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Icon name="MapPin" size={12} />
                  <span>{property.district}</span>
                  {property.street_name && (
                    <>
                      <span>•</span>
                      <span>{property.street_name} {property.house_number}</span>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-400">
              <Icon name="Search" size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Объекты не найдены</p>
              <p className="text-sm">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default MapPage;