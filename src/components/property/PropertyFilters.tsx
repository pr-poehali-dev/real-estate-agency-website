import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";

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
  onApplyFilters?: () => void;
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
  setCurrency,
  onApplyFilters
}: PropertyFiltersProps) {
  const activeFiltersCount = [
    transactionType !== 'all',
    propertyType !== 'all',
    district,
    rooms !== 'any',
    amenities,
    childrenAllowed,
    petsAllowed,
    minPrice,
    maxPrice,
    currency !== 'AMD'
  ].filter(Boolean).length;

  return (
    <div className="bg-white border-b border-gray-200 h-full overflow-y-auto">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <h3 className="font-bold text-lg">Фильтры</h3>
        {activeFiltersCount > 0 && (
          <span className="text-[#FF7A00] font-bold text-lg">{activeFiltersCount}</span>
        )}
      </div>
      
      <div className="px-4 py-4">
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">ОСНОВНЫЕ</h4>
          
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                <Icon name="Tag" size={18} className="text-gray-500" />
                Тип сделки
              </label>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger className="h-11 bg-white">
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
            
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                <Icon name="Home" size={18} className="text-gray-500" />
                Тип недвижимости
              </label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="h-11 bg-white">
                  <SelectValue placeholder="Все типы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="apartment">Квартира</SelectItem>
                  <SelectItem value="house">Дом</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                <Icon name="MapPin" size={18} className="text-gray-500" />
                Район
              </label>
              <Select value={district || undefined} onValueChange={setDistrict}>
                <SelectTrigger className="h-11 bg-white">
                  <SelectValue placeholder="Все районы" />
                </SelectTrigger>
                <SelectContent>
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
        </div>

        <div className="mb-6">
          <h4 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">ДОПОЛНИТЕЛЬНЫЕ</h4>
          
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                <Icon name="DoorOpen" size={18} className="text-gray-500" />
                Количество комнат
              </label>
              <Select value={rooms} onValueChange={setRooms}>
                <SelectTrigger className="h-11 bg-white">
                  <SelectValue placeholder="Выберите" />
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
            
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                <Icon name="Wifi" size={18} className="text-gray-500" />
                Удобства
              </label>
              <Select value={amenities || undefined} onValueChange={setAmenities}>
                <SelectTrigger className="h-11 bg-white">
                  <SelectValue placeholder="Выберите удобства" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Телевизор">Телевизор</SelectItem>
                  <SelectItem value="Кондиционер">Кондиционер</SelectItem>
                  <SelectItem value="Интернет">Интернет</SelectItem>
                  <SelectItem value="Холодильник">Холодильник</SelectItem>
                  <SelectItem value="Плита">Плита</SelectItem>
                  <SelectItem value="Микроволновка">Микроволновка</SelectItem>
                  <SelectItem value="Кофеварка">Кофеварка</SelectItem>
                  <SelectItem value="Посудомоечная машина">Посудомоечная машина</SelectItem>
                  <SelectItem value="Стиральная машина">Стиральная машина</SelectItem>
                  <SelectItem value="Сушильная машина">Сушильная машина</SelectItem>
                  <SelectItem value="Водонагреватель">Водонагреватель</SelectItem>
                  <SelectItem value="Утюг">Утюг</SelectItem>
                  <SelectItem value="Фен">Фен</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                <Icon name="Baby" size={18} className="text-gray-500" />
                Можно с детьми
              </label>
              <Select value={childrenAllowed || undefined} onValueChange={setChildrenAllowed}>
                <SelectTrigger className="h-11 bg-white">
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Да</SelectItem>
                  <SelectItem value="no">Нет</SelectItem>
                  <SelectItem value="negotiable">По договоренности</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                <Icon name="Dog" size={18} className="text-gray-500" />
                Можно с животными
              </label>
              <Select value={petsAllowed || undefined} onValueChange={setPetsAllowed}>
                <SelectTrigger className="h-11 bg-white">
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Да</SelectItem>
                  <SelectItem value="no">Нет</SelectItem>
                  <SelectItem value="negotiable">По договоренности</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                <Icon name="DollarSign" size={18} className="text-gray-500" />
                Цена
              </label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Input 
                  type="number" 
                  placeholder="от"
                  className="h-11"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <Input 
                  type="number" 
                  placeholder="до"
                  className="h-11"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="h-11 bg-white">
                  <SelectValue placeholder="AMD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AMD">AMD (֏)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="RUB">RUB (₽)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-4 pb-2">
          <Button 
            onClick={onApplyFilters}
            className="w-full h-12 bg-[#FF7A00] hover:bg-[#E66D00] text-white font-semibold"
          >
            Применить фильтры
          </Button>
        </div>
      </div>
    </div>
  );
}
