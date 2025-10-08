import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/admin" className="text-3xl font-black text-[#FF7A00] cursor-pointer">WSE.AM</Link>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-gray-800 hover:text-[#FF7A00] transition-colors">Услуги</a>
          <Link to="/map" className="text-gray-800 hover:text-[#FF7A00] transition-colors">Карта</Link>
          <a href="#contact" className="text-gray-800 hover:text-[#FF7A00] transition-colors">Контакты</a>
          <Link to="/admin" className="text-gray-800 hover:text-[#FF7A00] transition-colors">Вход</Link>
          <Button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-xl px-6"
          >
            Связаться
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-12 pb-8 max-w-7xl mx-auto">
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
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Цена до"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-12 rounded-xl"
              />

              <Link to="/map">
                <Button className="w-full h-12 bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-xl text-base font-medium">
                  Найти
                </Button>
              </Link>
            </div>
          </div>

          {/* Transaction Type Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link to="/map?transaction=rent">
              <Button className="bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-full px-8 h-12 text-base font-medium">
                АРЕНДА
              </Button>
            </Link>
            <Link to="/map?transaction=sale">
              <Button className="bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-full px-8 h-12 text-base font-medium">
                ПРОДАЖА
              </Button>
            </Link>
          </div>
        </div>


      </section>

      {/* Recently Added */}
      <section className="px-6 py-8 max-w-7xl mx-auto">
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
              <Link key={property.id} to={`/property/${property.id}`} className="block h-full">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full flex flex-col">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-56 object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400">Нет фото</span>
                    </div>
                  )}
                  
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-2xl font-bold text-gray-900 mb-2">
                      {formatPrice(property.price, property.currency)}
                      {property.transaction_type === 'rent' && <span className="text-base font-normal"> в месяц</span>}
                    </p>
                    
                    <p className="text-gray-700 font-medium mb-3 line-clamp-2">
                      {property.street_name || property.address}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-auto">
                      {property.rooms && <span>{property.rooms} комнат</span>}
                      {property.area && <span>• {property.area} м²</span>}
                      {property.floor && <span>• {property.floor} этаж</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Свяжитесь с нами</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-[#F5F3EE] rounded-2xl p-8">
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
                  className="w-full h-12 bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-xl text-base font-medium"
                >
                  {formLoading ? 'Отправка...' : 'Отправить заявку'}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold mb-6">Свяжитесь с нами</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Phone" size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Телефон</p>
                    <a href="tel:+37495129260" className="text-[#FF7A00] text-lg font-semibold hover:underline">
                      +374 95129260
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Send" size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Telegram</p>
                    <a href="https://t.me/WSEManager" target="_blank" rel="noopener noreferrer" className="text-[#FF7A00] text-lg font-semibold hover:underline">
                      WSEManager
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Instagram" size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Instagram</p>
                    <a href="https://instagram.com/w.s.e._am" target="_blank" rel="noopener noreferrer" className="text-[#FF7A00] text-lg font-semibold hover:underline">
                      w.s.e._am
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0">
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