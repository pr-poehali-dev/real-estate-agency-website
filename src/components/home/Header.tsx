import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
      <Link to="/admin" className="text-3xl font-black cursor-pointer hover:text-[#E66D00] transition-all hover:scale-110 animate-fadeInUp" style={{ color: '#FF7A00' }}>WSE.AM</Link>
      <nav className="hidden md:flex items-center gap-8 animate-fadeInUp delay-100">
        <Link to="/map" className="text-gray-800 hover:text-[#FF7A00] transition-all hover:scale-110">Карта</Link>
        <a href="#contact" className="text-gray-800 hover:text-[#FF7A00] transition-all hover:scale-110">Контакты</a>
        <Button 
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-[#FF7A00] hover:bg-[#E66D00] hover:scale-105 text-white rounded-xl px-6 transition-all"
        >
          Связаться
        </Button>
      </nav>
    </header>
  );
}