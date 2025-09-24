/**
 * Утилиты для работы с изображениями
 */

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 - 1.0
  format?: 'jpeg' | 'webp' | 'png';
}

/**
 * Сжимает изображение с сохранением пропорций
 */
export const compressImage = (
  file: File,
  options: ImageCompressionOptions = {}
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'jpeg'
    } = options;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Вычисляем новые размеры с сохранением пропорций
      const { width: newWidth, height: newHeight } = calculateNewDimensions(
        img.width,
        img.height,
        maxWidth,
        maxHeight
      );

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Рисуем сжатое изображение
      ctx!.drawImage(img, 0, 0, newWidth, newHeight);

      // Конвертируем в Blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Ошибка сжатия изображения'));
            return;
          }

          // Создаем новый File объект
          const compressedFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, `.${format === 'jpeg' ? 'jpg' : format}`),
            {
              type: `image/${format}`,
              lastModified: Date.now()
            }
          );

          resolve(compressedFile);
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = () => reject(new Error('Ошибка загрузки изображения'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Вычисляет новые размеры изображения с сохранением пропорций
 */
const calculateNewDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  let { width, height } = { width: originalWidth, height: originalHeight };

  // Если изображение меньше максимальных размеров, не изменяем
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  // Вычисляем коэффициенты масштабирования
  const widthRatio = maxWidth / width;
  const heightRatio = maxHeight / height;
  const ratio = Math.min(widthRatio, heightRatio);

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio)
  };
};

/**
 * Конвертирует File в base64 строку
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Получает информацию о размере изображения
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Форматирует размер файла в читаемый вид
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};