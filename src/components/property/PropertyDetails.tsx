import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import type { Property as ApiProperty } from "@/lib/api";

interface Property extends ApiProperty {
  id: number;
  created_at: string;
  updated_at: string;
}

interface PropertyDetailsProps {
  property: Property;
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
  };

  const nextImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  return (
    <div className="w-full md:w-1/2 overflow-y-auto md:pt-6">
      <div className="bg-[#F5F3EE] min-h-full">
        <div className="px-3 md:px-6 pb-6 pt-3 md:pt-[48px]">
          <div>
            {property.images && property.images.length > 0 ? (
              <div className="relative">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-[250px] md:h-[400px] object-cover rounded-2xl"
                />
                
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg"
                    >
                      <Icon name="ChevronLeft" size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg"
                    >
                      <Icon name="ChevronRight" size={24} />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-[250px] md:h-[400px] bg-gray-200 rounded-2xl flex items-center justify-center">
                <span className="text-gray-400 text-xl">Нет фото</span>
              </div>
            )}
            
            {property.images && property.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {property.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${property.title} - ${idx + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer flex-shrink-0 ${
                      idx === currentImageIndex ? 'ring-4 ring-[#FF7A00]' : 'opacity-60 hover:opacity-100'
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-2">
            <h1 className="text-2xl md:text-3xl font-bold flex-1">{property.title}</h1>
            {property.created_at && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Icon name="Calendar" size={16} />
                {formatDate(property.created_at)}
              </span>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-6">
            <span className="text-3xl md:text-4xl font-bold text-[#FF7A00]">
              {formatPrice(property.price, property.currency)}
            </span>
            {property.transaction_type === 'rent' && (
              <span className="text-base md:text-lg text-gray-600">в месяц</span>
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 md:p-6 mb-4">
            <h2 className="text-lg md:text-xl font-bold mb-4">Основная информация</h2>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {property.rooms && (
                <div className="flex items-center gap-3">
                  <Icon name="Home" size={24} className="text-[#FF7A00]" />
                  <div>
                    <p className="text-sm text-gray-600">Комнат</p>
                    <p className="font-semibold">{property.rooms}</p>
                  </div>
                </div>
              )}
              
              {property.area && (
                <div className="flex items-center gap-3">
                  <Icon name="Maximize" size={24} className="text-[#FF7A00]" />
                  <div>
                    <p className="text-sm text-gray-600">Площадь</p>
                    <p className="font-semibold">{property.area} м²</p>
                  </div>
                </div>
              )}
              
              {property.floor && (
                <div className="flex items-center gap-3">
                  <Icon name="Building" size={24} className="text-[#FF7A00]" />
                  <div>
                    <p className="text-sm text-gray-600">Этаж</p>
                    <p className="font-semibold">
                      {property.total_floors ? `${property.floor}/${property.total_floors}` : property.floor}
                    </p>
                  </div>
                </div>
              )}

              {property.property_type && (
                <div className="flex items-center gap-3">
                  <Icon name="Tag" size={24} className="text-[#FF7A00]" />
                  <div>
                    <p className="text-sm text-gray-600">Тип</p>
                    <p className="font-semibold">
                      {property.property_type === 'apartment' ? 'Квартира' :
                       property.property_type === 'house' ? 'Дом' :
                       property.property_type === 'commercial' ? 'Коммерция' : property.property_type}
                    </p>
                  </div>
                </div>
              )}

              {property.transaction_type && (
                <div className="flex items-center gap-3">
                  <Icon name="FileText" size={24} className="text-[#FF7A00]" />
                  <div>
                    <p className="text-sm text-gray-600">Тип сделки</p>
                    <p className="font-semibold">
                      {property.transaction_type === 'rent' ? 'Аренда' : 
                       property.transaction_type === 'daily_rent' ? 'Посуточно' : 'Продажа'}
                    </p>
                  </div>
                </div>
              )}

              {property.created_at && (
                <div className="flex items-center gap-3">
                  <Icon name="Calendar" size={24} className="text-[#FF7A00]" />
                  <div>
                    <p className="text-sm text-gray-600">Дата добавления</p>
                    <p className="font-semibold">{formatDate(property.created_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {(property.pets_allowed && property.pets_allowed !== 'any') || 
           (property.children_allowed && property.children_allowed !== 'any') ? (
            <div className="bg-white rounded-2xl p-4 md:p-6 mb-4">
              <h2 className="text-lg md:text-xl font-bold mb-4">Дополнительные условия</h2>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {property.pets_allowed && property.pets_allowed !== 'any' && (
                  <div className="flex items-center gap-3">
                    <Icon name="Dog" size={24} className="text-[#FF7A00]" />
                    <div>
                      <p className="text-sm text-gray-600">Можно с животными</p>
                      <p className="font-semibold">
                        {property.pets_allowed === 'yes' ? 'Да' : 
                         property.pets_allowed === 'no' ? 'Нет' : 'По договоренности'}
                      </p>
                    </div>
                  </div>
                )}

                {property.children_allowed && property.children_allowed !== 'any' && (
                  <div className="flex items-center gap-3">
                    <Icon name="Baby" size={24} className="text-[#FF7A00]" />
                    <div>
                      <p className="text-sm text-gray-600">Можно с детьми</p>
                      <p className="font-semibold">
                        {property.children_allowed === 'yes' ? 'Да' : 
                         property.children_allowed === 'no' ? 'Нет' : 'По договоренности'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {property.features && property.features.length > 0 && (
            <div className="bg-white rounded-2xl p-4 md:p-6 mb-4">
              <h2 className="text-lg md:text-xl font-bold mb-4">Особенности</h2>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature, idx) => (
                  <span key={idx} className="px-3 py-1 bg-orange-50 text-[#FF7A00] rounded-full text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {property.address && (
            <div className="bg-white rounded-2xl p-4 md:p-6 mb-4">
              <h2 className="text-lg md:text-xl font-bold mb-3">Адрес</h2>
              <div className="flex items-start gap-3">
                <Icon name="MapPin" size={24} className="text-[#FF7A00] mt-1" />
                <div>
                  <p className="text-lg">{property.address}</p>
                  {property.street_name && (
                    <p className="text-gray-600">{property.street_name}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {property.description && (
            <div className="bg-white rounded-2xl p-4 md:p-6 mb-4">
              <h2 className="text-lg md:text-xl font-bold mb-3">Описание</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 bg-[#F5F3EE] py-4 sticky bottom-0 md:relative">
            <a href="tel:+37495129260">
              <Button className="w-full h-12 md:h-14 bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-xl text-base md:text-lg font-medium">
                <Icon name="Phone" size={20} className="mr-2" />
                <span className="hidden sm:inline">Позвонить +374 95 129260</span>
                <span className="sm:hidden">+374 95 129260</span>
              </Button>
            </a>
            <a href="https://t.me/WSEManager" target="_blank" rel="noopener noreferrer">
              <Button className="w-full h-12 md:h-14 bg-[#0088cc] hover:bg-[#006699] text-white rounded-xl text-base md:text-lg font-medium">
                <Icon name="Send" size={20} className="mr-2" />
                Telegram
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}