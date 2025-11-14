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
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
      {/* Back button */}
      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="flex items-center gap-2"
          size="sm"
        >
          <Icon name="ArrowLeft" size={16} />
          Назад
        </Button>
      </div>
      
      {/* Header content */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Админ-панель <span className="text-[#FF7A00]">WSE.AM</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600">Добро пожаловать, {user.full_name}</p>
        </div>
        <Button variant="outline" onClick={onLogout} size="sm">
          <Icon name="LogOut" size={16} className="mr-2" />
          Выйти
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;