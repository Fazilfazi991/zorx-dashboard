
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dbpgogpnaopurmjlkuiw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGdvZ3BuYW9wdXJtamxrdWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NDUzNjgsImV4cCI6MjA4MzEyMTM2OH0.dpK-bLEgV-H6uJ2DlapDQiePBGyI9N3UZYF_UccJ48k";

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const isSupabaseConfigured = !!supabase;
