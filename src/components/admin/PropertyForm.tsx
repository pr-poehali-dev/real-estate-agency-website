import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Icon from '../ui/icon';
import ImageUpload from './ImageUpload';
import MapPicker from './MapPicker';
import { Property } from '@/types/property';

interface PropertyFormProps {
  propertyForm: Property;
  setPropertyForm: React.Dispatch<React.SetStateAction<Property>>;
  featuresText: string;
  setFeaturesText: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  error: string;
  success: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isEditing?: boolean;
  onCancel?: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  propertyForm,
  setPropertyForm,
  featuresText,
  setFeaturesText,
  loading,
  error,
  success,
  onSubmit,
  isEditing = false,
  onCancel
}) => {
  const [isMapOpen, setIsMapOpen] = useState(false);

  const handleLocationChange = (lat: number, lng: number) => {
    setPropertyForm(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name={isEditing ? "Edit" : "Plus"} size={20} />
            {isEditing ? "Редактировать объект недвижимости" : "Добавить объект недвижимости"}
          </div>
          {isEditing && onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              <Icon name="X" size={16} />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Название *</Label>
                <Input
                  id="title"
                  value={propertyForm.title}
                  onChange={(e) => setPropertyForm(prev => ({...prev, title: e.target.value}))}
                  placeholder="Например: 3-комнатная квартира в центре"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={propertyForm.description}
                  onChange={(e) => setPropertyForm(prev => ({...prev, description: e.target.value}))}
                  placeholder="Подробное описание объекта"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="property_type">Тип недвижимости *</Label>
                <Select value={propertyForm.property_type} onValueChange={(value) => setPropertyForm(prev => ({...prev, property_type: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Квартира</SelectItem>
                    <SelectItem value="house">Дом</SelectItem>
                    <SelectItem value="commercial">Коммерческая</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="transaction_type">Тип операции *</Label>
                <Select value={propertyForm.transaction_type} onValueChange={(value) => setPropertyForm(prev => ({...prev, transaction_type: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">Долгосрочная аренда</SelectItem>
                    <SelectItem value="daily_rent">Посуточная аренда</SelectItem>
                    <SelectItem value="sale">Продажа</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Цена *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={propertyForm.price || ''}
                    onChange={(e) => setPropertyForm(prev => ({...prev, price: e.target.value ? Number(e.target.value) : 0}))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Валюта</Label>
                  <Select value={propertyForm.currency} onValueChange={(value) => setPropertyForm(prev => ({...prev, currency: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AMD">AMD</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="RUB">RUB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rooms">Комнат</Label>
                  <Select value={propertyForm.rooms?.toString() || ''} onValueChange={(value) => setPropertyForm(prev => ({...prev, rooms: value ? Number(value) : 0}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 комната</SelectItem>
                      <SelectItem value="2">2 комнаты</SelectItem>
                      <SelectItem value="3">3 комнаты</SelectItem>
                      <SelectItem value="4">4+ комнат</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="area">Площадь (м²)</Label>
                  <Input
                    id="area"
                    type="number"
                    step="0.1"
                    value={propertyForm.area || ''}
                    onChange={(e) => setPropertyForm(prev => ({...prev, area: e.target.value ? Number(e.target.value) : 0}))}
                  />
                </div>
                <div>
                  <Label htmlFor="floor">Этаж</Label>
                  <Input
                    id="floor"
                    type="number"
                    value={propertyForm.floor || ''}
                    onChange={(e) => setPropertyForm(prev => ({...prev, floor: e.target.value ? Number(e.target.value) : 0}))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pets_allowed">Можно с животными</Label>
                  <Select value={propertyForm.pets_allowed || 'any'} onValueChange={(value) => setPropertyForm(prev => ({...prev, pets_allowed: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Не важно" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Не важно</SelectItem>
                      <SelectItem value="yes">Да</SelectItem>
                      <SelectItem value="no">Нет</SelectItem>
                      <SelectItem value="negotiable">По договоренности</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="children_allowed">Можно с детьми</Label>
                  <Select value={propertyForm.children_allowed || 'any'} onValueChange={(value) => setPropertyForm(prev => ({...prev, children_allowed: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Не важно" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Не важно</SelectItem>
                      <SelectItem value="yes">Да</SelectItem>
                      <SelectItem value="no">Нет</SelectItem>
                      <SelectItem value="negotiable">По договоренности</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Адрес объекта</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="street_name">Улица и дом *</Label>
                <Input
                  id="street_name"
                  value={propertyForm.street_name || ''}
                  onChange={(e) => setPropertyForm(prev => ({...prev, street_name: e.target.value}))}
                  placeholder="ул. Абовяна 15"
                  required
                />
              </div>
              <div>
                <Label htmlFor="district">Район *</Label>
                <Select value={propertyForm.district || ''} onValueChange={(value) => setPropertyForm(prev => ({...prev, district: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите район" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Аджапняк">Аджапняк</SelectItem>
                    <SelectItem value="Арабкир">Арабкир</SelectItem>
                    <SelectItem value="Аван">Аван</SelectItem>
                    <SelectItem value="Давташен">Давташен</SelectItem>
                    <SelectItem value="Эребуни">Эребуни</SelectItem>
                    <SelectItem value="Кентрон">Кентрон</SelectItem>
                    <SelectItem value="Малатия-Себастия">Малатия-Себастия</SelectItem>
                    <SelectItem value="Нор Норк">Нор Норк</SelectItem>
                    <SelectItem value="Нубарашен">Нубарашен</SelectItem>
                    <SelectItem value="Шенгавит">Шенгавит</SelectItem>
                    <SelectItem value="Канакер-Зейтун">Канакер-Зейтун</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <Label>Местоположение на карте</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setIsMapOpen(true)}>
                  <Icon name="MapPin" size={16} className="mr-1" />
                  Выбрать на карте
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                <p>Широта: {propertyForm.latitude?.toFixed(6) || 'не указано'}</p>
                <p>Долгота: {propertyForm.longitude?.toFixed(6) || 'не указано'}</p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Удобства</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Телевизор', value: 'tv' },
                { label: 'Кондиционер', value: 'ac' },
                { label: 'Интернет', value: 'internet' },
                { label: 'Холодильник', value: 'fridge' },
                { label: 'Плита', value: 'stove' },
                { label: 'Стиральная машина', value: 'washing_machine' },
                { label: 'Водонагреватель', value: 'water_heater' },
              ].map((amenity) => {
                const currentFeatures = featuresText.split('\n').filter(f => f.trim());
                const isChecked = currentFeatures.includes(amenity.label);
                return (
                  <label key={amenity.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFeaturesText(prev => prev ? `${prev}\n${amenity.label}` : amenity.label);
                        } else {
                          const newFeatures = currentFeatures.filter(f => f !== amenity.label);
                          setFeaturesText(newFeatures.join('\n'));
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm">{amenity.label}</span>
                  </label>
                );
              })}
            </div>
            <div>
              <Label htmlFor="features">Дополнительные особенности (каждая с новой строки)</Label>
              <Textarea
                id="features"
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="Парковка&#10;Балкон&#10;Лифт&#10;Мебель"
                rows={3}
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Фотографии</h3>

            <ImageUpload
              images={propertyForm.images || []}
              onImagesChange={(newImages) => setPropertyForm(prev => ({...prev, images: newImages}))}
              maxImages={10}
            />
          </div>

          <div className="flex gap-2">
            {isEditing && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Отмена
              </Button>
            )}
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (isEditing ? 'Сохранение...' : 'Добавление...') : (isEditing ? 'Сохранить изменения' : 'Добавить объект')}
            </Button>
          </div>
        </form>

        <MapPicker
          latitude={propertyForm.latitude || 40.1792}
          longitude={propertyForm.longitude || 44.4991}
          onLocationChange={handleLocationChange}
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyForm;