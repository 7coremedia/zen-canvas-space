import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  var __supabase__: SupabaseClient | undefined;
}

export const supabase: SupabaseClient = globalThis.__supabase__ ?? (globalThis.__supabase__ = createClient(supabaseUrl, supabaseAnonKey));