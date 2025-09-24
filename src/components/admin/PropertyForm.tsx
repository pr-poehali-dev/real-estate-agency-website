import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Icon from '../ui/icon';
import MapPicker from './MapPicker';

interface Property {
  id?: number;
  title: string;
  description: string;
  property_type: string;
  transaction_type: string;
  price: number;
  currency: string;
  area: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  total_floors: number;
  year_built: number;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  features: string[];
  images: string[];
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface PropertyFormProps {
  propertyForm: Property;
  setPropertyForm: React.Dispatch<React.SetStateAction<Property>>;
  featuresText: string;
  setFeaturesText: React.Dispatch<React.SetStateAction<string>>;
  imagesText: string;
  setImagesText: React.Dispatch<React.SetStateAction<string>>;
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
  imagesText,
  setImagesText,
  loading,
  error,
  success,
  onSubmit,
  isEditing = false,
  onCancel
}) => {
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  
  const districts = [
    'Центр (Кентрон)', 'Ачапняк', 'Аван', 'Арабкир', 'Давташен', 'Эребуни',
    'Канакер-Зейтун', 'Малатия-Себастия', 'Нор Норк', 'Нубарашен', 'Шенгавит', 'Норк-Мараш'
  ];

  const handleLocationChange = (lat: number, lng: number, address?: string) => {
    setPropertyForm({
      ...propertyForm,
      latitude: lat,
      longitude: lng,
      address: address || propertyForm.address
    });
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
            <Button variant="ghost" onClick={onCancel}>
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
                  onChange={(e) => setPropertyForm({...propertyForm, title: e.target.value})}
                  placeholder="Например: 3-комнатная квартира в центре"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={propertyForm.description}
                  onChange={(e) => setPropertyForm({...propertyForm, description: e.target.value})}
                  placeholder="Подробное описание объекта"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="property_type">Тип недвижимости *</Label>
                <Select value={propertyForm.property_type} onValueChange={(value) => setPropertyForm({...propertyForm, property_type: value})}>
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
                <Select value={propertyForm.transaction_type} onValueChange={(value) => setPropertyForm({...propertyForm, transaction_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">Аренда</SelectItem>
                    <SelectItem value="daily_rent">Посуточная аренда</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Цена *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={propertyForm.price}
                    onChange={(e) => setPropertyForm({...propertyForm, price: Number(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Валюта</Label>
                  <Select value={propertyForm.currency} onValueChange={(value) => setPropertyForm({...propertyForm, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AMD">AMD (драм)</SelectItem>
                      <SelectItem value="USD">USD (доллар)</SelectItem>
                      <SelectItem value="EUR">EUR (евро)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="area">Площадь (м²)</Label>
                  <Input
                    id="area"
                    type="number"
                    step="0.1"
                    value={propertyForm.area}
                    onChange={(e) => setPropertyForm({...propertyForm, area: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="rooms">Комнат</Label>
                  <Input
                    id="rooms"
                    type="number"
                    value={propertyForm.rooms}
                    onChange={(e) => setPropertyForm({...propertyForm, rooms: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Спален</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={propertyForm.bedrooms}
                    onChange={(e) => setPropertyForm({...propertyForm, bedrooms: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Ванных</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={propertyForm.bathrooms}
                    onChange={(e) => setPropertyForm({...propertyForm, bathrooms: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="year_built">Год постройки</Label>
                  <Input
                    id="year_built"
                    type="number"
                    value={propertyForm.year_built}
                    onChange={(e) => setPropertyForm({...propertyForm, year_built: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="floor">Этаж</Label>
                  <Input
                    id="floor"
                    type="number"
                    value={propertyForm.floor}
                    onChange={(e) => setPropertyForm({...propertyForm, floor: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="total_floors">Всего этажей</Label>
                  <Input
                    id="total_floors"
                    type="number"
                    value={propertyForm.total_floors}
                    onChange={(e) => setPropertyForm({...propertyForm, total_floors: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="district">Район *</Label>
                <Select value={propertyForm.district} onValueChange={(value) => setPropertyForm({...propertyForm, district: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map(district => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Адрес *</Label>
              <Input
                id="address"
                value={propertyForm.address}
                onChange={(e) => setPropertyForm({...propertyForm, address: e.target.value})}
                placeholder="Полный адрес объекта"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsMapPickerOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Icon name="MapPin" size={16} />
                  Выбрать на карте
                </Button>
                <span className="text-sm text-gray-600">
                  Координаты: {propertyForm.latitude.toFixed(6)}, {propertyForm.longitude.toFixed(6)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Широта</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    value={propertyForm.latitude}
                    onChange={(e) => setPropertyForm({...propertyForm, latitude: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Долгота</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    value={propertyForm.longitude}
                    onChange={(e) => setPropertyForm({...propertyForm, longitude: Number(e.target.value)})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Features and Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="features">Особенности (каждая с новой строки)</Label>
              <Textarea
                id="features"
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="Парковка&#10;Балкон&#10;Лифт&#10;Мебель"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="images">URL изображений (каждый с новой строки)</Label>
              <Textarea
                id="images"
                value={imagesText}
                onChange={(e) => setImagesText(e.target.value)}
                placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
                rows={4}
              />
            </div>
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
      </CardContent>
      
      <MapPicker
        latitude={propertyForm.latitude}
        longitude={propertyForm.longitude}
        onLocationChange={handleLocationChange}
        isOpen={isMapPickerOpen}
        onClose={() => setIsMapPickerOpen(false)}
      />
    </Card>
  );
};

export default PropertyForm;