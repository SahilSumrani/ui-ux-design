import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Fail closed in production if the project is not configured. The dev server
// remains usable as a component preview while Supabase credentials are absent.
export const supabase = url && publishableKey ? createClient(url, publishableKey) : null;
