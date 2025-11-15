-- Add badges column to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS badges TEXT[];

-- Add comment
COMMENT ON COLUMN properties.badges IS 'Custom badges for property (max 2)';