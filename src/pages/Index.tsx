import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Properties } from "@/lib/api";
import type { Property as ApiProperty } from "@/lib/api";
import Icon from "@/components/ui/icon";

interface Property extends ApiProperty {
  id: number;
  created_at: string;
  updated_at: string;
}

export default function Index() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionType, setTransactionType] = useState('rent');
  const [propertyType, setPropertyType] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [activeTab, setActiveTab] = useState('apartment');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    
    const token = localStorage.getItem('admin_token');
    if (token && token.startsWith('demo-token-')) {
      const demoData = localStorage.getItem('demo_properties');
      const demoProps = demoData ? JSON.parse(demoData) : [];
      setProperties(demoProps.slice(0, 3));
      setLoading(false);
      return;
    }

    try {
      const response = await Properties.list();
      const props = (response.properties || []) as Property[];
      setProperties(props.slice(0, 3));
    } catch (err) {
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-[20px] font-bold text-[#0B0B0B]">WSE.AM</Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/map" className="text-[#6B7280] hover:text-[#0B0B0B] transition-colors text-[14px]">Аренда</Link>
            <Link to="/map?transaction=sale" className="text-[#6B7280] hover:text-[#0B0B0B] transition-colors text-[14px]">Продажа</Link>
            <a href="#contact" className="text-[#6B7280] hover:text-[#0B0B0B] transition-colors text-[14px]">О компании</a>
            <a href="#reviews" className="text-[#6B7280] hover:text-[#0B0B0B] transition-colors text-[14px]">Отзывы</a>
            <Button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#F97316] hover:bg-[#EA6A0C] active:translate-y-[1px] text-white rounded-[12px] px-5 h-[40px] text-[14px] font-semibold shadow-none transition-all duration-200"
            >
              CTA
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-12">
          <div className="relative z-10 max-w-[600px]">
            <h1 className="text-[36px] font-bold mb-2 leading-[120%] text-[#0B0B0B]">
              Поиск недвижимости<br />в Ереване
            </h1>
            <p className="text-[14px] text-[#6B7280] mb-8">Найдите идеальный вариант</p>

            {/* Search Form */}
            <div className="bg-white rounded-[14px] shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-3 mb-4">
              <div className="grid grid-cols-4 gap-3">
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger className="h-12 rounded-[12px] border-[#E5E7EB] text-[14px] focus:border-[#F97316] focus:ring-[#F97316] focus:ring-opacity-25">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-[12px] shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
                    <SelectItem value="rent" className="focus:bg-[#FFF7ED] focus:text-[#F97316]">Аренда</SelectItem>
                    <SelectItem value="sale" className="focus:bg-[#FFF7ED] focus:text-[#F97316]">Продажа</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-12 rounded-[12px] border-[#E5E7EB] text-[14px] focus:border-[#F97316] focus:ring-[#F97316] focus:ring-opacity-25">
                    <SelectValue placeholder="Тип недвижимости" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[12px] shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
                    <SelectItem value="all" className="focus:bg-[#FFF7ED] focus:text-[#F97316]">Все типы</SelectItem>
                    <SelectItem value="apartment" className="focus:bg-[#FFF7ED] focus:text-[#F97316]">Квартира</SelectItem>
                    <SelectItem value="house" className="focus:bg-[#FFF7ED] focus:text-[#F97316]">Дом</SelectItem>
                    <SelectItem value="commercial" className="focus:bg-[#FFF7ED] focus:text-[#F97316]">Коммерческая</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Цена до, ֏"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-12 rounded-[12px] border-[#E5E7EB] text-[14px] focus:border-[#F97316] focus:ring-[#F97316] focus:ring-opacity-25"
                />
                
                <Link to="/map" className="w-full">
                  <Button className="w-full h-12 bg-[#F97316] hover:bg-[#EA6A0C] active:translate-y-[1px] text-white rounded-[12px] text-[14px] font-semibold transition-all duration-200">
                    Найти
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Category Tabs */}
            <div className="flex gap-3">
              <button 
                onClick={() => setActiveTab('apartment')}
                className={`h-[40px] px-5 rounded-full text-[14px] font-semibold transition-all duration-200 ${
                  activeTab === 'apartment' 
                    ? 'bg-[#F97316] text-white' 
                    : 'bg-white border border-[#F97316] text-[#F97316] hover:bg-[#FFF7ED]'
                }`}
              >
                КВАРТИРЫ
              </button>
              <button 
                onClick={() => setActiveTab('house')}
                className={`h-[40px] px-5 rounded-full text-[14px] font-semibold transition-all duration-200 ${
                  activeTab === 'house' 
                    ? 'bg-[#F97316] text-white' 
                    : 'bg-white border border-[#F97316] text-[#F97316] hover:bg-[#FFF7ED]'
                }`}
              >
                ДОМА
              </button>
              <button 
                onClick={() => setActiveTab('commercial')}
                className={`h-[40px] px-5 rounded-full text-[14px] font-semibold transition-all duration-200 ${
                  activeTab === 'commercial' 
                    ? 'bg-[#F97316] text-white' 
                    : 'bg-white border border-[#F97316] text-[#F97316] hover:bg-[#FFF7ED]'
                }`}
              >
                КОММЕРЧЕСКАЯ
              </button>
            </div>
          </div>
        </div>

        {/* Ararat Mountain Illustration */}
        <div className="absolute right-0 top-8 w-[50%] h-[280px] pointer-events-none flex items-center justify-center">
          <svg viewBox="0 0 600 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <path d="M 50 140 L 180 60 L 300 120 L 420 70 L 550 120 L 600 140 L 600 200 L 0 200 Z" fill="#F97316" opacity="1"/>
          </svg>
        </div>
      </section>

      {/* Recently Added */}
      <section className="px-6 py-16 max-w-[1200px] mx-auto bg-white">
        <h2 className="text-[22px] font-semibold mb-8 text-[#0B0B0B]">Недавно добавленные</h2>
        
        {loading ? (
          <div className="text-center py-12 text-[#6B7280]">Загрузка...</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 text-[#6B7280]">
            <p>Нет добавленных объектов</p>
            <Link to="/admin" className="text-[#F97316] hover:underline mt-2 inline-block">
              Добавить первый объект
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {properties.map((property) => (
              <div 
                key={property.id} 
                className="bg-white rounded-[16px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-200 cursor-pointer group"
              >
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-[180px] object-cover group-hover:scale-[1.01] transition-transform duration-200"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-[180px] bg-gray-200 flex items-center justify-center">
                    <span className="text-[#6B7280] text-[14px]">Нет фото</span>
                  </div>
                )}
                
                <div className="p-4">
                  <p className="text-[16px] font-bold text-[#0B0B0B] mb-1">
                    {formatPrice(property.price, property.currency)}
                    {property.transaction_type === 'rent' && <span className="text-[14px] font-normal"> в месяц</span>}
                  </p>
                  
                  <p className="text-[#6B7280] text-[14px] mb-3">
                    {property.street_name || property.address}
                  </p>
                  
                  <div className="flex items-center gap-3 text-[12px] text-[#6B7280]">
                    {property.rooms && (
                      <div className="flex items-center gap-1">
                        <Icon name="Home" size={16} className="text-[#6B7280]" />
                        <span>{property.rooms} комнат</span>
                      </div>
                    )}
                    {property.area && (
                      <div className="flex items-center gap-1">
                        <span>•</span>
                        <span>{property.area} м²</span>
                      </div>
                    )}
                    {property.floor && (
                      <div className="flex items-center gap-1">
                        <span>•</span>
                        <span>{property.floor} этаж</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-6">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-[13px] text-[#6B7280]">
          <p>© 2023 WSE.AM. Все права защищены.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#privacy" className="hover:text-[#0B0B0B] transition-colors">Политика конфиденциальности</a>
            <a href="#contact" className="hover:text-[#0B0B0B] transition-colors">Контакты</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
