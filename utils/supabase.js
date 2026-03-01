import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ewoighszyagimvnawthr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3b2lnaHN6eWFnaW12bmF3dGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjY5MzAsImV4cCI6MjA4NjIwMjkzMH0.Pn788wGZfBZSHxik7ek7jdvonT8fyI-ZOp2NUIzfElw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
