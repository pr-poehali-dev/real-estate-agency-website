import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface PropertyHeaderProps {
  onBack: () => void;
  onToggleFilters: () => void;
  showFilters: boolean;
}

export default function PropertyHeader({ onBack, onToggleFilters, showFilters }: PropertyHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-white px-3 md:px-6 py-3 md:py-4 shadow-sm">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl md:text-2xl font-bold" style={{ color: '#FF7A00' }}>WSE.AM</Link>
        <div className="flex gap-2 md:gap-3">
          <Button 
            onClick={onBack}
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 h-9 md:h-10"
          >
            <Icon name="ArrowLeft" size={18} className="md:mr-2" />
            <span className="hidden md:inline">Назад</span>
          </Button>
          <Button 
            onClick={onToggleFilters}
            variant="outline"
            size="sm"
            className={`border-gray-300 text-gray-700 hover:bg-gray-50 h-9 md:h-10 ${showFilters ? 'bg-gray-100' : ''}`}
          >
            <Icon name="SlidersHorizontal" size={18} className="md:mr-2" />
            <span className="hidden sm:inline">Фильтры</span>
          </Button>
          <Button 
            onClick={() => navigate('/full-map')}
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 h-9 md:h-10 hidden sm:flex"
          >
            <Icon name="Map" size={18} className="md:mr-2" />
            <span className="hidden md:inline">Карта</span>
          </Button>
        </div>
      </div>
    </header>
  );
}