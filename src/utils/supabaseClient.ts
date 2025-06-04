import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjahahpuwyckctzsnoro.supabase.co'; // reemplaza con tu URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqYWhhaHB1d3lja2N0enNub3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODM2NDEsImV4cCI6MjA2NDU1OTY0MX0.rkfdScc-i155MqkYNkbpIne6ZyncD3YXpXfqbJWFsc4'; // reemplaza con tu anon key

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});
