import React, { useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import Icon from './ui/icon';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

interface FilterProps {
  selectedDistrict: string;
  selectedType: string;
  selectedTransaction: string;
  priceRange: { min: string; max: string };
  streetSearch: string;
  onDistrictChange: (district: string) => void;
  onTypeChange: (type: string) => void;
  onTransactionChange: (transaction: string) => void;
  onPriceRangeChange: (range: { min: string; max: string }) => void;
  onStreetSearchChange: (search: string) => void;
  onReset: () => void;
}

const PropertyFilters: React.FC<FilterProps> = ({
  selectedDistrict,
  selectedType,
  selectedTransaction,
  priceRange,
  streetSearch,
  onDistrictChange,
  onTypeChange,
  onTransactionChange,
  onPriceRangeChange,
  onStreetSearchChange,
  onReset,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<'AMD' | 'USD' | 'RUB'>('AMD');
  const [selectedRooms, setSelectedRooms] = useState<string>('all');

  const districts = [
    'Все районы',
    'Центр (Кентрон)',
    'Аван',
    'Ачапняк',
    'Арабкир',
    'Давташен',
    'Канакер-Зейтун',
    'Малатия-Себастия',
    'Нор Норк',
    'Нубарашен',
    'Шенгавит',
    'Эребуни',
    'Норк-Мараш',
  ];

  const propertyTypes = [
    { value: 'all', label: 'Все типы' },
    { value: 'apartment', label: 'Квартира' },
    { value: 'house', label: 'Дом' },
    { value: 'commercial', label: 'Коммерция' },
  ];

  const transactionTypes = [
    { value: 'all', label: 'Все' },
    { value: 'rent', label: 'Долгосрочная аренда' },
    { value: 'daily_rent', label: 'Посуточно' },
    { value: 'sale', label: 'Продажа' },
  ];

  const activeFiltersCount = [
    selectedType !== 'all',
    selectedTransaction !== 'all',
    selectedDistrict !== 'Все районы',
    priceRange.min,
    priceRange.max,
    streetSearch,
    selectedRooms !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-scaleIn">
      <div className="bg-gradient-to-r from-[#FF7A00] to-[#FF5500] px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <Icon name="SlidersHorizontal" size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white">Фильтры</h3>
              {activeFiltersCount > 0 && (
                <p className="text-xs text-white/80">Активно: {activeFiltersCount}</p>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="text-white hover:bg-white/20 hover:text-white transition-all"
          >
            <Icon name="X" size={16} className="mr-1.5" />
            Сбросить
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon name="Tag" size={14} className="text-[#FF7A00]" />
              <label className="text-sm font-semibold text-gray-700">Тип сделки</label>
            </div>
            <Select value={selectedTransaction} onValueChange={onTransactionChange}>
              <SelectTrigger className="border-2 border-gray-200 hover:border-[#FF7A00] focus:border-[#FF7A00] transition-colors">
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent>
                {transactionTypes.map((transaction) => (
                  <SelectItem key={transaction.value} value={transaction.value}>
                    {transaction.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon name="Home" size={14} className="text-[#FF7A00]" />
              <label className="text-sm font-semibold text-gray-700">Тип недвижимости</label>
            </div>
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger className="border-2 border-gray-200 hover:border-[#FF7A00] focus:border-[#FF7A00] transition-colors">
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon name="MapPin" size={14} className="text-[#FF7A00]" />
              <label className="text-sm font-semibold text-gray-700">Район</label>
            </div>
            <Select value={selectedDistrict} onValueChange={onDistrictChange}>
              <SelectTrigger className="border-2 border-gray-200 hover:border-[#FF7A00] focus:border-[#FF7A00] transition-colors">
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon name="DollarSign" size={14} className="text-[#FF7A00]" />
              <label className="text-sm font-semibold text-gray-700">Валюта</label>
            </div>
            <div className="flex gap-2">
              {(['AMD', 'USD', 'RUB'] as const).map((currency) => (
                <button
                  key={currency}
                  onClick={() => setSelectedCurrency(currency)}
                  className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all ${
                    selectedCurrency === currency
                      ? 'bg-[#FF7A00] text-white shadow-lg shadow-orange-200 scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {currency}
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
                value={priceRange.min}
                onChange={(e) => onPriceRangeChange({ ...priceRange, min: e.target.value })}
                className="border-2 border-gray-200 hover:border-[#FF7A00] focus:border-[#FF7A00] transition-colors pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                {selectedCurrency}
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
                value={priceRange.max}
                onChange={(e) => onPriceRangeChange({ ...priceRange, max: e.target.value })}
                className="border-2 border-gray-200 hover:border-[#FF7A00] focus:border-[#FF7A00] transition-colors pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                {selectedCurrency}
              </span>
            </div>
          </div>
        </div>

        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-semibold text-gray-700">
              <Icon name={isAdvancedOpen ? 'ChevronUp' : 'ChevronDown'} size={16} />
              {isAdvancedOpen ? 'Скрыть доп. фильтры' : 'Показать доп. фильтры'}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name="Bed" size={14} className="text-[#FF7A00]" />
                  <label className="text-sm font-semibold text-gray-700">Количество комнат</label>
                </div>
                <Select value={selectedRooms} onValueChange={setSelectedRooms}>
                  <SelectTrigger className="border-2 border-gray-200 hover:border-[#FF7A00] focus:border-[#FF7A00] transition-colors">
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Любое</SelectItem>
                    <SelectItem value="1">1 комната</SelectItem>
                    <SelectItem value="2">2 комнаты</SelectItem>
                    <SelectItem value="3">3 комнаты</SelectItem>
                    <SelectItem value="4">4+ комнат</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name="Search" size={14} className="text-[#FF7A00]" />
                  <label className="text-sm font-semibold text-gray-700">Поиск по улице</label>
                </div>
                <Input
                  type="text"
                  placeholder="Название улицы..."
                  value={streetSearch}
                  onChange={(e) => onStreetSearchChange(e.target.value)}
                  className="border-2 border-gray-200 hover:border-[#FF7A00] focus:border-[#FF7A00] transition-colors"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default PropertyFilters;
