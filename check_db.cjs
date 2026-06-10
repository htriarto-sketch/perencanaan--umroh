const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://tvyhhtqyvxjacywugilj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2eWhodHF5dnhqYWN5d3VnaWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTIzMDksImV4cCI6MjA5NTgyODMwOX0.J5Q459OMzaPZLJioyOq_7YyUKiUHUSM_193M37y4HyQ";
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking guide_stages table...");
  const { data, error } = await supabase.from("guide_stages").select("*");
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Data found:", data.length, "rows");
    console.log(JSON.stringify(data, null, 2));
  }
}

check();
