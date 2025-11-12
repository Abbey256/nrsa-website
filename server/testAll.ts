import { supabase } from './lib/supabase.js';

async function testAll() {
  console.log('🔍 Running comprehensive tests...\n');
  
  // Test 1: Supabase connection
  console.log('1. Testing Supabase connection...');
  if (!supabase) {
    console.log('❌ Supabase not configured');
    return;
  }
  console.log('✅ Supabase client initialized');
  
  // Test 2: Database tables
  console.log('\n2. Testing database tables...');
  const tables = ['leaders', 'news', 'events', 'players', 'clubs', 'media', 'contacts'];
  let tablesOk = 0;
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) throw error;
      console.log(`✅ ${table}: ${data?.length || 0} records`);
      tablesOk++;
    } catch (error: any) {
      console.log(`❌ ${table}: ${error.message}`);
    }
  }
  
  // Test 3: API endpoints
  console.log('\n3. Testing API endpoints...');
  const endpoints = [
    '/api/test',
    '/api/health',
    '/api/leaders',
    '/api/news',
    '/api/events'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`);
      const status = response.ok ? '✅' : '❌';
      console.log(`${status} ${endpoint}: ${response.status}`);
    } catch (error: any) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }
  
  console.log(`\n📊 Summary: ${tablesOk}/${tables.length} tables working`);
}

testAll().catch(console.error);