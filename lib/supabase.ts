import { createClient } from '@supabase/supabase-js';

// Access environment variables safely
const env = (import.meta as any).env || {};

// Usamos las credenciales proporcionadas como fallback por defecto
// Esto permite que funcione inmediatamente al subirlo a GitHub/Vercel sin configurar .env manualmente
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://wogfknvsnrmpgtirkuae.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_QalP5w_eQARJSxOJDj9BLg_gFUlB2vV';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.sessionStorage,
  },
});