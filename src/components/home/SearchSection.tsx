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
  currency: string;
  setCurrency: (value: string) => void;
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
  currency,
  setCurrency,
  onSearch
}: SearchSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="relative px-6 py-16 mb-12">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://cdn.poehali.dev/projects/73745f0c-4271-4bf6-a60b-4537cc7c5835/files/8b45040a-7e58-4a46-8636-12cb7658e3b3.jpg)',
          filter: 'brightness(0.85)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight animate-fadeInUp text-white drop-shadow-lg">Поиск недвижимости в Ереване</h1>
          <p className="text-white text-xl leading-relaxed animate-fadeInUp delay-100 drop-shadow-md">Найди свой идеальный вариант</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 animate-scaleIn delay-200">
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">Тип сделки</label>
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger className="h-14 rounded-xl border-gray-200">
                    <SelectValue placeholder="Все типы сделок" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы сделок</SelectItem>
                    <SelectItem value="rent">Долгосрочная аренда</SelectItem>
                    <SelectItem value="daily">Посуточная аренда</SelectItem>
                    <SelectItem value="sale">Продажа</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">Тип недвижимости</label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-14 rounded-xl border-gray-200">
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

              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">Район</label>
                <Select value={district} onValueChange={setDistrict}>
                  <SelectTrigger className="h-14 rounded-xl border-gray-200">
                    <SelectValue placeholder="Все районы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все районы</SelectItem>
                    <SelectItem value="ajapnyak">Ачапняк</SelectItem>
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
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">Цена</label>
                <div className="flex gap-2">
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="h-14 rounded-xl w-32 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AMD">AMD (֏)</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="RUB">RUB</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Цена"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-14 rounded-xl border-gray-200 flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium opacity-0">Поиск</label>
                <Button 
                  onClick={onSearch}
                  className="h-14 w-full bg-[#FF7A00] hover:bg-[#E66D00] hover:opacity-90 text-white rounded-xl font-medium transition-all text-base"
                >
                  Найти
                </Button>
              </div>
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