import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { useState, useEffect } from "react";

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
      yearsExperience: '100% проверенная база'
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
    contactMethod: 'Telegram',
    contact: '',
    service: 'Аренда',
    message: ''
  });
  
  const t = translations[language];

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

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
                className={`px-3 py-1 text-sm font-medium rounded ${
                  language === 'ru' ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'
                }`}
              >
                RU
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm font-medium rounded ${
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
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    language === 'ru' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  RU
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 text-sm font-medium rounded ${
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
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative" 
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(https://cdn.poehali.dev/files/2c82aa26-7b5a-4336-8bc2-eda435311aaf.jpg)'
        }}
        data-animate 
        id="hero"
      >
        <div className={`container mx-auto px-6 text-center transition-all duration-1000 relative z-10 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8">
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 tracking-wider">
              WSE.AM
            </h1>
            <p className="text-lg md:text-2xl text-white tracking-widest uppercase opacity-90">
              WHITE SAFE ESTATE
            </p>
          </div>
          <h2 className="text-3xl md:text-6xl font-bold text-white leading-tight max-w-4xl mx-auto">
            НАДЕЖНАЯ<br/>НЕДВИЖИМОСТЬ<br/>В ЕРЕВАНЕ<br/>С WSE.AM
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button size="lg" className="bg-white hover:bg-gray-100 text-black px-12 py-4 text-lg font-semibold" onClick={() => window.open('https://t.me/Arenda_kvartir_yerevan', '_blank')}>
              {t.hero.findHousing}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-12 py-4 text-lg font-semibold" onClick={scrollToContact}>
              {t.hero.contactUs}
            </Button>
          </div>
        </div>
      </section>
      
      {/* Second Hero - City View */}
      <section 
        className="min-h-screen flex items-center justify-start bg-cover bg-center bg-no-repeat relative" 
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(https://cdn.poehali.dev/files/be6af7ec-495a-439d-bc35-b6a1ef90ce78.jpg)'
        }}
        data-animate
      >
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-3xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="w-16 h-16 border-4 border-white flex items-center justify-center">
                <Icon name="Home" size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wider">WSE.AM</h3>
                <p className="text-sm md:text-base text-white tracking-widest uppercase opacity-90">WHITE SAFE ESTATE</p>
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Надёжная<br/>недвижимость<br/>в Ереване<br/>с WSE.AM
            </h2>
          </div>
        </div>
      </section>
      
      {/* Third Hero - Happy Couple */}
      <section 
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative bg-blue-100" 
        style={{
          backgroundImage: 'url(https://cdn.poehali.dev/files/736948b2-d4bd-45e7-ad68-5ec3bdf63069.jpg)',
          backgroundSize: 'cover'
        }}
        data-animate
      >
        <div className="container mx-auto px-6 text-center">
          <div className="mb-12">
            <h3 className="text-3xl md:text-5xl font-bold text-blue-900 mb-4 tracking-wider">WHITE SAFE ESTATE</h3>
            <h2 className="text-2xl md:text-4xl font-bold text-blue-900">
              Найдём квартиру<br/>под ваш запрос
            </h2>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50" data-animate id="stats">
        <div className={`container mx-auto px-6 transition-all duration-1000 delay-200 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-gray-600">{t.stats.happyClients}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">{t.stats.propertiesRented}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-gray-600">{t.stats.yearsExperience}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 px-6" data-animate>
        <div className={`container mx-auto transition-all duration-1000 delay-300 ${isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold font-montserrat text-center mb-16 text-black">
            {t.about.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="text-center space-y-4">
                <div className="text-primary text-4xl mb-4">
                  <Icon name="Users" size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold font-montserrat">{t.about.card1.title}</h3>
                <p className="text-gray-600">
                  {t.about.card1.description}
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="text-center space-y-4">
                <div className="text-primary text-4xl mb-4">
                  <Icon name="Shield" size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold font-montserrat">{t.about.card2.title}</h3>
                <p className="text-gray-600">
                  {t.about.card2.description}
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="text-center space-y-4">
                <div className="text-primary text-4xl mb-4">
                  <Icon name="HandHeart" size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold font-montserrat">{t.about.card3.title}</h3>
                <p className="text-gray-600">
                  {t.about.card3.description}
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
            {t.services.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="text-primary text-5xl mb-4">
                  <Icon name="Key" size={48} className="mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold font-montserrat">{t.services.rental.title}</h3>
                <p className="text-gray-600">
                  {t.services.rental.description}
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="text-primary text-5xl mb-4">
                  <Icon name="Home" size={48} className="mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold font-montserrat">{t.services.purchase.title}</h3>
                <p className="text-gray-600">
                  {t.services.purchase.description}
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="text-primary text-5xl mb-4">
                  <Icon name="FileText" size={48} className="mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold font-montserrat">{t.services.consultation.title}</h3>
                <p className="text-gray-600">
                  {t.services.consultation.description}
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
            {t.contact.title}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
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

            {/* Contact Info */}
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

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold font-montserrat mb-4 text-primary">WSE.AM</h3>
              <p className="text-gray-300">
                {t.footer.description}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t.nav.services}</h4>
              <ul className="space-y-2 text-gray-300">
                <li>{t.services.rental.title}</li>
                <li>{t.services.purchase.title}</li>
                <li>{t.services.consultation.title}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t.contact.title}</h4>
              <div className="space-y-2 text-gray-300">
                <div>{t.contact.phone}: <a href="tel:+37495129260" className="text-primary hover:underline">+374 95129260</a></div>
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