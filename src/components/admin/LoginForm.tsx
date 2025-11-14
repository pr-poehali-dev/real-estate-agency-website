import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Icon from '../ui/icon';

interface LoginFormProps {
  loginForm: { username: string; password: string };
  setLoginForm: React.Dispatch<React.SetStateAction<{ username: string; password: string }>>;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loginForm,
  setLoginForm,
  loading,
  error,
  onSubmit
}) => {
  const [resetting, setResetting] = React.useState(false);
  const [resetSuccess, setResetSuccess] = React.useState('');

  const handleResetPassword = async () => {
    if (!confirm('Сбросить пароль для пользователя admin на admin123?')) {
      return;
    }

    setResetting(true);
    setResetSuccess('');

    try {
      const response = await fetch('https://functions.poehali.dev/bb554e87-2156-481e-b236-a9b4650565eb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
          new_password: 'admin123'
        })
      });

      const data = await response.json();

      if (data.ok) {
        setResetSuccess('Пароль успешно сброшен! Используйте admin / admin123');
      } else {
        alert('Ошибка: ' + data.error);
      }
    } catch (err) {
      alert('Ошибка сброса пароля: ' + err);
    } finally {
      setResetting(false);
    }
  };

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
            <form onSubmit={onSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {resetSuccess && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
                  {resetSuccess}
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

            <div className="mt-4 space-y-3">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleResetPassword}
                disabled={resetting}
              >
                {resetting ? 'Сброс пароля...' : 'Сбросить пароль на admin123'}
              </Button>

              <div className="text-sm text-gray-600 text-center">
                <p>Логин по умолчанию: <strong>admin</strong></p>
                <p>Пароль по умолчанию: <strong>admin123</strong></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;