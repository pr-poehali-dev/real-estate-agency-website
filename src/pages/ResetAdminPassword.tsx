import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const ResetAdminPassword = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {
    setLoading(true);
    setStatus('Сбрасываю пароль...');

    try {
      const response = await fetch('https://functions.poehali.dev/bb554e87-2156-481e-b236-a9b4650565eb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'adminWSE2044',
          new_password: 'ADmin@99!1'
        })
      });

      const data = await response.json();

      if (data.ok) {
        setStatus('✅ Пароль успешно сброшен! Теперь можете войти с новыми данными.');
      } else {
        setStatus('❌ Ошибка: ' + data.error);
      }
    } catch (err) {
      setStatus('❌ Ошибка запроса: ' + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Сброс пароля администратора</h1>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Эта страница сбросит пароль для пользователя <strong>adminWSE2044</strong> на <strong>ADmin@99!1</strong>
          </p>

          <Button 
            onClick={resetPassword} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Сброс...' : 'Сбросить пароль'}
          </Button>

          {status && (
            <div className={`p-4 rounded-lg ${
              status.includes('✅') ? 'bg-green-50 text-green-700' : 
              status.includes('❌') ? 'bg-red-50 text-red-700' : 
              'bg-blue-50 text-blue-700'
            }`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetAdminPassword;
