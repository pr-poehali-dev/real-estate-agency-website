import { useEffect, useState } from 'react';
import { 
  initData, 
  miniApp, 
  themeParams, 
  viewport,
  mainButton,
  backButton,
  hapticFeedback,
  cloudStorage
} from '@tma.js/sdk';

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
    try {
      // Инициализируем SDK
      initData.restore();
      miniApp.ready();
      viewport.expand();
      
      setIsExpanded(viewport.isExpanded);
      setColorScheme(themeParams.colorScheme || 'light');

      // Подписываемся на изменения viewport
      viewport.on('changed', () => {
        setIsExpanded(viewport.isExpanded);
      });

      // Подписываемся на изменения темы
      themeParams.on('changed', () => {
        setColorScheme(themeParams.colorScheme || 'light');
      });

    } catch (error) {
      console.log('Telegram WebApp не инициализирован:', error);
    }
  }, []);

  const showMainButton = (text: string, onClick: () => void) => {
    try {
      mainButton.setText(text);
      mainButton.show();
      mainButton.on('click', onClick);
    } catch (error) {
      console.log('Main button недоступна:', error);
    }
  };

  const hideMainButton = () => {
    try {
      mainButton.hide();
    } catch (error) {
      console.log('Main button недоступна:', error);
    }
  };

  const showAlert = (message: string) => {
    try {
      miniApp.showAlert(message);
    } catch (error) {
      alert(message);
    }
  };

  const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
    try {
      miniApp.showConfirm(message, callback);
    } catch (error) {
      const result = confirm(message);
      callback(result);
    }
  };

  const hapticImpact = (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    try {
      hapticFeedback.impactOccurred(style);
    } catch (error) {
      console.log('Haptic feedback недоступен:', error);
    }
  };

  const close = () => {
    try {
      miniApp.close();
    } catch (error) {
      console.log('Закрытие недоступно вне Telegram:', error);
    }
  };

  const expand = () => {
    try {
      viewport.expand();
    } catch (error) {
      console.log('Расширение недоступно вне Telegram:', error);
    }
  };

  const ready = () => {
    try {
      miniApp.ready();
    } catch (error) {
      console.log('Ready недоступно вне Telegram:', error);
    }
  };

  const sendData = (data: string) => {
    try {
      miniApp.sendData(data);
    } catch (error) {
      console.log('Send data недоступно вне Telegram:', error);
    }
  };

  // Получаем пользователя из initData
  const user = initData.user ? {
    id: initData.user.id,
    first_name: initData.user.firstName,
    last_name: initData.user.lastName,
    username: initData.user.username,
    language_code: initData.user.languageCode,
    is_premium: initData.user.isPremium,
    photo_url: initData.user.photoUrl
  } : undefined;

  return {
    user,
    isExpanded,
    colorScheme,
    themeParams: themeParams.getState(),
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