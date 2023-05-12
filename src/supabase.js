import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  "https://xzovknjkdfykvximpgxh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6b3ZrbmprZGZ5a3Z4aW1wZ3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMzMjI2NjQsImV4cCI6MTk5ODg5ODY2NH0.T8e5NRSrWYRvKs0qBrOBqAxm0mNS5yOu9Oei-sCtkMk"
);
