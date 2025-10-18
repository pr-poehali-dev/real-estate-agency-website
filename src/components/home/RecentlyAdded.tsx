import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import type { Property as ApiProperty } from "@/lib/api";

interface Property extends ApiProperty {
  id: number;
  created_at: string;
  updated_at: string;
}

interface RecentlyAddedProps {
  properties: Property[];
  loading: boolean;
}

export default function RecentlyAdded({ properties, loading }: RecentlyAddedProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<number, number>>({});
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const formatPrice = (price: number, currency: string) => {
    return {
      value: price.toLocaleString(),
      currency: currency
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дн. назад`;
    
    const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    return `${date.getDate()} ${months[date.getMonth()]}.`;
  };

  const isNew = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 3;
  };

  const sortedProperties = [...properties].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    if (dateB !== dateA) return dateB - dateA;
    return b.id - a.id;
  });

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    
    // Вычисляем текущую страницу на основе позиции прокрутки
    const cardWidth = clientWidth * 0.85; // ширина одной карточки + отступы
    const page = Math.round(scrollLeft / cardWidth);
    setCurrentPage(page);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const scrollAmount = clientWidth * 0.8;
    
    if (direction === 'left') {
      if (scrollLeft <= 0) {
        scrollContainerRef.current.scrollTo({
          left: scrollWidth - clientWidth,
          behavior: 'smooth'
        });
      } else {
        scrollContainerRef.current.scrollTo({
          left: scrollLeft - scrollAmount,
          behavior: 'smooth'
        });
      }
    } else {
      if (scrollLeft >= scrollWidth - clientWidth - 10) {
        scrollContainerRef.current.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      } else {
        scrollContainerRef.current.scrollTo({
          left: scrollLeft + scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };



  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [properties]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = parseInt(entry.target.getAttribute('data-card-id') || '0');
            setVisibleCards(prev => new Set(prev).add(cardId));
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('[data-card-id]');
    cards.forEach(card => observer.observe(card));

    return () => {
      cards.forEach(card => observer.unobserve(card));
    };
  }, [properties]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      scroll('right');
    }
    if (isRightSwipe) {
      scroll('left');
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <section className="py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-2xl md:text-3xl font-bold leading-tight animate-fadeInUp">Недавно добавленные</h2>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-6 md:py-8 text-gray-500 animate-fadeIn text-sm md:text-base">Загрузка...</div>
      ) : sortedProperties.length === 0 ? (
        <div className="text-center py-6 md:py-8 text-gray-500 text-sm md:text-base">
          <p>Нет добавленных объектов</p>
          <Link to="/admin" className="text-[#FF7A00] hover:underline mt-2 inline-block">
            Добавить первый объект
          </Link>
        </div>
      ) : (
        <div className="relative max-w-7xl mx-auto px-3 md:px-6">
          {sortedProperties.length > 3 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scroll('left')}
                className="absolute left-2 md:left-2 top-1/2 -translate-y-1/2 z-10 rounded-full w-10 h-10 p-0 bg-white/95 backdrop-blur-sm shadow-md hover:bg-white hover:shadow-lg border-gray-200 transition-all"
              >
                <Icon name="ChevronLeft" size={18} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scroll('right')}
                className="absolute right-2 md:right-2 top-1/2 -translate-y-1/2 z-10 rounded-full w-10 h-10 p-0 bg-white/95 backdrop-blur-sm shadow-md hover:bg-white hover:shadow-lg border-gray-200 transition-all"
              >
                <Icon name="ChevronRight" size={18} />
              </Button>
            </>
          )}

          <div 
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {sortedProperties.map((property, idx) => {
              const priceData = formatPrice(property.price, property.currency);
              const imageCount = property.images?.length || 0;
              const currentIndex = currentImageIndex[property.id] || 0;
              const isVisible = visibleCards.has(property.id);
              
              return (
                <Link 
                  key={property.id} 
                  to={`/property/${property.id}`} 
                  className="flex-shrink-0 w-[85vw] sm:w-[45vw] md:w-[calc(33.333%-16px)] snap-center group"
                  data-card-id={property.id}
                >
                  <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#FF7A00]/30 hover:-translate-y-2 transition-all duration-500 cursor-pointer h-full flex flex-col ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    <div className="relative overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <>
                          <div className="relative">
                            <img
                              src={property.images[currentIndex]}
                              alt={property.title}
                              className="w-full aspect-[16/11] object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          
                          {imageCount > 1 && (
                            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                              <Icon name="Image" size={12} />
                              <span>{currentIndex + 1}/{imageCount}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full aspect-[16/11] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Icon name="Image" size={32} className="text-gray-400" />
                        </div>
                      )}
                      
                      
                      {property.created_at && isNew(property.created_at) && (
                        <div className="absolute top-3 left-3 bg-[#FF7A00] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                          Новое
                        </div>
                      )}
                      
                      {property.transaction_type && (
                        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
                          {property.transaction_type === 'sale' ? 'Продажа' : 
                           property.transaction_type === 'rent' ? 'Аренда' : 'Посуточно'}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 md:p-5 flex flex-col flex-1">
                      <div className="mb-2 md:mb-3">
                        <div className="flex items-baseline gap-1 md:gap-1.5 mb-0.5 md:mb-1">
                          <p className="text-xl md:text-2xl font-bold text-gray-900">
                            {priceData.value}
                          </p>
                          <span className="text-xs md:text-sm font-medium text-gray-500">
                            {priceData.currency}
                          </span>
                        </div>
                        {property.created_at && (
                          <span className="text-xs text-gray-400">
                            {formatDate(property.created_at)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-start gap-1 md:gap-1.5 mb-2 md:mb-3">
                        <Icon name="MapPin" size={13} className="md:w-3.5 md:h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs md:text-sm text-gray-700 font-medium line-clamp-2 leading-snug">
                          {property.street_name || property.address}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600 mt-auto pt-2 md:pt-3 border-t border-gray-100">
                        {property.rooms && (
                          <div className="flex items-center gap-0.5 md:gap-1">
                            <Icon name="Bed" size={14} className="md:w-4 md:h-4 text-gray-400" />
                            <span>{property.rooms}</span>
                          </div>
                        )}
                        {property.area && (
                          <div className="flex items-center gap-0.5 md:gap-1">
                            <Icon name="Maximize2" size={14} className="md:w-4 md:h-4 text-gray-400" />
                            <span>{property.area} м²</span>
                          </div>
                        )}
                        {property.floor && property.total_floors && (
                          <div className="flex items-center gap-0.5 md:gap-1">
                            <Icon name="Building2" size={14} className="md:w-4 md:h-4 text-gray-400" />
                            <span>{property.floor}/{property.total_floors}</span>
                          </div>
                        )}
                      </div>
                      

                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          

        </div>
      )}
    </section>
  );
}