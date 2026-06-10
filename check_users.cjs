const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const dotenv = require("dotenv");

// Load environment variables
const env = dotenv.parse(fs.readFileSync(".env.local"));
const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_ACCESS_TOKEN; // Assuming the token in .env.local works as a service role key

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing environment variables for Supabase admin.");
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function listUsers() {
  console.log("Fetching users from Supabase...");
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      console.error("Error fetching users:", error);
      return;
    }
    console.log("Users found:", data.users.length);
    data.users.forEach((user) => {
      console.log(`- Email: ${user.email}, ID: ${user.id}, Created at: ${user.created_at}`);
    });
  } catch (e) {
    console.error("Caught error:", e);
  }
}

listUsers();
