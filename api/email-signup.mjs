import postgres from "postgres";

let sql;

function readSecretKey() {
  const direct = process.env.SUPABASE_SECRET_KEY
    || process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.STORAGE_SECRET_KEY
    || process.env.STORAGE_SERVICE_ROLE_KEY;
  if (direct) return direct;

  for (const name of ["SUPABASE_SECRET_KEYS", "STORAGE_SECRET_KEYS"]) {
    try {
      const keys = JSON.parse(process.env[name] || "{}");
      if (keys.default) return keys.default;
    } catch {
      // Ignore unset or malformed optional key bundles.
    }
  }
  return null;
}

async function saveWithSupabaseApi(email) {
  const url = process.env.SUPABASE_URL || process.env.STORAGE_SUPABASE_URL || process.env.STORAGE_URL;
  const key = readSecretKey();
  if (!url || !key || !url.startsWith("https://")) return null;

  const headers = {
    apikey: key,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal",
  };
  // New sb_secret keys are accepted on apikey only; legacy service_role keys also need Bearer auth.
  if (!key.startsWith("sb_secret_")) headers.Authorization = `Bearer ${key}`;

  const response = await fetch(`${url.replace(/\/+$/, "")}/rest/v1/email_signups?on_conflict=email`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email, last_seen_at: new Date().toISOString() }),
  });

  if (response.ok) return;
  const message = await response.text();
  console.error("Supabase signup write failed:", response.status, message.slice(0, 500));
  if (response.status === 401 || response.status === 403) {
    throw new Error("Database key or table permission is invalid.");
  }
  if (response.status === 404 || /relation .* does not exist|table .* not found/i.test(message)) {
    throw new Error("The email_signups table was not found in this Supabase project.");
  }
  throw new Error("Supabase rejected the email save request.");
}

async function saveWithPostgres(email, connectionString) {
  if (!sql) {
    sql = postgres(connectionString, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
      ssl: "require",
    });
  }
  await sql`INSERT INTO public.email_signups (email)
    VALUES (${email})
    ON CONFLICT (email) DO UPDATE SET last_seen_at = now()`;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawEmail = req.body?.email;
  if (typeof rawEmail !== "string" || rawEmail.length > 254) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }

  const email = rawEmail.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }

  try {
    const saved = await saveWithSupabaseApi(email);
    if (saved !== null) return res.status(200).json({ ok: true });

    const connectionString = process.env.POSTGRES_URL_NON_POOLING
      || process.env.POSTGRES_URL
      || (process.env.STORAGE_URL?.startsWith("postgres") ? process.env.STORAGE_URL : null);
    if (!connectionString) {
      console.error("Signup database configuration is missing Supabase URL/key or Postgres URL.");
      return res.status(503).json({ error: "Supabase connection is not configured for this Vercel project." });
    }
    await saveWithPostgres(email, connectionString);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Email signup database write failed:", error?.message ?? "Unknown error");
    const message = error?.message?.startsWith("Database ") || error?.message?.startsWith("The email_")
      ? error.message
      : "Could not connect to the Supabase database. Check the Vercel Supabase integration.";
    return res.status(503).json({ error: message });
  }
}
