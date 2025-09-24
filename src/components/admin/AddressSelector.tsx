import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import Icon from '../ui/icon';
import { AddressComponents, LocationPoint } from '@/types/property';

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
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [showMapSelector, setShowMapSelector] = useState(false);

  // Обновляем полный адрес при изменении компонентов
  const updateFormattedAddress = useCallback(() => {
    const parts = [
      address.street_name,
      address.house_number,
      address.apartment_number && `кв. ${address.apartment_number}`,
    ].filter(Boolean);

    const formatted_address = parts.join(', ') + (address.district ? `, ${address.district}` : '');
    
    if (formatted_address !== address.formatted_address) {
      onAddressChange({
        ...address,
        formatted_address: formatted_address || ''
      });
    }
  }, [address, onAddressChange]);

  useEffect(() => {
    updateFormattedAddress();
  }, [address.street_name, address.house_number, address.apartment_number, address.district, updateFormattedAddress]);

  const handleFieldChange = (field: keyof AddressComponents, value: string) => {
    onAddressChange({
      ...address,
      [field]: value
    });
  };

  // Простое геокодирование для демо (в реальном проекте нужно использовать API)
  const geocodeAddress = async () => {
    if (!address.street_name || !address.house_number) {
      alert('Укажите название улицы и номер дома');
      return;
    }

    setIsGeocodingLoading(true);

    try {
      // Симуляция API геокодирования с примерными координатами Еревана
      // В реальном проекте здесь должен быть вызов API геокодинга
      const mockCoordinates = {
        latitude: 40.1792 + (Math.random() - 0.5) * 0.1,
        longitude: 44.4991 + (Math.random() - 0.5) * 0.1,
        address: address.formatted_address || ''
      };

      onCoordinatesChange(mockCoordinates);
      
      // Показываем уведомление
      alert(`Координаты найдены: ${mockCoordinates.latitude.toFixed(6)}, ${mockCoordinates.longitude.toFixed(6)}`);
      
    } catch (error) {
      console.error('Ошибка геокодирования:', error);
      alert('Не удалось найти координаты для указанного адреса');
    } finally {
      setIsGeocodingLoading(false);
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Название улицы */}
        <div className="space-y-2">
          <Label htmlFor="street_name">
            Название улицы *
          </Label>
          <Input
            id="street_name"
            type="text"
            placeholder="ул. Абовяна, пр. Тиграна Меца"
            value={address.street_name}
            onChange={(e) => handleFieldChange('street_name', e.target.value)}
            required
          />
        </div>

        {/* Номер дома */}
        <div className="space-y-2">
          <Label htmlFor="house_number">
            Номер дома *
          </Label>
          <Input
            id="house_number"
            type="text"
            placeholder="15, 25/3, 10А"
            value={address.house_number}
            onChange={(e) => handleFieldChange('house_number', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Номер квартиры/офиса */}
        <div className="space-y-2">
          <Label htmlFor="apartment_number">
            Номер квартиры/офиса
          </Label>
          <Input
            id="apartment_number"
            type="text"
            placeholder="45, 12А"
            value={address.apartment_number || ''}
            onChange={(e) => handleFieldChange('apartment_number', e.target.value)}
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
      </div>

      {/* Полный адрес (автоматически формируемый) */}
      <div className="space-y-2">
        <Label htmlFor="formatted_address">
          Полный адрес
        </Label>
        <Input
          id="formatted_address"
          type="text"
          value={address.formatted_address || ''}
          disabled
          className="bg-gray-50 text-gray-600"
        />
        <p className="text-xs text-gray-500">
          Формируется автоматически на основе введенных данных
        </p>
      </div>

      {/* Координаты */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label>Координаты на карте</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={geocodeAddress}
              disabled={isGeocodingLoading || !address.street_name || !address.house_number}
            >
              {isGeocodingLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              ) : (
                <Icon name="Search" size={16} className="mr-2" />
              )}
              Найти на карте
            </Button>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-sm">Широта</Label>
            <Input
              type="number"
              step="0.000001"
              placeholder="40.1792"
              value={coordinates.latitude || ''}
              onChange={(e) => onCoordinatesChange({
                ...coordinates,
                latitude: parseFloat(e.target.value) || 0
              })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Долгота</Label>
            <Input
              type="number"
              step="0.000001"
              placeholder="44.4991"
              value={coordinates.longitude || ''}
              onChange={(e) => onCoordinatesChange({
                ...coordinates,
                longitude: parseFloat(e.target.value) || 0
              })}
            />
          </div>
        </div>

        {coordinates.latitude && coordinates.longitude && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Icon name="CheckCircle" size={16} />
            <span>Координаты установлены</span>
          </div>
        )}
      </div>

      {/* Простой модальный селектор карты */}
      {showMapSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Выберите точку на карте</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMapSelector(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Icon name="Map" size={48} className="text-gray-400 mx-auto" />
                  <p className="text-gray-600">Интерактивная карта</p>
                  <p className="text-sm text-gray-500">
                    Кликните на карте для выбора координат
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowMapSelector(false)}
                >
                  Отмена
                </Button>
                <Button
                  onClick={() => handleMapSelection({
                    latitude: 40.1792,
                    longitude: 44.4991,
                    address: address.formatted_address || ''
                  })}
                >
                  Подтвердить выбор
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Подсказки */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p><strong>Способы указания адреса:</strong></p>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Введите улицу и дом, затем нажмите "Найти на карте"</li>
              <li>Нажмите "Выбрать на карте" для ручного размещения маркера</li>
              <li>Введите координаты вручную если они известны</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSelector;