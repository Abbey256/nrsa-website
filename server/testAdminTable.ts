import { supabase } from "./lib/supabase.js";

async function testAdminTable() {
  if (!supabase) {
    console.error("❌ Supabase not configured");
    process.exit(1);
  }

  console.log("📊 Testing admins table...\n");

  // Test 1: Check if table exists and get all records
  console.log("Test 1: Fetching all admin records...");
  const { data: allAdmins, error: fetchError } = await supabase
    .from('admins')
    .select('*');
  
  if (fetchError) {
    console.error("❌ Error fetching admins:", fetchError.message);
  } else {
    console.log(`✅ Found ${allAdmins?.length || 0} admin records`);
    console.log("Records:", JSON.stringify(allAdmins, null, 2));
  }

  // Test 2: Query by email
  console.log("\nTest 2: Querying by email (admin@nrsa.com.ng)...");
  const { data: adminByEmail, error: emailError } = await supabase
    .from('admins')
    .select('id, name, email, role, protected')
    .eq('email', 'admin@nrsa.com.ng')
    .single();
  
  if (emailError) {
    console.error("❌ Error querying by email:", emailError.message);
  } else {
    console.log("✅ Found admin:", JSON.stringify(adminByEmail, null, 2));
  }

  // Test 3: Check table structure
  console.log("\nTest 3: Checking table columns...");
  const { data: sample } = await supabase
    .from('admins')
    .select('*')
    .limit(1);
  
  if (sample && sample.length > 0) {
    console.log("Columns:", Object.keys(sample[0]).join(', '));
  }

  process.exit(0);
}

testAdminTable().catch(error => {
  console.error("❌ Test failed:", error.message);
  process.exit(1);
});
