-- Create table for real estate properties
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(50) NOT NULL, -- apartment, house, commercial
    transaction_type VARCHAR(20) NOT NULL, -- sale, rent
    price DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'AMD',
    area DECIMAL(8,2), -- square meters
    rooms INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    floor INTEGER,
    total_floors INTEGER,
    year_built INTEGER,
    district VARCHAR(100) NOT NULL, -- Ереванские районы
    address TEXT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    features TEXT[], -- array of features like "parking", "balcony", etc
    images TEXT[], -- array of image URLs
    status VARCHAR(20) DEFAULT 'active', -- active, sold, rented, inactive
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance on common queries
CREATE INDEX idx_properties_district ON properties(district);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_transaction ON properties(transaction_type);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_location ON properties(latitude, longitude);

-- Create table for admin users
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Insert default admin user (password will be "admin123" - should be changed in production)
INSERT INTO admin_users (username, password_hash, email, full_name) 
VALUES ('admin', '$2b$12$LQv3c1yqBwEHxPiNsq/MTO7bIZK3DaB0FUgCQwQNXbDJKD1d6U8m2', 'admin@wse.am', 'Администратор WSE.AM');

-- Create Yerevan districts table for reference
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_hy VARCHAR(100) NOT NULL,
    name_ru VARCHAR(100) NOT NULL,
    center_lat DECIMAL(10,8),
    center_lng DECIMAL(11,8)
);

-- Insert Yerevan districts
INSERT INTO districts (name_en, name_hy, name_ru, center_lat, center_lng) VALUES
('Kentron', 'Կենտրոն', 'Центр', 40.1833, 44.5167),
('Ajapnyak', 'Աջափնյակ', 'Аджапняк', 40.2167, 44.4667),
('Avan', 'Ավան', 'Аван', 40.2333, 44.5333),
('Arabkir', 'Արաբկիր', 'Арабкир', 40.2000, 44.5000),
('Davtashen', 'Դավթաշեն', 'Давташен', 40.2333, 44.4833),
('Erebuni', 'Էրեբունի', 'Эребуни', 40.1333, 44.5000),
('Kanaker-Zeytun', 'Կանակեռ-Զեյթուն', 'Канакер-Зейтун', 40.2000, 44.5500),
('Malatia-Sebastia', 'Մալաթիա-Սեբաստիա', 'Малатия-Себастия', 40.1667, 44.4500),
('Nor Nork', 'Նոր Նորք', 'Нор Норк', 40.2167, 44.5333),
('Nubarashen', 'Նուբարաշեն', 'Нубарашен', 40.1500, 44.5167),
('Shengavit', 'Շենգավիթ', 'Шенгавит', 40.1500, 44.4833),
('Qanaqer-Zeytun', 'Քանաքեռ-Զեյթուն', 'Канакер-Зейтун', 40.2000, 44.5500);