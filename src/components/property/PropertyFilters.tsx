import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200 bg-white">
      <div className="px-4 md:px-6 py-4 md:py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg md:text-xl">Фильтры</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-[#FF7A00] hover:text-[#E66D00]"
          >
            Сбросить всё
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип сделки
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип недвижимости
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Район
            </label>
            <Select value={district || undefined} onValueChange={setDistrict}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите район" />
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Валюта
            </label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AMD">AMD</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="RUB">RUB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Цена
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="От"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <Input
                type="number"
                placeholder="До"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Количество комнат
            </label>
            <Select value={rooms} onValueChange={setRooms}>
              <SelectTrigger>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Удобства
            </label>
            <Select value={amenities} onValueChange={setAmenities}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите удобство" />
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Можно с детьми
            </label>
            <Select value={childrenAllowed} onValueChange={setChildrenAllowed}>
              <SelectTrigger>
                <SelectValue placeholder="Не важно" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Не важно</SelectItem>
                <SelectItem value="yes">Да</SelectItem>
                <SelectItem value="no">Нет</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Можно с животными
            </label>
            <Select value={petsAllowed} onValueChange={setPetsAllowed}>
              <SelectTrigger>
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
      </div>
    </div>
  );
}
