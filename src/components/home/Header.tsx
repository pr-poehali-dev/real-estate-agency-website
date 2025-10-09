import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
      <Link to="/admin" className="text-3xl font-black text-[#FF7A00] cursor-pointer hover:text-[#E66D00] transition-colors">WSE.AM</Link>
      <nav className="hidden md:flex items-center gap-8">
        <Link to="/map" className="text-gray-800 hover:text-[#FF7A00] transition-colors">Карта</Link>
        <a href="#contact" className="text-gray-800 hover:text-[#FF7A00] transition-colors">Контакты</a>
        <Button 
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-xl px-6"
        >
          Связаться
        </Button>
      </nav>
    </header>
  );
}
