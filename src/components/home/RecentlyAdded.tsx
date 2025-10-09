import { Link } from "react-router-dom";
import type { Property as ApiProperty } from "@/lib/api";

interface Property extends ApiProperty {
  id: number;
  created_at: string;
  updated_at: string;
}

interface RecentlyAddedProps {
  properties: Property[];
  loading: boolean;
}

export default function RecentlyAdded({ properties, loading }: RecentlyAddedProps) {
  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-4">Недавно добавленные</h2>
      </div>
      
      {loading ? (
        <div className="text-center py-8 text-gray-500">Загрузка...</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Нет добавленных объектов</p>
          <Link to="/admin" className="text-[#FF7A00] hover:underline mt-2 inline-block">
            Добавить первый объект
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.slice(0, 3).map((property) => (
              <Link key={property.id} to={`/property/${property.id}`} className="block aspect-square">
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-[60%] object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-full h-[60%] bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 text-sm">Нет фото</span>
                    </div>
                  )}
                  
                  <div className="p-4 flex flex-col flex-1 h-[40%]">
                    <p className="text-lg font-bold text-[#FF7A00] mb-1">
                      {formatPrice(property.price, property.currency)}
                    </p>
                    
                    <p className="text-gray-900 font-medium mb-2 line-clamp-1 text-sm">
                      {property.street_name || property.address}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-600 mt-auto">
                      {property.rooms && <span>{property.rooms} комн.</span>}
                      {property.area && <span>• {property.area} м²</span>}
                      {property.floor && <span>• {property.floor} эт.</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
