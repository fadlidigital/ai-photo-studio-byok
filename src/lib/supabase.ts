/**
 * Supabase Configuration
 *
 * Setup Instructions:
 * 1. Create a Supabase project at https://supabase.com/dashboard
 * 2. Go to Project Settings > API
 * 3. Copy your Project URL and anon/public key
 * 4. Create .env file from .env.example and fill in your Supabase config
 * 5. Enable Email Auth in Authentication > Providers > Email
 * 6. Configure Email Templates (optional) in Authentication > Email Templates
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
