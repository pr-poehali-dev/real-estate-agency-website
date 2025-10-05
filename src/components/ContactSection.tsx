import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { useState } from "react";

interface ContactSectionProps {
  t: any;
  isVisible: any;
  language: 'ru' | 'en';
}

export default function ContactSection({ t, isVisible, language }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    contactMethod: 'Telegram',
    contact: '',
    service: 'Аренда',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://functions.poehali.dev/09d9ff7b-b72a-40eb-ac66-289fa2f53b56', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          contactMethod: formData.contactMethod,
          contact: formData.contact,
          service: formData.service,
          message: formData.message
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        alert(language === 'ru' 
          ? 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.' 
          : 'Request sent successfully! We will contact you soon.'
        );
        
        setFormData({
          name: '',
          contactMethod: 'Telegram',
          contact: '',
          service: language === 'ru' ? 'Аренда' : 'Rental',
          message: ''
        });
      } else {
        throw new Error(result.error || 'Failed to send');
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      
      const telegramLink = `https://t.me/WSEManager?text=${encodeURIComponent(
        `Новая заявка:\n\nИмя: ${formData.name}\n${formData.contactMethod}: ${formData.contact}\nУслуга: ${formData.service}\nСообщение: ${formData.message}`
      )}`;
      
      if (confirm(language === 'ru' 
        ? 'Не удалось отправить форму. Открыть Telegram для связи?' 
        : 'Failed to submit form. Open Telegram to contact?'
      )) {
        window.open(telegramLink, '_blank');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-20 px-6" data-animate>
      <div className={`container mx-auto max-w-4xl transition-all duration-1000 delay-500 ${isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-4xl font-bold font-montserrat text-center mb-16 text-black">
          {t.contact.title}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="p-8">
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.contact.form.name}</label>
                    <Input 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t.contact.form.namePlaceholder} 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Способ связи</label>
                    <select 
                      name="contactMethod"
                      value={formData.contactMethod}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option>Telegram</option>
                      <option>WhatsApp</option>
                      <option>Viber</option>
                      <option>Email</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {formData.contactMethod === 'Email' ? 'Email' : `Контакт (${formData.contactMethod})`}
                    </label>
                    <Input 
                      name="contact"
                      type={formData.contactMethod === 'Email' ? 'email' : 'text'}
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder={
                        formData.contactMethod === 'Email' 
                          ? 'your@email.com' 
                          : formData.contactMethod === 'Telegram' 
                            ? '@username или +7...' 
                            : '+7...'
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.contact.form.serviceType}</label>
                    <select 
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option>Аренда</option>
                      <option>Покупка</option>
                      <option>Продажа</option>
                      <option>Консультация</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.contact.form.message}</label>
                    <Textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t.contact.form.messagePlaceholder} 
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-3">
                    {t.contact.form.submit}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold font-montserrat mb-6">{t.contact.title}</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Icon name="Phone" size={24} className="text-primary" />
                  <div>
                    <div className="font-medium">{t.contact.phone}</div>
                    <a href="tel:+37495129260" className="text-primary hover:underline">+374 95129260</a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Icon name="MessageCircle" size={24} className="text-primary" />
                  <div>
                    <div className="font-medium">Telegram</div>
                    <a href="https://t.me/WSEManager" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">WSEManager</a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Icon name="Instagram" size={24} className="text-primary" />
                  <div>
                    <div className="font-medium">Instagram</div>
                    <a href="https://www.instagram.com/w.s.e._am/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">w.s.e._am</a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Icon name="MapPin" size={24} className="text-primary" />
                  <div>
                    <div className="font-medium">Адрес</div>
                    <a href="https://yandex.com/maps/org/white_safe_estate/194631976201/?ll=44.516867%2C40.165353&z=20.23" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ереван ул. Хоренаци 47/7</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-3">{t.contact.workHours}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t.contact.monday}</span>
                  <span>11:00 - 19:00</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.contact.saturday}</span>
                  <span>10:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.contact.sunday}</span>
                  <span>{t.contact.closed}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
