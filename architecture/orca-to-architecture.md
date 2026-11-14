# OOUX ORCA to Technical Architecture Traceability Matrix

> **System:** `fotisp.gr-v2` (Fotis Pastrakis Personal Portfolio & Systems Architecture)  
> **Methodology:** Sophia Prater's Object-Oriented UX (OOUX) & ORCA Framework  
> **Stack:** Astro 5 (Static Output) · React 19 Islands · Atomic CSS (Zero Tailwind) · Netlify Edge & Netlify Forms

---

## 1. Executive Summary

This document establishes the bidirectional traceability between the domain model defined in [`/ooux/model.yaml`](../ooux/model.yaml) and the technical implementation within the codebase. Every noun, attribute, relationship, and call-to-action (CTA) in the ORCA matrix maps directly to a concrete software boundary (Zod content schema, file-based route, client island, or edge function).

```
[ ORCA Domain Object ] ─────────► [ Astro 5 Content Collection / Zod ]
         │                                       │
         ├───────────────────────────────────────┼─────────────────────────┐
         ▼                                       ▼                         ▼
[ UI Component / Island ]               [ Static Page / Route ]   [ Netlify Edge Forms ]
 (DesktopWindow / SystemBar)              (work/[id].astro)         (/__forms.html)
```

---

## 2. Object Traceability Matrix

| OOUX Object | Desktop Metaphor | Astro 5 Source / Schema | Static Page Route | Interactive Component | Ingestion & Storage Store |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Case Study** | `*.app` Executable Document | `src/content/case-studies/*.md` via `defineCollection()` | `src/pages/work/[id].astro`<br>`src/pages/work/index.astro` | `CaseStudyGrid.tsx`<br>`CaseStudyDiagram.astro` | `dist/work/*/index.html` (Static Pages) |
| **Publication** | `reference_*.pdf` Volume | `src/content/publications/*.md` via `defineCollection()` | `src/pages/index.astro#publications`<br>`src/pages/about.astro` | `DesktopWindow.astro`<br>1-Bit DOI Badge | Canonical DOI Resolver (`https://doi.org/*`) |
| **Service** | `service_*.daemon` Daemon | `src/content/services/*.md` via `defineCollection()` | `src/pages/index.astro#services`<br>`src/pages/work/index.astro` | `ServiceCard`<br>`data-service-select` | Statically baked in HTML |
| **Testimonial** | `*.sig` Signature Certificate | `src/content/testimonials/*.md` via `defineCollection()` | `src/pages/about.astro#testimonials`<br>`src/pages/index.astro#testimonials` | `DesktopWindow.astro`<br>Verified Ref Badge | Statically baked in HTML |
| **Inquiry** | `tty0 / console_inquiry.sh` | Zero-backend Form Interface in `public/__forms.html` | `/#contact-drawer`<br>`/about#contact-drawer` | `#contactForm` | Netlify Forms (`contact` registry) |

---

## 3. Detailed Object Specifications & Implementations

### 3.1 Case Study (`case_study`)
- **Domain Role:** Primary showcase of senior UX research, cognitive ergonomics, and front-end systems architecture across high-stakes domains.
- **Content Collection Schema (`src/content.config.ts`):**
  ```ts
  const caseStudies = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/case-studies' }),
    schema: z.object({
      title: z.string(),
      tagline: z.string(),
      client: z.string(),
      year: z.string(),
      role: z.string(),
      duration: z.string(),
      status: z.enum(['production', 'completed', 'archived']).default('production'),
      featured: z.boolean().default(false),
      order: z.number().default(99),
      services: z.array(z.string()).default([]),
      citations: z.array(z.string()).default([]),
      scope: z.array(z.string()).default([]),
      stack: z.array(z.string()).default([]),
      metrics: z.array(z.object({
        metric: z.string(),
        label: z.string(),
        verified: z.boolean().default(true),
      })).default([]),
      diagram: z.object({
        type: z.string(),
        caption: z.string(),
        figureTag: z.string().default('Fig. 01'),
      }).optional(),
    }),
  });
  ```
- **Ground-Truth Safeguard:** Every metric is backed by verified UX outcomes (e.g. "WCAG AAA clinical legibility", "800ms debounce pipeline", "Faceted organic taxonomy"). Zero hallucinated or fabricated percentage claims.
- **Architectural Schematics:** Rendered by `src/components/CaseStudyDiagram.astro` with 1-bit vector styling using `currentColor` and `var(--color-accent)`.

### 3.2 Publication (`publication`)
- **Domain Role:** Formal academic citations establishing peer-reviewed research authority in Cultural HCI and AI Modular Information Architecture.
- **Content Collection Schema (`src/content.config.ts`):**
  ```ts
  const publications = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/publications' }),
    schema: z.object({
      title: z.string(),
      authors: z.array(z.string()),
      venue: z.string(),
      year: z.number(),
      doi: z.string(),
      url: z.string().url(),
      abstract: z.string().optional(),
      keywords: z.array(z.string()).default([]),
      taxonomyType: z.enum(['cultural_ux', 'modular_ia', 'empirical_hci', 'accessibility']).default('cultural_ux'),
      verified: z.boolean().default(true),
    }),
  });
  ```
- **Ground-Truth Data:** 4 peer-reviewed publications (MDPI Information 2026, MDPI Digital 2025, MDPI Information 2024, MDPI Information 2023) linked with permanent DOIs.

### 3.3 Service (`service`)
- **Domain Role:** Commercial consulting scopes offered by Fotis Pastrakis (`ux-research`, `design-systems`, `ux-strategy`).
- **Interactive Wiring:** Every service card on `src/pages/index.astro` contains a CTA `[ INITIATE SCOPED INQUIRY ]` with `data-service-select="{id}"`.
- **Client Script Handshake:** Clicking the button scrolls smoothly to `#contact-drawer`, auto-selects the corresponding dropdown option in `#contact-subject`, and sets keyboard focus on `#contact-name`.

### 3.4 Inquiry (`inquiry`)
- **Domain Role:** Edge-persisted communication packet from prospective clients.
- **Transport & Storage:**
  - Client submits form payload via `POST /__forms.html` (handled natively by Netlify Forms build-time ingestion).
  - Security & Anti-Spam Pipeline:
    1. **Dual Honeypot Validation:** Form includes invisible fields `_gotcha` and `company_fax`. Submissions with non-empty honeypots are dropped by security filters.
    2. **Payload Validation:** Operator name, email (RFC 5322 regex validation), subject engagement scope, and message required.
    3. **Zero-Backend Ingestion:** Form skeleton declared in `public/__forms.html` allows Netlify's post-processing engine to securely index and route submissions without cold starts or server maintenance.
    4. **Edge Architecture Portability:** Architecture retains compatibility with Cloudflare Pages Functions (`functions/api/contact.ts`) and Cloudflare D1 serverless SQLite for alternative multi-cloud deployments.

### 3.5 Testimonial (`testimonial`)
- **Domain Role:** Verified peer and leadership endorsements from senior executives at enterprise organizations (Pfizer, Deloitte) confirming Fotis Pastrakis's architectural rigor and UX execution.
- **Content Collection Schema (`src/content.config.ts`):**
  ```ts
  const testimonials = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/testimonials' }),
    schema: z.object({
      author: z.string(),
      role: z.string(),
      company: z.string(),
      quote: z.string(),
    }),
  });
  ```
- **Relational Integrity:** Linked relationally into `caseStudies` (`testimonials: z.array(reference('testimonials')).max(3)`) and `services` (`testimonials: z.array(reference('testimonials')).max(3)`).
- **Ground-Truth Data:** 3 verified records in `src/content/testimonials/`:
  1. `deloitte-greece.md` — Panagiotis Tsakiridis, Senior Product Designer, Deloitte Digital Greece
  2. `deloitte-finland.md` — Tomi Sepa, Senior Manager, Risk Advisory, Deloitte Finland
  3. `pfizer.md` — Christoforos K. Gravas, Product Owner, Pfizer

---

## 4. MCSFD Cardinality Matrix

| Source Object | Relationship Verb | Target Object | Min Cardinality | Max Cardinality | Mandatory / Optional |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `case_study` | *demonstrates* | `service` | 1 | N | Mandatory |
| `case_study` | *cites* | `publication` | 0 | N | Optional |
| `case_study` | *validated by* | `testimonial` | 0 | 3 | Optional |
| `service` | *evidenced by* | `case_study` | 1 | N | Mandatory |
| `service` | *endorsed by* | `testimonial` | 0 | 3 | Optional |
| `publication` | *underpins* | `case_study` | 0 | N | Optional |
| `testimonial` | *validates* | `case_study` | 0 | N | Optional |
| `inquiry` | *scoped to* | `service` | 0 | 1 | Optional (defaults to 'general') |

---

## 5. Role-Based Call-To-Action (CTA) Matrix

| User Role | Object Target | Action Label | Mechanical Target | State Mutation |
| :--- | :--- | :--- | :--- | :--- |
| **GUEST** | `case_study` | *Read Full Architecture* | `/work/{id}` | Navigates to deep case study layout |
| **GUEST** | `case_study` | *Toggle Era Mode* | `SystemBar` / `⇧⌥E` | Toggles `document.documentElement.dataset.era` |
| **GUEST** | `publication` | *Resolve DOI* | `https://doi.org/{doi}` | Opens external canonical journal link |
| **GUEST** | `service` | *Initiate Scoped Inquiry* | `/#contact-drawer` | Pre-selects service option and focuses terminal input |
| **GUEST** | `testimonial` | *Inspect Verified Reference* | `/about#testimonials` | Navigates to leadership endorsement grid |
| **GUEST** | `inquiry` | *Transmit Packet* | `POST /__forms.html` | Submits form to Netlify Forms with live client dispatch confirmation |
| **SYSTEM** | `inquiry` | *Filter Spam* | Netlify Forms Engine | Rejects submissions containing non-empty `_gotcha` or `company_fax` |
| **SYSTEM** | `inquiry` | *Persist Record* | Netlify Form Registry | Stores encrypted inquiry in Netlify dashboard with webhook triggers |
| **OWNER** | `case_study` | *Update Case Study* | `src/content/caseStudies/*.md` | Git commit on `dev` branch |
| **OWNER** | `publication` | *Register Publication* | `src/content/publications/*.md` | Git commit on `dev` branch |
| **OWNER** | `testimonial` | *Register Endorsement* | `src/content/testimonials/*.md` | Git commit on `dev` branch |

---

## 6. Interactive React 19 Islands & Motion Architecture

| Component Island | File Path | Lifecycle Hydration | Motion & Accessibility Safeguards |
| :--- | :--- | :--- | :--- |
| **EdgeLottie** | `src/components/EdgeLottie.tsx` | `client:visible` | Wraps `@lottiefiles/dotlottie-react`. When `era === '1984'`, crushes canvas via `filter: url(#dither-1bit); image-rendering: pixelated;`. Animated Thessaloniki radar HUD fallback. |
| **SplitButton** | `src/components/SplitButton.tsx` | `client:load` / `client:visible` | Primary action button with attached dropdown toggle (`[ v ]`), separated by `--border-1bit`. Framer Motion height disclosure (`height: 0` $\rightarrow$ `auto`), live `[ COPIED TO CLIPBOARD ]` state, keyboard navigation (`Escape`, `Tab`). |
| **DraggableFrame** | `src/components/DraggableFrame.tsx` | `client:idle` | Titlebar-only handle drag with Framer Motion `useDragControls` and click-to-front `z-index`. **Disabled on `< 768px`** and `prefers-reduced-motion` so mobile touch scrolling is never hijacked. Listens to `reset-windows` event. |
| **MagneticTarget** | `src/components/MagneticTarget.tsx` | `client:load` / `client:visible` | Spring physics (`damping: 16, stiffness: 220`) pulling CTAs toward cursor within 40px radius. Disabled on touch (`pointerType === 'touch'`) and `prefers-reduced-motion`. |
| **SystemBar** | `src/components/SystemBar.tsx` | `client:load` | Fixed header navigation aligned to Figma v2 with 300ms hardware CRT glitch transition on era switch (`Shift+Alt+E`), diagnostic modal trigger (`Shift+Alt+D`), and window reset (`Shift+Alt+W`). |

---

## 7. Verification and Compliance

- **Build Verification:** All routes compile statically via `astro build` (`output: 'static'`).
- **Zero Tailwind:** Styles use custom CSS tokens (`src/styles/tokens.css`) and atomic utilities (`src/styles/atomic.css`).
- **Accessibility:** Tested at 360px and 1440px viewports with zero horizontal overflow and full keyboard navigation support (`Tab`, `Escape`, `Shift+Alt+E`, `Shift+Alt+D`).
