import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer id="services" className="bg-gray-900 text-white py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-6 md:mb-8">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-[#FF7A00] mb-3 md:mb-4">WSE.AM</h3>
            <p className="text-sm md:text-base text-gray-400">
              Ваш надёжный партнёр в мире недвижимости Еревана
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Услуги</h4>
            <ul className="space-y-1.5 md:space-y-2 text-sm md:text-base text-gray-400">
              <li>Аренда квартир</li>
              <li>Покупка недвижимости</li>
              <li>Консультации</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Свяжитесь с нами</h4>
            <ul className="space-y-1.5 md:space-y-2 text-sm md:text-base text-gray-400">
              <li>Телефон: <a href="tel:+37495129260" className="text-[#FF7A00] hover:underline">+374 95129260</a></li>
              <li>Telegram: <a href="https://t.me/WSEManager" className="text-[#FF7A00] hover:underline">WSEManager</a></li>
              <li>Instagram: <a href="https://instagram.com/w.s.e._am" className="text-[#FF7A00] hover:underline">w.s.e._am</a></li>
              <li className="text-[#FF7A00]">Ереван ул. Хоренаци 47/7</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 md:pt-8 text-center text-gray-400 text-xs md:text-sm">
          <Link to="/admin" className="hover:text-[#FF7A00] transition-colors cursor-pointer">
            © 2023 WSE.AM. Все права защищены.
          </Link>
        </div>
      </div>
    </footer>
  );
}