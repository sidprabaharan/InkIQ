-- Template: Create an enum type
-- Replace ENUM_NAME with your actual enum name
-- Replace the values with your actual enum values

-- Create the enum type
CREATE TYPE ENUM_NAME AS ENUM (
    'value1',
    'value2', 
    'value3'
);

-- Example: Add enum column to existing table
-- ALTER TABLE your_table 
-- ADD COLUMN status ENUM_NAME DEFAULT 'value1';

-- Example: Create table with enum column
-- CREATE TABLE example_table (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     status ENUM_NAME DEFAULT 'value1',
--     created_at TIMESTAMPTZ DEFAULT NOW()
-- );
