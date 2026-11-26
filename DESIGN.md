# Motif component library design

## Reference and capture

- Reference: [Libraries.dev](https://libraries.dev/) and its [Distortion Waves detail page](https://libraries.dev/waves).
- Captured and reviewed in Chrome on 2026-11-26. The supplied desktop screenshots show the dark catalog home, a detail playground with a persistent component sidebar, a stage and adjacent settings panel, plus install/usage content below.
- Libraries.dev's page text and accessible page structure were inspected. A separately rendered capture image could not be opened by the available image viewer, so precise pixel values below are visual estimates from the supplied screenshots; they are not claims about the source site's CSS.
- Product evidence: the Motif homepage in Chrome exposed 15 existing demos and the existing gated code/copy flow. This implementation retains those component demos and email gate.

## Visual system

| Role | Motif token | Value | Basis |
| --- | --- | --- | --- |
| Page background | `--lib-bg` | `#111` | Approximate from the reference's charcoal canvas |
| Secondary panel | `--lib-panel` | `#171717` | Approximate from the stage/control surfaces |
| Card surface | `--lib-card` | `#181818` | Home card surface |
| Border | `--lib-line` | `#292929` | Approximate low-contrast dividers and outlines |
| Main text | `--lib-ink` | `#f5f5f5` | Approximate high-contrast headings |
| Muted text | `--lib-muted` | `#929292` | Approximate descriptions and metadata |
| Link/accent | `--lib-blue` | `#0071fc` | Home primary action |

Use Geist for body text, Manrope for large display headings and Geist Mono for small metadata. The source page text identifies Inter and Saans; Motif uses its already loaded fonts rather than adding a new font dependency. Use 8–14px rounded corners on navigation and cards, with larger hero artwork kept circular. Keep borders subtle, use blue sparingly for active states, and reserve bright white for primary text.

## Layout and behavior

- The full-width `/` home uses a sticky nav, featured tiles, category filters, live component cards, how-to cards, FAQ accordion, and footer. `/components` opens the same home collection. `/components/<id>` opens a component detail page; browser back/forward stays in sync. `/introduction` and `/accessibility` are short docs pages linked from the sidebar.
- Detail shell: fixed top header, centered content, persistent left sidebar and a main area with tabs, stage, settings, source and install content. Sidebar groups Getting started and Components, has search, and hides its scrollbar. On mobile the sidebar becomes a scrim-backed slide-in drawer.
- Detail order: breadcrumb, title and summary, previous/next controls, Preview/Install tabs, platform labels, interactive demo with adjacent settings, then component source/usage. Install is a real tab state with package command, source, options, and license note. Copy prompt/source uses the email gate.
- Reuse existing interactive demos, live custom controls, and email-gated source/copy flow. Preview settings continue to feed the live source for Slide to Confirm and Upload Dropzone.
- Home cards are 344px tall with a 254px preview and 46px icon. Three columns become two at 1100px and one at 640px. Previews mount near the viewport and unmount offscreen; Distortion Waves uses a static receipt mock to avoid WebGL in the grid. Filters group the collection into Cards, Images, and Controls.
- Distortion Waves confines the wave to its 440×470px transfer card with clipped overflow and 28px radius; the stage remains static and Confirm stays inside the card. Reduced-motion preferences and visible keyboard focus are respected.

## Assets and fidelity limits

- Keep Motif's existing logo, local image assets and component implementations.
- The dark navigation/detail structure follows the supplied reference. Component artwork, wording, and demo details remain Motif-specific and use local assets.
- Checked at 1440px, 1024px, and 390px. The 390px layout has no horizontal overflow.

## Implementation constraints

- Keep Vite, React 18, Framer Motion, Lucide, and Distortion Waves. No Tailwind or new UI framework.
- Vercel CSP continues to use `script-src 'self'`; page behavior is bundled React code, not inline or external scripts. Geist loads through the existing Google Fonts allowance.
- Preserve the email signup API, local unlock state, history routes, source panel/copy, and live Slide to Confirm and Upload Dropzone controls.
