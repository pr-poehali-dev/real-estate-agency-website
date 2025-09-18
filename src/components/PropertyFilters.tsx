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
  onDistrictChange: (district: string) => void;
  onTypeChange: (type: string) => void;
  onTransactionChange: (transaction: string) => void;
  onPriceRangeChange: (range: { min: string; max: string }) => void;
  onReset: () => void;
}

const PropertyFilters: React.FC<FilterProps> = ({
  selectedDistrict,
  selectedType,
  selectedTransaction,
  priceRange,
  onDistrictChange,
  onTypeChange,
  onTransactionChange,
  onPriceRangeChange,
  onReset,
}) => {
  const districts = [
    'Все районы',
    'Центр',
    'Аджапняк',
    'Аван',
    'Арабкир',
    'Давташен',
    'Эребуни',
    'Канакер-Зейтун',
    'Малатия-Себастия',
    'Нор Норк',
    'Нубарашен',
    'Шенгавит',
  ];

  const propertyTypes = [
    { value: 'all', label: 'Все типы' },
    { value: 'apartment', label: 'Квартира' },
    { value: 'house', label: 'Дом' },
    { value: 'commercial', label: 'Коммерческая' },
  ];

  const transactionTypes = [
    { value: 'all', label: 'Все операции' },
    { value: 'sale', label: 'Продажа' },
    { value: 'rent', label: 'Аренда' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Icon name="Filter" size={20} />
          Фильтры поиска
        </h3>
        <Button variant="outline" size="sm" onClick={onReset}>
          <Icon name="RotateCcw" size={16} className="mr-2" />
          Сбросить
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

        {/* Тип операции */}
        <div className="space-y-2">
          <Label htmlFor="transaction">Операция</Label>
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

        {/* Цена от */}
        <div className="space-y-2">
          <Label htmlFor="price-min">Цена от</Label>
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

        {/* Цена до */}
        <div className="space-y-2">
          <Label htmlFor="price-max">Цена до</Label>
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
  );
};

export default PropertyFilters;