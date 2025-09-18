import React, { useState, useEffect } from 'react';
import InteractiveMap from '@/components/InteractiveMap';
import PropertyFilters from '@/components/PropertyFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Property {
  id: number;
  title: string;
  description: string;
  property_type: string;
  transaction_type: string;
  price: number;
  currency: string;
  area?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  total_floors?: number;
  year_built?: number;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  features: string[];
  images: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

const MapPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Filter states
  const [selectedDistrict, setSelectedDistrict] = useState('Все районы');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Load properties on component mount and when filters change
  useEffect(() => {
    loadProperties();
  }, [selectedDistrict, selectedType, selectedTransaction, priceRange]);

  const loadProperties = async () => {
    setLoading(true);
    setError('');

    try {
      // Build query parameters for filters
      const params = new URLSearchParams();
      
      if (selectedDistrict !== 'Все районы') {
        params.append('district', selectedDistrict);
      }
      
      if (selectedType !== 'all') {
        params.append('type', selectedType);
      }
      
      if (selectedTransaction !== 'all') {
        params.append('transaction', selectedTransaction);
      }
      
      if (priceRange.min) {
        params.append('min_price', priceRange.min);
      }
      
      if (priceRange.max) {
        params.append('max_price', priceRange.max);
      }

      const url = `https://functions.poehali.dev/8571bb44-9242-4aac-8df9-754908175968${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProperties(data.properties);
        } else {
          setError('Ошибка загрузки данных');
        }
      } else {
        setError('Ошибка подключения к серверу');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedDistrict('Все районы');
    setSelectedType('all');
    setSelectedTransaction('all');
    setPriceRange({ min: '', max: '' });
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'apartment': 'Квартира',
      'house': 'Дом',
      'commercial': 'Коммерческая'
    };
    return labels[type] || type;
  };

  const getTransactionTypeLabel = (type: string) => {
    return type === 'sale' ? 'Продажа' : 'Аренда';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Карта недвижимости Еревана
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Найдите идеальную недвижимость в Ереване с помощью интерактивной карты. 
            Используйте фильтры для уточнения поиска по районам, типу и цене.
          </p>
        </div>

        {/* Filters */}
        <PropertyFilters
          selectedDistrict={selectedDistrict}
          selectedType={selectedType}
          selectedTransaction={selectedTransaction}
          priceRange={priceRange}
          onDistrictChange={setSelectedDistrict}
          onTypeChange={setSelectedType}
          onTransactionChange={setSelectedTransaction}
          onPriceRangeChange={setPriceRange}
          onReset={resetFilters}
        />

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {loading ? 'Загрузка...' : `Найдено объектов: ${properties.length}`}
          </div>
          <div className="flex items-center gap-2">
            <Icon name="MapPin" size={16} />
            <span className="text-sm text-gray-600">
              Кликните на маркер для подробной информации
            </span>
          </div>
        </div>

        {/* Error Message */}
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
          {/* Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Map" size={20} />
                  Интерактивная карта
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <InteractiveMap
                  properties={properties}
                  selectedDistrict={selectedDistrict !== 'Все районы' ? selectedDistrict : undefined}
                  onPropertySelect={setSelectedProperty}
                />
              </CardContent>
            </Card>
          </div>

          {/* Property Details */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Info" size={20} />
                  {selectedProperty ? 'Информация об объекте' : 'Выберите объект на карте'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedProperty ? (
                  <div className="space-y-4">
                    {selectedProperty.images.length > 0 && (
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
                        <span className="text-gray-600">Район:</span>
                        <span>{selectedProperty.district}</span>
                      </div>
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
                          <span className="text-gray-600">Год постройки:</span>
                          <span>{selectedProperty.year_built}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-gray-600 text-sm mb-2">
                        <Icon name="MapPin" size={14} className="inline mr-1" />
                        {selectedProperty.address}
                      </p>
                    </div>

                    {selectedProperty.description && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Описание</h4>
                        <p className="text-gray-600 text-sm">
                          {selectedProperty.description}
                        </p>
                      </div>
                    )}

                    {selectedProperty.features.length > 0 && (
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

                    <Button className="w-full mt-4">
                      <Icon name="Phone" size={16} className="mr-2" />
                      Связаться с нами
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Icon name="MousePointer" size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>Кликните на маркер на карте, чтобы увидеть подробную информацию об объекте недвижимости.</p>
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