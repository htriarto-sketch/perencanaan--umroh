const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://tvyhhtqyvxjacywugilj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2eWhodHF5dnhqYWN5d3VnaWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTIzMDksImV4cCI6MjA5NTgyODMwOX0.J5Q459OMzaPZLJioyOq_7YyUKiUHUSM_193M37y4HyQ";
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking prayer_categories table...");
  const { data: catData, error: catError } = await supabase.from("prayer_categories").select("*");
  if (catError) console.error("Cat Error:", catError);
  else console.log("Categories found:", catData.length);

  console.log("Checking prayers table...");
  const { data: prayerData, error: prayerError } = await supabase.from("prayers").select("*");
  if (prayerError) console.error("Prayer Error:", prayerError);
  else console.log("Prayers found:", prayerData.length);
}

check();
