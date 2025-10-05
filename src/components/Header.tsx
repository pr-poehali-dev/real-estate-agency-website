import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface HeaderProps {
  t: any;
  language: 'ru' | 'en';
  setLanguage: (lang: 'ru' | 'en') => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  scrollToContact: () => void;
}

export default function Header({ t, language, setLanguage, isMenuOpen, setIsMenuOpen, scrollToContact }: HeaderProps) {
  return (
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
  );
}
