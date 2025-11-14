import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Тип для объекта недвижимости
interface Property {
  id: number;
  title: string;
  description: string;
  property_type: string;
  transaction_type: string;
  price: number;
  currency: string;
  area?: number;
  rooms?: number;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
  status: string;
}

interface InteractiveMapProps {
  properties: Property[];
  selectedDistrict?: string;
  onPropertySelect?: (property: Property) => void;
}

// Иконки для разных типов недвижимости
const createCustomIcon = (type: string, transactionType: string) => {
  const color = transactionType === 'sale' ? '#ff6600' : '#0066ff';
  const symbol = type === 'apartment' ? '🏢' : type === 'house' ? '🏠' : '🏪';
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 16 16 24 16 24s16-8 16-24C32 7.163 24.837 0 16 0z" fill="${color}"/>
        <circle cx="16" cy="16" r="10" fill="white"/>
        <text x="16" y="22" text-anchor="middle" font-size="12" fill="${color}">${symbol}</text>
      </svg>
    `)}`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
};

// Компонент для центрирования карты на выбранном районе
const MapController: React.FC<{ district?: string }> = ({ district }) => {
  const map = useMap();
  
  useEffect(() => {
    if (district) {
      // Координаты районов Еревана
      const districtCoords: { [key: string]: [number, number] } = {
        'Центр': [40.1833, 44.5167],
        'Ачапняк': [40.2167, 44.4667],
        'Аван': [40.2333, 44.5333],
        'Арабкир': [40.2000, 44.5000],
        'Давташен': [40.2333, 44.4833],
        'Эребуни': [40.1333, 44.5000],
        'Канакер-Зейтун': [40.2000, 44.5500],
        'Малатия-Себастия': [40.1667, 44.4500],
        'Нор Норк': [40.2167, 44.5333],
        'Нубарашен': [40.1500, 44.5167],
        'Шенгавит': [40.1500, 44.4833],
      };
      
      if (districtCoords[district]) {
        map.setView(districtCoords[district], 14);
      }
    }
  }, [district, map]);
  
  return null;
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  properties, 
  selectedDistrict, 
  onPropertySelect 
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    setMapLoaded(true);
  }, []);

  if (!mapLoaded) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Загрузка карты...</div>
      </div>
    );
  }

  // Центр Еревана
  const yerevanCenter: [number, number] = [40.1792, 44.4991];

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={yerevanCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapController district={selectedDistrict} />
        
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            icon={createCustomIcon(property.property_type, property.transaction_type)}
            eventHandlers={{
              click: () => onPropertySelect && onPropertySelect(property),
            }}
          >
            <Popup>
              <div className="min-w-64">
                <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-orange-600 font-bold">
                    {property.price.toLocaleString()} {property.currency}
                  </p>
                  <p><span className="font-medium">Район:</span> {property.district}</p>
                  <p><span className="font-medium">Тип:</span> {property.property_type}</p>
                  <p><span className="font-medium">Операция:</span> {property.transaction_type === 'sale' ? 'Продажа' : 'Аренда'}</p>
                  {property.area && (
                    <p><span className="font-medium">Площадь:</span> {property.area} м²</p>
                  )}
                  {property.rooms && (
                    <p><span className="font-medium">Комнат:</span> {property.rooms}</p>
                  )}
                  <p className="text-gray-600 mt-2">{property.address}</p>
                </div>
                {property.images.length > 0 && (
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-full h-32 object-cover rounded mt-2"
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;