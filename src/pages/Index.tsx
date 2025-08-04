import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { useState, useEffect } from "react";
import emailjs from 'emailjs-com';

const translations = {
  ru: {
    nav: {
      about: 'О нас',
      services: 'Услуги',
      contact: 'Контакты',
      submitRequest: 'Оставить заявку'
    },
    hero: {
      title: 'WSE.AM',
      subtitle: 'Агентство недвижимости в Ереване, основанное в 2023 году релокантами из России.',
      description: 'Наша миссия — помогать тем, кто уже живёт в Ереване или только собирается переехать, находить идеальное жильё для жизни и отдыха.',
      findHousing: 'Найти жильё',
      contactUs: 'Связаться с нами'
    },
    stats: {
      happyClients: 'Довольных клиентов',
      propertiesRented: 'Сданных объектов',
      yearsExperience: 'Лет на рынке'
    },
    about: {
      title: 'Почему выбирают нас',
      card1: {
        title: 'Опытные агенты',
        description: 'Профессиональные и внимательные специалисты с глубоким знанием рынка Еревана'
      },
      card2: {
        title: 'Проверенная база',
        description: 'Все квартиры и собственники проходят тщательную проверку на надёжность'
      },
      card3: {
        title: 'Полная поддержка',
        description: 'Сопровождаем на всех этапах сделки от просмотра до заключения договора'
      }
    },
    services: {
      title: 'Наши услуги',
      rental: {
        title: 'Аренда квартир',
        description: 'Широкий выбор квартир в разных районах Еревана'
      },
      purchase: {
        title: 'Покупка недвижимости',
        description: 'Помощь в покупке квартир и домов в Армении'
      },
      consultation: {
        title: 'Консультации',
        description: 'Экспертные советы по всем вопросам недвижимости'
      }
    },
    contact: {
      title: 'Свяжитесь с нами',
      phone: 'Телефон',
      workHours: 'Режим работы',
      monday: 'Пн-Пт:',
      saturday: 'Сб:',
      sunday: 'Вс:',
      closed: 'Выходной',
      form: {
        title: 'Оставить заявку',
        name: 'Имя',
        namePlaceholder: 'Ваше имя',
        phonePlaceholder: '+374 XX XXX XXX',
        emailPlaceholder: 'your@email.com',
        serviceType: 'Тип услуги',
        serviceOptions: {
          rental: 'Аренда',
          purchase: 'Покупка',
          sale: 'Продажа',
          consultation: 'Консультация'
        },
        message: 'Сообщение',
        messagePlaceholder: 'Расскажите о ваших требованиях...',
        submit: 'Отправить заявку'
      }
    },
    footer: {
      description: 'Ваш надёжный партнёр в мире недвижимости Еревана'
    }
  },
  en: {
    nav: {
      about: 'About',
      services: 'Services',
      contact: 'Contact',
      submitRequest: 'Submit Request'
    },
    hero: {
      title: 'WSE.AM',
      subtitle: 'Real estate agency in Yerevan, founded in 2023 by relocants from Russia.',
      description: 'Our mission is to help those who already live in Yerevan or are just planning to move, find perfect housing for living and vacation.',
      findHousing: 'Find Housing',
      contactUs: 'Contact Us'
    },
    stats: {
      happyClients: 'Happy Clients',
      propertiesRented: 'Properties Rented',
      yearsExperience: 'Years in Market'
    },
    about: {
      title: 'Why Choose Us',
      card1: {
        title: 'Experienced Agents',
        description: 'Professional and attentive specialists with deep knowledge of Yerevan market'
      },
      card2: {
        title: 'Verified Database',
        description: 'All apartments and property owners undergo thorough reliability verification'
      },
      card3: {
        title: 'Full Support',
        description: 'We accompany you at all stages from viewing to contract signing'
      }
    },
    services: {
      title: 'Our Services',
      rental: {
        title: 'Apartment Rental',
        description: 'Wide selection of apartments in different districts of Yerevan'
      },
      purchase: {
        title: 'Property Purchase',
        description: 'Assistance in buying apartments and houses in Armenia'
      },
      consultation: {
        title: 'Consultations',
        description: 'Expert advice on all real estate matters'
      }
    },
    contact: {
      title: 'Contact Us',
      phone: 'Phone',
      workHours: 'Working Hours',
      monday: 'Mon-Fri:',
      saturday: 'Sat:',
      sunday: 'Sun:',
      closed: 'Closed',
      form: {
        title: 'Submit Request',
        name: 'Name',
        namePlaceholder: 'Your name',
        phonePlaceholder: '+374 XX XXX XXX',
        emailPlaceholder: 'your@email.com',
        serviceType: 'Service Type',
        serviceOptions: {
          rental: 'Rental',
          purchase: 'Purchase',
          sale: 'Sale',
          consultation: 'Consultation'
        },
        message: 'Message',
        messagePlaceholder: 'Tell us about your requirements...',
        submit: 'Submit Request'
      }
    },
    footer: {
      description: 'Your reliable partner in Yerevan real estate world'
    }
  }
};

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Аренда',
    message: ''
  });
  
  const t = translations[language];

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Создаем данные для отправки
    const emailData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      service: formData.service,
      message: formData.message
    };
    
    // Отправляем POST запрос на ваш сервер или сервис
    try {
      const response = await fetch('https://formspree.io/f/2023wse@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });
      
      if (response.ok) {
        alert(language === 'ru' ? 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.' : 'Request sent successfully! We will contact you soon.');
        setFormData({
          name: '',
          phone: '',
          email: '',
          service: language === 'ru' ? 'Аренда' : 'Rental',
          message: ''
        });
      } else {
        throw new Error('Ошибка отправки');
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert(language === 'ru' ? 'Произошла ошибка при отправке. Попробуйте еще раз.' : 'An error occurred while sending. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-open-sans">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold font-montserrat text-primary">
            WSE.AM
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#about" className="text-gray-700 hover:text-primary transition-colors">{t.nav.about}</a>
            <a href="#services" className="text-gray-700 hover:text-primary transition-colors">{t.nav.services}</a>
            <a href="#contact" className="text-gray-700 hover:text-primary transition-colors">{t.nav.contact}</a>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setLanguage('ru')}
                className={`px-2 py-1 text-sm rounded ${
                  language === 'ru' ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'
                }`}
              >
                RU
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-sm rounded ${
                  language === 'en' ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'
                }`}
              >
                EN
              </button>
            </div>
            <Button onClick={scrollToContact} className="bg-primary hover:bg-primary/90 text-white hidden sm:block">
              {t.nav.submitRequest}
            </Button>
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Icon name={isMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </nav>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="container mx-auto px-6 py-4 space-y-4">
              <a href="#about" className="block text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>{t.nav.about}</a>
              <a href="#services" className="block text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>{t.nav.services}</a>
              <a href="#contact" className="block text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>{t.nav.contact}</a>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => setLanguage('ru')}
                  className={`px-3 py-1 text-sm rounded ${
                    language === 'ru' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  RU
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-sm rounded ${
                    language === 'en' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  EN
                </button>
              </div>
              <Button onClick={scrollToContact} className="w-full bg-primary hover:bg-primary/90 text-white mt-4">
                {t.nav.submitRequest}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section 
        className="py-20 px-6 bg-cover bg-center bg-no-repeat relative" 
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/img/32e30396-2620-4543-8610-38967af569e7.jpg)'
        }}
        data-animate 
        id="hero"
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className={`container mx-auto text-center transition-all duration-1000 relative z-10 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl md:text-6xl font-bold font-montserrat mb-6 text-white">
            🏡 <span className="text-primary">{t.hero.title}</span>
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>
          <p className="text-lg text-gray-200 mb-12 max-w-3xl mx-auto">
            {t.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3" onClick={() => window.open('https://t.me/Arenda_kvartir_yerevan', '_blank')}>
              {t.hero.findHousing}
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3" onClick={scrollToContact}>
              {t.hero.contactUs}
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50" data-animate id="stats">
        <div className={`container mx-auto px-6 transition-all duration-1000 delay-200 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-gray-600">Довольных клиентов</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2023</div>
              <div className="text-gray-600">Год основания</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-gray-600">Проверенная база</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 px-6" data-animate>
        <div className={`container mx-auto transition-all duration-1000 delay-300 ${isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold font-montserrat text-center mb-16 text-black">
            Почему выбирают нас
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="text-center space-y-4">
                <div className="text-primary text-4xl mb-4">
                  <Icon name="Users" size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold font-montserrat">Опытные агенты</h3>
                <p className="text-gray-600">
                  Профессиональные и внимательные специалисты с глубоким знанием рынка Еревана
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="text-center space-y-4">
                <div className="text-primary text-4xl mb-4">
                  <Icon name="Shield" size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold font-montserrat">Проверенная база</h3>
                <p className="text-gray-600">
                  Все квартиры и собственники проходят тщательную проверку на надёжность
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="text-center space-y-4">
                <div className="text-primary text-4xl mb-4">
                  <Icon name="HandHeart" size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold font-montserrat">Полная поддержка</h3>
                <p className="text-gray-600">
                  Сопровождаем на всех этапах сделки от просмотра до заключения договора
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50 px-6" data-animate>
        <div className={`container mx-auto transition-all duration-1000 delay-400 ${isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold font-montserrat text-center mb-16 text-black">
            Наши услуги
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="text-primary text-5xl mb-4">
                  <Icon name="Key" size={48} className="mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold font-montserrat">Аренда</h3>
                <p className="text-gray-600">
                  Поможем найти идеальную квартиру для долгосрочной или краткосрочной аренды
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="text-primary text-5xl mb-4">
                  <Icon name="Home" size={48} className="mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold font-montserrat">Купля-продажа</h3>
                <p className="text-gray-600">
                  Полное сопровождение сделок купли-продажи недвижимости в Ереване
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="text-primary text-5xl mb-4">
                  <Icon name="FileText" size={48} className="mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold font-montserrat">Документы</h3>
                <p className="text-gray-600">
                  Помощь в оформлении всех необходимых документов и юридическое сопровождение
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 px-6" data-animate>
        <div className={`container mx-auto max-w-4xl transition-all duration-1000 delay-500 ${isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold font-montserrat text-center mb-16 text-black">
            Оставить заявку
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <Card className="p-8">
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Имя</label>
                      <Input 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ваше имя" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Телефон</label>
                      <Input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+374 XX XXX XXX" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Тип услуги</label>
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
                      <label className="block text-sm font-medium mb-2">Сообщение</label>
                      <Textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Расскажите о ваших требованиях..." 
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-3">
                      Отправить заявку
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold font-montserrat mb-6">Контакты</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Icon name="Phone" size={24} className="text-primary" />
                    <div>
                      <div className="font-medium">Телефон</div>
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
                <h4 className="font-semibold mb-3">Режим работы</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Пн-Пт:</span>
                    <span>11:00 - 19:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Сб:</span>
                    <span>10:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Вс:</span>
                    <span>Выходной</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold font-montserrat mb-4 text-primary">WSE.AM</h3>
              <p className="text-gray-300">
                Ваш надёжный партнёр в мире недвижимости Еревана
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Услуги</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Аренда недвижимости</li>
                <li>Купля-продажа</li>
                <li>Оформление документов</li>
                <li>Консультации</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-gray-300">
                <div>Телефон: <a href="tel:+37495129260" className="text-primary hover:underline">+374 95129260</a></div>
                <div>Telegram: <a href="https://t.me/WSEManager" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">WSEManager</a></div>
                <div>Instagram: <a href="https://www.instagram.com/w.s.e._am/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">w.s.e._am</a></div>
                <div><a href="https://yandex.com/maps/org/white_safe_estate/194631976201/?ll=44.516867%2C40.165353&z=20.23" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ереван ул. Хоренаци 47/7</a></div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2023 WSE.AM. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}