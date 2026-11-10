# ui-ux-design

Motif is a responsive React gallery of tactile interactions. Visitors can try each component without signing in.

## Run locally

```sh
npm install
npm run dev
```

Component previews are public. Clicking Code or Copy code opens a one-field email prompt; submit stores the email in the UI-UX project's Supabase Postgres database and then unlocks the code, without sending an email or asking for a password.

## Email-only sign-in

The email is stored in `public.email_signups` and in that browser's local storage so the code stays unlocked on that device. This is a lightweight email prompt, not verified authentication: a visitor can enter any address. It should not be used to protect confidential source code.

The Vercel project must have its Supabase Marketplace environment variables configured for Production and Preview. The `/api/email-signup` function uses `SUPABASE_URL` with the server-only `SUPABASE_SECRET_KEY` (or a Postgres connection URL) and writes the normalized email server-side. Run `supabase/email_signups.sql` once in the Supabase SQL Editor first.

## Deploy to Vercel

Import `SahilSumrani/ui-ux-design` into Vercel and deploy with the Vite preset. `vercel.json` configures security headers.

After deployment, verify the response headers on the live URL.

## Security notes

- `npm audit --omit=dev` currently reports no production dependency vulnerabilities.
- Keep Supabase secret keys and Postgres connection URLs server-side and marked sensitive; never prefix them with `VITE_` or expose them in client code.
- The public signup endpoint accepts unverified emails. It only allows inserts through the server function; it does not expose email reads through Supabase's Data API.
- The Vercel headers deny framing, disable MIME sniffing and unnecessary browser permissions, force HTTPS, and restrict content sources.
