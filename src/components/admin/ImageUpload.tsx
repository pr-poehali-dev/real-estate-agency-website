import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import Icon from '../ui/icon';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  images, 
  onImagesChange, 
  maxImages = 5 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    if (images.length + fileArray.length > maxImages) {
      alert(`Максимум ${maxImages} изображений`);
      return;
    }

    setIsUploading(true);

    try {
      const newImages: string[] = [];
      
      for (const file of fileArray) {
        // Проверяем тип файла
        if (!file.type.startsWith('image/')) {
          alert(`Файл ${file.name} не является изображением`);
          continue;
        }

        // Проверяем размер файла (макс 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`Файл ${file.name} слишком большой (максимум 5MB)`);
          continue;
        }

        // Конвертируем в base64 для демонстрации
        const base64 = await convertToBase64(file);
        newImages.push(base64);
      }

      onImagesChange([...images, ...newImages]);
    } catch (error) {
      console.error('Ошибка загрузки изображений:', error);
      alert('Ошибка при загрузке изображений');
    } finally {
      setIsUploading(false);
      // Очищаем input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    if (images.length + files.length > maxImages) {
      alert(`Максимум ${maxImages} изображений`);
      return;
    }

    setIsUploading(true);

    try {
      const newImages: string[] = [];
      
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 5 * 1024 * 1024) continue;
        
        const base64 = await convertToBase64(file);
        newImages.push(base64);
      }

      onImagesChange([...images, ...newImages]);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Изображения ({images.length}/{maxImages})</Label>
      
      {/* Зона загрузки */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {isUploading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Загружаем...</span>
          </div>
        ) : (
          <div className="space-y-2">
            <Icon name="Upload" size={48} className="mx-auto text-gray-400" />
            <div>
              <p className="text-sm font-medium">
                Кликните или перетащите изображения сюда
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, WEBP до 5MB каждый
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Превью изображений */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`Изображение ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon name="X" size={12} />
              </button>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Кнопки управления */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= maxImages || isUploading}
          className="flex-1"
        >
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить изображения
        </Button>
        
        {images.length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => onImagesChange([])}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <Icon name="Trash2" size={16} className="mr-2" />
            Очистить все
          </Button>
        )}
      </div>

      {/* Альтернативный ввод URL */}
      <details className="border rounded-lg p-4">
        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
          Или добавить изображения по URL
        </summary>
        <div className="mt-3 space-y-2">
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            className="w-full p-2 border border-gray-300 rounded"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const url = (e.target as HTMLInputElement).value.trim();
                if (url && images.length < maxImages) {
                  onImagesChange([...images, url]);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
          <p className="text-xs text-gray-500">
            Нажмите Enter для добавления
          </p>
        </div>
      </details>
    </div>
  );
};

export default ImageUpload;