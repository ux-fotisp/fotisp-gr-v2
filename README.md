# fotisp.gr v2

Personal portfolio of Fotis Pastrakis — Senior UX Researcher, Design Systems Lead, Health-tech Product Designer.

## Stack

- **Framework:** Astro 5 (static output)
- **Islands:** React 19 (via `@astrojs/react`) for motion-heavy UI
- **Motion:** Framer Motion
- **Styling:** Custom Atomic CSS — zero Tailwind
- **Deployment:** Netlify Free Tier (Deploy Previews on `dev`/feature branches)

## Development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build → dist/
npm run preview    # serve dist/ locally
```

## ⚠️ Credit Safety Protocol

| Branch type        | Credits | Notes                                  |
|--------------------|---------|----------------------------------------|
| `main`             | **15**  | Production build — use sparingly       |
| `dev` / `feature/*`| **0**   | Deploy Previews — safe for iteration   |

Monthly cap: 300 credits (~20 production builds). **Never merge to `main` for a build test.**

## Project Structure

```
src/
├── content/           # Markdown/MDX content files
│   ├── caseStudies/   # UX case studies
│   ├── publications/  # Academic papers
│   └── services/      # Service offerings
├── content.config.ts  # Astro Content Layer + Zod schemas
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   └── index.astro
├── components/        # Astro + React island components
│   ├── system/        # SystemBar, DesktopWindow
│   └── islands/       # React 19 interactive islands
└── styles/
    ├── tokens.css     # CSS custom properties
    ├── atomic.css     # Utility classes (u-flex, u-grid, etc.)
    └── global.css     # Reset + base styles
public/
├── fonts/             # Self-hosted typefaces
│   └── fonts.css      # @font-face declarations
└── favicon.svg
```

## Palette

| Role        | Token                   | Hex       |
|-------------|-------------------------|-----------|
| Background  | `--color-bg`            | `#080303` |
| Surface     | `--color-surface`       | `#120608` |
| Border      | `--color-border`        | `#261014` |
| Accent      | `--color-accent`        | `#EE2626` |
| Text Main   | `--color-text`          | `#F4F4F5` |
| Text Muted  | `--color-text-muted`    | `#A1A1AA` |

## Typography

| Role    | Family               | Weights    |
|---------|----------------------|------------|
| Display | TT Supermolot Neue   | 400/700/900|
| Body    | Manrope              | 400/500/700|
| Mono    | JetBrains Mono       | 400/500/700|

> **Font files** must be licensed and placed in `/public/fonts/` before production. See `/public/fonts/fonts.css` for `@font-face` declarations (currently commented out).
