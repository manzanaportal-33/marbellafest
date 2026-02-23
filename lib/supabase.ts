import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // En desarrollo mostraremos un error claro en consola
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.error(
      "Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY",
    );
  }
}

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Supabase no está configurado. Define SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
      },
    });
  }

  return supabaseClient;
}

