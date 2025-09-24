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
    <div className="h-full w-full relative overflow-hidden bg-gray-50">
      {/* Карта Еревана как фон */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/img/f685af16-3d13-4cb1-929d-c50053195461.jpg)',
          filter: 'brightness(0.9) contrast(1.1)'
        }}
      />
      
      {/* Наложение для лучшей видимости маркеров */}
      <div className="absolute inset-0 bg-blue-900 bg-opacity-10"></div>
      
      {/* Заголовок */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 z-10">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Icon name="MapPin" size={20} className="text-orange-600" />
          Карта Еревана
        </h3>
        <p className="text-sm text-gray-600">Найдено объектов: {properties.length}</p>
      </div>

      {/* Названия районов */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute" style={{ left: '48%', top: '48%' }}>
          <span className="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-700 shadow-sm">Центр</span>
        </div>
        <div className="absolute" style={{ left: '35%', top: '21%' }}>
          <span className="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-700 shadow-sm">Аван</span>
        </div>
        <div className="absolute" style={{ left: '25%', top: '41%' }}>
          <span className="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-700 shadow-sm">Арабкир</span>
        </div>
        <div className="absolute" style={{ left: '62%', top: '26%' }}>
          <span className="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-700 shadow-sm">Давташен</span>
        </div>
        <div className="absolute" style={{ left: '70%', top: '71%' }}>
          <span className="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-700 shadow-sm">Эребуни</span>
        </div>
      </div>

      {/* Объекты на карте */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {properties.map((property, index) => {
            // Распределяем объекты по районам Еревана (приблизительные позиции)
            const districtPositions: Record<string, {x: string, y: string}> = {
              'Центр': { x: '48%', y: '52%' },
              'Аван': { x: '35%', y: '25%' },
              'Арабкир': { x: '25%', y: '45%' },
              'Давташен': { x: '62%', y: '30%' },
              'Эребуни': { x: '70%', y: '75%' },
              'Канакер-Зейтун': { x: '58%', y: '40%' },
              'Малатия-Себастия': { x: '32%', y: '65%' },
              'Норк-Мараш': { x: '78%', y: '55%' },
              'Нор Норк': { x: '85%', y: '45%' },
              'Шенгавит': { x: '45%', y: '78%' }
            };
            
            const position = districtPositions[property.district] || { x: '50%', y: '50%' };


            return (
              <div
                key={property.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: position.x, top: position.y }}
                onClick={() => onPropertySelect(property)}
              >
                {/* Маркер */}
                <div className="relative">
                  <div className="w-10 h-10 bg-red-600 rounded-full shadow-xl border-3 border-white flex items-center justify-center group-hover:scale-125 transition-all duration-200 hover:shadow-2xl">
                    <Icon name="Home" size={18} className="text-white" />
                  </div>
                  
                  {/* Пульсация */}
                  <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-60"></div>
                  
                  {/* Дополнительная тень для контраста */}
                  <div className="absolute inset-0 bg-black rounded-full opacity-20 blur-sm"></div>
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