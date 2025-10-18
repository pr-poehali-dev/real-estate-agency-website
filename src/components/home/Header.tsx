import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="px-6 py-8 flex items-center justify-between max-w-7xl mx-auto">
      <Link to="/" className="text-3xl font-black cursor-pointer hover:text-[#E66D00] transition-colors animate-fadeInUp" style={{ color: '#FF7A00' }}>WSE.AM</Link>
      <nav className="hidden md:flex items-center gap-10 animate-fadeInUp delay-100">
        <Link to="/map" className="text-gray-600 hover:text-gray-900 transition-colors">Карта</Link>
        <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Контакты</a>
        <Button 
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-[#FF7A00] hover:bg-[#E66D00] hover:opacity-90 text-white rounded-xl px-8 transition-all"
        >
          Связаться
        </Button>
      </nav>
    </header>
  );
}