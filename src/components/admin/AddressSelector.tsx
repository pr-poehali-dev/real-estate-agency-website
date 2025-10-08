import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import Icon from '../ui/icon';
import { AddressComponents, LocationPoint } from '@/types/property';
import MapSelectorModal from './MapSelectorModal';

interface AddressSelectorProps {
  address: AddressComponents;
  onAddressChange: (address: AddressComponents) => void;
  coordinates: LocationPoint;
  onCoordinatesChange: (coordinates: LocationPoint) => void;
  className?: string;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  address,
  onAddressChange,
  coordinates,
  onCoordinatesChange,
  className = ''
}) => {
  const [showMapSelector, setShowMapSelector] = useState(false);

  const handleFieldChange = (field: keyof AddressComponents, value: string) => {
    onAddressChange({
      ...address,
      [field]: value
    });
  };

  const openMapSelector = () => {
    setShowMapSelector(true);
  };

  const handleMapSelection = (newCoordinates: LocationPoint) => {
    onCoordinatesChange(newCoordinates);
    setShowMapSelector(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Адрес (улица и номер дома в одной строке) */}
      <div className="space-y-2">
        <Label htmlFor="street_name">
          Адрес (улица и номер дома) *
        </Label>
        <Input
          id="street_name"
          type="text"
          placeholder="ул. Абовяна 15, пр. Тиграна Меца 25А"
          value={address.street_name}
          onChange={(e) => handleFieldChange('street_name', e.target.value)}
          required
        />
      </div>

      {/* Район */}
      <div className="space-y-2">
        <Label htmlFor="district">
          Район
        </Label>
        <Input
          id="district"
          type="text"
          placeholder="Центр, Канакер-Зейтун"
          value={address.district}
          onChange={(e) => handleFieldChange('district', e.target.value)}
        />
      </div>

      {/* Отметить на карте */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label>Отметить на карте</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openMapSelector}
          >
            <Icon name="Map" size={16} className="mr-2" />
            Выбрать на карте
          </Button>
        </div>

        {coordinates.latitude && coordinates.longitude && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Icon name="CheckCircle" size={16} />
            <span>Местоположение отмечено ({coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)})</span>
          </div>
        )}
      </div>

      {/* Модальный селектор карты */}
      {showMapSelector && (
        <MapSelectorModal
          onClose={() => setShowMapSelector(false)}
          onSelect={handleMapSelection}
          initialCoordinates={coordinates}
        />
      )}

      {/* Подсказки */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p><strong>Как добавить адрес:</strong></p>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Введите полный адрес с номером дома (например: "ул. Абовяна 15")</li>
              <li>Нажмите "Выбрать на карте" чтобы отметить точное местоположение</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSelector;