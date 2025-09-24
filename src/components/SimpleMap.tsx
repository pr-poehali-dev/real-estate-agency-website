import React from 'react';
import Icon from '@/components/ui/icon';

interface Property {
  id: number;
  title: string;
  price: number;
  currency: string;
  latitude: number;
  longitude: number;
  district: string;
  property_type: string;
  transaction_type: string;
}

interface SimpleMapProps {
  properties: Property[];
  onPropertySelect: (property: Property) => void;
  selectedDistrict?: string;
}

const SimpleMap: React.FC<SimpleMapProps> = ({ properties, onPropertySelect }) => {
  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  const getPropertyTypeLabel = (type: string) => {
    return type === 'apartment' ? 'Квартира' : 'Дом';
  };

  const getTransactionTypeLabel = (type: string) => {
    return type === 'sale' ? 'Продажа' : 'Аренда';
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
      {/* Фон карты */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjFmNWY5Ii8+CjxwYXRoIGQ9Ik01MCAyMDBMMTAwIDE1MEwxNTAgMTgwTDIwMCAxMzBMMjUwIDE2MEwzMDAgMTIwTDM1MCAyMDAiIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNTAiIGZpbGw9IiNkY2ZjZTciIG9wYWNpdHk9IjAuNSIvPgo8L3N2Zz4K)'
        }}
      />
      
      {/* Заголовок */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 z-10">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Icon name="MapPin" size={20} className="text-orange-600" />
          Карта Еревана
        </h3>
        <p className="text-sm text-gray-600">Найдено объектов: {properties.length}</p>
      </div>

      {/* Объекты на карте */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {properties.map((property, index) => {
            // Распределяем объекты по карте (имитация координат)
            const positions = [
              { x: '25%', y: '40%' }, // Центр
              { x: '60%', y: '30%' }, // Центр 2
              { x: '20%', y: '70%' }, // Аван
              { x: '70%', y: '60%' }, // Ачапняк
              { x: '40%', y: '80%' }  // Арабкир
            ];
            const position = positions[index] || positions[0];

            return (
              <div
                key={property.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: position.x, top: position.y }}
                onClick={() => onPropertySelect(property)}
              >
                {/* Маркер */}
                <div className="relative">
                  <div className="w-8 h-8 bg-orange-600 rounded-full shadow-lg border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="Home" size={16} className="text-white" />
                  </div>
                  
                  {/* Пульсация */}
                  <div className="absolute inset-0 bg-orange-600 rounded-full animate-ping opacity-75"></div>
                </div>

                {/* Попап при наведении */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg p-3 min-w-64 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                  
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                    {property.title}
                  </h4>
                  <p className="text-orange-600 font-bold text-lg mb-1">
                    {formatPrice(property.price, property.currency)}
                  </p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>{getPropertyTypeLabel(property.property_type)} • {getTransactionTypeLabel(property.transaction_type)}</p>
                    <p className="flex items-center gap-1">
                      <Icon name="MapPin" size={12} />
                      {property.district}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Информационная панель */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3 z-10 max-w-xs">
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <Icon name="MousePointer" size={14} />
          Кликните на маркер для подробностей
        </p>
        <div className="mt-2">
          <button 
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            onClick={() => window.location.href = '/map'}
          >
            Открыть полную карту →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;