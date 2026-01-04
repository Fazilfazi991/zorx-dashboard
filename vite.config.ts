
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  const SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://dbpgogpnaopurmjlkuiw.supabase.co';
  const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGdvZ3BuYW9wdXJtamxrdWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NDUzNjgsImV4cCI6MjA4MzEyMTM2OH0.dpK-bLEgV-H6uJ2DlapDQiePBGyI9N3UZYF_UccJ48k';

  return {
    plugins: [react()],
    define: {
      // Injects the API_KEY for geminiService.ts
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Injects Supabase keys for supabase.ts
      'process.env.VITE_SUPABASE_URL': JSON.stringify(SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(SUPABASE_KEY),
    }
  };
});
