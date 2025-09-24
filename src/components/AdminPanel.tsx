import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Icon from './ui/icon';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

interface Property {
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
}

const AdminPanel: React.FC = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Property form state
  const [propertyForm, setPropertyForm] = useState<Property>({
    title: '',
    description: '',
    property_type: 'apartment',
    transaction_type: 'rent',
    price: 0,
    currency: 'AMD',
    area: 0,
    rooms: 0,
    bedrooms: 0,
    bathrooms: 0,
    floor: 0,
    total_floors: 0,
    year_built: new Date().getFullYear(),
    district: 'Центр',
    address: '',
    latitude: 40.1792,
    longitude: 44.4991,
    features: [],
    images: []
  });

  const [featuresText, setFeaturesText] = useState('');
  const [imagesText, setImagesText] = useState('');

  // Check existing auth on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    // Проверяем demo токен
    if (token.startsWith('demo-token-')) {
      const mockUser: AdminUser = {
        id: 1,
        username: 'admin',
        email: 'admin@wse.am',
        full_name: 'Администратор WSE.AM',
        role: 'admin'
      };
      setUser(mockUser);
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/ff6ed7aa-f0f1-4101-8caf-5bfcad13ef59', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('admin_token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('admin_token');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Локальная авторизация для демо
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      const mockUser: AdminUser = {
        id: 1,
        username: 'admin',
        email: 'admin@wse.am',
        full_name: 'Администратор WSE.AM',
        role: 'admin'
      };
      
      const mockToken = 'demo-token-' + Date.now();
      localStorage.setItem('admin_token', mockToken);
      setUser(mockUser);
      setLoginForm({ username: '', password: '' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/ff6ed7aa-f0f1-4101-8caf-5bfcad13ef59', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('admin_token', data.token);
        setUser(data.user);
        setLoginForm({ username: '', password: '' });
      } else {
        setError('Неверный логин или пароль. Попробуйте: admin / admin123');
      }
    } catch (error) {
      setError('Неверный логин или пароль. Попробуйте: admin / admin123');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('admin_token');
    if (!token) {
      setError('Необходима авторизация');
      setLoading(false);
      return;
    }

    // Демо режим для локального токена
    if (token.startsWith('demo-token-')) {
      // Симуляция успешного добавления
      setSuccess(`Объект "${propertyForm.title}" успешно добавлен в демо режиме!`);
      
      // Сброс формы
      setPropertyForm({
        title: '',
        description: '',
        property_type: 'apartment',
        transaction_type: 'rent',
        price: 0,
        currency: 'AMD',
        area: 0,
        rooms: 0,
        bedrooms: 0,
        bathrooms: 0,
        floor: 0,
        total_floors: 0,
        year_built: new Date().getFullYear(),
        district: 'Центр (Кентрон)',
        address: '',
        latitude: 40.1792,
        longitude: 44.4991,
        features: [],
        images: []
      });
      setFeaturesText('');
      setImagesText('');
      setLoading(false);
      return;
    }

    try {
      // Parse features and images from text
      const features = featuresText.split('\n').filter(f => f.trim()).map(f => f.trim());
      const images = imagesText.split('\n').filter(i => i.trim()).map(i => i.trim());

      const propertyData = {
        ...propertyForm,
        features,
        images
      };

      const response = await fetch('https://functions.poehali.dev/8571bb44-9242-4aac-8df9-754908175968', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(propertyData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Объект недвижимости успешно добавлен!');
        // Reset form
        setPropertyForm({
          title: '',
          description: '',
          property_type: 'apartment',
          transaction_type: 'rent',
          price: 0,
          currency: 'AMD',
          area: 0,
          rooms: 0,
          bedrooms: 0,
          bathrooms: 0,
          floor: 0,
          total_floors: 0,
          year_built: new Date().getFullYear(),
          district: 'Центр (Кентрон)',
          address: '',
          latitude: 40.1792,
          longitude: 44.4991,
          features: [],
          images: []
        });
        setFeaturesText('');
        setImagesText('');
      } else {
        setError(data.error || 'Ошибка добавления объекта');
      }
    } catch (error) {
      setError('В демо режиме используйте логин admin/admin123');
    } finally {
      setLoading(false);
    }
  };

  const districts = [
    'Центр (Кентрон)', 'Ачапняк', 'Аван', 'Арабкир', 'Давташен', 'Эребуни',
    'Канакер-Зейтун', 'Малатия-Себастия', 'Нор Норк', 'Нубарашен', 'Шенгавит', 'Норк-Мараш'
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                <Icon name="Shield" className="mx-auto mb-4" size={32} />
                Вход в админ-панель
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <div>
                  <Label htmlFor="username">Имя пользователя</Label>
                  <Input
                    id="username"
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                    placeholder="Введите имя пользователя"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    placeholder="Введите пароль"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Вход...' : 'Войти'}
                </Button>
              </form>
              
              <div className="mt-4 text-sm text-gray-600 text-center">
                <p>Логин по умолчанию: <strong>admin</strong></p>
                <p>Пароль по умолчанию: <strong>admin123</strong></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Админ-панель WSE.AM</h1>
              <p className="text-gray-600">Добро пожаловать, {user.full_name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        {/* Add Property Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Plus" size={20} />
              Добавить объект недвижимости
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddProperty} className="space-y-6">
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Добавление...' : 'Добавить объект'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;