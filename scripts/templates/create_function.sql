-- Template: Create a PostgreSQL function
-- Replace FUNCTION_NAME with your actual function name
-- Modify parameters and return type as needed

CREATE OR REPLACE FUNCTION FUNCTION_NAME(
    -- Add your parameters here
    param1 TEXT,
    param2 INTEGER DEFAULT 0
)
RETURNS TABLE (
    -- Define return columns here
    id UUID,
    name TEXT,
    count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER -- Use SECURITY INVOKER if you want caller's permissions
AS $$
DECLARE
    -- Declare variables here if needed
    var_example TEXT;
BEGIN
    -- Your function logic here
    
    -- Example: Return a query result
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        COUNT(*)::INTEGER
    FROM some_table t
    WHERE t.name ILIKE '%' || param1 || '%'
    GROUP BY t.id, t.name
    HAVING COUNT(*) > param2;
    
    -- Alternative: Use simple RETURN for non-table functions
    -- RETURN 'some_value';
END;
$$;

-- Grant execute permissions if needed
-- GRANT EXECUTE ON FUNCTION FUNCTION_NAME TO authenticated;
-- GRANT EXECUTE ON FUNCTION FUNCTION_NAME TO anon;
