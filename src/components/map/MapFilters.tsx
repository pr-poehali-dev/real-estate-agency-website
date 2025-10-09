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
  selectedDistrict: string;
  setSelectedDistrict: (value: string) => void;
  rooms: string;
  setRooms: (value: string) => void;
  amenities: string[];
  setAmenities: (value: string[]) => void;
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
  filteredCount
}) => {
  const hasActiveFilters = selectedType || selectedTransaction || selectedDistrict || minPrice || maxPrice || rooms || amenities.length > 0 || petsAllowed || childrenAllowed;

  return (
    <aside className="w-64 border-r bg-white overflow-y-auto flex-shrink-0">
      <div className="sticky top-0 bg-white border-b px-4 py-3 z-10">
        <Link to="/" className="flex items-center gap-2 text-gray-900 hover:text-[#FF7A00] transition-colors mb-4">
          <Icon name="ArrowLeft" size={20} />
          <span className="font-semibold">Назад</span>
        </Link>
        <h2 className="text-base font-bold text-gray-900">Фильтры</h2>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Тип сделки</label>
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
          <label className="block text-sm font-semibold text-gray-700 mb-3">Тип недвижимости</label>
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
          <label className="block text-sm font-semibold text-gray-700 mb-3">Район</label>
          <Select value={selectedDistrict || 'all'} onValueChange={(v) => setSelectedDistrict(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Все районы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все районы</SelectItem>
              <SelectItem value="Аджапняк">Аджапняк</SelectItem>
              <SelectItem value="Арабкир">Арабкир</SelectItem>
              <SelectItem value="Аван">Аван</SelectItem>
              <SelectItem value="Давташен">Давташен</SelectItem>
              <SelectItem value="Эребуни">Эребуни</SelectItem>
              <SelectItem value="Кентрон">Кентрон</SelectItem>
              <SelectItem value="Малатия-Себастия">Малатия-Себастия</SelectItem>
              <SelectItem value="Нор Норк">Нор Норк</SelectItem>
              <SelectItem value="Нубарашен">Нубарашен</SelectItem>
              <SelectItem value="Шенгавит">Шенгавит</SelectItem>
              <SelectItem value="Канакер-Зейтун">Канакер-Зейтун</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Количество комнат</label>
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
          <label className="block text-sm font-semibold text-gray-700 mb-3">Удобства</label>
          <MultiSelect
            options={[
              { label: 'Телевизор', value: 'tv' },
              { label: 'Кондиционер', value: 'ac' },
              { label: 'Интернет', value: 'internet' },
              { label: 'Холодильник', value: 'fridge' },
              { label: 'Плита', value: 'stove' },
              { label: 'Стиральная машина', value: 'washing_machine' },
              { label: 'Водонагреватель', value: 'water_heater' },
            ]}
            selected={amenities}
            onChange={setAmenities}
            placeholder="Выберите удобства"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Можно с детьми</label>
          <Select value={childrenAllowed} onValueChange={setChildrenAllowed}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Не важно" />
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
              <SelectValue placeholder="Не важно" />
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
          <label className="block text-sm font-semibold text-gray-700 mb-3">Цена</label>
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

        {hasActiveFilters && (
          <Button
            onClick={resetFilters}
            variant="outline"
            className="w-full"
          >
            Сбросить фильтры
          </Button>
        )}

        <div className="text-center text-sm text-gray-600 pt-4 border-t">
          {loading ? 'Загрузка...' : `Найдено объектов: ${filteredCount}`}
        </div>
      </div>
    </aside>
  );
};

export default MapFilters;
