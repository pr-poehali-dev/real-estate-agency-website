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

  return (
    <div className="w-1/2 border-l border-gray-200 bg-white flex flex-col">
      <div className="px-6 pt-6 pb-6 flex flex-col h-full">
        <h3 className="font-bold text-xl mb-4">Другие объекты ({properties.length})</h3>
        
        {properties.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Нет объектов с такими параметрами</p>
        ) : (
          <div className="overflow-y-auto pr-2 space-y-4" style={{ maxHeight: 'calc(9 * 196px)' }}>
            {properties.map((prop) => (
              <Link 
                key={prop.id} 
                to={`/property/${prop.id}`}
                className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow h-[180px] flex-shrink-0"
              >
                <div className="flex gap-4 p-4 h-full">
                  <img 
                    src={prop.images?.[0] || '/placeholder.jpg'} 
                    alt={prop.title}
                    className="w-[150px] h-full object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-lg line-clamp-2 flex-1 pr-2">{prop.title}</h4>
                      {prop.created_at && (
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatDate(prop.created_at)}
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-[#FF7A00] mb-2">
                      {formatPrice(prop.price, prop.currency)}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-600 mb-2">
                      {prop.rooms && <span>{prop.rooms} комн.</span>}
                      {prop.area && <span>{prop.area} м²</span>}
                      {prop.floor && prop.total_floors && <span>{prop.floor}/{prop.total_floors} этаж</span>}
                    </div>
                    {prop.address && (
                      <p className="text-sm text-gray-500 mt-auto line-clamp-1">
                        <Icon name="MapPin" size={14} className="inline mr-1" />
                        {prop.address}
                      </p>
                    )}
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
