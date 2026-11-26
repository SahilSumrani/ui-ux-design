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
| Card surface | `--lib-card` | `#191919` | Proposed small-card surface |
| Border | `--lib-line` | `#292929` | Approximate low-contrast dividers and outlines |
| Main text | `--lib-ink` | `#f5f5f5` | Approximate high-contrast headings |
| Muted text | `--lib-muted` | `#929292` | Approximate descriptions and metadata |
| Link/accent | `--lib-blue` | `#8ab4f8` | Approximate cool blue link/accent seen in reference |

Use Geist for body text, Manrope for large display headings and Geist Mono for small metadata. The source page text identifies Inter and Saans; Motif uses its already loaded fonts rather than adding a new font dependency. Use 8–14px rounded corners on navigation and cards, with larger hero artwork kept circular. Keep borders subtle, use blue sparingly for active states, and reserve bright white for primary text.

## Layout and behavior

- Fixed top header; fixed, independently scrollable left sidebar on desktop; main content begins to its right.
- Sidebar includes an all-components entry, search field, and every Motif component name. Active route is highlighted. At narrow widths, the sidebar becomes a slide-in drawer.
- `/` and `/components` show a searchable-friendly component catalog with short descriptions and individual links. `/components/<id>` opens a component detail page; browser back/forward stays in sync.
- Detail page order: breadcrumb, title and summary, React context, preview navigation, large interactive demo with a compact adjacent helper/settings card, then install/usage information.
- Reuse existing interactive demos, live custom controls, and email-gated source/copy flow. Preview settings continue to feed the live source for Slide to Confirm and Upload Dropzone.
- Catalog cards are intentionally concise and clickable; the persistent sidebar remains the primary way to move between all 15 demos.

## Assets and fidelity limits

- Keep Motif's existing logo, local image assets and component implementations.
- The dark navigation/detail structure follows the supplied reference. Component artwork and demo details remain Motif-specific. The home page uses a lightweight CSS orbit illustration instead of copying Libraries.dev imagery or branding.
- Responsive layout is an implementation adaptation; the supplied screenshots establish the desktop reference but do not document Libraries.dev's mobile behavior.
