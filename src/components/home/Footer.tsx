import { Link } from "react-router-dom";

export default function Footer() {
  return (
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
  );
}
