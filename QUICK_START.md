# Quick Start - Supabase Connection

## Essential Steps

1. **Create a Supabase Project**
   - Go to https://supabase.com/dashboard
   - Create a new project

2. **Get Your Credentials**
   - Go to Settings > API
   - Copy your Project URL and anon/public key

3. **Create `.env.local` File**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
   ```

4. **Set Up Database**
   - Go to SQL Editor in Supabase dashboard
   - Run `scripts/001_create_voting_tables.sql`

5. **Install Dependencies & Run**
   ```bash
   pnpm install
   pnpm dev
   ```

## Full Documentation

See `SUPABASE_SETUP.md` for detailed instructions and troubleshooting.

## What Was Fixed

- ✅ Fixed column name mismatch (`face_data` → `face_encoding`)
- ✅ Added environment variable validation
- ✅ Improved error messages
- ✅ Created comprehensive setup guide

