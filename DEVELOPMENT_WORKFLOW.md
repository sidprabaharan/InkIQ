# Database Version Control & Development Workflow

## Your Current Situation
- **Frontend**: React/TypeScript project with Supabase integration ✅
- **Database**: Production Supabase with 66 existing migrations ✅
- **MCP**: Connected to Supabase for direct database management ✅
- **Goal**: Sync code changes with database schema changes

## The Complete Workflow

### 1. **Current State Management** (BASELINE)
Your database currently has 66 migrations. This represents your "production baseline." From this point forward, all new changes will be tracked.

### 2. **Feature Development Workflow**

#### For New Features:
```powershell
# Step 1: Create a feature branch in Git
git checkout -b feature/new-customer-fields

# Step 2: Create a Supabase development branch (using MCP)
# This creates an isolated database environment
# - All 66 existing migrations will be applied
# - You get a fresh database with current schema
# - Completely isolated from production

# Step 3: Make your database changes in the development branch
# - Add tables, columns, functions, etc.
# - Test your changes safely

# Step 4: When ready, create a migration file
npx supabase migration new add_customer_fields

# Step 5: Write the SQL for your changes in the migration file
# Example: supabase/migrations/20250814000000_add_customer_fields.sql

# Step 6: Test locally (if you have Docker) or on the dev branch

# Step 7: Merge the Supabase branch to production
# This applies your migration to the production database

# Step 8: Merge your Git branch
git checkout main
git merge feature/new-customer-fields
```

### 3. **Database-First vs Code-First Development**

#### Option A: Database-First (Recommended)
1. Create Supabase development branch
2. Make schema changes in Supabase dashboard
3. Generate migration files from changes
4. Update your TypeScript types
5. Update frontend code
6. Merge database branch → production
7. Deploy frontend code

#### Option B: Code-First
1. Write migration SQL files directly
2. Apply to development branch
3. Test and verify
4. Update frontend code
5. Merge to production

### 4. **Your Synchronization Points**

When you want to "push your project and have the database pushed as well":

1. **Git Commit**: Your code changes
2. **Supabase Branch Merge**: Your database schema changes
3. **Deployment**: Your frontend deployment

These three should happen together as one "release."

## Branching Strategy

### Development Branches (Supabase)
- **Purpose**: Test database schema changes safely
- **Data**: Empty (no production data for security)
- **Lifetime**: Create for features, delete when merged
- **Cost**: Minimal (preview branches are cheap)

### Git Branches
- **Purpose**: Track code changes
- **Syncs with**: Supabase branches (same names recommended)
- **Workflow**: Standard Git flow

## Migration File Management

### Creating Migrations
```sql
-- Example: supabase/migrations/20250814120000_add_customer_loyalty_program.sql

-- Add loyalty points column
ALTER TABLE customers 
ADD COLUMN loyalty_points INTEGER DEFAULT 0;

-- Add loyalty tier enum
CREATE TYPE loyalty_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');

-- Add loyalty tier column
ALTER TABLE customers 
ADD COLUMN loyalty_tier loyalty_tier DEFAULT 'bronze';

-- Create loyalty transactions table
CREATE TABLE loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    points_change INTEGER NOT NULL,
    transaction_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view their own loyalty transactions" ON loyalty_transactions
    FOR SELECT USING (auth.uid() IN (
        SELECT user_id FROM customers WHERE id = customer_id
    ));
```

### Migration Naming Convention
- Format: `YYYYMMDDHHMMSS_descriptive_name.sql`
- Examples:
  - `20250814120000_add_customer_loyalty_program.sql`
  - `20250815100000_create_inventory_tracking.sql`
  - `20250816140000_add_email_templates.sql`

## Type Safety & Code Sync

### Auto-generating TypeScript Types
```powershell
# Generate types from your current database
npx supabase gen types typescript --linked > src/types/database.ts
```

### Updating Your Frontend
After database changes, update:
1. **Types**: Regenerate database types
2. **Components**: Update forms, tables, queries
3. **API calls**: Update Supabase queries
4. **Validation**: Update Zod schemas

## Environment Management

### Development Environment Variables
```bash
# .env.local
VITE_SUPABASE_URL=https://your-dev-branch-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_dev_branch_anon_key
```

### Production Environment Variables
```bash
# .env.production
VITE_SUPABASE_URL=https://eqdlaagjaikxdrkgvopn.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

## Deployment Checklist

### Before Each Release:
- [ ] All migrations tested on development branch
- [ ] Frontend code updated for schema changes
- [ ] TypeScript types regenerated
- [ ] Tests passing (if you have them)
- [ ] Development branch ready to merge

### Release Process:
1. **Merge Supabase branch** → Production database updated
2. **Merge Git branch** → Code updated
3. **Deploy frontend** → New version live
4. **Verify** → Everything working together

### After Release:
- [ ] Delete used development branches
- [ ] Update local development environment
- [ ] Document any breaking changes

## Common Scenarios

### Adding a New Table
1. Create Supabase dev branch
2. Add table in dashboard or write migration
3. Enable RLS and add policies
4. Generate new TypeScript types
5. Create frontend components
6. Test everything
7. Merge database changes
8. Deploy frontend

### Modifying Existing Table
1. Create Supabase dev branch
2. Write migration for schema change
3. Update TypeScript types
4. Update affected frontend components
5. Test data migration if needed
6. Merge database changes
7. Deploy frontend

### Emergency Hotfix
1. Create hotfix branch (Git)
2. Create quick Supabase branch if DB changes needed
3. Make minimal changes
4. Fast-track testing
5. Deploy immediately
6. Document for later cleanup

## Tools You'll Use

### Daily Development:
- **MCP Supabase tools** (for branch management)
- **npx supabase** (for migrations)
- **Git** (for code versioning)
- **VS Code** (with Supabase extension recommended)

### Periodic Tasks:
- **Type generation** (after schema changes)
- **Branch cleanup** (delete old dev branches)
- **Migration review** (ensure quality)

## Best Practices

### Do's:
✅ Create descriptive migration names
✅ Test on development branches first
✅ Keep migrations small and focused
✅ Always enable RLS on new tables
✅ Generate types after schema changes
✅ Use consistent naming conventions
✅ Document breaking changes

### Don'ts:
❌ Make direct changes to production database
❌ Skip testing migrations
❌ Create massive, complex migrations
❌ Forget to update frontend types
❌ Leave development branches running indefinitely
❌ Mix unrelated changes in one migration

## Troubleshooting

### Migration Conflicts
If multiple developers create migrations simultaneously:
1. Rename migration files to fix timestamp order
2. Test the combined changes
3. Resolve any SQL conflicts manually

### Schema Drift
If production and development get out of sync:
1. Delete development branch
2. Create fresh branch (gets latest production state)
3. Reapply your changes

### Frontend/Backend Mismatch
If your frontend breaks after database changes:
1. Check TypeScript types are updated
2. Verify API calls match new schema
3. Update component props/interfaces
4. Check for breaking changes in data structure

This workflow ensures your code and database stay in perfect sync while giving you safe places to experiment and test changes!
