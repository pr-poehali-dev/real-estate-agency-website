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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
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

  // Сортировка по дате (новые первыми)
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
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const scrollAmount = clientWidth * 0.8;
    
    if (direction === 'left') {
      // Если в начале списка, прокручиваем в конец
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
      // Если в конце списка, прокручиваем в начало
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

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold leading-tight animate-fadeInUp">Недавно добавленные</h2>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8 text-gray-500 animate-fadeIn">Загрузка...</div>
      ) : sortedProperties.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Нет добавленных объектов</p>
          <Link to="/admin" className="text-[#FF7A00] hover:underline mt-2 inline-block">
            Добавить первый объект
          </Link>
        </div>
      ) : (
        <div className="relative max-w-7xl mx-auto px-3 md:px-6">
          {/* Кнопки прокрутки по бокам от карточек */}
          {sortedProperties.length > 3 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scroll('left')}
                className="absolute left-2 md:left-2 top-1/2 -translate-y-1/2 z-10 rounded-full w-12 h-12 p-0 bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white border-gray-200"
              >
                <Icon name="ChevronLeft" size={20} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scroll('right')}
                className="absolute right-2 md:right-2 top-1/2 -translate-y-1/2 z-10 rounded-full w-12 h-12 p-0 bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white border-gray-200"
              >
                <Icon name="ChevronRight" size={20} />
              </Button>
            </>
          )}

          {/* Контейнер с прокруткой */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {sortedProperties.map((property, idx) => (
              <Link 
                key={property.id} 
                to={`/property/${property.id}`} 
                className="flex-shrink-0 w-[85vw] sm:w-[45vw] md:w-[calc(33.333%-16px)] snap-center"
              >
                <div className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col animate-fadeInUp`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full aspect-[4/3] object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 text-sm">Нет фото</span>
                    </div>
                  )}
                  
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-lg font-bold text-[#FF7A00]">
                        {formatPrice(property.price, property.currency)}
                      </p>
                      {property.created_at && (
                        <span className="text-xs text-gray-500">
                          {formatDate(property.created_at)}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-900 font-medium mb-2 line-clamp-1 text-sm">
                      {property.street_name || property.address}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-600 mt-auto">
                      {property.rooms && <span>{property.rooms} комн.</span>}
                      {property.area && <span>• {property.area} м²</span>}
                      {property.floor && property.total_floors && <span>• {property.floor}/{property.total_floors} эт.</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}