import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import Icon from './ui/icon';

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
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
}

interface SimpleMapProps {
  properties: Property[];
  selectedDistrict?: string;
  onPropertySelect?: (property: Property) => void;
}

const SimpleMap: React.FC<SimpleMapProps> = ({ 
  properties, 
  selectedDistrict, 
  onPropertySelect 
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    onPropertySelect && onPropertySelect(property);
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'apartment': return '🏢';
      case 'house': return '🏠';
      case 'commercial': return '🏪';
      default: return '📍';
    }
  };

  const getTransactionColor = (type: string) => {
    return type === 'sale' ? 'bg-orange-500' : 'bg-blue-500';
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  return (
    <div className="w-full">
      {/* Map Placeholder with Properties List */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-6 min-h-96">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
            <Icon name="Map" size={24} />
            Карта недвижимости Еревана
          </h3>
          <p className="text-gray-600 text-sm">
            {selectedDistrict && selectedDistrict !== 'Все районы' 
              ? `Показаны объекты в районе: ${selectedDistrict}` 
              : 'Показаны все доступные объекты'}
          </p>
          <div className="text-sm text-gray-500 mt-2">
            Найдено объектов: {properties.length}
          </div>
        </div>

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
            {properties.map((property) => (
              <Card 
                key={property.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedProperty?.id === property.id ? 'ring-2 ring-orange-500' : ''
                }`}
                onClick={() => handlePropertyClick(property)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Property Icon & Type */}
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full ${getTransactionColor(property.transaction_type)} flex items-center justify-center text-white text-lg`}>
                        {getPropertyTypeIcon(property.property_type)}
                      </div>
                    </div>
                    
                    {/* Property Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {property.title}
                      </h4>
                      
                      <div className="text-orange-600 font-bold text-lg mb-1">
                        {formatPrice(property.price, property.currency)}
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Icon name="MapPin" size={12} />
                          {property.district}
                        </div>
                        
                        {property.area && property.rooms && (
                          <div className="flex items-center gap-3">
                            <span>{property.area} м²</span>
                            <span>{property.rooms} комн.</span>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500">
                          {property.transaction_type === 'sale' ? 'Продажа' : 'Аренда'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon name="Home" size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {selectedDistrict && selectedDistrict !== 'Все районы' 
                ? `В районе "${selectedDistrict}" пока нет объектов`
                : 'Пока нет объектов недвижимости'}
            </p>
          </div>
        )}
      </div>

      {/* Interactive Map Notice */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 text-blue-700">
          <Icon name="Info" size={16} />
          <span className="text-sm font-medium">
            Полная интерактивная карта с OpenStreetMap будет добавлена после настройки проекта
          </span>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;