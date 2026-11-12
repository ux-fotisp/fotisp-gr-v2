# fotisp.gr v2

**Personal portfolio of Fotis Pastrakis** — Lead Product Designer & Systems Architect (10+ years experience specializing in health-tech, clinical UX, enterprise design systems, and Object-Oriented UX).

Live architecture fusing **Astro 5 static generation**, **React 19 interactive islands**, **Framer Motion physics**, and an **authentic 1-Bit OS / EDGE design system**. Hosted on **Cloudflare Pages** backed by **Cloudflare D1** and **Cloudflare Turnstile**.

---

## ⚡ Architectural Stack

- **Framework:** [Astro 5](https://astro.build/) (Static Site Generation with Content Layer & Zod Schema Validation)
- **Interactive Islands:** [React 19](https://react.dev/) via `@astrojs/react` for telemetry, motion physics, and interactive controls
- **Motion Engine:** [Framer Motion](https://www.framer.com/motion/) (Titlebar window dragging, magnetic pull CTAs, clip-path text reveals, and CRT glitch era transitions)
- **Styling Paradigm:** Custom Atomic CSS (`tokens.css`, `atomic.css`, `global.css`) — **Zero Tailwind**, pure CSS variables and pixel-perfect 1-bit borders
- **Hosting & CDN:** [Cloudflare Pages](https://pages.cloudflare.com/) (`wrangler.jsonc`)
- **Serverless Compute:** Cloudflare Pages Functions (`functions/api/contact.ts`)
- **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (`fotisp_db` / `fotisp-db`) for contact inquiries with SHA-256 IP hashing and era tracking
- **Security & Anti-Abuse:** Cloudflare Turnstile human verification + dual invisible honeypots (`_gotcha`, `company_fax`)

---

## 🚀 Quick Start & Scripts

```bash
# Install dependencies
npm install

# Run Astro development server (http://localhost:4321)
npm run dev

# Generate Astro content types and sync collections
npx astro sync

# Production build (outputs to dist/)
npm run build

# Serve local production build
npm run preview

# Scaffold new OOUX content interactively
npm run create:object
```

---

## 🧩 OOUX Content Collections Architecture

The content layer adheres strictly to the **Object-Oriented UX (ORCA)** methodology. All objects are declared in `src/content.config.ts` and validated via Zod schemas:

| Object | Collection Path | Key Attributes | Relationships |
|---|---|---|---|
| **`[O] CASE_STUDY`** | `src/content/caseStudies/` | `title`, `domain`, `role`, `timeline`, `summary`, `metrics`, `isDraft` | References `services`, `publications`, `testimonials` |
| **`[O] PUBLICATION`** | `src/content/publications/` | `title`, `venue`, `year`, `citations`, `doi`, `summary` | Referenced by `caseStudies`, `services` |
| **`[O] SERVICE`** | `src/content/services/` | `title`, `scope`, `deliverables`, `summary` | References `publications`, `testimonials`; referenced by `caseStudies` |
| **`[O] TESTIMONIAL`** | `src/content/testimonials/` | `author`, `role`, `company`, `quote` | Referenced by `caseStudies`, `services` |

### Content Scaffolding CLI

To create a new content object with guaranteed schema compliance and valid slug references:

```bash
npm run create:object
```

The CLI interactively:
1. Prompts for the target domain object (`Case Study`, `Publication`, `Service`, `Testimonial`).
2. Reads the active workspace to present available slugs for cross-references.
3. Automatically sets `isDraft: true` by default to prevent publishing unvetted content.
4. Generates standard frontmatter and initial markdown body.

---

## 🕹️ Interactive Controls & Telemetry

### Keyboard Shortcuts
- **`Shift + Alt + E`**: Toggle Era between **Modern 2026** (Crimson `#EE2626` / Obsidian `#080303`) and **Vintage 1984** (Amber `#FFB000` / Monochrome CRT) with hardware CRT glitch sweep.
- **`Shift + Alt + D`**: Toggle System Diagnostic HUD overlay.

### Motion & UI Paradigms
- **Draggable OS Windows (`DesktopWindow.astro` + `DraggableFrame.tsx`):** Windows support titlebar-only dragging with click-to-front z-index elevation. Automatically disabled on mobile viewports (`< 768px`) and when `prefers-reduced-motion` is enabled to preserve native touch scrolling.
- **Magnetic Buttons (`MagneticTarget.tsx`):** Lightweight spring physics attract key primary CTAs toward the user cursor.
- **Split Button Island (`SplitButton.tsx`):** Primary action anchor coupled with an attached dropdown for LinkedIn profile navigation, email copying to clipboard, and deep links.
- **Telemetry Radar (`EdgeLottie.tsx`):** Orbital telemetry HUD locked to Fotis's coordinates in Thessaloniki (`40.64° N, 22.94° E`).

---

## 🎨 Design System & Palette

### Modern 2026 Era (Default)
| Token | Hex | Role |
|---|---|---|
| `--color-bg` | `#080303` | Obsidian Canvas |
| `--color-surface` | `#120608` | Window Surface |
| `--color-border` | `#261014` | Muted 1-Bit Framing |
| `--color-accent` | `#EE2626` | Scarlet Red Accent |
| `--color-text` | `#F4F4F5` | Primary High-Contrast Text |
| `--color-text-muted` | `#A1A1AA` | Secondary Metadata |

### Vintage 1984 Era (`data-era="1984"`)
| Token | Hex | Role |
|---|---|---|
| `--color-bg` | `#111111` | Monochromatic Phosphor Canvas |
| `--color-accent` | `#FFB000` | Vintage Amber Glow |
| `--color-border` | `#444444` | High-Contrast Wireframe |

### Typography Stack
- **Display / Headings:** `TT Supermolot Neue`, sans-serif
- **Body / Paragraphs:** `Manrope`, sans-serif
- **System / Telemetry:** `JetBrains Mono`, monospace

---

## ☁️ Deployment & Production

### Cloudflare Pages Setup
Configured in `wrangler.jsonc`:
- **Build Output Directory:** `dist`
- **Compatibility Date:** `2024-11-01`
- **Compatibility Flags:** `["nodejs_compat"]`
- **D1 Database Binding:** `fotisp_db` (ID: `168e7737-ecea-4c82-85a3-dbdd1e0c5fae`)

### Environment Variables
Configure in the Cloudflare Pages Dashboard (Settings > Environment Variables):
- `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile server-side validation secret.
- `CONTACT_FORWARD_EMAIL`: Destination email for incoming contact inquiries.

### Deployment Workflow
Production deploys are automated via Cloudflare Pages integration on pushes to `main`.
For manual preview or production deployment via Wrangler:

```bash
# Build static site
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name fotisp-gr-v2
```
