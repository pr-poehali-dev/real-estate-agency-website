import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  t: any;
  isVisible: any;
  scrollToContact: () => void;
}

export default function HeroSection({ t, isVisible, scrollToContact }: HeroSectionProps) {
  return (
    <section 
      className="min-h-screen px-6 bg-cover bg-center bg-no-repeat relative flex items-center" 
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://cdn.poehali.dev/files/0e9fae6d-86d7-40be-b0ba-b7e09d909847.png)'
      }}
      data-animate 
      id="hero"
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className={`container mx-auto text-center transition-all duration-1000 relative z-10 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-5xl md:text-6xl font-bold font-montserrat mb-6 text-white">
          🏡 <span className="text-primary">{t.hero.title}</span>
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto leading-relaxed">
          {t.hero.subtitle}
        </p>
        <p className="text-lg text-gray-200 mb-12 max-w-3xl mx-auto">
          {t.hero.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3" onClick={() => window.open('https://t.me/Arenda_kvartir_yerevan', '_blank')}>
            {t.hero.findHousing}
          </Button>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3" onClick={scrollToContact}>
            {t.hero.contactUs}
          </Button>
        </div>
      </div>
    </section>
  );
}
