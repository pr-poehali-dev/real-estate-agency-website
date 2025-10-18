import React from 'react';
import Icon from '@/components/ui/icon';
import FavoriteButton from '@/components/FavoriteButton';
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

  const isNew = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 3;
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 auto-rows-min">
      {properties
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map((property, idx) => (
          <div
            key={property.id}
            ref={(el) => { propertyRefs.current[property.id] = el; }}
            className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl md:hover:-translate-y-2 md:hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col animate-fadeInUp delay-${Math.min((idx % 6) * 100, 500)} ${
              selectedPropertyId === property.id ? 'ring-4 ring-[#FF7A00]' : ''
            }`}
            onClick={() => window.location.href = `/property/${property.id}`}
          >
            <div className="relative overflow-hidden">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-44 sm:h-36 object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-44 sm:h-36 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Icon name="Image" size={32} className="text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
                {property.created_at && isNew(property.created_at) && (
                  <div className="bg-[#FF7A00] text-white text-xs font-semibold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-md">
                    ✨ Новое
                  </div>
                )}
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FavoriteButton propertyId={property.id} />
                </div>
              </div>
              
              {property.images && property.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Icon name="Image" size={12} />
                  <span>{property.images.length}</span>
                </div>
              )}
            </div>
            
            <div className="p-3 sm:p-3 flex flex-col flex-1">
              <p className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-[#FF7A00] to-[#FF5500] bg-clip-text text-transparent mb-1">
                {formatPrice(property.price, property.currency)}
                {property.transaction_type === 'rent' && <span className="text-xs font-semibold text-gray-600"> /мес</span>}
              </p>
              
              <p className="text-gray-900 font-medium mb-2 line-clamp-2 sm:line-clamp-1 text-sm">
                {property.title}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-2 flex-wrap">
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