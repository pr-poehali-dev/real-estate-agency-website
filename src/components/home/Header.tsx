import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between max-w-7xl mx-auto">
      <Link to="/" className="text-2xl md:text-3xl font-black cursor-pointer hover:text-[#E66D00] transition-colors animate-fadeInUp" style={{ color: '#FF7A00' }}>WSE.AM</Link>
      <nav className="flex items-center gap-3 md:gap-10 animate-fadeInUp delay-100">
        <Link to="/map" className="text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors">Карта</Link>
        <a href="#contact" className="hidden sm:block text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors">Контакты</a>
        <Button 
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="h-9 md:h-12 bg-[#FF7A00] hover:bg-[#E66D00] hover:opacity-90 text-white rounded-lg md:rounded-xl px-4 md:px-8 transition-all text-sm md:text-base"
        >
          Связаться
        </Button>
      </nav>
    </header>
  );
}