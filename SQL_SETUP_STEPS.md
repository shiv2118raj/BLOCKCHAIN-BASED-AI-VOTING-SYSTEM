# Quick SQL Setup Steps

## After Clicking "New Query" in Supabase:

### Step 1: Copy the SQL Script
1. Open the file `scripts/001_create_voting_tables.sql` in your project
2. Select **ALL** the text (Ctrl+A or Cmd+A)
3. Copy it (Ctrl+C or Cmd+C)

### Step 2: Paste into SQL Editor
1. Click inside the empty query box in Supabase SQL Editor
2. Paste the SQL script (Ctrl+V or Cmd+V)

### Step 3: Run the Script
1. Click the **"Run"** button (usually at the bottom right)
   - OR press **Ctrl+Enter** (Windows/Linux)
   - OR press **Cmd+Enter** (Mac)

### Step 4: Verify Success
You should see a success message like:
- ✅ "Success. No rows returned"
- ✅ Or a list of "CREATE TABLE" success messages

### What This Script Creates:
- ✅ 6 database tables (voters, elections, candidates, votes, vote_verification, admin_users)
- ✅ Row Level Security (RLS) policies for data protection
- ✅ Database indexes for better performance
- ✅ Foreign key relationships between tables

### If You See Errors:
- **"relation already exists"** → Tables already created (this is okay, you can ignore)
- **"permission denied"** → Check your Supabase project permissions
- **Syntax errors** → Make sure you copied the entire script correctly

### After Running:
✅ Your database is ready! You can now:
- Start your app: `npm run dev`
- Register voters
- Create elections
- Cast votes

---

**That's it!** The script takes about 5-10 seconds to run.

