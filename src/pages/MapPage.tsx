import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import YerevanMapLeaflet from '@/components/YerevanMapLeaflet';
import PropertyFilters from '@/components/PropertyFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  
  const [selectedDistrict, setSelectedDistrict] = useState('Все районы');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [streetSearch, setStreetSearch] = useState('');

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

  const filteredProperties = useMemo(() => {
    return allProperties.filter((prop) => {
      if (selectedDistrict !== 'Все районы' && prop.district !== selectedDistrict) return false;
      if (selectedType !== 'all' && prop.property_type !== selectedType) return false;
      if (selectedTransaction !== 'all' && prop.transaction_type !== selectedTransaction) return false;
      
      if (streetSearch.trim()) {
        const searchLower = streetSearch.toLowerCase();
        const streetMatch = (prop.street_name || '').toLowerCase().includes(searchLower);
        const addressMatch = (prop.address || '').toLowerCase().includes(searchLower);
        if (!streetMatch && !addressMatch) return false;
      }
      
      if (priceRange.min) {
        const minPrice = parseFloat(priceRange.min);
        if (prop.price < minPrice) return false;
      }
      
      if (priceRange.max) {
        const maxPrice = parseFloat(priceRange.max);
        if (prop.price > maxPrice) return false;
      }
      
      return true;
    });
  }, [allProperties, selectedDistrict, selectedType, selectedTransaction, priceRange, streetSearch]);

  const resetFilters = () => {
    setSelectedDistrict('Все районы');
    setSelectedType('all');
    setSelectedTransaction('all');
    setPriceRange({ min: '', max: '' });
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="mb-4">
            <Link to="/">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Icon name="ArrowLeft" size={16} />
                Назад
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Карта недвижимости Еревана
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Найдите идеальную недвижимость в Ереване с помощью интерактивной карты. 
              Используйте фильтры для уточнения поиска по районам, типу и цене.
            </p>
          </div>
        </div>

        <PropertyFilters
          selectedDistrict={selectedDistrict}
          selectedType={selectedType}
          selectedTransaction={selectedTransaction}
          priceRange={priceRange}
          streetSearch={streetSearch}
          onDistrictChange={setSelectedDistrict}
          onTypeChange={setSelectedType}
          onTransactionChange={setSelectedTransaction}
          onPriceRangeChange={setPriceRange}
          onStreetSearchChange={setStreetSearch}
          onReset={resetFilters}
        />

        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {loading ? 'Загрузка...' : `Найдено объектов: ${filteredProperties.length}`}
          </div>
          <div className="flex items-center gap-2">
            <Icon name="MapPin" size={16} />
            <span className="text-sm text-gray-600">
              Кликните на объект для подробной информации
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Map" size={20} />
                  Интерактивная карта
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 w-full">
                  <YerevanMapLeaflet
                    properties={filteredProperties}
                    selectedDistrict={selectedDistrict !== 'Все районы' ? selectedDistrict : undefined}
                    onPropertySelect={setSelectedProperty}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Info" size={20} />
                  {selectedProperty ? 'Информация об объекте' : 'Выберите объект'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedProperty ? (
                  <div className="space-y-4">
                    {selectedProperty.images && selectedProperty.images.length > 0 && (
                      <img
                        src={selectedProperty.images[0]}
                        alt={selectedProperty.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {selectedProperty.title}
                      </h3>
                      <p className="text-orange-600 font-bold text-xl mb-2">
                        {formatPrice(selectedProperty.price, selectedProperty.currency)}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Тип:</span>
                        <span>{getPropertyTypeLabel(selectedProperty.property_type)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Операция:</span>
                        <span>{getTransactionTypeLabel(selectedProperty.transaction_type)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Дата:</span>
                        <span>{new Date(selectedProperty.created_at).toLocaleDateString('ru-RU')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Район:</span>
                        <span>{selectedProperty.district}</span>
                      </div>
                      {selectedProperty.street_name && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Адрес:</span>
                          <span>{selectedProperty.street_name} {selectedProperty.house_number}</span>
                        </div>
                      )}
                      {selectedProperty.area && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Площадь:</span>
                          <span>{selectedProperty.area} м²</span>
                        </div>
                      )}
                      {selectedProperty.rooms && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Комнат:</span>
                          <span>{selectedProperty.rooms}</span>
                        </div>
                      )}
                      {selectedProperty.floor && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Этаж:</span>
                          <span>
                            {selectedProperty.floor}
                            {selectedProperty.total_floors && ` из ${selectedProperty.total_floors}`}
                          </span>
                        </div>
                      )}
                      {selectedProperty.year_built && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Год:</span>
                          <span>{selectedProperty.year_built}</span>
                        </div>
                      )}
                    </div>

                    {selectedProperty.description && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Описание</h4>
                        <p className="text-gray-600 text-sm">
                          {selectedProperty.description}
                        </p>
                      </div>
                    )}

                    {selectedProperty.features && selectedProperty.features.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Особенности</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProperty.features.map((feature, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full mt-4"
                      onClick={() => window.open('https://t.me/WSEManager', '_blank')}
                    >
                      <Icon name="Phone" size={16} className="mr-2" />
                      Связаться с нами
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center text-gray-500 mb-4">
                      <Icon name="MousePointer" size={24} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Кликните на объект на карте или в списке ниже</p>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3 text-sm text-gray-700">
                        {filteredProperties.length > 0 
                          ? `Найденные объекты (${filteredProperties.length})` 
                          : 'Объекты не найдены'}
                      </h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredProperties.length > 0 ? (
                          filteredProperties
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .map((property) => (
                            <div
                              key={property.id}
                              className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                selectedProperty?.id === property.id ? 'bg-blue-50 border-blue-300' : ''
                              }`}
                              onClick={() => setSelectedProperty(property)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-sm leading-tight mb-1">
                                    {property.title}
                                  </h5>
                                  <p className="text-primary font-bold text-sm">
                                    {formatPrice(property.price, property.currency)}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <Icon name="MapPin" size={12} />
                                    <span>{property.district}</span>
                                    <span>•</span>
                                    <span>{getTransactionTypeLabel(property.transaction_type)}</span>
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    {new Date(property.created_at).toLocaleDateString('ru-RU')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            <Icon name="Search" size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Попробуйте изменить параметры поиска</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
