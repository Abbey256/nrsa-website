import { supabase } from './lib/supabase.js';

export async function testDatabaseConnection() {
  if (!supabase) {
    console.error('❌ Supabase not configured');
    return false;
  }

  const tests = [
    { table: 'leaders', name: 'Leaders' },
    { table: 'news', name: 'News' },
    { table: 'events', name: 'Events' },
    { table: 'players', name: 'Players' },
    { table: 'clubs', name: 'Clubs' }
  ];

  console.log('🔍 Testing database connection...');
  
  for (const test of tests) {
    try {
      const { data, error } = await supabase.from(test.table).select('count').limit(1);
      if (error) throw error;
      console.log(`✅ ${test.name} table: OK`);
    } catch (error: any) {
      console.log(`❌ ${test.name} table: ${error.message}`);
      return false;
    }
  }
  
  console.log('✅ All database tests passed');
  return true;
}

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDatabaseConnection();
}