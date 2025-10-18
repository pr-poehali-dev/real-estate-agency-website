import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
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

  return (
    <Card className="mb-6 md:mb-8 animate-scaleIn">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 justify-between animate-fadeInUp text-base md:text-lg">
          <div className="flex items-center gap-2">
            <Icon name="List" size={20} className="hidden sm:block" />
            <span className="text-sm sm:text-base">Существующие объявления ({properties.length})</span>
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
        ) : properties.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Icon name="Home" size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Нет добавленных объектов</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4 max-h-96 overflow-y-auto">
            {properties.map((property) => (
              <div key={property.id} className="border rounded-lg p-3 md:p-4 bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div className="flex-1 w-full">
                    <div className="flex items-start gap-2 mb-2 flex-wrap">
                      <h4 className="font-semibold text-base md:text-lg flex-1 min-w-0">{property.title}</h4>
                      <div className="flex gap-1 flex-wrap">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap">
                          {getPropertyTypeLabel(property.property_type)}
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded whitespace-nowrap">
                          {getTransactionTypeLabel(property.transaction_type)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Icon name="MapPin" size={14} />
                        <span className="truncate">{property.district}</span>
                      </div>
                      {property.street_name && (
                        <div className="flex items-center gap-1">
                          <Icon name="Home" size={14} />
                          <span className="truncate">{property.street_name} {property.house_number}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span className="font-bold whitespace-nowrap">{formatPrice(property.price, property.currency)}</span>
                      </div>
                      {property.rooms && (
                        <div className="flex items-center gap-1">
                          <Icon name="Bed" size={14} />
                          <span>{property.rooms} комн{property.area ? `, ${property.area} м²` : ''}</span>
                        </div>
                      )}
                      {property.floor && (
                        <div className="flex items-center gap-1">
                          <Icon name="Building" size={14} />
                          <span>{property.floor}{property.total_floors ? `/${property.total_floors}` : ''} эт</span>
                        </div>
                      )}
                    </div>

                    {property.description && (
                      <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-3">
                        {property.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex sm:flex-col flex-row gap-2 w-full sm:w-auto sm:ml-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(property)}
                      className="flex-1 sm:flex-none text-xs md:text-sm"
                    >
                      <Icon name="Edit" size={14} className="mr-1" />
                      <span className="hidden xs:inline">Изменить</span>
                      <span className="xs:hidden">Изм</span>
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(property.id)}
                      className="flex-1 sm:flex-none text-xs md:text-sm"
                    >
                      <Icon name="Trash2" size={14} className="mr-1" />
                      <span className="hidden xs:inline">Удалить</span>
                      <span className="xs:hidden">Уд</span>
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