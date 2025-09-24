import { useEffect, useState } from 'react';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramWebApp {
  user?: TelegramUser;
  isExpanded: boolean;
  colorScheme: 'light' | 'dark';
  themeParams: any;
  showMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
  showAlert: (message: string) => void;
  showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
  hapticImpact: (style?: 'light' | 'medium' | 'heavy') => void;
  close: () => void;
  expand: () => void;
  ready: () => void;
  sendData: (data: string) => void;
}

export const useTelegram = (): TelegramWebApp => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Проверяем наличие Telegram WebApp
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      
      try {
        tg.ready();
        tg.expand();
        
        setIsExpanded(tg.isExpanded);
        setColorScheme(tg.colorScheme || 'light');
      } catch (error) {
        console.log('Telegram WebApp не инициализирован:', error);
      }
    }
  }, []);

  const showMainButton = (text: string, onClick: () => void) => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.MainButton.setText(text);
      tg.MainButton.show();
      tg.MainButton.onClick(onClick);
    }
  };

  const hideMainButton = () => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.MainButton.hide();
    }
  };

  const showAlert = (message: string) => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.showConfirm(message, callback);
    } else {
      const result = confirm(message);
      callback(result);
    }
  };

  const hapticImpact = (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred(style);
      }
    }
  };

  const close = () => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.close();
    }
  };

  const expand = () => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.expand();
    }
  };

  const ready = () => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
    }
  };

  const sendData = (data: string) => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.sendData(data);
    }
  };

  // Получаем пользователя
  const user = typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user 
    ? (window as any).Telegram.WebApp.initDataUnsafe.user 
    : undefined;

  return {
    user,
    isExpanded,
    colorScheme,
    themeParams: {},
    showMainButton,
    hideMainButton,
    showAlert,
    showConfirm,
    hapticImpact,
    close,
    expand,
    ready,
    sendData
  };
};