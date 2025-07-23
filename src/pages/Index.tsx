import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";

export default function Index() {
  return (
    <div className="min-h-screen bg-white text-black font-open-sans">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold font-montserrat text-primary">
            WSE.AM
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#about" className="text-gray-700 hover:text-primary transition-colors">О нас</a>
            <a href="#services" className="text-gray-700 hover:text-primary transition-colors">Услуги</a>
            <a href="#contact" className="text-gray-700 hover:text-primary transition-colors">Контакты</a>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white">
            Оставить заявку
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold font-montserrat mb-6">
            🏡 <span className="text-primary">WSE.AM</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            Агентство недвижимости в Ереване, основанное в 2023 году релокантами из России.
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Наша миссия — помогать тем, кто уже живёт в Ереване или только собирается переехать, 
            находить идеальное жильё для жизни и отдыха.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3">
              Найти жильё
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3">
              Связаться с нами
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
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
      <section id="about" className="py-20 px-6">
        <div className="container mx-auto">
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
      <section id="services" className="py-20 bg-gray-50 px-6">
        <div className="container mx-auto">
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
      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold font-montserrat text-center mb-16 text-black">
            Оставить заявку
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <Card className="p-8">
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Имя</label>
                  <Input placeholder="Ваше имя" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Телефон</label>
                  <Input placeholder="+374 XX XXX XXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Тип услуги</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Аренда</option>
                    <option>Покупка</option>
                    <option>Продажа</option>
                    <option>Консультация</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Сообщение</label>
                  <Textarea placeholder="Расскажите о ваших требованиях..." />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3">
                  Отправить заявку
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold font-montserrat mb-6">Контакты</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Icon name="MessageCircle" size={24} className="text-primary" />
                    <div>
                      <div className="font-medium">Telegram</div>
                      <a href="#" className="text-primary hover:underline">@wse_am</a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Icon name="Instagram" size={24} className="text-primary" />
                    <div>
                      <div className="font-medium">Instagram</div>
                      <a href="#" className="text-primary hover:underline">@wse.am</a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Icon name="MapPin" size={24} className="text-primary" />
                    <div>
                      <div className="font-medium">Адрес</div>
                      <div className="text-gray-600">Ереван, Армения</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3">Режим работы</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Пн-Пт:</span>
                    <span>09:00 - 19:00</span>
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
                <div>Telegram: @wse_am</div>
                <div>Instagram: @wse.am</div>
                <div>Ереван, Армения</div>
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