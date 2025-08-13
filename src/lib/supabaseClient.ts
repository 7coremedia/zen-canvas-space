import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

type SupabaseLike = Pick<SupabaseClient, "from" | "storage">;

function createStub(): SupabaseLike {
  return {
    from: () => ({
      insert: async () => ({ data: null, error: null }),
    }) as any,
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } as any }),
      }) as any,
    } as any,
  } as SupabaseLike;
}

export const supabase: SupabaseLike =
  supabaseUrl && supabaseAnonKey
    ? (createClient(supabaseUrl, supabaseAnonKey) as SupabaseLike)
    : createStub();

