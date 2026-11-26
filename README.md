# ui-ux-design

Motif is a responsive React gallery of tactile interactions. Visitors can try each component without signing in.

## Run locally

```sh
npm install
npm run dev
```

Component previews and source code are free for everyone. Code and prompt copy actions work without signing in or sharing an email address.

## Deploy to Vercel

Import `SahilSumrani/ui-ux-design` into Vercel and deploy with the Vite preset. `vercel.json` configures security headers.

After deployment, verify the response headers on the live URL.

## Security notes

- `npm audit --omit=dev` currently reports no production dependency vulnerabilities.
- Keep Supabase secret keys and Postgres connection URLs server-side and marked sensitive; never prefix them with `VITE_` or expose them in client code.
- The Vercel headers deny framing, disable MIME sniffing and unnecessary browser permissions, force HTTPS, and restrict content sources.
