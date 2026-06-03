import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbgnmzxdtzortukkxdmm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZ25tenhkdHpvcnR1a2t4ZG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MDY5ODEsImV4cCI6MjA5NjA4Mjk4MX0.2fib1yro8wGtl3vr6HOOb2oCovJsjMGBQ_Pfva6CZJc'; // reemplazar con anon key

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

