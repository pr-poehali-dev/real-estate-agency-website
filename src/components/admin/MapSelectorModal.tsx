import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '../ui/button';
import Icon from '../ui/icon';
import { LocationPoint } from '@/types/property';

interface MapSelectorModalProps {
  onClose: () => void;
  onSelect: (coordinates: LocationPoint) => void;
  initialCoordinates: LocationPoint;
}

const MapSelectorModal: React.FC<MapSelectorModalProps> = ({
  onClose,
  onSelect,
  initialCoordinates
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<LocationPoint>(initialCoordinates);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = L.map(mapContainer.current, {
      center: [initialCoordinates.latitude || 40.1776, initialCoordinates.longitude || 44.5126],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true
    });

    mapInstance.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: #FF6B35; 
          width: 32px; 
          height: 32px; 
          border-radius: 50% 50% 50% 0; 
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <div style="
            color: white; 
            font-size: 18px; 
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
          ">📍</div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    if (initialCoordinates.latitude && initialCoordinates.longitude) {
      markerRef.current = L.marker(
        [initialCoordinates.latitude, initialCoordinates.longitude],
        { icon: customIcon, draggable: true }
      ).addTo(map);

      markerRef.current.on('dragend', function() {
        const pos = markerRef.current!.getLatLng();
        setSelectedCoords({
          latitude: pos.lat,
          longitude: pos.lng,
          address: ''
        });
      });
    }

    map.on('click', function(e) {
      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng);
      } else {
        markerRef.current = L.marker(e.latlng, { icon: customIcon, draggable: true }).addTo(map);
        markerRef.current.on('dragend', function() {
          const pos = markerRef.current!.getLatLng();
          setSelectedCoords({
            latitude: pos.lat,
            longitude: pos.lng,
            address: ''
          });
        });
      }
      
      setSelectedCoords({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
        address: ''
      });
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const handleConfirm = () => {
    onSelect(selectedCoords);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Выберите точку на карте</h3>
            <p className="text-sm text-gray-600 mt-1">
              Кликните на карте или перетащите маркер
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
        
        <div className="p-4 space-y-4">
          <div 
            ref={mapContainer} 
            className="rounded-lg h-[500px] w-full border border-gray-200"
          />
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Широта:</span>
                <span className="font-mono font-semibold">{selectedCoords.latitude.toFixed(6)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Долгота:</span>
                <span className="font-mono font-semibold">{selectedCoords.longitude.toFixed(6)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Отмена
            </Button>
            <Button
              onClick={handleConfirm}
            >
              <Icon name="Check" size={16} className="mr-2" />
              Подтвердить выбор
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSelectorModal;