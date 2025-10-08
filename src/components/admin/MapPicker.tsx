import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [selectedLat, setSelectedLat] = useState(latitude);
  const [selectedLng, setSelectedLng] = useState(longitude);

  useEffect(() => {
    if (!isOpen || !mapContainer.current || mapInstance.current) return;

    mapInstance.current = L.map(mapContainer.current, {
      center: [latitude, longitude],
      zoom: 15,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(mapInstance.current);

    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="position: relative;">
          <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0C8.954 0 0 8.954 0 20c0 11.046 20 30 20 30s20-18.954 20-30C40 8.954 31.046 0 20 0z" fill="#FF7A00"/>
            <circle cx="20" cy="20" r="10" fill="white"/>
            <circle cx="20" cy="20" r="5" fill="#FF7A00"/>
          </svg>
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 50]
    });

    markerRef.current = L.marker([latitude, longitude], { 
      icon: customIcon,
      draggable: true 
    }).addTo(mapInstance.current);

    markerRef.current.on('dragend', () => {
      const pos = markerRef.current!.getLatLng();
      setSelectedLat(pos.lat);
      setSelectedLng(pos.lng);
      onLocationChange(pos.lat, pos.lng);
    });

    mapInstance.current.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setSelectedLat(lat);
      setSelectedLng(lng);
      onLocationChange(lat, lng);
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [isOpen]);

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
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Выбранные координаты:</p>
            <p className="font-medium">{selectedLat.toFixed(6)}, {selectedLng.toFixed(6)}</p>
          </div>
          
          <div 
            ref={mapContainer} 
            className="w-full h-96 bg-gray-200 rounded-lg"
            style={{ minHeight: '400px' }}
          />
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Отмена
            </Button>
            <Button onClick={handleConfirm}>
              <Icon name="Check" size={16} className="mr-1" />
              Подтвердить выбор
            </Button>
          </div>
        </CardContent>
      </Card>

      <style>{`
        .custom-marker {
          background: none;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default MapPicker;
