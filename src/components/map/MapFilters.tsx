import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import Icon from '@/components/ui/icon';

interface MapFiltersProps {
  selectedTransaction: string;
  setSelectedTransaction: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedDistrict: string[];
  setSelectedDistrict: (value: string[]) => void;
  rooms: string;
  setRooms: (value: string) => void;
  amenities: string;
  setAmenities: (value: string) => void;
  childrenAllowed: string;
  setChildrenAllowed: (value: string) => void;
  petsAllowed: string;
  setPetsAllowed: (value: string) => void;
  currency: string;
  setCurrency: (value: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  resetFilters: () => void;
  loading: boolean;
  filteredCount: number;
  onClose?: () => void;
}

const MapFilters: React.FC<MapFiltersProps> = ({
  selectedTransaction,
  setSelectedTransaction,
  selectedType,
  setSelectedType,
  selectedDistrict,
  setSelectedDistrict,
  rooms,
  setRooms,
  amenities,
  setAmenities,
  childrenAllowed,
  setChildrenAllowed,
  petsAllowed,
  setPetsAllowed,
  currency,
  setCurrency,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  resetFilters,
  loading,
  filteredCount,
  onClose
}) => {
  const hasActiveFilters = selectedType || selectedTransaction || selectedDistrict || minPrice || maxPrice || rooms || amenities.length > 0 || petsAllowed || childrenAllowed;

  return (
    <aside className="w-full sm:w-72 md:w-64 border-r bg-white overflow-y-auto flex-shrink-0 h-full">
      <div className="sticky top-0 bg-white border-b px-3 sm:px-4 py-3 z-10">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <Link to="/" className="flex items-center gap-2 text-gray-900 hover:text-[#FF7A00] transition-colors">
            <Icon name="ArrowLeft" size={18} className="sm:w-5 sm:h-5" />
            <span className="font-semibold text-sm sm:text-base">Назад</span>
          </Link>
          {onClose && (
            <button 
              onClick={onClose}
              className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">Фильтры</h2>
          {!loading && (
            <span className="text-xs sm:text-sm font-semibold text-[#FF7A00] bg-orange-50 px-2 py-1 rounded-full">
              {filteredCount}
            </span>
          )}
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Tag" size={16} className="text-gray-500" />
            <label className="block text-sm font-semibold text-gray-700">Тип сделки</label>
          </div>
          <Select value={selectedTransaction || 'all'} onValueChange={(v) => setSelectedTransaction(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Все типы сделок" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы сделок</SelectItem>
              <SelectItem value="rent">Долгосрочная аренда</SelectItem>
              <SelectItem value="daily_rent">Посуточная аренда</SelectItem>
              <SelectItem value="sale">Продажа</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Home" size={16} className="text-gray-500" />
            <label className="block text-sm font-semibold text-gray-700">Тип недвижимости</label>
          </div>
          <Select value={selectedType || 'all'} onValueChange={(v) => setSelectedType(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Все типы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              <SelectItem value="apartment">Квартира</SelectItem>
              <SelectItem value="house">Дом</SelectItem>
              <SelectItem value="commercial">Коммерция</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icon name="MapPin" size={16} className="text-gray-500" />
            <label className="block text-sm font-semibold text-gray-700">Район</label>
          </div>
          <Select value={selectedDistrict[0] || 'all'} onValueChange={(v) => setSelectedDistrict(v === 'all' ? [] : [v])}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Все районы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все районы</SelectItem>
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

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Bed" size={16} className="text-gray-500" />
            <label className="block text-sm font-semibold text-gray-700">Количество комнат</label>
          </div>
          <Select value={rooms} onValueChange={setRooms}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Не важно</SelectItem>
              <SelectItem value="1">1 комната</SelectItem>
              <SelectItem value="2">2 комнаты</SelectItem>
              <SelectItem value="3">3 комнаты</SelectItem>
              <SelectItem value="4">4+ комнат</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Sofa" size={16} className="text-gray-500" />
            <label className="block text-sm font-semibold text-gray-700">Удобства</label>
          </div>
          <Select value={amenities} onValueChange={setAmenities}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите удобства" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Не важно</SelectItem>
              <SelectItem value="tv">Телевизор</SelectItem>
              <SelectItem value="ac">Кондиционер</SelectItem>
              <SelectItem value="internet">Интернет</SelectItem>
              <SelectItem value="fridge">Холодильник</SelectItem>
              <SelectItem value="stove">Плита</SelectItem>
              <SelectItem value="microwave">Микроволновка</SelectItem>
              <SelectItem value="coffee_maker">Кофеварка</SelectItem>
              <SelectItem value="dishwasher">Посудомоечная машина</SelectItem>
              <SelectItem value="washing_machine">Стиральная машина</SelectItem>
              <SelectItem value="dryer">Сушильная машина</SelectItem>
              <SelectItem value="water_heater">Водонагреватель</SelectItem>
              <SelectItem value="iron">Утюг</SelectItem>
              <SelectItem value="hair_dryer">Фен</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Можно с детьми</label>
          <Select value={childrenAllowed} onValueChange={setChildrenAllowed}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Не важно</SelectItem>
              <SelectItem value="yes">Да</SelectItem>
              <SelectItem value="no">Нет</SelectItem>
              <SelectItem value="negotiable">По договоренности</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Можно с животными</label>
          <Select value={petsAllowed} onValueChange={setPetsAllowed}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Не важно</SelectItem>
              <SelectItem value="yes">Да</SelectItem>
              <SelectItem value="no">Нет</SelectItem>
              <SelectItem value="negotiable">По договоренности</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icon name="DollarSign" size={16} className="text-gray-500" />
            <label className="block text-sm font-semibold text-gray-700">Цена</label>
          </div>
          <div className="space-y-2">
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AMD">AMD (֏)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="RUB">RUB (₽)</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Мин цена"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full"
            />
            <Input
              type="number"
              placeholder="Макс цена"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <Button
          onClick={resetFilters}
          variant="outline"
          className="w-full hover:bg-gray-50 transition-colors mt-2"
          disabled={!hasActiveFilters}
        >
          <Icon name="RotateCcw" size={16} className="mr-2" />
          Сбросить фильтры
        </Button>

        {onClose && (
          <Button
            onClick={onClose}
            className="w-full mt-4 bg-[#FF7A00] hover:bg-[#E66D00] md:hidden"
          >
            Показать на карте
          </Button>
        )}
      </div>
    </aside>
  );
};

export default MapFilters;