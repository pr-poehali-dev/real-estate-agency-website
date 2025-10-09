import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Properties } from "@/lib/api";
import type { Property as ApiProperty } from "@/lib/api";
import Icon from "@/components/ui/icon";

interface Property extends ApiProperty {
  id: number;
  created_at: string;
  updated_at: string;
}

export default function Index() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionType, setTransactionType] = useState('rent');
  const [propertyType, setPropertyType] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [currency, setCurrency] = useState('AMD');
  const [rooms, setRooms] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [petsAllowed, setPetsAllowed] = useState('');
  const [childrenAllowed, setChildrenAllowed] = useState('');
  const [streetSearch, setStreetSearch] = useState('');
  
  const [contactForm, setContactForm] = useState({
    name: '',
    contact_method: 'telegram',
    contact_value: '',
    service_type: 'rent',
    message: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    
    const token = localStorage.getItem('admin_token');
    if (token && token.startsWith('demo-token-')) {
      const demoData = localStorage.getItem('demo_properties');
      const demoProps = demoData ? JSON.parse(demoData) : [];
      setProperties(demoProps.slice(0, 6));
      setLoading(false);
      return;
    }

    try {
      const response = await Properties.list();
      const props = (response.properties || []) as Property[];
      setProperties(props.slice(0, 6));
    } catch (err) {
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormSuccess(false);

    const message = `🏠 *Новая заявка с сайта WSE.AM*\n\n` +
      `👤 *Имя:* ${contactForm.name}\n` +
      `📞 *Способ связи:* ${contactForm.contact_method === 'telegram' ? 'Telegram' : contactForm.contact_method === 'phone' ? 'Телефон' : 'WhatsApp'}\n` +
      `📱 *Контакт:* ${contactForm.contact_value}\n` +
      `🏡 *Тип услуги:* ${contactForm.service_type === 'rent' ? 'Аренда квартир' : contactForm.service_type === 'sale' ? 'Покупка недвижимости' : 'Консультация'}\n` +
      `💬 *Сообщение:* ${contactForm.message || 'Не указано'}`;

    try {
      const TELEGRAM_BOT_TOKEN = '7777777777:AAHexampleTokenHere';
      const TELEGRAM_CHAT_ID = '-1001234567890';
      
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      setFormSuccess(true);
      setContactForm({
        name: '',
        contact_method: 'telegram',
        contact_value: '',
        service_type: 'rent',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  const handleSearch = () => {
    const filters = {
      selectedTransaction: transactionType === 'rent' ? 'rent' : transactionType === 'sale' ? 'sale' : '',
      selectedType: propertyType === 'all' ? '' : propertyType,
      maxPrice: maxPrice,
      minPrice: minPrice,
      currency: currency,
      rooms: rooms,
      amenities: amenities,
      petsAllowed: petsAllowed,
      childrenAllowed: childrenAllowed,
      streetSearch: streetSearch
    };
    localStorage.setItem('map_filters', JSON.stringify(filters));
    navigate('/map');
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto animate-in fade-in slide-in-from-top duration-700">
        <Link to="/admin" className="text-3xl font-black text-[#FF7A00] cursor-pointer hover:scale-110 transition-transform duration-300">WSE.AM</Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/map" className="text-gray-800 hover:text-[#FF7A00] hover:scale-110 transition-all duration-300">Карта</Link>
          <a href="#contact" className="text-gray-800 hover:text-[#FF7A00] hover:scale-110 transition-all duration-300">Контакты</a>
          <Button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#FF7A00] hover:bg-[#E66D00] hover:scale-105 text-white rounded-xl px-6 transition-all duration-300"
          >
            Связаться
          </Button>
        </nav>
      </header>

      {/* Compact Search Section */}
      <section className="relative px-6 py-4 max-w-7xl mx-auto">
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-4">Поиск недвижимости в Ереване</h1>

          {/* Search Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="space-y-4">
              {/* Row 1: Transaction Type & Property Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">Долгосрочная аренда</SelectItem>
                    <SelectItem value="sale">Продажа</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Тип недвижимости" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    <SelectItem value="apartment">Квартира</SelectItem>
                    <SelectItem value="house">Дом</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Row 2: Price Range */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  type="number"
                  placeholder="Цена от"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="h-10 rounded-lg"
                />
                <Input
                  type="number"
                  placeholder="Цена до"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-10 rounded-lg"
                />
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AMD">AMD</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Row 3: Rooms & Street Search */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select value={rooms} onValueChange={setRooms}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Количество комнат" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Любое</SelectItem>
                    <SelectItem value="1">1 комната</SelectItem>
                    <SelectItem value="2">2 комнаты</SelectItem>
                    <SelectItem value="3">3 комнаты</SelectItem>
                    <SelectItem value="4+">4+ комнат</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="text"
                  placeholder="Поиск по улице"
                  value={streetSearch}
                  onChange={(e) => setStreetSearch(e.target.value)}
                  className="h-10 rounded-lg"
                />
              </div>

              {/* Row 4: Amenities */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Удобства</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="wifi" 
                      checked={amenities.includes('wifi')}
                      onCheckedChange={() => toggleAmenity('wifi')}
                    />
                    <label htmlFor="wifi" className="text-sm cursor-pointer">WiFi</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="parking" 
                      checked={amenities.includes('parking')}
                      onCheckedChange={() => toggleAmenity('parking')}
                    />
                    <label htmlFor="parking" className="text-sm cursor-pointer">Парковка</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="elevator" 
                      checked={amenities.includes('elevator')}
                      onCheckedChange={() => toggleAmenity('elevator')}
                    />
                    <label htmlFor="elevator" className="text-sm cursor-pointer">Лифт</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="balcony" 
                      checked={amenities.includes('balcony')}
                      onCheckedChange={() => toggleAmenity('balcony')}
                    />
                    <label htmlFor="balcony" className="text-sm cursor-pointer">Балкон</label>
                  </div>
                </div>
              </div>

              {/* Row 5: Additional Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select value={petsAllowed} onValueChange={setPetsAllowed}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Разрешены ли питомцы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Не важно</SelectItem>
                    <SelectItem value="yes">Разрешены</SelectItem>
                    <SelectItem value="no">Не разрешены</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={childrenAllowed} onValueChange={setChildrenAllowed}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Разрешены ли дети" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Не важно</SelectItem>
                    <SelectItem value="yes">Разрешены</SelectItem>
                    <SelectItem value="no">Не разрешены</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                className="w-full h-12 bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-lg font-medium transition-all text-base"
              >
                Найти недвижимость
              </Button>
            </div>
          </div>
        </div>


      </section>

      {/* Recently Added */}
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

      {/* Map Preview Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom duration-700">
          <h2 className="text-4xl font-bold mb-4">Найдите на карте</h2>
          <p className="text-xl text-gray-600">Все объекты недвижимости в Ереване на интерактивной карте</p>
        </div>
        
        <Link to="/full-map" className="block group">
          <div className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 animate-in fade-in zoom-in duration-700 delay-300">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48624.58415456418!2d44.47379!3d40.18111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406abd39496ad82b%3A0x2e2579e7e2d4621b!2sYerevan%2C%20Armenia!5e0!3m2!1sen!2s!4v1234567890"
              className="w-full h-[500px] pointer-events-none"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-12 group-hover:from-black/40 transition-all duration-500">
              <div className="bg-[#FF7A00] hover:bg-[#E66D00] text-white px-8 py-4 rounded-full text-lg font-bold flex items-center gap-3 shadow-2xl group-hover:scale-110 transition-all duration-300">
                <Icon name="Map" size={24} />
                Показать на карте
                <Icon name="ArrowRight" size={24} />
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center animate-in fade-in slide-in-from-bottom duration-700">Свяжитесь с нами</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-[#F5F3EE] rounded-2xl p-8 animate-in fade-in slide-in-from-left duration-700 delay-300 hover:shadow-xl transition-shadow duration-300">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Имя</label>
                  <Input
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    placeholder="Ваше имя"
                    required
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Способ связи</label>
                  <Select value={contactForm.contact_method} onValueChange={(value) => setContactForm({...contactForm, contact_method: value})}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="telegram">Telegram</SelectItem>
                      <SelectItem value="phone">Телефон</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Контакт (Telegram)</label>
                  <Input
                    value={contactForm.contact_value}
                    onChange={(e) => setContactForm({...contactForm, contact_value: e.target.value})}
                    placeholder="@username или +7..."
                    required
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Тип услуги</label>
                  <Select value={contactForm.service_type} onValueChange={(value) => setContactForm({...contactForm, service_type: value})}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">Аренда</SelectItem>
                      <SelectItem value="sale">Покупка</SelectItem>
                      <SelectItem value="consultation">Консультация</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Сообщение</label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    placeholder="Расскажите о ваших требованиях..."
                    rows={4}
                    className="rounded-xl"
                  />
                </div>

                {formSuccess && (
                  <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm">
                    Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={formLoading}
                  className="w-full h-12 bg-[#FF7A00] hover:bg-[#E66D00] hover:scale-105 text-white rounded-xl text-base font-medium transition-all duration-300"
                >
                  {formLoading ? 'Отправка...' : 'Отправить заявку'}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-700 delay-300">
              <h3 className="text-2xl font-bold mb-6">Свяжитесь с нами</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0 hover:rotate-12 transition-transform duration-300">
                    <Icon name="Phone" size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Телефон</p>
                    <a href="tel:+37495129260" className="text-[#FF7A00] text-lg font-semibold hover:underline">
                      +374 95129260
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0 hover:rotate-12 transition-transform duration-300">
                    <Icon name="Send" size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Telegram</p>
                    <a href="https://t.me/WSEManager" target="_blank" rel="noopener noreferrer" className="text-[#FF7A00] text-lg font-semibold hover:underline">
                      WSEManager
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0 hover:rotate-12 transition-transform duration-300">
                    <Icon name="Instagram" size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Instagram</p>
                    <a href="https://instagram.com/w.s.e._am" target="_blank" rel="noopener noreferrer" className="text-[#FF7A00] text-lg font-semibold hover:underline">
                      w.s.e._am
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0 hover:rotate-12 transition-transform duration-300">
                    <Icon name="MapPin" size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Адрес</p>
                    <p className="text-[#FF7A00] text-lg font-semibold">
                      Ереван ул. Хоренаци 47/7
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F5F3EE] rounded-2xl p-6 mt-8">
                <h4 className="font-bold mb-4">Режим работы</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Пн-Пт:</span>
                    <span className="font-medium">11:00 - 19:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Сб:</span>
                    <span className="font-medium">10:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Вс:</span>
                    <span className="font-medium">Выходной</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="services" className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-[#FF7A00] mb-4">WSE.AM</h3>
              <p className="text-gray-400">
                Ваш надёжный партнёр в мире недвижимости Еревана
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Услуги</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Аренда квартир</li>
                <li>Покупка недвижимости</li>
                <li>Консультации</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Свяжитесь с нами</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Телефон: <a href="tel:+37495129260" className="text-[#FF7A00] hover:underline">+374 95129260</a></li>
                <li>Telegram: <a href="https://t.me/WSEManager" className="text-[#FF7A00] hover:underline">WSEManager</a></li>
                <li>Instagram: <a href="https://instagram.com/w.s.e._am" className="text-[#FF7A00] hover:underline">w.s.e._am</a></li>
                <li className="text-[#FF7A00]">Ереван ул. Хоренаци 47/7</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <Link to="/admin" className="hover:text-[#FF7A00] transition-colors cursor-pointer">
              © 2023 WSE.AM. Все права защищены.
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}