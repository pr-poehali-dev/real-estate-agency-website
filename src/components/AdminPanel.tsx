import React, { useState, useEffect } from 'react';
import LoginForm from './admin/LoginForm';
import AdminHeader from './admin/AdminHeader';
import PropertyForm from './admin/PropertyForm';
import PropertyList from './admin/PropertyList';
import { Property } from '@/types/property';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

const AdminPanel: React.FC = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
    street_name: '',
    house_number: '',
    apartment_number: '',
    latitude: 40.1792,
    longitude: 44.4991,
    features: [],
    images: []
  });

  const [featuresText, setFeaturesText] = useState('');

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
      setLoading(false);
      return;
    }

    try {
      // Parse features from text
      const features = featuresText.split('\n').filter(f => f.trim()).map(f => f.trim());

      const propertyData = {
        ...propertyForm,
        features
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
      } else {
        setError(data.error || 'Ошибка добавления объекта');
      }
    } catch (error) {
      setError('В демо режиме используйте логин admin/admin123');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setIsEditing(true);
    
    // Заполняем форму данными редактируемого объекта
    setPropertyForm({
      ...property,
      street_name: property.street_name || '',
      house_number: property.house_number || '',
      apartment_number: property.apartment_number || '',
      features: property.features || [],
      images: property.images || []
    });
    
    // Заполняем текстовые поля
    setFeaturesText((property.features || []).join('\n'));
    
    // Очищаем сообщения
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingProperty(null);
    setIsEditing(false);
    
    // Сбрасываем форму к начальным значениям
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
      district: 'Центр',
      address: '',
      street_name: '',
      house_number: '',
      apartment_number: '',
      latitude: 40.1792,
      longitude: 44.4991,
      features: [],
      images: []
    });
    
    setFeaturesText('');
    setError('');
    setSuccess('');
  };

  const handleDeleteProperty = async (propertyId: number) => {
    if (!confirm('Вы уверены, что хотите удалить это объявление?')) {
      return;
    }

    // В демо режиме просто показываем сообщение
    const token = localStorage.getItem('admin_token');
    if (token && token.startsWith('demo-token-')) {
      setSuccess(`Объявление #${propertyId} удалено в демо режиме!`);
      return;
    }

    // В реальном режиме здесь был бы API вызов
    setSuccess(`Объявление #${propertyId} помечено для удаления`);
  };

  if (!user) {
    return (
      <LoginForm
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        loading={loading}
        error={error}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <AdminHeader user={user} onLogout={handleLogout} />
        
        <PropertyList
          onEdit={handleEditProperty}
          onDelete={handleDeleteProperty}
        />
        
        <PropertyForm
          propertyForm={propertyForm}
          setPropertyForm={setPropertyForm}
          featuresText={featuresText}
          setFeaturesText={setFeaturesText}
          loading={loading}
          error={error}
          success={success}
          onSubmit={handleAddProperty}
          isEditing={isEditing}
          onCancel={handleCancelEdit}
        />
      </div>
    </div>
  );
};

export default AdminPanel;