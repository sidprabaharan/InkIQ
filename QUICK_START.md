# 🚀 Quick Start: Database Version Control

## TL;DR - The Simple Workflow

### 1. Start a New Feature
```powershell
# This creates a Git branch and guides you through creating a Supabase branch
npm run workflow:start feature-name
```

### 2. Make Database Changes
- Go to your Supabase development branch dashboard
- Add tables, columns, whatever you need
- Test your changes

### 3. Create Migration File
```powershell
# This creates a migration file for your changes
npm run workflow:migrate my_feature_changes
```

### 4. Update Frontend Types
```powershell
# This generates TypeScript types from your new database schema
npm run workflow:sync
```

### 5. Update Your Code
- Update your React components
- Add new queries/mutations
- Test everything locally

### 6. Deploy
- Merge your Supabase branch (database changes go live)
- Merge your Git branch (code changes go live)
- Deploy your frontend

## Daily Commands You'll Use

```powershell
# Check what's happening
npm run workflow:status

# Start new feature
npm run workflow:start customer-loyalty

# Create migration
npm run workflow:migrate add_loyalty_points

# Update types after DB changes
npm run workflow:sync

# Check migration status
npm run db:status
```

## Your Development Loop

1. **Idea** → "I need to add customer loyalty points"
2. **Start** → `npm run workflow:start loyalty-system`
3. **Design** → Create Supabase development branch
4. **Build** → Add tables/columns in Supabase dashboard  
5. **Capture** → `npm run workflow:migrate add_loyalty_tables`
6. **Sync** → `npm run workflow:sync`
7. **Code** → Update React components
8. **Test** → Everything works?
9. **Ship** → Merge database branch, then Git branch
10. **Celebrate** → 🎉

## When Things Go Wrong

### "My types are out of sync"
```powershell
npm run workflow:sync
```

### "I messed up my migration"
- Delete the migration file
- Fix your database changes
- Create a new migration

### "My development branch is broken"
- Delete the Supabase development branch
- Create a new one (it will get the latest production schema)
- Redo your changes

### "I have merge conflicts"
- This means someone else changed the database too
- Coordinate with your team
- Usually: merge their changes first, then yours

## Pro Tips

✅ **Do this:**
- Always test on development branches first
- Make small, focused changes
- Use descriptive migration names
- Update types after schema changes
- Keep your development branches clean

❌ **Don't do this:**
- Never change production database directly
- Don't create massive migrations
- Don't forget to merge Supabase branch first
- Don't leave development branches running forever

## File Structure After Setup

```
your-project/
├── supabase/
│   ├── config.toml           # Supabase configuration
│   ├── migrations/           # Your migration files
│   └── seed.sql             # Sample data (optional)
├── scripts/
│   ├── dev-workflow.ps1     # Workflow automation
│   └── templates/           # Migration templates
├── src/
│   └── types/
│       └── database.ts      # Auto-generated types
└── DEVELOPMENT_WORKFLOW.md  # Detailed docs
```

## Need Help?

1. **Read the full guide**: `DEVELOPMENT_WORKFLOW.md`
2. **Check workflow status**: `npm run workflow:status`
3. **See all commands**: `npm run workflow:help`

Remember: Your database has 66 existing migrations. That's your baseline. Everything new from here gets tracked properly! 🎯
