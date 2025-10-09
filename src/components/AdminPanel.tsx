import React, { useState, useEffect, useCallback } from 'react';
import LoginForm from './admin/LoginForm';
import AdminHeader from './admin/AdminHeader';
import PropertyForm from './admin/PropertyForm';
import PropertyList from './admin/PropertyList';
import { Property } from '@/types/property';
import { Auth, Properties, User as ApiUser } from '@/lib/api';

type AdminUser = ApiUser;

const AdminPanel: React.FC = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [demoProperties, setDemoProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('demo_properties');
    return saved ? JSON.parse(saved) : [];
  });

  const [propertyForm, setPropertyForm] = useState<Property>(() => {
    const saved = localStorage.getItem('admin_form_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {
          title: '',
          description: '',
          property_type: 'apartment',
          transaction_type: 'rent',
          price: 0,
          currency: 'AMD',
          area: 0,
          rooms: 0,
          floor: 0,
          total_floors: 0,
          district: 'Центр (Кентрон)',
          address: '',
          street_name: '',
          house_number: '',
          apartment_number: '',
          latitude: 40.1792,
          longitude: 44.4991,
          features: [],
          images: [],
          pets_allowed: 'any',
          children_allowed: 'any'
        };
      }
    }
    return {
      title: '',
      description: '',
      property_type: 'apartment',
      transaction_type: 'rent',
      price: 0,
      currency: 'AMD',
      area: 0,
      rooms: 0,
      floor: 0,
      total_floors: 0,
      district: 'Центр (Кентрон)',
      address: '',
      street_name: '',
      house_number: '',
      apartment_number: '',
      latitude: 40.1792,
      longitude: 44.4991,
      features: [],
      images: [],
      pets_allowed: 'any',
      children_allowed: 'any'
    };
  });

  const [featuresText, setFeaturesText] = useState(() => {
    return localStorage.getItem('admin_features_draft') || '';
  });

  // Автосохранение формы
  useEffect(() => {
    localStorage.setItem('admin_form_draft', JSON.stringify(propertyForm));
  }, [propertyForm]);

  useEffect(() => {
    localStorage.setItem('admin_features_draft', featuresText);
  }, [featuresText]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

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
      const data = await Auth.me();
      setUser(data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('admin_token');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
      const data = await Auth.login(loginForm.username, loginForm.password);
      localStorage.setItem('admin_token', data.token);
      setUser(data.user);
      setLoginForm({ username: '', password: '' });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка авторизации. Попробуйте: admin / admin123');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
  };

  const resetForm = useCallback(() => {
    const emptyForm = {
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
      street_name: '',
      house_number: '',
      apartment_number: '',
      latitude: 40.1792,
      longitude: 44.4991,
      features: [],
      images: [],
      pets_allowed: 'any',
      children_allowed: 'any'
    };
    setPropertyForm(emptyForm);
    setFeaturesText('');
    setIsEditing(false);
    setEditingProperty(null);
    localStorage.removeItem('admin_form_draft');
    localStorage.removeItem('admin_features_draft');
  }, []);

  const handleAddOrUpdateProperty = async (e: React.FormEvent) => {
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

    if (token.startsWith('demo-token-')) {
      const features = featuresText.split('\n').filter(f => f.trim()).map(f => f.trim());
      const now = new Date().toISOString();
      
      let updatedProperties: Property[];
      if (isEditing && editingProperty?.id) {
        const updatedProperty: Property = {
          ...propertyForm,
          id: editingProperty.id,
          features,
          status: 'active',
          created_at: editingProperty.created_at || now,
          updated_at: now
        };
        updatedProperties = demoProperties.map(p => 
          p.id === editingProperty.id ? updatedProperty : p
        );
        setSuccess(`Объект "${propertyForm.title}" успешно обновлён в демо режиме!`);
      } else {
        const newProperty: Property = {
          ...propertyForm,
          id: Date.now(),
          features,
          status: 'active',
          created_at: now,
          updated_at: now
        };
        updatedProperties = [...demoProperties, newProperty];
        setSuccess(`Объект "${propertyForm.title}" успешно добавлен в демо режиме!`);
      }

      setDemoProperties(updatedProperties);
      localStorage.setItem('demo_properties', JSON.stringify(updatedProperties));
      resetForm();
      setLoading(false);
      setRefetchTrigger(prev => prev + 1);
      return;
    }

    try {
      const features = featuresText.split('\n').filter(f => f.trim()).map(f => f.trim());

      const payload = {
        title: propertyForm.title?.trim(),
        description: propertyForm.description?.trim() || '',
        property_type: propertyForm.property_type,
        transaction_type: propertyForm.transaction_type,
        price: Number(propertyForm.price) || 0,
        currency: propertyForm.currency || 'AMD',
        area: propertyForm.area ? Number(propertyForm.area) : 0,
        rooms: propertyForm.rooms ? Number(propertyForm.rooms) : 0,
        bedrooms: propertyForm.bedrooms ? Number(propertyForm.bedrooms) : 0,
        bathrooms: propertyForm.bathrooms ? Number(propertyForm.bathrooms) : 0,
        floor: propertyForm.floor ? Number(propertyForm.floor) : 0,
        total_floors: propertyForm.total_floors ? Number(propertyForm.total_floors) : 0,
        year_built: propertyForm.year_built ? Number(propertyForm.year_built) : new Date().getFullYear(),
        latitude: Number(propertyForm.latitude) || 40.1792,
        longitude: Number(propertyForm.longitude) || 44.4991,
        district: propertyForm.district?.trim() || 'Центр (Кентрон)',
        address: propertyForm.address?.trim() || '',
        street_name: propertyForm.street_name?.trim() || '',
        house_number: propertyForm.house_number?.trim() || '',
        apartment_number: propertyForm.apartment_number?.trim() || '',
        features,
        images: propertyForm.images || [],
        pets_allowed: propertyForm.pets_allowed || 'any',
        children_allowed: propertyForm.children_allowed || 'any',
        status: 'active'
      };

      if (isEditing && propertyForm.id) {
        await Properties.update(propertyForm.id, payload);
        setSuccess(`Объект "${propertyForm.title}" успешно обновлён!`);
      } else {
        await Properties.create(payload);
        setSuccess(`Объект "${propertyForm.title}" успешно добавлен!`);
      }

      resetForm();
      setRefetchTrigger(prev => prev + 1);
    } catch (error: any) {
      setError(error.message || 'Ошибка сохранения объекта');
      console.error('Property save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setIsEditing(true);
    
    setPropertyForm({
      ...property,
      street_name: property.street_name || '',
      house_number: property.house_number || '',
      apartment_number: property.apartment_number || '',
      features: property.features || [],
      images: property.images || [],
      pets_allowed: property.pets_allowed || 'any',
      children_allowed: property.children_allowed || 'any'
    });
    
    setFeaturesText((property.features || []).join('\n'));
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    resetForm();
    setError('');
    setSuccess('');
  };

  const handleDeleteProperty = async (propertyId: number) => {
    if (!confirm('Вы уверены, что хотите удалить это объявление?')) {
      return;
    }

    const token = localStorage.getItem('admin_token');
    if (token && token.startsWith('demo-token-')) {
      const updatedProperties = demoProperties.filter(p => p.id !== propertyId);
      setDemoProperties(updatedProperties);
      localStorage.setItem('demo_properties', JSON.stringify(updatedProperties));
      setSuccess(`Объявление #${propertyId} удалено в демо режиме!`);
      setRefetchTrigger(prev => prev + 1);
      return;
    }

    try {
      await Properties.remove(propertyId);
      setSuccess('Объявление успешно удалено!');
      setRefetchTrigger(prev => prev + 1);
    } catch (error: any) {
      setError(error.message || 'Ошибка удаления объекта');
    }
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
          refetchTrigger={refetchTrigger}
          demoProperties={demoProperties}
        />
        
        <PropertyForm
          propertyForm={propertyForm}
          setPropertyForm={setPropertyForm}
          featuresText={featuresText}
          setFeaturesText={setFeaturesText}
          loading={loading}
          error={error}
          success={success}
          onSubmit={handleAddOrUpdateProperty}
          isEditing={isEditing}
          onCancel={handleCancelEdit}
        />
      </div>
    </div>
  );
};

export default AdminPanel;