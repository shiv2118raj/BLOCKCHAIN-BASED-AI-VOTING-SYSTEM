# Supabase Setup Guide

This guide will help you connect your Blockchain Voting System to Supabase.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com if you don't have one)
2. A Supabase project created

## Step 1: Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Blockchain Voting System (or your preferred name)
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Choose the closest region to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (takes 1-2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon in the left sidebar)
2. Click on **API** in the settings menu
3. You'll find two important values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
```

3. Replace `your_project_url_here` with your Project URL from Step 2
4. Replace `your_anon_key_here` with your anon/public key from Step 2

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
```

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (in the left sidebar)
2. Click "New query"
3. Copy and paste the contents of `scripts/001_create_voting_tables.sql`
4. Click "Run" to execute the SQL script
5. This will create all the necessary tables:
   - `voters` - Stores voter information
   - `elections` - Stores election details
   - `candidates` - Stores candidate information
   - `votes` - Stores voting records with blockchain hashes
   - `vote_verification` - Stores verification data
   - `admin_users` - Stores admin user information
6. (Optional) Run `scripts/002_seed_sample_data.sql` to add sample elections and candidates
7. (Optional) Run `scripts/003_seed_sample_voters.sql` to add sample voters

## Step 5: Configure Row Level Security (RLS)

The SQL script already sets up RLS policies, but you may need to verify them:

1. Go to **Authentication** > **Policies** in your Supabase dashboard
2. Verify that RLS is enabled for all tables
3. The policies should allow:
   - Voters to view/update their own data
   - Public read access to active elections and candidates
   - Voters to insert and view their own votes

## Step 6: Configure Authentication

1. Go to **Authentication** > **Providers** in your Supabase dashboard
2. Enable **Email** provider (it should be enabled by default)
3. Configure email templates if needed (go to **Authentication** > **Email Templates**)

## Step 7: Install Dependencies

Make sure all dependencies are installed:

```bash
npm install
# or
pnpm install
```

## Step 8: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. Navigate to `http://localhost:3000`
3. Try registering a new voter or logging in
4. Check the browser console and terminal for any errors

### Quick Verification

You can verify your Supabase connection by:

1. **Check Environment Variables**: Make sure `.env.local` exists and has the correct values
2. **Test Database Connection**: Go to your Supabase dashboard and verify tables are created
3. **Test Authentication**: Try accessing the login page - it should not throw environment variable errors
4. **Check Browser Console**: Open browser dev tools and look for any Supabase-related errors

## Troubleshooting

### Error: "Invalid API key" or "Failed to fetch"
- Verify that your environment variables are correctly set in `.env.local`
- Make sure you're using the **anon/public key**, not the service role key
- Restart your development server after changing environment variables

### Error: "relation does not exist"
- Make sure you've run the SQL scripts from the `scripts/` folder
- Verify that the tables were created in the Supabase dashboard (go to **Table Editor**)

### Error: "Row Level Security policy violation"
- Check that RLS policies are correctly set up
- Verify that users are authenticated before accessing protected resources
- Review the RLS policies in the SQL script

### Authentication issues
- Verify that email provider is enabled in Supabase
- Check email templates configuration
- For development, you may need to configure email redirect URLs

## Additional Configuration

### Email Configuration (Optional)

For production, configure SMTP settings:
1. Go to **Settings** > **Auth** > **SMTP Settings**
2. Configure your SMTP server details
3. Update email templates as needed

### Storage (Optional)

If you need to store face recognition data or images:
1. Go to **Storage** in the Supabase dashboard
2. Create a new bucket (e.g., "face-data")
3. Configure bucket policies
4. Update your code to use Supabase Storage API

## Security Notes

- Never commit `.env.local` to version control (it's already in `.gitignore`)
- Use the **anon key** in client-side code (it's safe to expose)
- Use the **service role key** only in server-side code (never expose it)
- Enable RLS on all tables to prevent unauthorized access
- Regularly review and update RLS policies

## Next Steps

After completing the setup:
1. Test user registration and authentication
2. Test voting functionality
3. Verify blockchain integration
4. Test face recognition features
5. Set up production environment variables

## Support

If you encounter any issues:
1. Check the Supabase documentation: https://supabase.com/docs
2. Check the Next.js documentation: https://nextjs.org/docs
3. Review the application logs and browser console for error messages

