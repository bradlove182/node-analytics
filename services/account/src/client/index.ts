import { env } from '@repo/environment';
import { createClient } from '@supabase/supabase-js';

export const client = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
