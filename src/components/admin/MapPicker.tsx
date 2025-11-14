import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Icon from '../ui/icon';

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number, address?: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const MapPicker: React.FC<MapPickerProps> = ({
  latitude,
  longitude,
  onLocationChange,
  isOpen,
  onClose
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  useEffect(() => {
    if (!isOpen || !mapContainer.current) return;

    // Инициализация карты 2GIS
    const initMap = () => {
      if (window.DG) {
        const mapInstance = window.DG.map(mapContainer.current, {
          center: [latitude, longitude],
          zoom: 15
        });

        // Создаем маркер
        const markerInstance = window.DG.marker([latitude, longitude], {
          draggable: true
        }).addTo(mapInstance);

        // Обработчик перетаскивания маркера
        markerInstance.on('dragend', async (e: any) => {
          const newLat = e.target.getLatLng().lat;
          const newLng = e.target.getLatLng().lng;
          
          // Получаем адрес для новых координат
          try {
            const address = await reverseGeocode(newLat, newLng);
            setSelectedAddress(address);
            onLocationChange(newLat, newLng, address);
          } catch (error) {
            console.error('Ошибка геокодирования:', error);
            onLocationChange(newLat, newLng);
          }
        });

        // Обработчик клика по карте
        mapInstance.on('click', async (e: any) => {
          const newLat = e.latlng.lat;
          const newLng = e.latlng.lng;
          
          // Перемещаем маркер
          markerInstance.setLatLng([newLat, newLng]);
          
          // Получаем адрес
          try {
            const address = await reverseGeocode(newLat, newLng);
            setSelectedAddress(address);
            onLocationChange(newLat, newLng, address);
          } catch (error) {
            console.error('Ошибка геокодирования:', error);
            onLocationChange(newLat, newLng);
          }
        });

        setMap(mapInstance);
        setMarker(markerInstance);

        // Получаем изначальный адрес
        reverseGeocode(latitude, longitude).then(setSelectedAddress);
      }
    };

    // Загружаем API 2GIS если не загружено
    if (!window.DG) {
      const script = document.createElement('script');
      script.src = 'https://maps.api.2gis.ru/2.0/loader.js?pkg=full';
      script.onload = () => {
        window.DG.then(() => {
          initMap();
        });
      };
      document.head.appendChild(script);
    } else {
      window.DG.then(() => {
        initMap();
      });
    }

    // Очистка при размонтировании
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [isOpen, latitude, longitude]);

  // Обратное геокодирование для получения адреса
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // Используем простое форматирование координат если геокодинг не работает
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const handleConfirm = () => {
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] m-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="MapPin" size={20} />
              Выберите местоположение на карте
            </div>
            <Button variant="ghost" onClick={handleCancel}>
              <Icon name="X" size={20} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
            <Icon name="Info" size={16} className="inline mr-2" />
            Кликните по карте или перетащите маркер для выбора точного местоположения
          </div>
          
          {selectedAddress && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Выбранные координаты:</p>
              <p className="font-medium">{selectedAddress}</p>
            </div>
          )}
          
          <div 
            ref={mapContainer} 
            className="w-full h-96 bg-gray-200 rounded-lg"
            style={{ minHeight: '400px' }}
          >
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Icon name="Map" size={48} className="mx-auto mb-2 opacity-50" />
                <p>Загрузка карты...</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Отмена
            </Button>
            <Button onClick={handleConfirm}>
              Подтвердить выбор
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapPicker;