import { Properties } from '@/lib/api';

export const migrateDemoToDatabase = async () => {
  const demoDataStr = localStorage.getItem('demo_properties');
  
  if (!demoDataStr) {
    console.log('Нет демо-данных для миграции');
    return { success: false, message: 'Нет демо-данных' };
  }

  const demoProperties = JSON.parse(demoDataStr);
  
  if (!Array.isArray(demoProperties) || demoProperties.length === 0) {
    console.log('Демо-данные пустые');
    return { success: false, message: 'Демо-данные пустые' };
  }

  const results = {
    total: demoProperties.length,
    success: 0,
    failed: 0,
    errors: [] as string[]
  };

  for (const property of demoProperties) {
    try {
      const payload = {
        title: property.title?.trim(),
        description: property.description?.trim() || '',
        property_type: property.property_type,
        transaction_type: property.transaction_type,
        price: Number(property.price) || 0,
        currency: property.currency || 'AMD',
        area: property.area ? Number(property.area) : 0,
        rooms: property.rooms ? Number(property.rooms) : 0,
        bedrooms: property.bedrooms ? Number(property.bedrooms) : 0,
        bathrooms: property.bathrooms ? Number(property.bathrooms) : 0,
        floor: property.floor ? Number(property.floor) : 0,
        total_floors: property.total_floors ? Number(property.total_floors) : 0,
        year_built: property.year_built ? Number(property.year_built) : new Date().getFullYear(),
        latitude: Number(property.latitude) || 40.1792,
        longitude: Number(property.longitude) || 44.4991,
        district: property.district?.trim() || 'Центр (Кентрон)',
        address: property.address?.trim() || '',
        street_name: property.street_name?.trim() || '',
        house_number: property.house_number?.trim() || '',
        apartment_number: property.apartment_number?.trim() || '',
        features: property.features || [],
        images: property.images || [],
        pets_allowed: property.pets_allowed || 'any',
        children_allowed: property.children_allowed || 'any',
        status: 'active'
      };

      await Properties.create(payload);
      results.success++;
      console.log(`✅ Мигрировано: ${property.title}`);
    } catch (error: any) {
      results.failed++;
      const errorMsg = `Ошибка для "${property.title}": ${error.message}`;
      results.errors.push(errorMsg);
      console.error(errorMsg);
    }
  }

  console.log('Миграция завершена:', results);
  return { success: true, results };
};
