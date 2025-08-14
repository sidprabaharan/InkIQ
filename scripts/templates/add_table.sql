-- Template: Add a new table with common patterns
-- Replace TABLENAME with your actual table name
-- Replace fields with your actual columns

CREATE TABLE TABLENAME (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Add your columns here
    name TEXT NOT NULL,
    description TEXT,
    
    -- Common audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    -- Organization/tenant isolation (if needed)
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE TABLENAME ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view TABLENAME from their organization" ON TABLENAME
    FOR SELECT USING (
        org_id IN (
            SELECT org_id FROM user_organizations 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert TABLENAME in their organization" ON TABLENAME
    FOR INSERT WITH CHECK (
        org_id IN (
            SELECT org_id FROM user_organizations 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update TABLENAME in their organization" ON TABLENAME
    FOR UPDATE USING (
        org_id IN (
            SELECT org_id FROM user_organizations 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete TABLENAME in their organization" ON TABLENAME
    FOR DELETE USING (
        org_id IN (
            SELECT org_id FROM user_organizations 
            WHERE user_id = auth.uid()
        )
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_TABLENAME_updated_at 
    BEFORE UPDATE ON TABLENAME 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
