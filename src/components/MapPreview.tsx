import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import YerevanMapLeaflet from '@/components/YerevanMapLeaflet';
import { Properties } from '@/lib/api';

interface MapPreviewProps {
  t: any;
  isVisible: any;
}

export default function MapPreview({ t, isVisible }: MapPreviewProps) {
  const navigate = useNavigate();
  const [previewProperties, setPreviewProperties] = useState<any[]>([]);
  
  useEffect(() => {
    const loadPreviewData = async () => {
      const token = localStorage.getItem('admin_token');
      
      if (token && token.startsWith('demo-token-')) {
        const demoData = localStorage.getItem('demo_properties');
        const demoProps = demoData ? JSON.parse(demoData) : [];
        setPreviewProperties(demoProps.slice(0, 10));
        return;
      }

      try {
        const response = await Properties.list();
        const props = (response.properties || []).slice(0, 10);
        setPreviewProperties(props);
      } catch (err) {
        console.error('Error loading preview properties:', err);
        setPreviewProperties([]);
      }
    };

    loadPreviewData();
  }, []);

  return (
    <section 
      className="py-20 px-6 bg-gray-50" 
      data-animate 
      id="map-preview"
    >
      <div className={`container mx-auto transition-all duration-1000 ${isVisible['map-preview'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold font-montserrat text-gray-900 mb-4">
            🗺️ Найдите своё жильё на карте
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Интерактивная карта Еревана с актуальными объектами недвижимости. 
            Выбирайте район, фильтруйте по цене и типу жилья.
          </p>
        </div>

        {/* Map Container */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Map */}
            <div 
              className="h-[300px] relative cursor-pointer group"
              onClick={() => navigate('/map')}
            >
              <YerevanMapLeaflet
                properties={previewProperties}
                onPropertySelect={() => {}}
                isPreview={true}
              />
            </div>

            {/* CTA Button Bar */}
            <div className="bg-white border-t p-6 text-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-10 py-6 text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate('/map')}
              >
                <Icon name="Map" size={28} className="mr-3" />
                Открыть карту
              </Button>
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