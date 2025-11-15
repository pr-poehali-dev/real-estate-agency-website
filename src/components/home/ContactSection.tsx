import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";

export default function ContactSection() {
  const loadFormFromStorage = () => {
    try {
      const saved = localStorage.getItem('contact_form');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load contact form:', e);
    }
    return {
      name: '',
      contact_method: 'telegram',
      contact_value: '',
      service_type: 'rent',
      message: ''
    };
  };

  const [contactForm, setContactForm] = useState(loadFormFromStorage());
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('contact_form', JSON.stringify(contactForm));
  }, [contactForm]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormSuccess(false);

    try {
      const response = await fetch('https://functions.poehali.dev/09d9ff7b-b72a-40eb-ac66-289fa2f53b56', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactForm.name,
          contactMethod: contactForm.contact_method === 'telegram' ? 'Telegram' : contactForm.contact_method === 'phone' ? 'Телефон' : 'WhatsApp',
          contact: contactForm.contact_value,
          service: contactForm.service_type === 'rent' ? 'Аренда квартир' : contactForm.service_type === 'sale' ? 'Покупка недвижимости' : 'Консультация',
          message: contactForm.message || 'Не указано'
        })
      });

      if (response.ok) {
        setFormSuccess(true);
        const emptyForm = {
          name: '',
          contact_method: 'telegram',
          contact_value: '',
          service_type: 'rent',
          message: ''
        };
        setContactForm(emptyForm);
        localStorage.setItem('contact_form', JSON.stringify(emptyForm));
      } else {
        console.error('Failed to send form');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <section id="contact" className="px-4 md:px-6 py-8 md:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-center leading-tight animate-fadeInUp">Свяжитесь с нами</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 animate-slideInLeft shadow-sm border border-gray-100">
            <form onSubmit={handleContactSubmit} className="space-y-4 md:space-y-5">
              <div>
                <label className="block text-xs md:text-sm font-medium mb-2 md:mb-3 text-gray-600">Имя</label>
                <Input
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  placeholder="Ваше имя"
                  required
                  className="rounded-xl md:rounded-2xl h-12 md:h-14 border-gray-200 text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-2 md:mb-3 text-gray-600">Способ связи</label>
                <Select value={contactForm.contact_method} onValueChange={(value) => setContactForm({...contactForm, contact_method: value})}>
                  <SelectTrigger className="rounded-xl md:rounded-2xl h-12 md:h-14 border-gray-200 text-sm md:text-base">
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
                <label className="block text-xs md:text-sm font-medium mb-2 md:mb-3 text-gray-600">Контакт (Telegram)</label>
                <Input
                  value={contactForm.contact_value}
                  onChange={(e) => setContactForm({...contactForm, contact_value: e.target.value})}
                  placeholder="@username или +7..."
                  required
                  className="rounded-xl md:rounded-2xl h-12 md:h-14 border-gray-200 text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-2 md:mb-3 text-gray-600">Тип услуги</label>
                <Select value={contactForm.service_type} onValueChange={(value) => setContactForm({...contactForm, service_type: value})}>
                  <SelectTrigger className="rounded-xl md:rounded-2xl h-12 md:h-14 border-gray-200 text-sm md:text-base">
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
                <label className="block text-xs md:text-sm font-medium mb-2 md:mb-3 text-gray-600">Сообщение</label>
                <Textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  placeholder="Расскажите о ваших требованиях..."
                  rows={3}
                  className="rounded-xl md:rounded-2xl border-gray-200 text-sm md:text-base"
                />
              </div>

              {formSuccess && (
                <div className="bg-green-50 text-green-600 p-3 md:p-4 rounded-xl md:rounded-2xl text-xs md:text-sm">
                  Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
                </div>
              )}

              <Button 
                type="submit" 
                disabled={formLoading}
                className="w-full h-12 md:h-16 bg-[#FF7A00] hover:bg-[#E66D00] hover:opacity-90 text-white rounded-xl md:rounded-2xl text-sm md:text-base font-medium transition-all"
              >
                {formLoading ? 'Отправка...' : 'Отправить заявку'}
              </Button>
            </form>
          </div>

          <div ref={sectionRef} className="space-y-6 md:space-y-10">
            <h3 className="text-xl md:text-2xl font-bold leading-tight">Свяжитесь с нами</h3>
            
            <div className="space-y-5 md:space-y-8">
              <div className={`flex items-center gap-3 md:gap-5 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '100ms' }}>
                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Phone" size={20} className="md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium mb-0.5 md:mb-1 text-gray-600 text-sm md:text-base">Телефон</p>
                  <a href="tel:+37495129260" className="text-[#FF7A00] text-lg md:text-xl font-semibold hover:underline">
                    +374 95129260
                  </a>
                </div>
              </div>

              <div className={`flex items-center gap-3 md:gap-5 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '200ms' }}>
                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Send" size={20} className="md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium mb-0.5 md:mb-1 text-gray-600 text-sm md:text-base">Telegram</p>
                  <a href="https://t.me/WSEManager" target="_blank" rel="noopener noreferrer" className="text-[#FF7A00] text-lg md:text-xl font-semibold hover:underline">
                    WSEManager
                  </a>
                </div>
              </div>

              <div className={`flex items-center gap-3 md:gap-5 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '300ms' }}>
                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Star" size={20} className="md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium mb-0.5 md:mb-1 text-gray-600 text-sm md:text-base">Отзывы</p>
                  <a href="https://yandex.com/maps/org/wse_am/194631976201/reviews/?ll=44.516867%2C40.165353&z=20" target="_blank" rel="noopener noreferrer" className="text-[#FF7A00] text-lg md:text-xl font-semibold hover:underline">
                    Яндекс.Карты
                  </a>
                </div>
              </div>

              <div className={`flex items-center gap-3 md:gap-5 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '400ms' }}>
                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="MapPin" size={20} className="md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium mb-0.5 md:mb-1 text-gray-600 text-sm md:text-base">Адрес</p>
                  <p className="text-[#FF7A00] text-lg md:text-xl font-semibold">
                    Ереван ул. Хоренаци 47/7
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8 mt-8">
              <h4 className="font-bold mb-6 text-lg">Режим работы</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Пн-Пт:</span>
                  <span className="font-medium">11:00 - 19:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Сб:</span>
                  <span className="font-medium">Выходной</span>
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
  );
}