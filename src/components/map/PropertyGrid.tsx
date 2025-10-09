import React from 'react';
import Icon from '@/components/ui/icon';
import type { Property as ApiProperty } from '@/lib/api';

interface Property extends ApiProperty {
  id: number;
  created_at: string;
  updated_at: string;
}

interface PropertyGridProps {
  properties: Property[];
  selectedPropertyId: number | null;
  propertyRefs: React.MutableRefObject<{ [key: number]: HTMLDivElement | null }>;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ properties, selectedPropertyId, propertyRefs }) => {
  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  if (properties.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Icon name="Search" size={64} className="mx-auto mb-4 opacity-30" />
        <p className="text-xl font-medium mb-2">Объекты не найдены</p>
        <p className="text-sm">Попробуйте изменить параметры фильтров</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 auto-rows-min">
      {properties
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map((property) => (
          <div
            key={property.id}
            ref={(el) => { propertyRefs.current[property.id] = el; }}
            className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col ${
              selectedPropertyId === property.id ? 'ring-4 ring-[#FF7A00]' : ''
            }`}
            onClick={() => window.location.href = `/property/${property.id}`}
          >
            {property.images && property.images.length > 0 ? (
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-36 object-cover"
              />
            ) : (
              <div className="w-full h-36 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Нет фото</span>
              </div>
            )}
            
            <div className="p-3 flex flex-col flex-1">
              <p className="text-lg font-bold text-[#FF7A00] mb-1">
                {formatPrice(property.price, property.currency)}
                {property.transaction_type === 'rent' && <span className="text-xs font-normal text-gray-600"> /мес</span>}
              </p>
              
              <p className="text-gray-900 font-medium mb-2 line-clamp-1 text-sm">
                {property.title}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                {property.rooms && <span>{property.rooms} комн.</span>}
                {property.area && <span>• {property.area} м²</span>}
                {property.floor && <span>• {property.floor} эт.</span>}
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-500 mt-auto">
                <Icon name="MapPin" size={12} />
                <span className="truncate">
                  {property.street_name ? `${property.street_name} ${property.house_number || ''}` : property.district}
                </span>
              </div>
            </div>
          </div>
      ))}
    </div>
  );
};

export default PropertyGrid;
