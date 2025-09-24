import React from 'react';
import { Button } from '../ui/button';
import Icon from '../ui/icon';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

interface AdminHeaderProps {
  user: AdminUser;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ user, onLogout }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Админ-панель WSE.AM</h1>
          <p className="text-gray-600">Добро пожаловать, {user.full_name}</p>
        </div>
        <Button variant="outline" onClick={onLogout}>
          <Icon name="LogOut" size={16} className="mr-2" />
          Выйти
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;