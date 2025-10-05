import { useState, useEffect } from "react";
import { translations } from "@/components/translations";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');
  
  const t = translations[language];

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
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
      <Header 
        t={t} 
        language={language} 
        setLanguage={setLanguage} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        scrollToContact={scrollToContact} 
      />
      <HeroSection t={t} isVisible={isVisible} scrollToContact={scrollToContact} />
      <AboutSection t={t} isVisible={isVisible} />
      <ServicesSection t={t} isVisible={isVisible} />
      <ContactSection t={t} isVisible={isVisible} language={language} />
      <Footer t={t} />
    </div>
  );
}
