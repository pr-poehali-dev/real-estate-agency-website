import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Properties } from "@/lib/api";
import type { Property as ApiProperty } from "@/lib/api";
import Icon from "@/components/ui/icon";

interface Property extends ApiProperty {
  id: number;
  created_at: string;
  updated_at: string;
}

export default function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    
    const token = localStorage.getItem('admin_token');
    if (token && token.startsWith('demo-token-')) {
      const demoData = localStorage.getItem('demo_properties');
      const demoProps = demoData ? JSON.parse(demoData) : [];
      const found = demoProps.find((p: Property) => p.id === Number(id));
      setProperty(found || null);
      setLoading(false);
      return;
    }

    try {
      const response = await Properties.list();
      const props = (response.properties || []) as Property[];
      const found = props.find(p => p.id === Number(id));
      setProperty(found || null);
    } catch (err) {
      console.error('Error loading property:', err);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  const nextImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Объект не найден</h1>
          <Link to="/">
            <Button className="bg-[#FF7A00] hover:bg-[#E66D00] text-white">
              Вернуться на главную
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      {/* Header */}
      <header className="bg-white px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">WSE.AM</Link>
          <Button 
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {property.images && property.images.length > 0 ? (
              <div className="relative">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-[500px] object-cover rounded-2xl"
                />
                
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg"
                    >
                      <Icon name="ChevronLeft" size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg"
                    >
                      <Icon name="ChevronRight" size={24} />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-[500px] bg-gray-200 rounded-2xl flex items-center justify-center">
                <span className="text-gray-400 text-xl">Нет фото</span>
              </div>
            )}
            
            {property.images && property.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {property.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${property.title} - ${idx + 1}`}
                    className={`w-24 h-24 object-cover rounded-lg cursor-pointer ${
                      idx === currentImageIndex ? 'ring-4 ring-[#FF7A00]' : 'opacity-60 hover:opacity-100'
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl font-bold text-[#FF7A00]">
                {formatPrice(property.price, property.currency)}
              </span>
              {property.transaction_type === 'rent' && (
                <span className="text-xl text-gray-600">в месяц</span>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Основная информация</h2>
              <div className="grid grid-cols-2 gap-4">
                {property.rooms && (
                  <div className="flex items-center gap-3">
                    <Icon name="Home" size={24} className="text-[#FF7A00]" />
                    <div>
                      <p className="text-sm text-gray-600">Комнат</p>
                      <p className="font-semibold">{property.rooms}</p>
                    </div>
                  </div>
                )}
                
                {property.area && (
                  <div className="flex items-center gap-3">
                    <Icon name="Maximize" size={24} className="text-[#FF7A00]" />
                    <div>
                      <p className="text-sm text-gray-600">Площадь</p>
                      <p className="font-semibold">{property.area} м²</p>
                    </div>
                  </div>
                )}
                
                {property.floor && (
                  <div className="flex items-center gap-3">
                    <Icon name="Building" size={24} className="text-[#FF7A00]" />
                    <div>
                      <p className="text-sm text-gray-600">Этаж</p>
                      <p className="font-semibold">{property.floor}</p>
                    </div>
                  </div>
                )}
                
                {property.property_type && (
                  <div className="flex items-center gap-3">
                    <Icon name="Tag" size={24} className="text-[#FF7A00]" />
                    <div>
                      <p className="text-sm text-gray-600">Тип</p>
                      <p className="font-semibold capitalize">{property.property_type}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {property.address && (
              <div className="bg-white rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-bold mb-3">Адрес</h2>
                <div className="flex items-start gap-3">
                  <Icon name="MapPin" size={24} className="text-[#FF7A00] mt-1" />
                  <div>
                    <p className="text-lg">{property.address}</p>
                    {property.street_name && (
                      <p className="text-gray-600">{property.street_name}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {property.description && (
              <div className="bg-white rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-bold mb-3">Описание</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
              </div>
            )}

            <div className="flex gap-4">
              <a href="tel:+37495129260" className="flex-1">
                <Button className="w-full h-14 bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-xl text-lg font-medium">
                  <Icon name="Phone" size={20} className="mr-2" />
                  Позвонить
                </Button>
              </a>
              <a href="https://t.me/WSEManager" target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full h-14 bg-[#0088cc] hover:bg-[#006699] text-white rounded-xl text-lg font-medium">
                  <Icon name="Send" size={20} className="mr-2" />
                  Telegram
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-[#FF7A00] mb-4">WSE.AM</h3>
          <p className="text-gray-400 mb-4">Ваш надёжный партнёр в мире недвижимости Еревана</p>
          <div className="border-t border-gray-800 pt-6 text-gray-400 text-sm">
            <Link to="/admin" className="hover:text-[#FF7A00] transition-colors">
              © 2023 WSE.AM. Все права защищены.
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
