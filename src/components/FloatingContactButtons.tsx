import Icon from '@/components/ui/icon';

interface FloatingContactButtonsProps {
  phoneNumber?: string;
  whatsappNumber?: string;
}

export default function FloatingContactButtons({ 
  phoneNumber = '+37495129260',
  whatsappNumber = '+37495129260'
}: FloatingContactButtonsProps) {
  
  const handleCall = () => {
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`, '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[999] flex flex-col gap-3 md:gap-4">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="w-14 h-14 md:w-16 md:h-16 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110 active:scale-95 border border-gray-100"
        title="Написать в WhatsApp"
        aria-label="Написать в WhatsApp"
      >
        <Icon name="MessageCircle" size={24} className="md:w-[26px] md:h-[26px] text-gray-600 group-hover:text-[#25D366] transition-colors" />
      </button>

      {/* Phone Button with pulse animation */}
      <button
        onClick={handleCall}
        className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#FF7A00] to-[#FF6B00] rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110 active:scale-95 animate-pulse-slow"
        title="Позвонить"
        aria-label="Позвонить"
      >
        <div className="absolute inset-0 bg-[#FF7A00] rounded-full animate-ping opacity-20"></div>
        <Icon name="Phone" size={24} className="md:w-[26px] md:h-[26px] text-white group-hover:rotate-12 transition-transform relative z-10" />
      </button>
    </div>
  );
}