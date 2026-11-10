# ui-ux-design

Motif is a responsive React gallery of tactile interactions. Visitors can try each component, inspect its source, and copy it.

## Run locally

```sh
npm install
npm run dev
```

The gallery stays open locally while Supabase credentials are not configured, so the component previews are easy to develop. Production fails closed until email authentication is configured.

## Email-only sign-in

Sign-in uses a Supabase one-time email link. The form asks only for an email address; there are no passwords, names, or profile fields. Email addresses and authentication sessions are handled by Supabase Auth. No service-role key or email list is stored in this app.

1. Create or select a Supabase project and enable Email sign-in.
2. In Supabase **Authentication → URL Configuration**, set the Site URL to the deployed Vercel URL. Add `http://localhost:5177/**` for local testing and the exact production URL as an allowed redirect. Add Vercel preview URLs only if you need preview deployments to accept sign-in links.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Vercel's Production environment. The publishable key is intended for a public client. Never put a Supabase secret/service-role key in a `VITE_` variable.
4. Set the same variables in an untracked `.env.local` file for local authentication.

Copy `.env.example` as a starting point. With the Supabase variables absent, local development intentionally skips the sign-in gate; a production deployment shows a setup error and does not expose the gallery until the variables are set.

Supabase's default Magic Link email template must include `{{ .ConfirmationURL }}`. `signInWithOtp` sends that one-time link and automatically creates a user on first sign-in.

## Deploy to Vercel

Import `SahilSumrani/ui-ux-design` into Vercel, choose the Vite preset, add the two environment variables, and deploy. `vercel.json` configures security headers, including a Content Security Policy limited to this site, Google Fonts, and Supabase Auth.

After Vercel provides the production URL, add that exact URL to Supabase's Auth Site URL and redirect allow list, then test sign-in and verify the response headers on the deployed URL. The repository can be reviewed before that production check; production authentication cannot be verified until the Supabase project and Vercel URL are configured.

## Security notes

- `npm audit --omit=dev` currently reports no production dependency vulnerabilities.
- The gallery has no application database or user profile store; auth is handled by Supabase.
- Keep Supabase secret/service-role keys out of GitHub and browser environment variables.
- The Vercel headers deny framing, disable MIME sniffing and unnecessary browser permissions, force HTTPS, and restrict content sources.
