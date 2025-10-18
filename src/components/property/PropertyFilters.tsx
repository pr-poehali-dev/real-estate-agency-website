import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";

interface PropertyFiltersProps {
  transactionType: string;
  setTransactionType: (value: string) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
  district: string;
  setDistrict: (value: string) => void;
  rooms: string;
  setRooms: (value: string) => void;
  amenities: string[];
  setAmenities: (value: string[]) => void;
  childrenAllowed: string[];
  setChildrenAllowed: (value: string[]) => void;
  petsAllowed: string[];
  setPetsAllowed: (value: string[]) => void;
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
  return (
    <div className="border-b border-gray-200 px-3 md:px-6 py-3 md:py-4 bg-gray-50">
      <h3 className="font-bold text-base md:text-lg mb-3">Фильтры</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Тип сделки</label>
          <Select value={transactionType} onValueChange={setTransactionType}>
            <SelectTrigger className="h-10">
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
          <label className="text-sm font-medium mb-1.5 block">Тип недвижимости</label>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="h-10">
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
          <label className="text-sm font-medium mb-1.5 block">Район</label>
          <Select value={district} onValueChange={setDistrict}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все районы</SelectItem>
              <SelectItem value="Центр (Кентрон)">Центр</SelectItem>
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
          <label className="text-sm font-medium mb-1.5 block">Количество комнат</label>
          <Select value={rooms} onValueChange={setRooms}>
            <SelectTrigger className="h-10">
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
        
        <div>
          <label className="text-sm font-medium mb-1.5 block">Валюта</label>
          <div className="flex gap-1">
            <Button 
              variant={currency === 'AMD' ? 'default' : 'outline'} 
              size="sm" 
              className="flex-1 h-10"
              onClick={() => setCurrency('AMD')}
            >
              AMD
            </Button>
            <Button 
              variant={currency === 'USD' ? 'default' : 'outline'} 
              size="sm" 
              className="flex-1 h-10"
              onClick={() => setCurrency('USD')}
            >
              USD
            </Button>
            <Button 
              variant={currency === 'RUB' ? 'default' : 'outline'} 
              size="sm" 
              className="flex-1 h-10"
              onClick={() => setCurrency('RUB')}
            >
              RUB
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Удобства</label>
          <MultiSelect
            options={[
              { label: 'Телевизор', value: 'Телевизор' },
              { label: 'Кондиционер', value: 'Кондиционер' },
              { label: 'Интернет', value: 'Интернет' },
              { label: 'Холодильник', value: 'Холодильник' },
              { label: 'Плита', value: 'Плита' },
              { label: 'Микроволновка', value: 'Микроволновка' },
              { label: 'Кофеварка', value: 'Кофеварка' },
              { label: 'Посудомоечная машина', value: 'Посудомоечная машина' },
              { label: 'Стиральная машина', value: 'Стиральная машина' },
              { label: 'Сушильная машина', value: 'Сушильная машина' },
              { label: 'Водонагреватель', value: 'Водонагреватель' },
              { label: 'Утюг', value: 'Утюг' },
              { label: 'Фен', value: 'Фен' },
            ]}
            selected={amenities}
            onChange={setAmenities}
            placeholder="Выберите"
            className="h-10"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1.5 block">Можно с детьми</label>
          <MultiSelect
            options={[
              { label: 'Да', value: 'yes' },
              { label: 'Нет', value: 'no' },
              { label: 'По договоренности', value: 'negotiable' },
            ]}
            selected={childrenAllowed}
            onChange={setChildrenAllowed}
            placeholder="Выберите"
            className="h-10"
            showSearch={false}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1.5 block">Можно с животными</label>
          <MultiSelect
            options={[
              { label: 'Да', value: 'yes' },
              { label: 'Нет', value: 'no' },
              { label: 'По договоренности', value: 'negotiable' },
            ]}
            selected={petsAllowed}
            onChange={setPetsAllowed}
            placeholder="Выберите"
            className="h-10"
            showSearch={false}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1.5 block">Мин. цена</label>
          <Input 
            type="number" 
            placeholder="От"
            className="h-10"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1.5 block">Макс. цена</label>
          <Input 
            type="number" 
            placeholder="До"
            className="h-10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1.5 block md:invisible">Найти</label>
          <Button className="w-full h-10 bg-[#FF7A00] hover:bg-[#E66D00]">
            Найти
          </Button>
        </div>
      </div>
    </div>
  );
}