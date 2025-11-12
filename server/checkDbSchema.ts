import { supabase } from "./lib/supabase.js";

async function checkSchema() {
  if (!supabase) {
    console.error("❌ Supabase not configured");
    process.exit(1);
  }

  const tables = ['events', 'leaders', 'news', 'hero_slides', 'admins'];
  
  for (const table of tables) {
    console.log(`\n📊 Table: ${table}`);
    console.log("=".repeat(50));
    
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);
    
    if (error) {
      console.error(`❌ Error: ${error.message}`);
    } else if (data && data.length > 0) {
      console.log("Columns:", Object.keys(data[0]).join(', '));
      console.log("Sample data:", data[0]);
    } else {
      console.log("Table is empty - fetching structure differently");
      // Try to insert and rollback to see structure
      const { error: structError } = await supabase
        .from(table)
        .select('*')
        .limit(0);
      
      if (structError) {
        console.log("Cannot determine structure:", structError.message);
      }
    }
  }

  process.exit(0);
}

checkSchema().catch(error => {
  console.error("❌ Check failed:", error.message);
  process.exit(1);
});
