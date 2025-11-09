# Verify Database Setup

## Check if All Tables Were Created

After running the SQL script, verify that all 6 tables were created:

### Step 1: Check Tables in Supabase Dashboard

1. Go to your Supabase dashboard
2. Click on **Table Editor** in the left sidebar
3. You should see these 6 tables:
   - ✅ `voters`
   - ✅ `elections`
   - ✅ `candidates`
   - ✅ `votes`
   - ✅ `vote_verification`
   - ✅ `admin_users`

### Step 2: If Only Part of the Script Ran

If you only see the `voters` table, you need to run the **complete SQL script**:

1. Go back to **SQL Editor**
2. Click **New query** (the + button)
3. Copy and paste the **ENTIRE** SQL script (all 141 lines)
4. Click **Run**

### Step 3: Quick Verification Query

Run this query in SQL Editor to check all tables:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

You should see 6 tables listed.

## Next Steps After Verification

Once all tables are created:

1. ✅ **Test the Application**
   ```bash
   npm run dev
   ```

2. ✅ **Open your app**: http://localhost:3000

3. ✅ **Test the connection**:
   - Try accessing the login page
   - Check browser console for errors
   - Verify no Supabase connection errors

## If Tables Are Missing

If some tables are missing, run the complete SQL script again. The `IF NOT EXISTS` clause ensures it's safe to run multiple times.

