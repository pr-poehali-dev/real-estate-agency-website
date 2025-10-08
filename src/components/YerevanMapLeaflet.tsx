import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

interface YerevanMapLeafletProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
  selectedDistrict?: string;
  isPreview?: boolean;
}

const YerevanMapLeaflet: React.FC<YerevanMapLeafletProps> = ({ 
  properties, 
  onPropertySelect, 
  selectedDistrict,
  isPreview = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  const getPropertyTypeLabel = (type: string) => {
    return type === 'apartment' ? 'Квартира' : 'Дом';
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'rent': 'Долгосрочная аренда',
      'daily_rent': 'Посуточная аренда',
      'sale': 'Продажа'
    };
    return labels[type] || type;
  };

  const getDistrictCoordinates = (district: string): [number, number] => {
    const coordinates: Record<string, [number, number]> = {
      'Центр (Кентрон)': [40.1776, 44.5126],
      'Аван': [40.2100, 44.4950],
      'Арабкир': [40.1800, 44.4850],
      'Давташен': [40.2050, 44.5400],
      'Эребуни': [40.1450, 44.5500],
      'Канакер-Зейтун': [40.1900, 44.5300],
      'Малатия-Себастия': [40.1600, 44.4700],
      'Норк-Мараш': [40.1700, 44.5700],
      'Нор Норк': [40.1850, 44.5800],
      'Шенгавит': [40.1400, 44.5200]
    };
    return coordinates[district] || [40.1776, 44.5126];
  };

  const stableOffset = (id: number): [number, number] => {
    const dy = Math.sin(id * 99991) * 0.00025;
    const dx = Math.cos(id * 12347) * 0.00025;
    return [dy, dx];
  };

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    mapInstance.current = L.map(mapContainer.current, {
      center: [40.1792, 44.4991],
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: !isPreview
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [isPreview]);

  useEffect(() => {
    if (!mapInstance.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="position: relative;">
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z" fill="#FF7A00"/>
            <circle cx="16" cy="16" r="8" fill="white"/>
            <path d="M13 13h6v6h-6z" fill="#FF7A00"/>
          </svg>
        </div>
      `,
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -40]
    });

    properties.forEach((property) => {
      if (!property.latitude || !property.longitude) {
        return;
      }
      
      const lat = Number(property.latitude);
      const lng = Number(property.longitude);

      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupContent = `
        <div style="min-width: 250px; font-family: system-ui;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; line-height: 1.3;">
            ${property.title}
          </h4>
          <p style="margin: 0 0 8px 0; color: #FF7A00; font-size: 16px; font-weight: 700;">
            ${formatPrice(property.price, property.currency)}
          </p>
          <div style="margin: 0 0 8px 0; font-size: 12px; color: #666;">
            <p style="margin: 0;">${getPropertyTypeLabel(property.property_type)} • ${getTransactionTypeLabel(property.transaction_type)}</p>
          </div>
          <p style="margin: 0; font-size: 12px; color: #666;">
            📍 ${property.district}
          </p>
        </div>
      `;

      marker.bindPopup(popupContent);
      
      marker.on('mouseover', () => {
        marker.openPopup();
      });
      
      marker.on('mouseout', () => {
        marker.closePopup();
      });
      
      marker.on('click', () => {
        if (isPreview) {
          window.location.href = '/map';
        } else if (onPropertySelect) {
          onPropertySelect(property);
        }
      });

      marker.addTo(mapInstance.current!);
      markersRef.current.push(marker);
    });

    const propertiesWithCoords = properties.filter(p => p.latitude && p.longitude);
    
    if (propertiesWithCoords.length > 0 && !isPreview) {
      const bounds = L.latLngBounds(
        propertiesWithCoords.map(p => [Number(p.latitude), Number(p.longitude)] as [number, number])
      );
      mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [properties, onPropertySelect, isPreview]);

  return (
    <div className="h-full w-full relative">
      <div ref={mapContainer} className="h-full w-full rounded-xl" />
      
      {!isPreview && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000] max-w-sm">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-2">
            <Icon name="MapPin" size={20} className="text-[#FF7A00]" />
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

      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-4 h-4 bg-[#FF7A00] rounded-full border border-white shadow-sm"></div>
          <span>Объекты недвижимости</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Кликните на маркер для деталей</p>
      </div>

      <style>{`
        .custom-marker {
          background: none;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .custom-marker:hover {
          transform: scale(1.1);
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          animation: popupFadeIn 0.2s ease-out;
        }
        .leaflet-popup-tip {
          background: white;
        }
        @keyframes popupFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default YerevanMapLeaflet;