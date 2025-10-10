import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface PropertyHeaderProps {
  onBack: () => void;
  onToggleFilters: () => void;
  showFilters: boolean;
}

export default function PropertyHeader({ onBack, onToggleFilters, showFilters }: PropertyHeaderProps) {
  return (
    <header className="bg-white px-6 py-4 shadow-sm">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold" style={{ color: '#FF7A00' }}>WSE.AM</Link>
        <div className="flex gap-3">
          <Button 
            onClick={onBack}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
          <Button 
            onClick={onToggleFilters}
            variant="outline"
            className={`border-gray-300 text-gray-700 hover:bg-gray-50 ${showFilters ? 'bg-gray-100' : ''}`}
          >
            <Icon name="SlidersHorizontal" size={20} className="mr-2" />
            Фильтры
          </Button>
          <Button 
            onClick={() => document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' })}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Icon name="Map" size={20} className="mr-2" />
            Карта
          </Button>
        </div>
      </div>
    </header>
  );
}
