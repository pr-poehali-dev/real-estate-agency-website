import { useState } from 'react';
import { Cart as CartType, CartItem } from '@/types/product';
import { useTelegram } from '@/hooks/useTelegram';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface CartProps {
  cart: CartType;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Cart = ({ 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  isOpen,
  onClose 
}: CartProps) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { hapticImpact, showMainButton, hideMainButton } = useTelegram();

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    hapticImpact('medium');
    
    // Показываем главную кнопку Telegram для оплаты
    showMainButton(`Оплатить ${cart.total} ₽`, () => {
      onCheckout();
      hideMainButton();
    });
    
    setTimeout(() => setIsCheckingOut(false), 1000);
  };

  const handleQuantityChange = (item: CartItem, delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
      onRemoveItem(item.id);
    } else {
      onUpdateQuantity(item.id, newQuantity);
    }
    hapticImpact('light');
  };

  const formatPrice = (price: number, currency: string) => {
    const symbols = {
      RUB: '₽',
      USD: '$',
      EUR: '€'
    };
    
    return `${price.toLocaleString()} ${symbols[currency as keyof typeof symbols]}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full max-h-[80vh] bg-background rounded-t-3xl slide-up">
        <Card className="border-none shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Корзина</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="rounded-full w-8 h-8 p-0"
              >
                <Icon name="X" className="w-4 h-4" />
              </Button>
            </div>
            <Badge variant="secondary" className="w-fit">
              {cart.itemsCount} товаров
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-3 max-h-[50vh] overflow-y-auto">
            {cart.items.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="ShoppingCart" className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Корзина пуста</p>
              </div>
            ) : (
              cart.items.map((item) => (
                <div key={item.id} className="flex gap-3 p-2 rounded-lg bg-secondary/50">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {formatPrice(item.price, item.currency)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-7 h-7 rounded-full p-0"
                          onClick={() => handleQuantityChange(item, -1)}
                        >
                          <Icon name="Minus" className="w-3 h-3" />
                        </Button>
                        
                        <span className="text-sm font-medium min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-7 h-7 rounded-full p-0"
                          onClick={() => handleQuantityChange(item, 1)}
                        >
                          <Icon name="Plus" className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive w-7 h-7 rounded-full p-0"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Icon name="Trash2" className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
          
          {cart.items.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Итого:</span>
                <span className="text-lg font-bold">
                  {cart.total.toLocaleString()} ₽
                </span>
              </div>
              
              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full tg-button"
              >
                {isCheckingOut ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Обработка...
                  </div>
                ) : (
                  `Оформить заказ на ${cart.total.toLocaleString()} ₽`
                )}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};