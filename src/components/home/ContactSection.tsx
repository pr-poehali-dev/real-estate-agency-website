import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";

export default function ContactSection() {
  const [contactForm, setContactForm] = useState({
    name: '',
    contact_method: 'telegram',
    contact_value: '',
    service_type: 'rent',
    message: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

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

  return (
    <section id="contact" className="px-6 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center animate-in fade-in slide-in-from-bottom duration-700">Свяжитесь с нами</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
  );
}
