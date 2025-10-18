import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function MapPreview() {
  return (
    <section className="px-4 md:px-6 py-6 md:py-8 max-w-7xl mx-auto">
      <div className="text-center mb-4 md:mb-6">
        <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-6 leading-tight animate-fadeInUp">Найдите на карте</h2>
        <p className="text-base md:text-xl text-gray-600 leading-relaxed animate-fadeInUp delay-100">Все объекты недвижимости в Ереване на интерактивной карте</p>
      </div>
      
      <Link to="/full-map" className="block group">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-500 animate-scaleIn delay-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48624.58415456418!2d44.47379!3d40.18111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406abd39496ad82b%3A0x2e2579e7e2d4621b!2sYerevan%2C%20Armenia!5e0!3m2!1sen!2s!4v1234567890"
            className="w-full h-[300px] md:h-[500px] pointer-events-none"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-center justify-center group-hover:from-black/30 transition-all duration-500">
            <div className="bg-[#FF7A00] hover:bg-[#E66D00] text-white px-6 md:px-10 py-3 md:py-5 rounded-full text-sm md:text-lg font-bold flex items-center gap-2 md:gap-3 shadow-lg group-hover:opacity-90 transition-all duration-300">
              <Icon name="Map" size={20} className="md:w-6 md:h-6" />
              Показать на карте
              <Icon name="ArrowRight" size={20} className="md:w-6 md:h-6" />
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}