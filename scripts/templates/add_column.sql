-- Template: Add a column to existing table
-- Replace TABLENAME with your actual table name
-- Replace NEW_COLUMN with your actual column name

-- Add the new column
ALTER TABLE TABLENAME 
ADD COLUMN NEW_COLUMN TEXT; -- Change data type as needed

-- Add a default value if needed
-- ALTER TABLE TABLENAME 
-- ALTER COLUMN NEW_COLUMN SET DEFAULT 'default_value';

-- Add NOT NULL constraint if needed (after setting default)
-- ALTER TABLE TABLENAME 
-- ALTER COLUMN NEW_COLUMN SET NOT NULL;

-- Add a check constraint if needed
-- ALTER TABLE TABLENAME 
-- ADD CONSTRAINT check_NEW_COLUMN CHECK (NEW_COLUMN IN ('value1', 'value2'));

-- Add an index if needed
-- CREATE INDEX idx_TABLENAME_NEW_COLUMN ON TABLENAME(NEW_COLUMN);

-- Update RLS policies if the new column affects access control
-- (This depends on your specific security requirements)
