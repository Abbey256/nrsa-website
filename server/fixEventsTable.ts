import { supabase } from "./lib/supabase.js";

async function fixEventsTable() {
  if (!supabase) {
    console.error("❌ Supabase not configured");
    process.exit(1);
  }

  console.log("Checking events table structure...\n");

  // Try to describe the table by checking what insert fields it expects
  const testEvent = {
    title: "Schema Test",
    description: "Test",
    venue: "Test Venue",
    city: "Lagos",
    state: "Lagos",
    event_date: new Date().toISOString(),
    is_featured: false
  };

  console.log("Attempting insert with event_date column...");
  const { data, error } = await supabase
    .from('events')
    .insert(testEvent)
    .select()
    .single();

  if (error) {
    console.error("❌ Error with event_date:", error.message);
    console.error("Error code:", error.code);
    console.error("Error details:", error.details);
    
    console.log("\n💡 The events table needs to be recreated with the correct schema!");
    console.log("This must be done in the Supabase dashboard or via SQL migration.");
    console.log("\nRequired columns:");
    console.log("- id (serial primary key)");
    console.log("- title (text)");
    console.log("- description (text)");
    console.log("- venue (text)");
    console.log("- city (text)");
    console.log("- state (text)");
    console.log("- event_date (timestamp with time zone)");
    console.log("- registration_deadline (timestamp with time zone, nullable)");
    console.log("- registration_link (text, nullable)");
    console.log("- image_url (text, nullable)");
    console.log("- is_featured (boolean, default false)");
    console.log("- created_at (timestamp with time zone, default now())");
  } else {
    console.log("✅ Success! Event created:", data);
    // Clean up
    await supabase.from('events').delete().eq('id', data.id);
  }

  process.exit(0);
}

fixEventsTable();
