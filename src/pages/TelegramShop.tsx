import { useState, useEffect } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import { ProductCard } from '@/components/ProductCard';
import { Cart } from '@/components/Cart';
import { products } from '@/data/products';
import { Product, Cart as CartType, CartItem } from '@/types/product';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const TelegramShop = () => {
  const [cart, setCart] = useState<CartType>({ items: [], total: 0, itemsCount: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  
  const { 
    user, 
    colorScheme, 
    ready, 
    expand,
    showAlert,
    hapticImpact 
  } = useTelegram();

  useEffect(() => {
    ready();
    expand();
    
    // Устанавливаем тему
    if (colorScheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [ready, expand, colorScheme]);

  const categories = ['Все', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.id === product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = prevCart.items.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...prevCart.items, { ...product, quantity: 1 }];
      }
      
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newItemsCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        items: newItems,
        total: newTotal,
        itemsCount: newItemsCount
      };
    });
    
    hapticImpact('light');
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newItemsCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        items: newItems,
        total: newTotal,
        itemsCount: newItemsCount
      };
    });
  };

  const removeItem = (productId: number) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.id !== productId);
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newItemsCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        items: newItems,
        total: newTotal,
        itemsCount: newItemsCount
      };
    });
    
    hapticImpact('medium');
  };

  const handleCheckout = () => {
    const orderData = {
      user: user,
      items: cart.items,
      total: cart.total,
      timestamp: new Date().toISOString()
    };
    
    showAlert(`Спасибо за заказ, ${user?.first_name || 'покупатель'}! Заказ на сумму ${cart.total.toLocaleString()} ₽ оформлен.`);
    
    // Отправляем данные заказа боту (в реальном приложении)
    console.log('Order data:', orderData);
    
    // Очищаем корзину
    setCart({ items: [], total: 0, itemsCount: 0 });
    setIsCartOpen(false);
  };

  return (
    <div className="twa-root min-h-screen pb-20">
      {/* Хедер */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">Apple Store</h1>
              {user && (
                <p className="text-sm text-muted-foreground">
                  Привет, {user.first_name}! 👋
                </p>
              )}
            </div>
          </div>
          
          {/* Поиск */}
          <div className="relative mb-4">
            <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Категории */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className="container py-4">
        {filteredProducts.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <Icon name="Search" className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle className="mb-2">Товары не найдены</CardTitle>
              <p className="text-muted-foreground">
                Попробуйте изменить поисковый запрос или категорию
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Кнопка корзины */}
      {cart.itemsCount > 0 && (
        <Button
          onClick={() => setIsCartOpen(true)}
          className="cart-floating tg-button rounded-full w-14 h-14 p-0 relative"
        >
          <Icon name="ShoppingCart" className="w-6 h-6" />
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {cart.itemsCount}
          </Badge>
        </Button>
      )}

      {/* Корзина */}
      <Cart
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default TelegramShop;