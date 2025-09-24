import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: 1,
    name: 'Беспроводные наушники AirPods Pro',
    description: 'Наушники с активным шумоподавлением и прозрачным режимом',
    price: 24990,
    currency: 'RUB',
    image: '/img/196c9ed5-bcf8-497d-bbef-bd37170c7fe9.jpg',
    category: 'Электроника',
    inStock: true,
    rating: 4.8,
    discount: 15
  },
  {
    id: 2,
    name: 'Apple Watch Series 9',
    description: 'Смарт-часы с GPS и Cellular, 45мм',
    price: 42990,
    currency: 'RUB',
    image: '/img/33b8fe48-8da7-4b06-8f2e-6560eecc00db.jpg',
    category: 'Электроника',
    inStock: true,
    rating: 4.9
  },
  {
    id: 3,
    name: 'iPhone 15 Pro Max',
    description: 'Смартфон с титановым корпусом, 256ГБ',
    price: 129990,
    currency: 'RUB',
    image: '/img/3eccebd6-7e8e-47e0-9b9f-39e7c401d0aa.jpg',
    category: 'Смартфоны',
    inStock: true,
    rating: 4.7
  },
  {
    id: 4,
    name: 'MacBook Air M2',
    description: 'Ноутбук с чипом M2, 13 дюймов, 8ГБ ОЗУ, 256ГБ SSD',
    price: 124990,
    currency: 'RUB',
    image: '/img/3eccebd6-7e8e-47e0-9b9f-39e7c401d0aa.jpg',
    category: 'Компьютеры',
    inStock: false,
    rating: 4.6
  },
  {
    id: 5,
    name: 'iPad Pro 12.9"',
    description: 'Планшет с чипом M2, 128ГБ, Wi-Fi + Cellular',
    price: 104990,
    currency: 'RUB',
    image: '/img/3eccebd6-7e8e-47e0-9b9f-39e7c401d0aa.jpg',
    category: 'Планшеты',
    inStock: true,
    rating: 4.8,
    discount: 10
  },
  {
    id: 6,
    name: 'Magic Keyboard для iPad',
    description: 'Клавиатура с подсветкой и трекпадом',
    price: 32990,
    currency: 'RUB',
    image: '/img/3eccebd6-7e8e-47e0-9b9f-39e7c401d0aa.jpg',
    category: 'Аксессуары',
    inStock: true,
    rating: 4.5
  }
];