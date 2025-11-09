// Quick test script to verify Supabase connection
// Run with: node test-supabase-connection.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    // Test 1: Check if we can connect
    console.log('1. Testing connection...');
    const { data, error } = await supabase.from('voters').select('count').limit(0);
    
    if (error && error.message.includes('relation "public.voters" does not exist')) {
      console.log('❌ Tables not created yet. Please run the complete SQL script in Supabase SQL Editor.');
      return;
    }
    
    if (error) {
      console.log('❌ Connection error:', error.message);
      return;
    }
    
    console.log('✅ Connection successful!\n');

    // Test 2: Check all tables
    console.log('2. Checking tables...');
    const tables = ['voters', 'elections', 'candidates', 'votes', 'vote_verification', 'admin_users'];
    
    for (const table of tables) {
      const { error: tableError } = await supabase.from(table).select('*').limit(1);
      if (tableError) {
        console.log(`❌ Table "${table}" not found`);
      } else {
        console.log(`✅ Table "${table}" exists`);
      }
    }

    console.log('\n✅ Supabase connection verified!');
    console.log('🚀 You can now run: npm run dev');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection();

