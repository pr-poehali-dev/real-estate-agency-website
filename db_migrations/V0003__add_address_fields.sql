-- Добавляем отдельные поля для улицы и номера дома
ALTER TABLE t_p37006348_real_estate_agency_w.properties 
ADD COLUMN street_name VARCHAR(255),
ADD COLUMN house_number VARCHAR(20),
ADD COLUMN apartment_number VARCHAR(20);

-- Комментарии для понимания структуры
COMMENT ON COLUMN t_p37006348_real_estate_agency_w.properties.street_name IS 'Название улицы (например: ул. Абовяна, пр. Тиграна Меца)';
COMMENT ON COLUMN t_p37006348_real_estate_agency_w.properties.house_number IS 'Номер дома (например: 15, 25/3, 10А)';  
COMMENT ON COLUMN t_p37006348_real_estate_agency_w.properties.apartment_number IS 'Номер квартиры/офиса (опционально)';