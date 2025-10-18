import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface PropertyFiltersProps {
  transactionType: string;
  setTransactionType: (value: string) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
  district: string;
  setDistrict: (value: string) => void;
  rooms: string;
  setRooms: (value: string) => void;
  amenities: string;
  setAmenities: (value: string) => void;
  childrenAllowed: string;
  setChildrenAllowed: (value: string) => void;
  petsAllowed: string;
  setPetsAllowed: (value: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  currency: string;
  setCurrency: (value: string) => void;
}

export default function PropertyFilters({
  transactionType,
  setTransactionType,
  propertyType,
  setPropertyType,
  district,
  setDistrict,
  rooms,
  setRooms,
  amenities,
  setAmenities,
  childrenAllowed,
  setChildrenAllowed,
  petsAllowed,
  setPetsAllowed,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  currency,
  setCurrency
}: PropertyFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const activeFiltersCount = [
    transactionType !== 'all',
    propertyType !== 'all',
    district,
    rooms !== 'any',
    amenities,
    minPrice,
    maxPrice,
    childrenAllowed,
    petsAllowed,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setTransactionType('all');
    setPropertyType('all');
    setDistrict('');
    setRooms('any');
    setAmenities('');
    setChildrenAllowed('');
    setPetsAllowed('');
    setMinPrice('');
    setMaxPrice('');
    setCurrency('AMD');
  };

  return (
    <div className="border-b border-gray-200 bg-gradient-to-br from-white to-gray-50">
      <div className="px-3 md:px-6 py-4 md:py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#FF7A00] to-[#FF5500] p-2.5 rounded-lg">
              <Icon name="SlidersHorizontal" size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg text-gray-900">Фильтры</h3>
              {activeFiltersCount > 0 && (
                <p className="text-xs text-gray-500">Активно: {activeFiltersCount}</p>
              )}
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="text-[#FF7A00] border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white transition-all"
            >
              <Icon name="X" size={14} className="mr-1.5" />
              Сбросить
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon name="Tag" size={14} className="text-[#FF7A00]" />
              <label className="text-sm font-semibold text-gray-700">Тип сделки</label>
            </div>
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger className="h-11 border-2 border-gray-200 hover:border-[#FF7A00] focus:border-[#FF7A00] transition-colors">
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
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon name="Home" size={14} className="text-[#FF7A00]" />
              <label className="text-sm font-semibold text-gray-700">Тип недвижимости</label>
            </div>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="h-11 border-2 border-gray-200 hover:border-[#FF7A00] focus:border-[#FF7A00] transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="apartment">Квартира</SelectItem>
                <SelectItem value="house">Дом</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon name="MapPin" size={14} className="text-[#FF7A00]" />
              <label className="text-sm font-semibold text-gray-700">Район</label>
            </div>
            <Select value={district || undefined} onValueChange={setDistrict}>
              <SelectTrigger className="h-11 border-2 border-gray-200 hover:border-[#FF7A00] focus:border-[#FF7A00] transition-colors">
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="Центр (Кентрон)">Кентрон</SelectItem>
                <SelectItem value="Аван">Аван</SelectItem>
                <SelectItem value="Ачапняк">Ачапняк</SelectItem>
                <SelectItem value="Арабкир">Арабкир</SelectItem>
                <SelectItem value="Давташен">Давташен</SelectItem>
                <SelectItem value="Эребуни">Эребуни</SelectItem>
                <SelectItem value="Канакер-Зейтун">Канакер-Зейтун</SelectItem>
                <SelectItem value="Малатия-Себастия">Малатия-Себастия</SelectItem>
                <SelectItem value="Нор Норк">Нор Норк</SelectItem>
                <SelectItem value="Нубарашен">Нубарашен</SelectItem>
                <SelectItem value="Шенгавит">Шенгавит</SelectItem>
                <SelectItem value="Норк-Мараш">Норк-Мараш</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon name="DollarSign" size={14} className="text-[#FF7A00]" />
              <label className="text-sm font-semibold text-gray-700">Валюта</label>
            </div>
            <div className="flex gap-2">
              {(['AMD', 'USD', 'RUB'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`flex-1 py-2.5 px-3 rounded-lg font-bold text-sm transition-all ${
                    currency === curr || (currency === 'all' && curr === 'AMD')
                      ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-white shadow-lg shadow-orange-200 scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon name="TrendingDown" size={14} className="text-[#FF7A00]" />
              <label className="text-sm font-semibold text-gray-700">Мин. цена</label>
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="От"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-11 border-2 border-gray-200 hover:border-[#FF7A00] focus:border-[#FF7A00] transition-colors pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-semibold">
                {currency === 'all' ? 'AMD' : currency}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon name="TrendingUp" size={14} className="text-[#FF7A00]" />
              <label className="text-sm font-semibold text-gray-700">Макс. цена</label>
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="До"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-11 border-2 border-gray-200 hover:border-[#FF7A00] focus:border-[#FF7A00] transition-colors pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-semibold">
                {currency === 'all' ? 'AMD' : currency}
              </span>
            </div>
          </div>
        </div>

        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen} className="mt-4">
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-bold text-gray-700">
              <Icon name={isAdvancedOpen ? 'ChevronUp' : 'ChevronDown'} size={16} />
              {isAdvancedOpen ? 'Скрыть доп. фильтры' : 'Показать доп. фильтры'}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name="Bed" size={14} className="text-[#FF7A00]" />
                  <label className="text-sm font-semibold text-gray-700">Количество комнат</label>
                </div>
                <Select value={rooms} onValueChange={setRooms}>
                  <SelectTrigger className="h-11 border-2 border-gray-200 hover:border-[#FF7A00] focus:border-[#FF7A00] transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Любое</SelectItem>
                    <SelectItem value="1">1 комната</SelectItem>
                    <SelectItem value="2">2 комнаты</SelectItem>
                    <SelectItem value="3">3 комнаты</SelectItem>
                    <SelectItem value="4">4+ комнат</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name="Sofa" size={14} className="text-[#FF7A00]" />
                  <label className="text-sm font-semibold text-gray-700">Удобства</label>
                </div>
                <Select value={amenities} onValueChange={setAmenities}>
                  <SelectTrigger className="h-11 border-2 border-gray-200 hover:border-[#FF7A00] focus:border-[#FF7A00] transition-colors">
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Не важно</SelectItem>
                    <SelectItem value="tv">Телевизор</SelectItem>
                    <SelectItem value="ac">Кондиционер</SelectItem>
                    <SelectItem value="internet">Интернет</SelectItem>
                    <SelectItem value="fridge">Холодильник</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name="Baby" size={14} className="text-[#FF7A00]" />
                  <label className="text-sm font-semibold text-gray-700">Можно с детьми</label>
                </div>
                <Select value={childrenAllowed} onValueChange={setChildrenAllowed}>
                  <SelectTrigger className="h-11 border-2 border-gray-200 hover:border-[#FF7A00] focus:border-[#FF7A00] transition-colors">
                    <SelectValue placeholder="Не важно" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Не важно</SelectItem>
                    <SelectItem value="yes">Да</SelectItem>
                    <SelectItem value="no">Нет</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name="Dog" size={14} className="text-[#FF7A00]" />
                  <label className="text-sm font-semibold text-gray-700">Можно с животными</label>
                </div>
                <Select value={petsAllowed} onValueChange={setPetsAllowed}>
                  <SelectTrigger className="h-11 border-2 border-gray-200 hover:border-[#FF7A00] focus:border-[#FF7A00] transition-colors">
                    <SelectValue placeholder="Не важно" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Не важно</SelectItem>
                    <SelectItem value="yes">Да</SelectItem>
                    <SelectItem value="no">Нет</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
