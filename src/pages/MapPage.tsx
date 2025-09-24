import React, { useState, useEffect } from 'react';
import YerevanMap2GIS from '@/components/YerevanMap2GIS';
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
  const [streetSearch, setStreetSearch] = useState('');

  // Mock data with updated districts
  const getMockProperties = (): Property[] => {
    const mockProps: Property[] = [
      {
        id: 1,
        title: '3-комнатная квартира в Центре',
        description: 'Прекрасная квартира в самом сердце Еревана. Рядом с главными достопримечательностями, ресторанами и магазинами.',
        property_type: 'apartment',
        transaction_type: 'rent',
        price: 350000,
        currency: 'AMD',
        area: 85.5,
        rooms: 3,
        bedrooms: 2,
        bathrooms: 1,
        floor: 4,
        total_floors: 9,
        year_built: 2015,
        district: 'Центр (Кентрон)',
        address: 'ул. Абовяна 23, Ереван',
        latitude: 40.1823,
        longitude: 44.5146,
        features: ['Мебель', 'Кондиционер', 'Балкон', 'Интернет', 'Парковка'],
        images: ['/img/703391dd-7309-4c1d-873e-51a4a1ee5059.jpg'],
        status: 'active',
        created_at: '2024-11-20T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        title: 'Элитная 2-комнатная квартира на площади Республики',
        description: 'Роскошная квартира с видом на площадь Республики. Дизайнерский ремонт, премиальная мебель.',
        property_type: 'apartment',
        transaction_type: 'rent',
        price: 450000,
        currency: 'AMD',
        area: 65.0,
        rooms: 2,
        bedrooms: 1,
        bathrooms: 1,
        floor: 7,
        total_floors: 12,
        year_built: 2018,
        district: 'Центр (Кентрон)',
        address: 'пр. Республики 15, Ереван',
        latitude: 40.1776,
        longitude: 44.5126,
        features: ['Премиум класс', 'Вид на площадь', 'Консьерж', 'Лифт', 'Подземная парковка', 'Охрана'],
        images: ['/img/d6af7502-6fd6-494d-b0ff-846b279690c0.jpg'],
        status: 'active',
        created_at: '2024-11-18T15:30:00Z',
        updated_at: '2024-01-20T15:30:00Z'
      },
      {
        id: 3,
        title: 'Просторный дом в Авановском районе',
        description: 'Частный дом с садом в тихом районе Ереван. Отличное место для семьи.',
        property_type: 'house',
        transaction_type: 'daily_rent',
        price: 25000,
        currency: 'AMD',
        area: 180.0,
        rooms: 5,
        bedrooms: 4,
        bathrooms: 2,
        floor: 2,
        total_floors: 2,
        year_built: 2010,
        district: 'Аван',
        address: 'ул. Аванского шоссе 45, Ереван',
        latitude: 40.2150,
        longitude: 44.5200,
        features: ['Сад', 'Гараж', 'Камин', 'Терраса'],
        images: ['/img/703391dd-7309-4c1d-873e-51a4a1ee5059.jpg'],
        status: 'active',
        created_at: '2024-11-15T12:00:00Z',
        updated_at: '2024-01-25T12:00:00Z'
      },
      {
        id: 4,
        title: 'Современная квартира в Ачапняке',
        description: 'Новая квартира с европейским ремонтом в развивающемся районе.',
        property_type: 'apartment',
        transaction_type: 'rent',
        price: 280000,
        currency: 'AMD',
        area: 70.0,
        rooms: 2,
        bedrooms: 1,
        bathrooms: 1,
        floor: 3,
        total_floors: 8,
        year_built: 2020,
        district: 'Ачапняк',
        address: 'ул. Мясникяна 12, Ереван',
        latitude: 40.1650,
        longitude: 44.4900,
        features: ['Новостройка', 'Европейский ремонт', 'Лифт'],
        images: ['/img/d6af7502-6fd6-494d-b0ff-846b279690c0.jpg'],
        status: 'active',
        created_at: '2024-11-17T14:00:00Z',
        updated_at: '2024-01-22T14:00:00Z'
      },
      {
        id: 5,
        title: 'Семейная квартира в Арабкире',
        description: 'Уютная 3-комнатная квартира в престижном районе с хорошей инфраструктурой.',
        property_type: 'apartment',
        transaction_type: 'daily_rent',
        price: 15000,
        currency: 'AMD',
        area: 90.0,
        rooms: 3,
        bedrooms: 2,
        bathrooms: 1,
        floor: 5,
        total_floors: 10,
        year_built: 2012,
        district: 'Арабкир',
        address: 'ул. Комитаса 28, Ереван',
        latitude: 40.2000,
        longitude: 44.5100,
        features: ['Балкон', 'Кладовка', 'Интернет', 'Кабельное ТВ'],
        images: ['/img/703391dd-7309-4c1d-873e-51a4a1ee5059.jpg'],
        status: 'active',
        created_at: '2024-11-16T11:30:00Z',
        updated_at: '2024-01-18T11:30:00Z'
      }
    ];

    // Применяем фильтры
    return mockProps.filter(prop => {
      if (selectedDistrict !== 'Все районы' && prop.district !== selectedDistrict) return false;
      if (selectedType !== 'all' && prop.property_type !== selectedType) return false;
      if (selectedTransaction !== 'all' && prop.transaction_type !== selectedTransaction) return false;
      
      // Поиск по улице
      if (streetSearch.trim()) {
        const searchLower = streetSearch.toLowerCase();
        const addressMatch = prop.address.toLowerCase().includes(searchLower);
        if (!addressMatch) return false;
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
  };

  const loadProperties = async () => {
    setLoading(true);
    setError('');

    try {
      // Используем моковые данные для демо
      const mockData = getMockProperties();
      
      // Симуляция загрузки
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProperties(mockData);
    } catch (err) {
      console.error('Error loading properties:', err);
      const mockData = getMockProperties();
      setProperties(mockData);
    } finally {
      setLoading(false);
    }
  };

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
      'house': 'Дом'
    };
    return labels[type] || type;
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'rent': 'Аренда',
      'daily_rent': 'Посуточная аренда',
      'sale': 'Продажа'
    };
    return labels[type] || type;
  };

  // Load properties on component mount and when filters change
  useEffect(() => {
    loadProperties();
  }, [selectedDistrict, selectedType, selectedTransaction, priceRange, streetSearch]);

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
          streetSearch={streetSearch}
          onDistrictChange={setSelectedDistrict}
          onTypeChange={setSelectedType}
          onTransactionChange={setSelectedTransaction}
          onPriceRangeChange={setPriceRange}
          onStreetSearchChange={setStreetSearch}
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
              Кликните на объект для подробной информации
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
          {/* Interactive Map */}
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
                  <YerevanMap2GIS
                    properties={properties}
                    selectedDistrict={selectedDistrict !== 'Все районы' ? selectedDistrict : undefined}
                    onPropertySelect={setSelectedProperty}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Property Details */}
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
                        <span className="text-gray-600">Дата добавления:</span>
                        <span>{new Date(selectedProperty.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
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
                  <div className="space-y-4">
                    <div className="text-center text-gray-500 mb-4">
                      <Icon name="MousePointer" size={24} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Кликните на объект на карте или в списке ниже</p>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3 text-sm text-gray-700">
                        {properties.length > 0 
                          ? `Найденные объекты (${properties.length})` 
                          : 'Объекты не найдены'}
                      </h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {properties.length > 0 ? (
                          properties
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
                                    {new Date(property.created_at).toLocaleDateString('ru-RU', { 
                                      day: '2-digit', 
                                      month: '2-digit', 
                                      year: 'numeric' 
                                    })}
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