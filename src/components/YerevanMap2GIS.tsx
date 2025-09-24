import React, { useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

interface Property {
  id: number;
  title: string;
  price: number;
  currency: string;
  latitude: number;
  longitude: number;
  district: string;
  property_type: string;
  transaction_type: string;
}

interface YerevanMap2GISProps {
  properties: Property[];
  onPropertySelect: (property: Property) => void;
  selectedDistrict?: string;
  isPreview?: boolean;
}

declare global {
  interface Window {
    DG: any;
  }
}

const YerevanMap2GIS: React.FC<YerevanMap2GISProps> = ({ 
  properties, 
  onPropertySelect, 
  selectedDistrict,
  isPreview = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  const getPropertyTypeLabel = (type: string) => {
    return type === 'apartment' ? 'Квартира' : 'Дом';
  };

  const getTransactionTypeLabel = (type: string) => {
    return type === 'sale' ? 'Продажа' : 'Долгосрочная аренда';
  };

  // Координаты районов Еревана (приблизительные центры)
  const getDistrictCoordinates = (district: string): [number, number] => {
    const coordinates: Record<string, [number, number]> = {
      'Центр': [44.5126, 40.1776],
      'Аван': [44.4950, 40.2100],
      'Арабкир': [44.4850, 40.1800],
      'Давташен': [44.5400, 40.2050],
      'Эребуни': [44.5500, 40.1450],
      'Канакер-Зейтун': [44.5300, 40.1900],
      'Малатия-Себастия': [44.4700, 40.1600],
      'Норк-Мараш': [44.5700, 40.1700],
      'Нор Норк': [44.5800, 40.1850],
      'Шенгавит': [44.5200, 40.1400]
    };
    return coordinates[district] || [44.5126, 40.1776];
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    // Ждем загрузки 2GIS API
    const initMap = () => {
      if (window.DG) {
        // Создаем карту с центром в Ереване
        mapInstance.current = window.DG.map(mapContainer.current, {
          center: [40.1776, 44.5126], // Центр Еревана
          zoom: 11,
          fullscreenControl: true,
          zoomControl: true
        });

        // Добавляем маркеры для объектов
        addMarkers();
      } else {
        // Если API еще не загружен, ждем
        setTimeout(initMap, 100);
      }
    };

    initMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  const addMarkers = () => {
    if (!mapInstance.current || !window.DG) return;

    // Очищаем предыдущие маркеры
    markersRef.current.forEach(marker => {
      mapInstance.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Добавляем маркеры для каждого объекта
    properties.forEach((property) => {
      const [lng, lat] = getDistrictCoordinates(property.district);
      
      // Добавляем небольшое случайное смещение для объектов в одном районе
      const offsetLat = lat + (Math.random() - 0.5) * 0.01;
      const offsetLng = lng + (Math.random() - 0.5) * 0.01;

      // Создаем кастомную иконку
      const customIcon = window.DG.icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z" fill="#dc2626"/>
            <circle cx="16" cy="16" r="8" fill="white"/>
            <path d="M16 10l2 2-2 2-2-2 2-2zm0 4l2 2-2 2-2-2 2-2z" fill="#dc2626"/>
          </svg>
        `),
        iconSize: [32, 40],
        iconAnchor: [16, 40]
      });

      // Создаем маркер
      const marker = window.DG.marker([offsetLat, offsetLng], {
        icon: customIcon
      });

      // Создаем попап с информацией об объекте
      const popupContent = `
        <div style="padding: 12px; min-width: 250px; font-family: system-ui;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; line-height: 1.3;">
            ${property.title}
          </h4>
          <p style="margin: 0 0 8px 0; color: #dc2626; font-size: 16px; font-weight: 700;">
            ${formatPrice(property.price, property.currency)}
          </p>
          <div style="margin: 0 0 8px 0; font-size: 12px; color: #666;">
            <p style="margin: 0;">${getPropertyTypeLabel(property.property_type)} • ${getTransactionTypeLabel(property.transaction_type)}</p>
          </div>
          <p style="margin: 0; font-size: 12px; color: #666; display: flex; align-items: center;">
            📍 ${property.district}
          </p>
          <button 
            onclick="window.selectProperty(${property.id})" 
            style="margin-top: 8px; background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;"
          >
            Подробнее
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(mapInstance.current);
      markersRef.current.push(marker);
    });

    // Глобальная функция для выбора объекта
    (window as any).selectProperty = (propertyId: number) => {
      const property = properties.find(p => p.id === propertyId);
      if (property) {
        // Если это предпросмотр, открываем полную карту
        if (isPreview) {
          window.location.href = '/map';
          return;
        }
        onPropertySelect(property);
      }
    };
  };

  useEffect(() => {
    if (mapInstance.current) {
      addMarkers();
    }
  }, [properties, onPropertySelect]);

  // Если 2GIS не загружен, показываем заглушку
  if (typeof window !== 'undefined' && !window.DG) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загружаем карту Еревана...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      {/* Контейнер для карты */}
      <div ref={mapContainer} className="h-full w-full" />
      
      {/* Информационная панель */}
      {!isPreview && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10 max-w-sm">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-2">
            <Icon name="MapPin" size={20} className="text-red-600" />
            Карта недвижимости Еревана
          </h3>
          <p className="text-sm text-gray-600 mb-2">Найдено объектов: {properties.length}</p>
          {selectedDistrict && (
            <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              Район: {selectedDistrict}
            </p>
          )}
        </div>
      )}

      {/* Легенда */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-4 h-4 bg-red-600 rounded-full border border-white shadow-sm"></div>
          <span>Объекты недвижимости</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Кликните на маркер для деталей</p>
      </div>
    </div>
  );
};

export default YerevanMap2GIS;