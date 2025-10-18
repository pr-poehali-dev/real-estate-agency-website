import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import FavoriteButton from "@/components/FavoriteButton";
import type { Property as ApiProperty } from "@/lib/api";

interface Property extends ApiProperty {
  id: number;
  created_at: string;
  updated_at: string;
}

interface PropertyListProps {
  properties: Property[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  const [sortBy, setSortBy] = useState<'date' | 'price_asc' | 'price_desc'>('date');

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
  };

  const isNew = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 3;
  };

  const sortedProperties = [...properties].sort((a, b) => {
    if (sortBy === 'price_asc') {
      return a.price - b.price;
    } else if (sortBy === 'price_desc') {
      return b.price - a.price;
    } else {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    }
  });

  return (
    <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-gray-200 bg-gradient-to-br from-white to-gray-50 flex flex-col">
      <div className="px-4 md:px-6 pt-4 md:pt-6 pb-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg md:text-xl">
            Найдено: <span className="text-[#FF7A00]">{properties.length}</span>
          </h3>
          <div className="flex items-center gap-2">
            <Icon name="ArrowDownUp" size={14} className="text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs md:text-sm font-semibold border-2 border-gray-200 rounded-lg px-2 md:px-3 py-1.5 md:py-2 bg-white hover:border-[#FF7A00] focus:border-[#FF7A00] focus:outline-none transition-colors"
            >
              <option value="date">Новые</option>
              <option value="price_asc">Дешевле</option>
              <option value="price_desc">Дороже</option>
            </select>
          </div>
        </div>
        
        {properties.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Нет объектов с такими параметрами</p>
        ) : (
          <div className="overflow-y-auto pr-2 space-y-3 md:space-y-4" style={{ maxHeight: 'calc(9 * 196px)' }}>
            {sortedProperties.map((prop) => (
              <div key={prop.id} className="relative group">
                <Link 
                  to={`/property/${prop.id}`}
                  className="block bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-[#FF7A00]/30 hover:-translate-y-1 transition-all duration-300 h-[140px] md:h-[180px] flex-shrink-0"
                >
                  <div className="flex gap-3 md:gap-4 p-3 md:p-4 h-full">
                    <div className="relative w-[110px] md:w-[150px] h-full flex-shrink-0">
                      <img 
                        src={prop.images?.[0] || '/placeholder.jpg'} 
                        alt={prop.title}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      {prop.created_at && isNew(prop.created_at) && (
                        <div className="absolute top-1 left-1 bg-[#FF7A00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ✨ Новое
                        </div>
                      )}
                      {prop.images && prop.images.length > 1 && (
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Icon name="Image" size={10} />
                          <span>{prop.images.length}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between mb-1 md:mb-2">
                        <h4 className="font-bold text-sm md:text-base line-clamp-2 flex-1 pr-2">{prop.title}</h4>
                      </div>
                      <p className="text-lg md:text-xl font-extrabold bg-gradient-to-r from-[#FF7A00] to-[#FF5500] bg-clip-text text-transparent mb-1 md:mb-2">
                        {formatPrice(prop.price, prop.currency)}
                      </p>
                      <div className="flex gap-2 md:gap-3 text-xs md:text-sm text-gray-600 mb-1 md:mb-2">
                        {prop.rooms && (
                          <div className="flex items-center gap-0.5">
                            <Icon name="Bed" size={12} className="text-gray-400" />
                            <span>{prop.rooms}</span>
                          </div>
                        )}
                        {prop.area && (
                          <div className="flex items-center gap-0.5">
                            <Icon name="Maximize2" size={12} className="text-gray-400" />
                            <span>{prop.area} м²</span>
                          </div>
                        )}
                        {prop.floor && prop.total_floors && (
                          <div className="flex items-center gap-0.5">
                            <Icon name="Building2" size={12} className="text-gray-400" />
                            <span>{prop.floor}/{prop.total_floors}</span>
                          </div>
                        )}
                      </div>
                      {prop.address && (
                        <p className="text-xs md:text-sm text-gray-500 mt-auto line-clamp-1 flex items-center gap-1">
                          <Icon name="MapPin" size={12} className="text-gray-400 flex-shrink-0" />
                          <span className="truncate">{prop.address}</span>
                        </p>
                      )}
                      {prop.created_at && (
                        <span className="text-[10px] text-gray-400 mt-1">
                          📅 {formatDate(prop.created_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FavoriteButton propertyId={prop.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}