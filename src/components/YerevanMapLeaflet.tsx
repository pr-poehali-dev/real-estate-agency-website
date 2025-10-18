import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
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
  const markersMapRef = useRef<Map<number, L.Marker>>(new Map());
  const markerClusterGroup = useRef<L.MarkerClusterGroup | null>(null);
  const hasInitialFit = useRef(false);

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

    markerClusterGroup.current = (L as any).markerClusterGroup({
      maxClusterRadius: 60,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        let size = 'small';
        if (count > 10) size = 'medium';
        if (count > 50) size = 'large';
        
        return L.divIcon({
          html: `<div style="
            background: linear-gradient(135deg, #FF7A00 0%, #FF5500 100%);
            border: 3px solid white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(255, 122, 0, 0.4);
          ">${count}</div>`,
          className: 'marker-cluster',
          iconSize: L.point(40, 40)
        });
      }
    });
    
    markerClusterGroup.current.addTo(mapInstance.current);

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

    const createMarkerIcon = (property: Property, isSelected: boolean) => {
      return L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="position: relative;">
            <svg width="28" height="35" viewBox="0 0 28 35" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.15));">
              <path d="M14 0C6.268 0 0 6.268 0 14c0 7.732 14 21 14 21s14-13.268 14-21C28 6.268 21.732 0 14 0z" fill="${isSelected ? '#FF5500' : '#FF7A00'}"/>
              <circle cx="14" cy="14" r="7" fill="white"/>
            </svg>
          </div>
        `,
        iconSize: [28, 35],
        iconAnchor: [14, 35],
        popupAnchor: [0, -35]
      });
    };

    const currentPropertyIds = new Set(properties.map(p => p.id));
    const existingIds = new Set(markersMapRef.current.keys());

    existingIds.forEach(id => {
      if (!currentPropertyIds.has(id)) {
        const marker = markersMapRef.current.get(id);
        if (marker && markerClusterGroup.current) {
          markerClusterGroup.current.removeLayer(marker);
          markersMapRef.current.delete(id);
        }
      }
    });

    properties.forEach((property) => {
      if (!property.latitude || !property.longitude) {
        return;
      }
      
      const lat = Number(property.latitude);
      const lng = Number(property.longitude);
      const isSelected = selectedProperty?.id === property.id;

      let marker = markersMapRef.current.get(property.id);

      if (!marker) {
        marker = L.marker([lat, lng], { icon: createMarkerIcon(property, isSelected) });

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
      
      const popupTimeout: NodeJS.Timeout | null = null;
      
      marker.on('click', () => {
        if (openOnClick) {
          window.location.href = `/property/${property.id}`;
        }
      });
      
      marker.on('popupopen', () => {
        setTimeout(() => {
          const popupElement = document.querySelector(`[data-property-id="${property.id}"]`);
          
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
        }, 100);
      });
      
        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          marker!.openPopup();
        });

        if (markerClusterGroup.current) {
          markerClusterGroup.current.addLayer(marker);
        }
        markersMapRef.current.set(property.id, marker);
      } else {
        marker.setIcon(createMarkerIcon(property, isSelected));
      }
    });

    const propertiesWithCoords = properties.filter(p => p.latitude && p.longitude);
    
    if (propertiesWithCoords.length > 0 && !isPreview && !hasInitialFit.current) {
      const bounds = L.latLngBounds(
        propertiesWithCoords.map(p => [Number(p.latitude), Number(p.longitude)] as [number, number])
      );
      mapInstance.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      hasInitialFit.current = true;
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