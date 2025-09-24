import { useState } from 'react';
import { Product } from '@/types/product';
import { useTelegram } from '@/hooks/useTelegram';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const { hapticImpact } = useTelegram();

  const handleAddToCart = () => {
    setIsAdding(true);
    hapticImpact('light');
    onAddToCart(product);
    
    setTimeout(() => setIsAdding(false), 500);
  };

  const formatPrice = (price: number, currency: string) => {
    const symbols = {
      RUB: '₽',
      USD: '$',
      EUR: '€'
    };
    
    return `${price.toLocaleString()} ${symbols[currency as keyof typeof symbols]}`;
  };

  const originalPrice = product.discount 
    ? Math.round(product.price / (1 - product.discount / 100))
    : null;

  return (
    <Card className="product-card border-none shadow-sm">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-32 object-cover"
        />
        
        {product.discount && (
          <Badge 
            variant="destructive" 
            className="absolute top-2 left-2 text-xs"
          >
            -{product.discount}%
          </Badge>
        )}
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-sm font-medium">Нет в наличии</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-medium text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {product.description}
        </p>
        
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Icon name="Star" className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">{product.rating}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-semibold text-sm">
              {formatPrice(product.price, product.currency)}
            </span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(originalPrice, product.currency)}
              </span>
            )}
          </div>
          
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className={`tg-button text-xs px-3 py-1 h-8 ${
              isAdding ? 'bg-green-500' : ''
            }`}
          >
            {isAdding ? (
              <Icon name="Check" className="w-3 h-3" />
            ) : (
              <Icon name="Plus" className="w-3 h-3" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};