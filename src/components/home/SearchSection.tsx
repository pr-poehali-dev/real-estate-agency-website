import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";

interface SearchSectionProps {
  transactionType: string;
  setTransactionType: (value: string) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
  district: string;
  setDistrict: (value: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  currency: string;
  setCurrency: (value: string) => void;
  rooms: string;
  amenities: string[];
  petsAllowed: string;
  childrenAllowed: string;
  streetSearch: string;
  onSearch: () => void;
}

export default function SearchSection({
  transactionType,
  setTransactionType,
  propertyType,
  setPropertyType,
  district,
  setDistrict,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  currency,
  setCurrency,
  rooms,
  amenities,
  petsAllowed,
  childrenAllowed,
  streetSearch,
  onSearch
}: SearchSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="relative px-6 py-6 max-w-7xl mx-auto">
      <div className="relative z-10">
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight animate-fadeInUp">Поиск недвижимости в Ереване</h1>
          <p className="text-gray-600 text-xl leading-relaxed animate-fadeInUp delay-100">Найди свой идеальный вариант</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-scaleIn delay-200">
          <div className="space-y-5">
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger className="h-16 rounded-2xl w-full md:w-52 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">Долгосрочная аренда</SelectItem>
                  <SelectItem value="daily">Посуточная аренда</SelectItem>
                  <SelectItem value="sale">Продажа</SelectItem>
                </SelectContent>
              </Select>

              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="h-16 rounded-2xl w-full md:w-52 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Квартира</SelectItem>
                  <SelectItem value="house">Дом</SelectItem>
                  <SelectItem value="commercial">Коммерция</SelectItem>
                </SelectContent>
              </Select>

              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="h-16 rounded-2xl w-full md:w-52 border-gray-200">
                  <SelectValue placeholder="Все районы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все районы</SelectItem>
                  <SelectItem value="ajapnyak">Аджапняк</SelectItem>
                  <SelectItem value="arabkir">Арабкир</SelectItem>
                  <SelectItem value="avan">Аван</SelectItem>
                  <SelectItem value="davtashen">Давташен</SelectItem>
                  <SelectItem value="erebuni">Эребуни</SelectItem>
                  <SelectItem value="kentron">Кентрон</SelectItem>
                  <SelectItem value="malatia-sebastia">Малатия-Себастия</SelectItem>
                  <SelectItem value="nor-nork">Нор Норк</SelectItem>
                  <SelectItem value="nubarashen">Нубарашен</SelectItem>
                  <SelectItem value="shengavit">Шенгавит</SelectItem>
                  <SelectItem value="kanaker-zeytun">Канакер-Зейтун</SelectItem>
                  <SelectItem value="qanaqer-zeytun">Канакер-Зейтун</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Цена от"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-16 rounded-2xl w-full md:w-32 border-gray-200"
              />
              <Input
                type="number"
                placeholder="до"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-16 rounded-2xl w-full md:w-32 border-gray-200"
              />
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="h-16 rounded-2xl w-full md:w-24 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AMD">AMD</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="RUB">RUB</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                onClick={onSearch}
                className="h-16 px-12 bg-[#FF7A00] hover:bg-[#E66D00] hover:opacity-90 text-white rounded-2xl font-medium transition-all text-base whitespace-nowrap"
              >
                Найти
              </Button>
            </div>

            <Button 
              onClick={() => navigate('/map')}
              variant="outline"
              className="w-full h-16 rounded-2xl border border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-medium transition-all"
            >
              <Icon name="Map" size={20} className="mr-2" />
              Открыть карту
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}