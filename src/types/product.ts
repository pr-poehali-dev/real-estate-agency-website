export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: 'RUB' | 'USD' | 'EUR';
  image: string;
  category: string;
  inStock: boolean;
  rating?: number;
  discount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemsCount: number;
}