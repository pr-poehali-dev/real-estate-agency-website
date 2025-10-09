import { Link } from "react-router-dom";

interface FooterProps {
  t: any;
}

export default function Footer({ t }: FooterProps) {
  return (
    <footer className="bg-black text-white py-12 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-[#FF7A00]">WSE.AM</h3>
            <p className="text-gray-300">
              {t.footer.description}
            </p>
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
          <p>&copy; 2025 <Link to="/admin" className="hover:text-primary transition-colors inline-flex items-center gap-1">
            WSE.AM 🔐
          </Link>. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}