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
  images?: string[];
}

interface YerevanMapLeafletProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  onMapMove?: (center: L.LatLng, zoom: number) => void;
  selectedDistrict?: string;
  isPreview?: boolean;
  openOnClick?: boolean;
  keepPopupsOpen?: boolean;
  zoomPosition?: 'topright' | 'topleft';
}

const YerevanMapLeaflet: React.FC<YerevanMapLeafletProps> = ({ 
  properties,
  selectedProperty,
  onPropertySelect,
  onMapMove,
  selectedDistrict,
  isPreview = false,
  openOnClick = false,
  keepPopupsOpen = false,
  zoomPosition = 'topright'
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
      zoomControl: false,
      scrollWheelZoom: !isPreview
    });

    L.control.zoom({
      position: zoomPosition
    }).addTo(mapInstance.current);

    const streetLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en', {
      attribution: '© Google Maps',
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const satelliteLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      attribution: '© Google Maps',
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const hybridLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      attribution: '© Google Maps',
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    streetLayer.addTo(mapInstance.current);

    const baseMaps = {
      "Схема": streetLayer,
      "Спутник": satelliteLayer,
      "Гибрид": hybridLayer
    };

    L.control.layers(baseMaps, {}, { position: 'topright' }).addTo(mapInstance.current);

    if (onMapMove) {
      mapInstance.current.on('moveend', () => {
        if (mapInstance.current) {
          const center = mapInstance.current.getCenter();
          const zoom = mapInstance.current.getZoom();
          onMapMove(center, zoom);
        }
      });
    }

    const handleLocateUser = () => {
      if (mapInstance.current) {
        mapInstance.current.locate({ setView: true, maxZoom: 16 });
      }
    };

    const handleRestorePosition = (event: CustomEvent) => {
      if (mapInstance.current && event.detail) {
        const { lat, lng, zoom } = event.detail;
        mapInstance.current.setView([lat, lng], zoom);
      }
    };

    window.addEventListener('map-locate-user', handleLocateUser as any);
    window.addEventListener('map-restore-position', handleRestorePosition as any);

    return () => {
      window.removeEventListener('map-locate-user', handleLocateUser as any);
      window.removeEventListener('map-restore-position', handleRestorePosition as any);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [isPreview, zoomPosition, onMapMove]);

  useEffect(() => {
    if (!mapInstance.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const createMarkerIcon = (property: Property, isSelected: boolean) => {
      return L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="position: relative; transition: transform 0.2s;">
            <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); transform: scale(${isSelected ? '1.2' : '1'});">
              <path d="M20 0C8.954 0 0 8.954 0 20c0 11.046 20 30 20 30s20-18.954 20-30C40 8.954 31.046 0 20 0z" fill="${isSelected ? '#FF5500' : '#FF7A00'}"/>
              <circle cx="20" cy="20" r="10" fill="white"/>
              <text x="20" y="26" text-anchor="middle" font-size="10" font-weight="bold" fill="#FF7A00">${formatPrice(property.price, property.currency).split(' ')[0].substring(0, 3)}k</text>
            </svg>
          </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 50],
        popupAnchor: [0, -50]
      });
    };

    properties.forEach((property) => {
      if (!property.latitude || !property.longitude) {
        return;
      }
      
      const lat = Number(property.latitude);
      const lng = Number(property.longitude);
      const isSelected = selectedProperty?.id === property.id;

      const marker = L.marker([lat, lng], { icon: createMarkerIcon(property, isSelected) });

      const imageUrl = property.images && property.images.length > 0 ? property.images[0] : '';
      const popupContent = `
        <div style="width: 220px; font-family: system-ui; cursor: pointer;" class="property-popup" data-property-id="${property.id}">
          ${imageUrl ? `
            <div style="width: 100%; height: 120px; overflow: hidden; border-radius: 6px; margin-bottom: 8px;">
              <img src="${imageUrl}" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
          ` : ''}
          <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${property.title}
          </h4>
          <p style="margin: 0 0 6px 0; color: #FF7A00; font-size: 15px; font-weight: 700;">
            ${formatPrice(property.price, property.currency)}
          </p>
          <div style="margin: 0 0 4px 0; font-size: 11px; color: #666;">
            <p style="margin: 0;">${getPropertyTypeLabel(property.property_type)} • ${getTransactionTypeLabel(property.transaction_type)}</p>
          </div>
          <p style="margin: 0; font-size: 11px; color: #666;">
            📍 ${property.district}
          </p>
        </div>
      `;

      const popup = L.popup({
        closeButton: true,
        autoClose: !keepPopupsOpen,
        closeOnClick: !keepPopupsOpen,
        offset: [0, -10],
        autoPan: false,
        maxWidth: 240,
        className: 'compact-popup'
      }).setContent(popupContent);
      
      marker.bindPopup(popup);
      
      let popupTimeout: NodeJS.Timeout | null = null;
      
      marker.on('click', () => {
        if (openOnClick) {
          window.location.href = `/property/${property.id}`;
        }
      });
      
      marker.on('popupopen', () => {
        setTimeout(() => {
          const popupElement = document.querySelector(`[data-property-id="${property.id}"]`);
          const leafletPopup = document.querySelector('.leaflet-popup');
          
          if (popupElement) {
            if (openOnClick) {
              const handleClick = (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/property/${property.id}`;
              };
              popupElement.addEventListener('click', handleClick, { once: true });
            } else {
              let clickCount = 0;
              let clickTimer: NodeJS.Timeout | null = null;
              
              const handleClick = (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                clickCount++;
                
                if (clickCount === 1) {
                  clickTimer = setTimeout(() => {
                    if (onPropertySelect) {
                      onPropertySelect(property);
                    }
                    clickCount = 0;
                  }, 250);
                } else if (clickCount === 2) {
                  if (clickTimer) {
                    clearTimeout(clickTimer);
                  }
                  window.location.href = `/property/${property.id}`;
                  clickCount = 0;
                }
              };
              
              popupElement.addEventListener('click', handleClick);
            }
          }
          
          if (leafletPopup) {
          leafletPopup.addEventListener('mouseenter', () => {
            if (popupTimeout) {
              clearTimeout(popupTimeout);
              popupTimeout = null;
            }
          });
          
          leafletPopup.addEventListener('mouseleave', () => {
            popupTimeout = setTimeout(() => {
              marker.closePopup();
            }, 300);
          });
        }
        }, 100);
      });
      
      if (!keepPopupsOpen) {
        marker.on('mouseover', () => {
          if (popupTimeout) {
            clearTimeout(popupTimeout);
            popupTimeout = null;
          }
          marker.openPopup();
        });
        
        marker.on('mouseout', () => {
          popupTimeout = setTimeout(() => {
            marker.closePopup();
          }, 300);
        });
      }
      
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        marker.openPopup();
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
  }, [properties, selectedProperty, onPropertySelect, isPreview, keepPopupsOpen, openOnClick]);

  return (
    <div className="h-full w-full relative">
      <div ref={mapContainer} className="h-full w-full rounded-xl" />

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
        .property-popup {
          transition: background-color 0.2s ease;
          border-radius: 8px;
          padding: 4px;
          margin: -4px;
        }
        .property-popup:hover {
          background-color: rgba(255, 122, 0, 0.05);
        }
        .leaflet-popup-close-button {
          font-size: 20px;
          padding: 4px 8px;
          color: #666;
          font-weight: bold;
        }
        .leaflet-popup-close-button:hover {
          color: #FF7A00;
          background-color: rgba(255, 122, 0, 0.1);
          border-radius: 4px;
        }
        .leaflet-control-attribution {
          display: none !important;
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