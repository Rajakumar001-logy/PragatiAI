import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

const DEFAULT_SUPABASE_URL = 'https://cmvejmisvbbqxzopijnv.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_SJQCrMd6uGgwROJcIU9srQ_T2w7nVgy';

export class SupabaseConfigurationError extends Error {
  constructor() {
    super('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
    this.name = 'SupabaseConfigurationError';
  }
}

export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  const url = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_KEY;

  if (!url || !publishableKey) {
    throw new SupabaseConfigurationError();
  }

  client = createClient(url, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return client;
}

export const supabase = getSupabaseClient();
