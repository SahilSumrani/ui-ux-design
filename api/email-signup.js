const postgres = require("postgres");

let sql;

function getDatabase() {
  const connectionString = process.env.STORAGE_URL;
  if (!connectionString) throw new Error("STORAGE_URL is not configured");
  if (!sql) {
    sql = postgres(connectionString, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: "require",
    });
  }
  return sql;
}

module.exports = async function handler(req, res) {
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
    const db = getDatabase();
    await db`CREATE TABLE IF NOT EXISTS public.email_signups (
      email text PRIMARY KEY CHECK (char_length(email) <= 254),
      created_at timestamptz NOT NULL DEFAULT now(),
      last_seen_at timestamptz NOT NULL DEFAULT now()
    )`;
    await db`ALTER TABLE public.email_signups ENABLE ROW LEVEL SECURITY`;
    await db`REVOKE ALL ON TABLE public.email_signups FROM anon, authenticated`;
    await db`INSERT INTO public.email_signups (email)
      VALUES (${email})
      ON CONFLICT (email) DO UPDATE SET last_seen_at = now()`;
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Email signup database write failed:", error?.message ?? "Unknown error");
    return res.status(503).json({ error: "Could not save your email. Please try again shortly." });
  }
};
