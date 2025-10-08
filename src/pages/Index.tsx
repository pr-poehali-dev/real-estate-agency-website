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
  const [district, setDistrict] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  
  const districts = [
    'Аван', 'Аджапняк', 'Арабкир', 'Давташен', 'Канакер-Зейтун',
    'Малатия-Себастия', 'Нор Норк', 'Нубарашен', 'Центр', 'Шенгавит', 'Эребуни'
  ];
  
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="text-xl font-bold">WSE.AM</Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/map" className="text-gray-700 hover:text-[#FF7A00] transition-colors text-sm">Аренда</Link>
            <Link to="/map?transaction=sale" className="text-gray-700 hover:text-[#FF7A00] transition-colors text-sm">Продажа</Link>
            <a href="#contact" className="text-gray-700 hover:text-[#FF7A00] transition-colors text-sm">О компании</a>
            <Button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-lg px-6 h-9 text-sm"
            >
              Связаться
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-[#FAFAFA] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
          <div className="relative z-10 max-w-xl">
            <h1 className="text-4xl font-bold mb-2 leading-tight">
              Поиск недвижимости<br />в Ереване
            </h1>
            <p className="text-sm text-gray-600 mb-6">Найдите идеальный вариант</p>

            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-sm p-3">
              <div className="flex gap-2 mb-2">
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger className="h-10 rounded-md border-gray-200 text-sm flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">Аренда</SelectItem>
                    <SelectItem value="sale">Продажа</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-10 rounded-md border-gray-200 text-sm flex-1">
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
                  placeholder="Цена до, $"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-10 rounded-md border-gray-200 text-sm flex-1"
                />
              </div>
              
              <Link to="/map">
                <Button className="w-full h-10 bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-md text-sm font-medium">
                  Найти
                </Button>
              </Link>
            </div>
            
            {/* Category Buttons */}
            <div className="flex gap-2 mt-4">
              <Link to="/map?type=apartment">
                <Button className="bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-md px-6 h-9 text-sm font-medium">
                  КВАРТИРЫ
                </Button>
              </Link>
              <Link to="/map?type=house">
                <Button className="bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-md px-6 h-9 text-sm font-medium">
                  ДОМА
                </Button>
              </Link>
              <Link to="/map?type=commercial">
                <Button className="bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-md px-6 h-9 text-sm font-medium">
                  КОММЕРЧЕСКАЯ
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mountain Illustration */}
        <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none">
          <svg viewBox="0 0 700 250" className="w-full h-full" preserveAspectRatio="xMaxYMax slice">
            <path d="M 100 150 Q 200 80 280 120 L 380 80 L 480 130 L 600 70 L 700 100 L 700 250 L 0 250 Z" fill="#FF7A00" opacity="0.95"/>
            <path d="M 0 180 L 150 130 Q 250 100 350 140 L 500 110 L 700 140 L 700 250 L 0 250 Z" fill="#FF9933" opacity="0.8"/>
          </svg>
        </div>
      </section>

      {/* Recently Added */}
      <section className="px-6 py-8 max-w-7xl mx-auto bg-white">
        <h2 className="text-2xl font-bold mb-6">Недавно добавленные</h2>
        
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Нет фото</span>
                  </div>
                )}
                
                <div className="p-4">
                  <p className="text-xl font-bold text-gray-900 mb-1">
                    {formatPrice(property.price, property.currency)}
                    {property.transaction_type === 'rent' && <span className="text-sm font-normal"> в месяц</span>}
                  </p>
                  
                  <p className="text-gray-600 text-sm mb-2">
                    {property.street_name || property.address}
                  </p>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500">
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
            © 2023 WSE.AM. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}