interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

const BACKEND_URLS = {
  auth: 'https://functions.poehali.dev/ff6ed7aa-f0f1-4101-8caf-5bfcad13ef59',
  properties: 'https://functions.poehali.dev/8571bb44-9242-4aac-8df9-754908175968',
  telegramSubmit: 'https://functions.poehali.dev/09d9ff7b-b72a-40eb-ac66-289fa2f53b56'
};

async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> || {})
  };
  
  if (token) {
    headers['X-Auth-Token'] = token;
  }
  
  const url = path;
  
  try {
    const res = await fetch(url, {
      ...opts,
      headers,
      credentials: 'omit'
    });
    
    const json: ApiResponse = await res.json().catch(() => ({ ok: false, error: 'Invalid response' }));
    
    if (!res.ok || json.ok === false) {
      throw new Error(json.error || `HTTP ${res.status}`);
    }
    
    return json.data as T;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const Auth = {
  login: (username: string, password: string) =>
    api<LoginResponse>(BACKEND_URLS.auth, {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),
  
  me: () =>
    api<{ user: User }>(BACKEND_URLS.auth),
  
  logout: () => {
    localStorage.removeItem('admin_token');
    return Promise.resolve();
  }
};

export interface Property {
  id?: number;
  title: string;
  description: string;
  property_type: string;
  transaction_type: string;
  price: number;
  currency: string;
  area: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  total_floors: number;
  year_built: number;
  district: string;
  address: string;
  street_name?: string;
  house_number?: string;
  apartment_number?: string;
  latitude: number;
  longitude: number;
  features: string[];
  images: string[];
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyListResponse {
  properties: Property[];
  count: number;
}

function isDemoMode(): boolean {
  const token = localStorage.getItem('admin_token');
  return token?.startsWith('demo-token-') || false;
}

function getDemoProperties(): Property[] {
  try {
    const data = localStorage.getItem('demo_properties');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveDemoProperties(properties: Property[]): void {
  try {
    const propertiesWithoutImages = properties.map(p => ({
      ...p,
      images: p.images?.slice(0, 2) || []
    }));
    localStorage.setItem('demo_properties', JSON.stringify(propertiesWithoutImages));
  } catch (error) {
    console.error('Failed to save demo properties:', error);
    const propertiesWithoutImages = properties.map(p => ({
      ...p,
      images: []
    }));
    localStorage.setItem('demo_properties', JSON.stringify(propertiesWithoutImages));
  }
}

export const Properties = {
  list: async (query = '') => {
    const properties = getDemoProperties();
    return { properties, count: properties.length };
  },
  
  get: async (id: number) => {
    const properties = getDemoProperties();
    const property = properties.find(p => p.id === id);
    if (!property) throw new Error('Объект не найден');
    return property;
  },
  
  create: async (payload: Partial<Property>) => {
    if (isDemoMode()) {
      const properties = getDemoProperties();
      const newProperty: Property = {
        ...payload,
        id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active'
      } as Property;
      properties.push(newProperty);
      saveDemoProperties(properties);
      return { property_id: newProperty.id!, message: 'Объект добавлен (демо-режим)' };
    }
    return api<{ property_id: number; message: string }>(BACKEND_URLS.properties, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  
  update: async (id: number, payload: Partial<Property>) => {
    if (isDemoMode()) {
      const properties = getDemoProperties();
      const index = properties.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Property not found');
      properties[index] = {
        ...properties[index],
        ...payload,
        id,
        updated_at: new Date().toISOString()
      };
      saveDemoProperties(properties);
      return { message: 'Объект обновлён (демо-режим)' };
    }
    return api<{ message: string }>(`${BACKEND_URLS.properties}?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },
  
  remove: async (id: number) => {
    if (isDemoMode()) {
      const properties = getDemoProperties();
      const filtered = properties.filter(p => p.id !== id);
      saveDemoProperties(filtered);
      return { message: 'Объект удалён (демо-режим)' };
    }
    return api<{ message: string }>(`${BACKEND_URLS.properties}?id=${id}`, {
      method: 'DELETE'
    });
  }
};

export interface TelegramSubmission {
  name: string;
  contactMethod: string;
  contact: string;
  service: string;
  message: string;
}

export const Telegram = {
  submit: (data: TelegramSubmission) =>
    api<{ success: true; message: string }>(BACKEND_URLS.telegramSubmit, {
      method: 'POST',
      body: JSON.stringify(data)
    })
};