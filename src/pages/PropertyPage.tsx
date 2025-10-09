import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Properties } from "@/lib/api";
import type { Property as ApiProperty } from "@/lib/api";
import Icon from "@/components/ui/icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import YerevanMapLeaflet from "@/components/YerevanMapLeaflet";

interface Property extends ApiProperty {
  id: number;
  created_at: string;
  updated_at: string;
}

export default function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [transactionType, setTransactionType] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [district, setDistrict] = useState('all');
  const [rooms, setRooms] = useState('any');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [petsAllowed, setPetsAllowed] = useState('any');
  const [childrenAllowed, setChildrenAllowed] = useState('any');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currency, setCurrency] = useState('all');

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    
    const token = localStorage.getItem('admin_token');
    if (token && token.startsWith('demo-token-')) {
      const demoData = localStorage.getItem('demo_properties');
      const demoProps = demoData ? JSON.parse(demoData) : [];
      // Добавляем created_at если его нет
      const propsWithDates = demoProps.map((p: any) => ({
        ...p,
        created_at: p.created_at || new Date().toISOString()
      }));
      const found = propsWithDates.find((p: Property) => p.id === Number(id));
      setProperty(found || null);
      setAllProperties(propsWithDates.filter((p: Property) => p.id !== Number(id)));
      setLoading(false);
      return;
    }

    try {
      const response = await Properties.list();
      const props = (response.properties || []) as Property[];
      // Добавляем created_at если его нет
      const propsWithDates = props.map(p => ({
        ...p,
        created_at: p.created_at || new Date().toISOString()
      }));
      const found = propsWithDates.find(p => p.id === Number(id));
      setProperty(found || null);
      setAllProperties(propsWithDates.filter(p => p.id !== Number(id)));
    } catch (err) {
      console.error('Error loading property:', err);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

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
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const filteredProperties = allProperties.filter(prop => {
    if (transactionType !== 'all' && prop.transaction_type !== transactionType) return false;
    if (propertyType !== 'all' && prop.property_type !== propertyType) return false;
    if (district !== 'all' && prop.district !== district) return false;
    if (rooms !== 'any' && prop.rooms !== Number(rooms)) return false;
    if (childrenAllowed !== 'any' && prop.children_allowed !== (childrenAllowed === 'yes')) return false;
    if (petsAllowed !== 'any' && prop.pets_allowed !== (petsAllowed === 'yes')) return false;
    if (currency !== 'all' && prop.currency !== currency) return false;
    if (minPrice && prop.price < Number(minPrice)) return false;
    if (maxPrice && prop.price > Number(maxPrice)) return false;
    if (amenities.length > 0) {
      const propAmenities = prop.amenities || [];
      if (!amenities.every(a => propAmenities.includes(a))) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Объект не найден</h1>
          <Link to="/">
            <Button className="bg-[#FF7A00] hover:bg-[#E66D00] text-white">
              Вернуться на главную
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 py-4 shadow-sm">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold" style={{ color: '#FF7A00' }}>WSE.AM</Link>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </Button>
            <Button 
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className={`border-gray-300 text-gray-700 hover:bg-gray-50 ${showFilters ? 'bg-gray-100' : ''}`}
            >
              <Icon name="SlidersHorizontal" size={20} className="mr-2" />
              Фильтры
            </Button>
            <Button 
              onClick={() => document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Icon name="Map" size={20} className="mr-2" />
              Карта
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left side - Property details */}
        <div className="w-1/2 overflow-y-auto pt-6">
          <div className="bg-[#F5F3EE] min-h-full">
            <div className="px-6 pb-6 pt-[48px]">
            {/* Images */}
            <div>
              {property.images && property.images.length > 0 ? (
                <div className="relative">
                  <img
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    className="w-full h-[400px] object-cover rounded-2xl"
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
                <div className="w-full h-[400px] bg-gray-200 rounded-2xl flex items-center justify-center">
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

            {/* Details */}
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-3xl font-bold flex-1">{property.title}</h1>
              {property.created_at && (
                <span className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <Icon name="Calendar" size={16} />
                  {formatDate(property.created_at)}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl font-bold text-[#FF7A00]">
                {formatPrice(property.price, property.currency)}
              </span>
              {property.transaction_type === 'rent' && (
                <span className="text-lg text-gray-600">в месяц</span>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 mb-4">
              <h2 className="text-xl font-bold mb-4">Основная информация</h2>
              <div className="grid grid-cols-2 gap-4">
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

            {/* Дополнительные условия */}
            {(property.pets_allowed && property.pets_allowed !== 'any') || 
             (property.children_allowed && property.children_allowed !== 'any') ? (
              <div className="bg-white rounded-2xl p-6 mb-4">
                <h2 className="text-xl font-bold mb-4">Дополнительные условия</h2>
                <div className="grid grid-cols-2 gap-4">
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

            {/* Особенности */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 mb-4">
                <h2 className="text-xl font-bold mb-4">Особенности</h2>
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
              <div className="bg-white rounded-2xl p-6 mb-4">
                <h2 className="text-xl font-bold mb-3">Адрес</h2>
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
              <div className="bg-white rounded-2xl p-6 mb-4">
                <h2 className="text-xl font-bold mb-3">Описание</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
              </div>
            )}

            <div className="flex flex-col gap-3 bg-[#F5F3EE] py-4">
              <a href="tel:+37495129260">
                <Button className="w-full h-14 bg-[#FF7A00] hover:bg-[#E66D00] text-white rounded-xl text-lg font-medium">
                  <Icon name="Phone" size={20} className="mr-2" />
                  Позвонить +374 95 129260
                </Button>
              </a>
              <a href="https://t.me/WSEManager" target="_blank" rel="noopener noreferrer">
                <Button className="w-full h-14 bg-[#0088cc] hover:bg-[#006699] text-white rounded-xl text-lg font-medium">
                  <Icon name="Send" size={20} className="mr-2" />
                  Telegram
                </Button>
              </a>
            </div>

            </div>
          </div>
        </div>

        {/* Right side - List & Map */}
        <div className="w-1/2 border-l border-gray-200 bg-white flex flex-col">
          {/* Filters */}
          {showFilters && (
            <div className="border-b border-gray-200 p-6 bg-gray-50">
              <h3 className="font-bold text-lg mb-4">Фильтры</h3>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Тип сделки</label>
                  <Select value={transactionType} onValueChange={setTransactionType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      <SelectItem value="rent">Долгосрочная аренда</SelectItem>
                      <SelectItem value="daily_rent">Посуточная аренда</SelectItem>
                      <SelectItem value="sale">Продажа</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Тип недвижимости</label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все типы</SelectItem>
                      <SelectItem value="apartment">Квартира</SelectItem>
                      <SelectItem value="house">Дом</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Район</label>
                  <Select value={district} onValueChange={setDistrict}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все районы</SelectItem>
                      <SelectItem value="Центр (Кентрон)">Центр (Кентрон)</SelectItem>
                      <SelectItem value="Аван">Аван</SelectItem>
                      <SelectItem value="Арабкир">Арабкир</SelectItem>
                      <SelectItem value="Давташен">Давташен</SelectItem>
                      <SelectItem value="Эребуни">Эребуни</SelectItem>
                      <SelectItem value="Канакер-Зейтун">Канакер-Зейтун</SelectItem>
                      <SelectItem value="Малатия-Себастия">Малатия-Себастия</SelectItem>
                      <SelectItem value="Норк-Мараш">Норк-Мараш</SelectItem>
                      <SelectItem value="Нор Норк">Нор Норк</SelectItem>
                      <SelectItem value="Шенгавит">Шенгавит</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Количество комнат</label>
                  <Select value={rooms} onValueChange={setRooms}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Выберите</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Можно с детьми</label>
                  <Select value={childrenAllowed} onValueChange={setChildrenAllowed}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Не важно</SelectItem>
                      <SelectItem value="yes">Да</SelectItem>
                      <SelectItem value="no">Нет</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Можно с животными</label>
                  <Select value={petsAllowed} onValueChange={setPetsAllowed}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Не важно</SelectItem>
                      <SelectItem value="yes">Да</SelectItem>
                      <SelectItem value="no">Нет</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Валюта</label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      <SelectItem value="AMD">AMD</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="RUB">RUB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Мин. цена</label>
                    <Input 
                      type="number" 
                      placeholder="От"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Макс. цена</label>
                    <Input 
                      type="number" 
                      placeholder="До"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* List */}
          <div className="px-6 pt-6 pb-6 flex flex-col h-full">
              <h3 className="font-bold text-xl mb-4">Другие объекты ({filteredProperties.length})</h3>
              
              {filteredProperties.length === 0 ? (
                <p className="text-gray-500 text-center py-12">Нет объектов с такими параметрами</p>
              ) : (
                <div className="overflow-y-auto pr-2 space-y-4" style={{ maxHeight: 'calc(9 * 196px)' }}>
                  {filteredProperties.map((prop) => (
                    <Link 
                      key={prop.id} 
                      to={`/property/${prop.id}`}
                      className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow h-[180px] flex-shrink-0"
                    >
                      <div className="flex gap-4 p-4 h-full">
                        <img 
                          src={prop.images?.[0] || '/placeholder.jpg'} 
                          alt={prop.title}
                          className="w-[150px] h-full object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-lg line-clamp-2 flex-1 pr-2">{prop.title}</h4>
                            {prop.created_at && (
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                {formatDate(prop.created_at)}
                              </span>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-[#FF7A00] mb-2">
                            {formatPrice(prop.price, prop.currency)}
                          </p>
                          <div className="flex gap-4 text-sm text-gray-600 mb-2">
                            {prop.rooms && <span>{prop.rooms} комн.</span>}
                            {prop.area && <span>{prop.area} м²</span>}
                            {prop.floor && prop.total_floors && <span>{prop.floor}/{prop.total_floors} этаж</span>}
                          </div>
                          {prop.address && (
                            <p className="text-sm text-gray-500 mt-auto line-clamp-1">
                              <Icon name="MapPin" size={14} className="inline mr-1" />
                              {prop.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
        </div>
      </div>

      {/* Карта с объектами на всю ширину */}
      {filteredProperties.length > 0 && (
        <div id="map-section" className="bg-white border-t border-gray-200">
          <div className="px-6 py-6">
            <h2 className="text-xl font-bold mb-4">Похожие объекты на карте</h2>
            <div className="h-[500px] rounded-xl overflow-hidden">
              <YerevanMapLeaflet
                properties={[property, ...filteredProperties.slice(0, 20)]}
                onPropertySelect={(selected) => {
                  if (selected.id !== property.id) {
                    navigate(`/property/${selected.id}`);
                  }
                }}
                isPreview={false}
                openOnClick={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}