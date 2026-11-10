# ui-ux-design

Motif is a responsive React gallery of tactile interactions. Visitors can try each component without signing in.

## Run locally

```sh
npm install
npm run dev
```

Component previews are public. Clicking Code or Copy code opens a one-field email prompt; submit unlocks the code immediately without sending an email or asking for a password.

## Email-only sign-in

The entered email is saved in that browser's local storage so it stays unlocked on that device. This is a lightweight email prompt, not verified authentication: a visitor can enter any address, and the site does not send or centrally collect emails. It should not be used to protect confidential source code.

## Deploy to Vercel

Import `SahilSumrani/ui-ux-design` into Vercel and deploy with the Vite preset. `vercel.json` configures security headers.

After deployment, verify the response headers on the live URL.

## Security notes

- `npm audit --omit=dev` currently reports no production dependency vulnerabilities.
- The gallery has no application database or user profile store; email remains in each visitor's browser.
- The Vercel headers deny framing, disable MIME sniffing and unnecessary browser permissions, force HTTPS, and restrict content sources.
