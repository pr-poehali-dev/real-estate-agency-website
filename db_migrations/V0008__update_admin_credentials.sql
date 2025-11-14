-- Update admin username and password
UPDATE t_p37006348_real_estate_agency_w.admin_users 
SET 
  username = 'adminWSE2044',
  password_hash = '$2b$12$vYH7xKQZJzP3mHfN8FqxTOZKGH4.qwmNBxC5L/XjYvRqE9xZLNqOe'
WHERE username = 'admin';