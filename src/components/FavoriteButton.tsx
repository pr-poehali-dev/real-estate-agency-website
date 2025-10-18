import React, { useState, useEffect } from 'react';
import Icon from './ui/icon';

interface FavoriteButtonProps {
  propertyId: number;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ propertyId, className = '' }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(propertyId));
  }, [propertyId]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      const newFavorites = favorites.filter((id: number) => id !== propertyId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(propertyId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg transition-all hover:scale-110 ${className}`}
      aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <Icon 
        name="Heart" 
        size={18} 
        className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
      />
    </button>
  );
};

export default FavoriteButton;
