import React from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Icon from './ui/icon';

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
  const districts = [
    'Все районы',
    'Аван',
    'Ачапняк',
    'Арабкир',
    'Давташен',
    'Канакер-Зейтун',
    'Центр (Кентрон)',
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
    { value: 'all', label: 'Все операции' },
    { value: 'rent', label: 'Долгосрочная аренда' },
    { value: 'daily_rent', label: 'Посуточная аренда' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 animate-scaleIn">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 animate-fadeInUp">
          <Icon name="Filter" size={20} />
          Фильтры поиска
        </h3>
        <Button variant="outline" size="sm" onClick={onReset} className="hover:scale-105 transition-transform">
          <Icon name="RotateCcw" size={16} className="mr-2" />
          Сбросить
        </Button>
      </div>

      <div className="space-y-4">
        {/* Первая строка */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Тип сделки */}
          <div className="space-y-2">
            <Label htmlFor="transaction">Тип сделки</Label>
            <Select value={selectedTransaction} onValueChange={onTransactionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите операцию" />
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

          {/* Тип недвижимости */}
          <div className="space-y-2">
            <Label htmlFor="type">Тип недвижимости</Label>
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
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

          {/* Район */}
          <div className="space-y-2">
            <Label htmlFor="district">Район</Label>
            <Select value={selectedDistrict} onValueChange={onDistrictChange}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите район" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Количество спален */}
          <div className="space-y-2">
            <Label htmlFor="rooms">Количество спален</Label>
            <Select value="all">
              <SelectTrigger>
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Любое</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Вторая строка */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Поиск по улице */}
          <div className="space-y-2">
            <Label htmlFor="street-search">Поиск по улице</Label>
            <Input
              id="street-search"
              type="text"
              placeholder="Название улицы..."
              value={streetSearch}
              onChange={(e) => onStreetSearchChange(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Мин цена */}
          <div className="space-y-2">
            <Label htmlFor="price-min">Мин цена</Label>
            <Input
              id="price-min"
              type="number"
              placeholder="0"
              value={priceRange.min}
              onChange={(e) =>
                onPriceRangeChange({ ...priceRange, min: e.target.value })
              }
            />
          </div>

          {/* Макс цена */}
          <div className="space-y-2">
            <Label htmlFor="price-max">Макс цена</Label>
            <Input
              id="price-max"
              type="number"
              placeholder="∞"
              value={priceRange.max}
              onChange={(e) =>
                onPriceRangeChange({ ...priceRange, max: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;