-- Reset admin password to 'admin123'
UPDATE admin_users 
SET password_hash = '$2b$12$LQv3c1yduTPaK7P3mGkKWOxNJFbYK9H6P0VqZYVqZYVqZYVqZYVqZO'
WHERE username = 'admin';