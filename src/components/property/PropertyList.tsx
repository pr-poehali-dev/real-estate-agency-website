import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
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

  const getTransactionBadge = (type: string) => {
    const badges = {
      rent: { text: 'Аренда', color: 'bg-blue-100 text-blue-700' },
      daily_rent: { text: 'Посуточно', color: 'bg-purple-100 text-purple-700' },
      sale: { text: 'Продажа', color: 'bg-green-100 text-green-700' }
    };
    return badges[type as keyof typeof badges] || { text: 'Аренда', color: 'bg-gray-100 text-gray-700' };
  };

  return (
    <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-gray-200 bg-white flex flex-col overflow-hidden">
      <div className="px-4 md:px-6 pt-4 md:pt-6 pb-6 flex flex-col h-full">
        <h3 className="font-bold text-lg md:text-xl mb-4">Другие объекты ({properties.length})</h3>
        
        {properties.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Нет объектов с такими параметрами</p>
        ) : (
          <div className="overflow-y-auto overflow-x-hidden pr-2 space-y-4 flex-1">
            {properties.map((prop) => (
              <Link 
                key={prop.id} 
                to={`/property/${prop.id}`}
                className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200"
              >
                <div className="flex gap-4 p-3">
                  <div className="w-32 h-32 flex-shrink-0 relative">
                    <img 
                      src={prop.images?.[0] || '/placeholder.jpg'} 
                      alt={prop.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {prop.transaction_type && (
                      <span className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold ${getTransactionBadge(prop.transaction_type).color}`}>
                        {getTransactionBadge(prop.transaction_type).text}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-base line-clamp-2 flex-1">
                          {prop.title}
                        </h4>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {formatDate(prop.created_at)}
                        </span>
                      </div>
                      
                      <p className="text-2xl font-bold text-[#FF7A00] mb-3">
                        {formatPrice(prop.price, prop.currency)}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        {prop.rooms && (
                          <span className="flex items-center gap-1">
                            <Icon name="DoorClosed" size={16} className="text-gray-400" />
                            {prop.rooms} комн.
                          </span>
                        )}
                        {prop.area && (
                          <span className="flex items-center gap-1">
                            <Icon name="Maximize2" size={16} className="text-gray-400" />
                            {prop.area} м²
                          </span>
                        )}
                        {prop.floor && prop.total_floors && (
                          <span className="flex items-center gap-1">
                            <Icon name="Building2" size={16} className="text-gray-400" />
                            {prop.floor}/{prop.total_floors} эт
                          </span>
                        )}
                      </div>
                      
                      {prop.address && (
                        <p className="text-sm text-gray-500 flex items-start gap-1 line-clamp-1">
                          <Icon name="MapPin" size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                          <span>{prop.address}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}