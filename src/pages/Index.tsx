import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Properties } from "@/lib/api";
import type { Property as ApiProperty } from "@/lib/api";

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

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    
    const token = localStorage.getItem('admin_token');
    if (token && token.startsWith('demo-token-')) {
      const demoData = localStorage.getItem('demo_properties');
      const demoProps = demoData ? JSON.parse(demoData) : [];
      setProperties(demoProps);
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
    <div className="min-h-screen bg-[#F5F3EE]">
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold">WSE.AM</Link>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#rent" className="text-gray-800 hover:text-[#FF7A00] transition-colors">Аренда</a>
          <a href="#sale" className="text-gray-800 hover:text-[#FF7A00] transition-colors">Продажа</a>
          <a href="#about" className="text-gray-800 hover:text-[#FF7A00] transition-colors">О компании</a>
          <Button className="bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-xl px-6">
            CTA
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-12 pb-24 max-w-7xl mx-auto">
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Поиск недвижимости<br />в Ереване
          </h1>
          <p className="text-xl text-gray-600 mb-12">Найдите идеальный вариант</p>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">Аренда</SelectItem>
                  <SelectItem value="sale">Продажа</SelectItem>
                </SelectContent>
              </Select>

              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Тип недвижимости" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="apartment">Квартира</SelectItem>
                  <SelectItem value="house">Дом</SelectItem>
                  <SelectItem value="commercial">Коммерческая</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Цена до, ₽"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-12 rounded-xl"
              />

              <Button className="h-12 bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-xl text-base font-medium">
                Найти
              </Button>
            </div>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button 
              variant={propertyType === 'apartment' ? 'default' : 'outline'}
              onClick={() => setPropertyType('apartment')}
              className="bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-full px-8 h-12 text-base font-medium"
            >
              КВАРТИРЫ
            </Button>
            <Button 
              variant={propertyType === 'house' ? 'default' : 'outline'}
              onClick={() => setPropertyType('house')}
              className="bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-full px-8 h-12 text-base font-medium"
            >
              ДОМА
            </Button>
            <Button 
              variant={propertyType === 'commercial' ? 'default' : 'outline'}
              onClick={() => setPropertyType('commercial')}
              className="bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-full px-8 h-12 text-base font-medium"
            >
              КОММЕРЧЕСКАЯ
            </Button>
          </div>
        </div>

        {/* Mountain Illustration */}
        <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none">
          <svg viewBox="0 0 800 400" className="w-full h-full" preserveAspectRatio="xMaxYMid slice">
            <path d="M 0 250 Q 200 100 350 200 T 650 150 L 800 400 L 0 400 Z" fill="#FF7A00" opacity="0.9"/>
            <path d="M 100 300 Q 300 150 500 250 T 800 200 L 800 400 L 100 400 Z" fill="#FF7A00" opacity="0.7"/>
          </svg>
        </div>
      </section>

      {/* Recently Added */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Недавно добавленные</h2>
        
        {loading ? (
          <div className="text-center py-12 text-gray-500">Загрузка...</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Нет добавленных объектов</p>
            <Link to="/admin" className="text-[#FF7A00] hover:underline mt-2 inline-block">
              Добавить первый объект
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Нет фото</span>
                  </div>
                )}
                
                <div className="p-6">
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {formatPrice(property.price, property.currency)}
                    {property.transaction_type === 'rent' && <span className="text-base font-normal"> в месяц</span>}
                  </p>
                  
                  <p className="text-gray-700 font-medium mb-3">
                    {property.street_name || property.address}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {property.rooms && <span>{property.rooms} комнат</span>}
                    {property.area && <span>• {property.area} м²</span>}
                    {property.floor && <span>• {property.floor} этаж</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-400">© 2024 WSE.AM. Все права защищены</p>
        </div>
      </footer>
    </div>
  );
}
