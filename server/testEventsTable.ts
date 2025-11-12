import { supabase } from "./lib/supabase.js";

async function testEvents() {
  if (!supabase) {
    console.error("❌ Supabase not configured");
    process.exit(1);
  }

  console.log("Testing events table schema...\n");

  // Try to insert a test record to see what columns are expected
  console.log("Attempting to insert test event...");
  
  const testEvent = {
    title: "Test Event",
    description: "Test description",
    venue: "Test Venue",
    city: "Lagos",
    state: "Lagos",
    event_date: new Date().toISOString(),
    is_featured: false
  };

  const { data, error } = await supabase
    .from('events')
    .insert(testEvent)
    .select()
    .single();

  if (error) {
    console.error("❌ Insert error:", error);
    console.log("\nTrying with 'date' column instead...");
    
    const testEvent2 = {
      title: "Test Event",
      description: "Test description",
      venue: "Test Venue",
      city: "Lagos",
      state: "Lagos",
      date: new Date().toISOString(),
      is_featured: false
    };
    
    const { data: data2, error: error2 } = await supabase
      .from('events')
      .insert(testEvent2)
      .select()
      .single();
    
    if (error2) {
      console.error("❌ Still error:", error2);
    } else {
      console.log("✅ Success with 'date' column!");
      console.log("Columns:", Object.keys(data2).join(', '));
      
      // Clean up test data
      await supabase.from('events').delete().eq('id', data2.id);
    }
  } else {
    console.log("✅ Success with 'event_date' column!");
    console.log("Columns:", Object.keys(data).join(', '));
    
    // Clean up
    await supabase.from('events').delete().eq('id', data.id);
  }

  process.exit(0);
}

testEvents();
