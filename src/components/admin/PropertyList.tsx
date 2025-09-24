import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Icon from '../ui/icon';
import { sampleProperties } from '@/data/sampleProperties';

interface Property {
  id?: number;
  title: string;
  description: string;
  property_type: string;
  transaction_type: string;
  price: number;
  currency: string;
  area: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  total_floors: number;
  year_built: number;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  features: string[];
  images: string[];
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface PropertyListProps {
  onEdit: (property: Property) => void;
  onDelete: (propertyId: number) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ onEdit, onDelete }) => {
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
        <CardTitle className="flex items-center gap-2">
          <Icon name="List" size={20} />
          Существующие объявления ({sampleProperties.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {sampleProperties.map((property) => (
            <div key={property.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
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
                    <div className="flex items-center gap-1">
                      <Icon name="DollarSign" size={14} />
                      <span>{formatPrice(property.price, property.currency)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Home" size={14} />
                      <span>{property.rooms} комн, {property.area} м²</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Building" size={14} />
                      <span>{property.floor}/{property.total_floors} эт</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {property.description}
                  </p>
                  
                  <div className="text-xs text-gray-500">
                    {property.address}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(property)}
                    className="flex items-center gap-1"
                  >
                    <Icon name="Edit" size={14} />
                    Редактировать
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(property.id!)}
                    className="flex items-center gap-1 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Icon name="Trash2" size={14} />
                    Удалить
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {sampleProperties.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Icon name="Home" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Пока нет объявлений</p>
              <p className="text-sm">Добавьте первое объявление с помощью формы выше</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyList;