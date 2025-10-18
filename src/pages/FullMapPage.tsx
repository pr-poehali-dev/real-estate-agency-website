import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import YerevanMapLeaflet from '@/components/YerevanMapLeaflet';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Properties } from '@/lib/api';
import type { Property as ApiProperty } from '@/lib/api';

interface Property extends ApiProperty {
  id: number;
  created_at: string;
  updated_at: string;
}

const FullMapPage: React.FC = () => {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const propertyRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const loadProperties = async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('admin_token');
    
    if (token && token.startsWith('demo-token-')) {
      const demoData = localStorage.getItem('demo_properties');
      const demoProps = demoData ? JSON.parse(demoData) : [];
      setAllProperties(demoProps);
      setLoading(false);
      return;
    }

    try {
      const response = await Properties.list();
      const props = (response.properties || []) as Property[];
      setAllProperties(props);
    } catch (err: any) {
      console.error('Error loading properties:', err);
      setError(err.message || 'Не удалось загрузить объекты');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    if (selectedProperty && propertyRefs.current[selectedProperty.id]) {
      propertyRefs.current[selectedProperty.id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [selectedProperty]);

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setShowSidebar(true);
  };

  const handlePropertyClick = (propertyId: number) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="h-screen flex bg-white relative">
      {/* Sidebar with properties list */}
      <aside 
        className={`absolute left-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-[1001] transform transition-transform duration-300 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="border-b px-6 py-4 flex items-center justify-between bg-white sticky top-0 z-10">
            <h2 className="text-lg font-bold text-gray-900">Объявления</h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Properties List */}
          <div className="flex-1 overflow-y-auto p-4">
            {allProperties.length > 0 ? (
              <div className="space-y-4">
                {allProperties
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((property) => (
                    <div
                      key={property.id}
                      ref={(el) => { propertyRefs.current[property.id] = el; }}
                      className={`bg-white rounded-xl overflow-hidden border hover:shadow-lg transition-all duration-300 cursor-pointer ${
                        selectedProperty?.id === property.id ? 'ring-2 ring-[#FF7A00] shadow-lg' : 'border-gray-200'
                      }`}
                      onClick={() => handlePropertyClick(property.id)}
                    >
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">Нет фото</span>
                        </div>
                      )}
                      
                      <div className="p-4">
                        <p className="text-xl font-bold text-[#FF7A00] mb-2">
                          {formatPrice(property.price, property.currency)}
                          {property.transaction_type === 'rent' && <span className="text-sm font-normal text-gray-600"> /мес</span>}
                        </p>
                        
                        <p className="text-gray-900 font-medium mb-2 line-clamp-2 text-sm">
                          {property.title}
                        </p>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                          {property.rooms && <span>{property.rooms} комн.</span>}
                          {property.area && <span>• {property.area} м²</span>}
                          {property.floor && <span>• {property.floor} эт.</span>}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Icon name="MapPin" size={12} />
                          <span className="truncate">
                            {property.street_name ? `${property.street_name} ${property.house_number || ''}` : property.district}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Icon name="Search" size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm">Объекты не найдены</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Toggle sidebar button */}
      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="absolute left-4 top-4 z-[1000] bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg shadow-lg transition-all hover:shadow-xl flex items-center gap-2"
        >
          <Icon name="List" size={20} />
          <span className="font-medium">Показать объявления</span>
        </button>
      )}

      {/* Back button */}
      <Link 
        to="/"
        className="absolute left-4 bottom-4 z-[1000] bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg shadow-lg transition-all hover:shadow-xl flex items-center gap-2"
      >
        <Icon name="ArrowLeft" size={20} />
        <span className="font-medium">Назад</span>
      </Link>

      {/* Map - Full screen */}
      <div className="w-full h-full">
        <YerevanMapLeaflet
          properties={allProperties}
          onPropertySelect={handlePropertySelect}
          openOnClick={true}
        />
      </div>

      {error && (
        <div className="absolute top-4 right-4 z-[1000] bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 shadow-lg">
          <Icon name="AlertCircle" size={20} />
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadProperties}
            className="ml-2"
          >
            Повторить
          </Button>
        </div>
      )}
    </div>
  );
};

export default FullMapPage;