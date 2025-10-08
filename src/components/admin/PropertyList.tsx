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
  demoProperties?: Property[];
}

const PropertyList: React.FC<PropertyListProps> = ({ onEdit, onDelete, refetchTrigger, demoProperties }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProperties();
  }, [refetchTrigger, demoProperties]);

  const loadProperties = async () => {
    const token = localStorage.getItem('admin_token');
    
    if (token && token.startsWith('demo-token-')) {
      setProperties(demoProperties || []);
      setLoading(false);
      setError('');
      return;
    }

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
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Icon name="List" size={20} />
            Существующие объявления ({properties.length})
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
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center gap-2">
            <Icon name="AlertCircle" size={16} />
            {error}
            <Button variant="outline" size="sm" onClick={loadProperties} className="ml-auto">
              Повторить
            </Button>
          </div>
        )}

        {loading && properties.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Icon name="Loader2" size={32} className="mx-auto mb-2 animate-spin" />
            Загрузка объектов...
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Icon name="Home" size={32} className="mx-auto mb-2 opacity-50" />
            Нет добавленных объектов
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {properties.map((property) => (
              <div key={property.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h4 className="font-semibold text-lg">{property.title}</h4>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {getPropertyTypeLabel(property.property_type)}
                      </span>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        {getTransactionTypeLabel(property.transaction_type)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Icon name="MapPin" size={14} />
                        <span>{property.district}</span>
                      </div>
                      {property.street_name && (
                        <div className="flex items-center gap-1">
                          <Icon name="Home" size={14} />
                          <span>{property.street_name} {property.house_number}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{formatPrice(property.price, property.currency)}</span>
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
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {property.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(property)}
                    >
                      <Icon name="Edit" size={14} className="mr-1" />
                      Изменить
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(property.id)}
                    >
                      <Icon name="Trash2" size={14} className="mr-1" />
                      Удалить
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