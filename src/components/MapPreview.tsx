import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import YerevanMapLeaflet from '@/components/YerevanMapLeaflet';
import { sampleProperties } from '@/data/sampleProperties';

interface MapPreviewProps {
  t: any;
  isVisible: any;
}

export default function MapPreview({ t, isVisible }: MapPreviewProps) {
  const navigate = useNavigate();
  
  // Берём первые 10 объектов для превью
  const previewProperties = sampleProperties.slice(0, 10);

  return (
    <section 
      className="py-20 px-6 bg-gray-50" 
      data-animate 
      id="map-preview"
    >
      <div className={`container mx-auto transition-all duration-1000 ${isVisible['map-preview'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-montserrat text-gray-900 mb-4">
            🗺️ Найдите своё жильё на карте
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Интерактивная карта Еревана с актуальными объектами недвижимости. 
            Выбирайте район, фильтруйте по цене и типу жилья.
          </p>
        </div>

        {/* Map Container */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Map */}
            <div 
              className="h-[400px] relative cursor-pointer group"
              onClick={() => navigate('/map')}
            >
              <YerevanMapLeaflet
                properties={previewProperties}
                onPropertySelect={() => {}}
                isPreview={true}
              />
              
              {/* Overlay with CTA */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none">
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center pointer-events-auto">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg shadow-2xl group-hover:scale-105 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/map');
                    }}
                  >
                    <Icon name="Map" size={24} className="mr-2" />
                    Открыть полную карту
                  </Button>
                </div>
              </div>
            </div>

            {/* Info Bar */}
            <div className="bg-white border-t p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon name="MapPin" size={24} className="text-primary" />
                    <span className="text-2xl font-bold text-gray-900">{previewProperties.length}+</span>
                  </div>
                  <p className="text-gray-600">Объектов недвижимости</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon name="Building" size={24} className="text-primary" />
                    <span className="text-2xl font-bold text-gray-900">10</span>
                  </div>
                  <p className="text-gray-600">Районов Еревана</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon name="Filter" size={24} className="text-primary" />
                    <span className="text-2xl font-bold text-gray-900">5+</span>
                  </div>
                  <p className="text-gray-600">Фильтров поиска</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Search" size={28} className="text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Удобный поиск</h3>
            <p className="text-gray-600 text-sm">Фильтры по району, цене, типу недвижимости и улице</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="MapPin" size={28} className="text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Точные адреса</h3>
            <p className="text-gray-600 text-sm">Все объекты с координатами и подробным адресом</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Clock" size={28} className="text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Актуальная база</h3>
            <p className="text-gray-600 text-sm">Обновляем информацию ежедневно</p>
          </div>
        </div>
      </div>
    </section>
  );
}