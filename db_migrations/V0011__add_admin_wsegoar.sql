-- Add new admin user WSEGoar
INSERT INTO t_p37006348_real_estate_agency_w.admin_users 
  (username, password_hash, email, full_name, role, is_active) 
VALUES 
  ('WSEGoar', '$2b$12$XZvPqYFQ9nJ.LKx8h5LqK.WGxJKqDfBmNDH0J3Y7nGxZKqLmYPgHi', 'wsegoar@wse.am', 'WSE Goar', 'admin', true);