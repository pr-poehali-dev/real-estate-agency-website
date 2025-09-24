import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import Icon from '../ui/icon';
import { compressImage, fileToBase64, formatFileSize, getImageDimensions } from '@/utils/imageUtils';

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
  const [compressionEnabled, setCompressionEnabled] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
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

        // Проверяем размер файла (макс 10MB для обработки)
        if (file.size > 10 * 1024 * 1024) {
          alert(`Файл ${file.name} слишком большой (максимум 10MB)`);
          continue;
        }

        // Сжимаем изображение если включено сжатие
        let processedFile = file;
        if (compressionEnabled) {
          try {
            processedFile = await compressImage(file, {
              maxWidth: 1920,
              maxHeight: 1080,
              quality: 0.8,
              format: 'jpeg'
            });
            console.log(`Сжатие: ${formatFileSize(file.size)} → ${formatFileSize(processedFile.size)}`);
          } catch (error) {
            console.warn('Ошибка сжатия, используем оригинал:', error);
          }
        }

        // Конвертируем в base64
        const base64 = await fileToBase64(processedFile);
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

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    
    if (images.length + files.length > maxImages) {
      alert(`Максимум ${maxImages} изображений`);
      return;
    }

    setIsUploading(true);

    try {
      const newImages: string[] = [];
      
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) continue;

        // Сжимаем если включено
        let processedFile = file;
        if (compressionEnabled) {
          try {
            processedFile = await compressImage(file, {
              maxWidth: 1920,
              maxHeight: 1080,
              quality: 0.8,
              format: 'jpeg'
            });
          } catch (error) {
            console.warn('Ошибка сжатия:', error);
          }
        }
        
        const base64 = await fileToBase64(processedFile);
        newImages.push(base64);
      }

      onImagesChange([...images, ...newImages]);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Обработка перетаскивания изображений для сортировки
  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDropTargetIndex(index);
    }
  };

  const handleImageDragLeave = () => {
    setDropTargetIndex(null);
  };

  const handleImageDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDropTargetIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Удаляем перетаскиваемое изображение
    newImages.splice(draggedIndex, 1);
    
    // Вставляем на новое место
    const finalTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
    newImages.splice(finalTargetIndex, 0, draggedImage);
    
    onImagesChange(newImages);
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Изображения ({images.length}/{maxImages})</Label>
        
        {/* Настройки сжатия */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="compression"
            checked={compressionEnabled}
            onChange={(e) => setCompressionEnabled(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="compression" className="text-sm text-gray-600 cursor-pointer">
            Сжимать изображения
          </label>
        </div>
      </div>
      
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
            <span>Загружаем{compressionEnabled ? ' и сжимаем' : ''}...</span>
          </div>
        ) : (
          <div className="space-y-2">
            <Icon name="Upload" size={48} className="mx-auto text-gray-400" />
            <div>
              <p className="text-sm font-medium">
                Кликните или перетащите изображения сюда
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, WEBP до 10MB{compressionEnabled ? ' (автосжатие до 1920px)' : ''}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Превью изображений с поддержкой сортировки */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            💡 Перетащите изображения для изменения порядка
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleImageDragStart(e, index)}
                onDragOver={(e) => handleImageDragOver(e, index)}
                onDragLeave={handleImageDragLeave}
                onDrop={(e) => handleImageDrop(e, index)}
                className={`relative group cursor-move transition-all duration-200 ${
                  draggedIndex === index ? 'opacity-50 scale-95' : ''
                } ${
                  dropTargetIndex === index ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
              >
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`Изображение ${index + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
                
                {/* Кнопка удаления */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <Icon name="X" size={12} />
                </button>
                
                {/* Номер изображения */}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
                
                {/* Индикатор перетаскивания */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="Move" size={12} />
                </div>
              </div>
            ))}
          </div>
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

      {/* Информация о функциях */}
      {images.length > 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p><strong>Сортировка:</strong> Перетащите изображения для изменения порядка</p>
              <p><strong>Сжатие:</strong> {compressionEnabled ? 'Включено (до 1920px, качество 80%)' : 'Отключено'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;