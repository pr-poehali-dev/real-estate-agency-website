import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Icon from '../ui/icon';
import { Properties } from '@/lib/api';

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
  street_name?: string;
  house_number?: string;
  apartment_number?: string;
  latitude: number;
  longitude: number;
  features?: string[];
  images?: string[];
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface PropertyListProps {
  onEdit: (property: Property) => void;
  onDelete: (propertyId: number) => void;
  refetchTrigger?: number;
}

const PropertyList: React.FC<PropertyListProps> = ({ onEdit, onDelete, refetchTrigger }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Фильтры
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterTransaction, setFilterTransaction] = useState('all');
  const [filterDistrict, setFilterDistrict] = useState('all');

  useEffect(() => {
    loadProperties();
  }, [refetchTrigger]);

  const loadProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await Properties.list();
      setProperties((response.properties || []) as Property[]);
    } catch (err: any) {
      console.error('Error loading properties:', err);
      setError(err.message || 'Не удалось загрузить объекты');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ' + currency;
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'rent': return 'Долгосрочная аренда';
      case 'daily_rent': return 'Посуточно';
      case 'sale': return 'Продажа';
      default: return type;
    }
  };

  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case 'apartment': return 'Квартира';
      case 'house': return 'Дом';
      case 'commercial': return 'Коммерческая';
      default: return type;
    }
  };

  // Фильтрация и сортировка объектов
  const filteredProperties = useMemo(() => {
    const filtered = properties.filter(property => {
      // Поиск по словам
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchFields = [
          property.title,
          property.description,
          property.district,
          property.street_name,
          property.address,
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchFields.includes(query)) return false;
      }

      // Фильтр по типу недвижимости
      if (filterType !== 'all' && property.property_type !== filterType) return false;

      // Фильтр по типу сделки
      if (filterTransaction !== 'all' && property.transaction_type !== filterTransaction) return false;

      // Фильтр по району
      if (filterDistrict !== 'all' && property.district !== filterDistrict) return false;

      return true;
    });

    // Сортировка по дате (самые новые первыми)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return b.id - a.id;
    });
  }, [properties, searchQuery, filterType, filterTransaction, filterDistrict]);

  // Получить уникальные районы
  const districts = useMemo(() => {
    const uniqueDistricts = Array.from(new Set(properties.map(p => p.district))).sort();
    return uniqueDistricts;
  }, [properties]);

  const resetFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterTransaction('all');
    setFilterDistrict('all');
  };

  const hasActiveFilters = searchQuery || filterType !== 'all' || filterTransaction !== 'all' || filterDistrict !== 'all';

  return (
    <Card className="mb-6 md:mb-8 animate-scaleIn">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 justify-between animate-fadeInUp text-base md:text-lg">
          <div className="flex items-center gap-2">
            <Icon name="List" size={20} className="hidden sm:block" />
            <span className="text-sm sm:text-base">Существующие объявления ({filteredProperties.length})</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadProperties}
            disabled={loading}
          >
            <Icon name="RefreshCw" size={16} className={loading ? 'animate-spin' : ''} />
          </Button>
        </CardTitle>

        {/* Фильтры */}
        <div className="mt-4 space-y-3">
          {/* Поиск */}
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск по названию, описанию, адресу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Фильтры в строку */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Тип недвижимости" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="apartment">Квартира</SelectItem>
                <SelectItem value="house">Дом</SelectItem>
                <SelectItem value="commercial">Коммерческая</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterTransaction} onValueChange={setFilterTransaction}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Тип сделки" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все сделки</SelectItem>
                <SelectItem value="rent">Долгосрочная аренда</SelectItem>
                <SelectItem value="daily_rent">Посуточная аренда</SelectItem>
                <SelectItem value="sale">Продажа</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDistrict} onValueChange={setFilterDistrict}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Район" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все районы</SelectItem>
                {districts.map(district => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="w-full sm:w-auto"
            >
              <Icon name="X" size={14} className="mr-1" />
              Сбросить фильтры
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
            <Icon name="AlertCircle" size={16} />
            <span className="flex-1">{error}</span>
            <Button variant="outline" size="sm" onClick={loadProperties}>
              Повторить
            </Button>
          </div>
        )}

        {loading && properties.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Icon name="Loader2" size={32} className="mx-auto mb-2 animate-spin" />
            <p className="text-sm">Загрузка объектов...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Icon name="Home" size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {hasActiveFilters ? 'Нет объектов по заданным фильтрам' : 'Нет добавленных объектов'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow duration-200"
              >
                {/* Изображение */}
                <div className="relative h-40 bg-gray-200">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon name="Home" size={48} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Контент */}
                <div className="p-3">
                  <h4 className="font-semibold text-sm md:text-base mb-2 line-clamp-1">
                    {property.title}
                  </h4>

                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Icon name="MapPin" size={12} />
                      <span className="truncate">{property.district}</span>
                    </div>
                    
                    {property.street_name && (
                      <div className="flex items-center gap-1">
                        <Icon name="Home" size={12} />
                        <span className="truncate">{property.street_name} {property.house_number}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 flex-wrap">
                      {property.rooms && (
                        <div className="flex items-center gap-1">
                          <Icon name="Bed" size={12} />
                          <span>{property.rooms} комн</span>
                        </div>
                      )}
                      {property.area && (
                        <div className="flex items-center gap-1">
                          <Icon name="Maximize" size={12} />
                          <span>{property.area} м²</span>
                        </div>
                      )}
                      {property.floor && (
                        <div className="flex items-center gap-1">
                          <Icon name="Building" size={12} />
                          <span>{property.floor}/{property.total_floors || '?'} эт</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-sm md:text-base font-bold text-[#FF7A00] mb-3">
                    {formatPrice(property.price, property.currency)}
                  </div>

                  {/* Кнопки действий */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(property)}
                      className="flex-1 text-xs"
                    >
                      <Icon name="Edit" size={14} className="mr-1" />
                      Изменить
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(property.id)}
                      className="text-xs"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyList;