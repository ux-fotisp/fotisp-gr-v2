# OOUX ORCA to Technical Architecture Traceability Matrix

> **System:** `fotisp.gr-v2` (Fotis Pastrakis Personal Portfolio & Systems Architecture)  
> **Methodology:** Sophia Prater's Object-Oriented UX (OOUX) & ORCA Framework  
> **Stack:** Astro 5 (Static Output) · React 19 Islands · Atomic CSS (Zero Tailwind) · Cloudflare Pages & D1

---

## 1. Executive Summary

This document establishes the bidirectional traceability between the domain model defined in [`/ooux/model.yaml`](../ooux/model.yaml) and the technical implementation within the codebase. Every noun, attribute, relationship, and call-to-action (CTA) in the ORCA matrix maps directly to a concrete software boundary (Zod content schema, file-based route, client island, or edge function).

```
[ ORCA Domain Object ] ─────────► [ Astro 5 Content Collection / Zod ]
         │                                       │
         ├───────────────────────────────────────┼─────────────────────────┐
         ▼                                       ▼                         ▼
[ UI Component / Island ]               [ Static Page / Route ]   [ Edge Worker / D1 ]
 (DesktopWindow / SystemBar)              (work/[id].astro)         (/api/contact)
```

---

## 2. Object Traceability Matrix

| OOUX Object | Desktop Metaphor | Astro 5 Source / Schema | Static Page Route | Interactive Component | Edge / Database Store |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Case Study** | `*.app` Executable Document | `src/content/case-studies/*.md` via `defineCollection()` | `src/pages/work/[id].astro`<br>`src/pages/work/index.astro` | `CaseStudyGrid.tsx`<br>`CaseStudyDiagram.astro` | `dist/work/*/index.html` (Static Pages) |
| **Publication** | `reference_*.pdf` Volume | `src/content/publications/*.md` via `defineCollection()` | `src/pages/index.astro#publications`<br>`src/pages/about.astro` | `DesktopWindow.astro`<br>1-Bit DOI Badge | Canonical DOI Resolver (`https://doi.org/*`) |
| **Service** | `service_*.daemon` Daemon | In-Memory / Config in `src/pages/index.astro` | `src/pages/index.astro#services`<br>`src/pages/work/index.astro` | `ServiceCard`<br>`data-service-select` | Statically baked in HTML |
| **Inquiry** | `tty0 / console_inquiry.sh` | Dynamic Payload Interface in `functions/api/contact.ts` | `/#contact-drawer`<br>`/about#contact-drawer` | `#contactForm`<br>`Turnstile` (optional) | Cloudflare D1 `inquiries` table (`fotisp_db`) |

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
  - Client submits JSON payload to `POST /api/contact`.
  - Edge worker executes:
    1. **Honeypot Validation:** Silent 200 OK discard if `_gotcha` or `company_fax` contains data.
    2. **Payload Validation:** Name, email (RFC 5322 regex), and message required.
    3. **Anonymized Telemetry:** SHA-256 hash of `CF-Connecting-IP` via Web Crypto API (`crypto.subtle.digest`).
    4. **Era Mode Logging:** Captures whether client was in `1984` or `2026` visual mode.
    5. **D1 Insertion:** SQL query executed on Cloudflare D1 (`fotisp-db`):
       ```sql
       INSERT INTO inquiries (name, email, subject, message, era_mode, ip_hash, created_at)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);
       ```
    6. **Graceful Fallback:** If D1 table is absent or in local preview, returns structured success JSON with console trace, never terminating with an unhandled 500 error.

---

## 4. MCSFD Cardinality Matrix

| Source Object | Relationship Verb | Target Object | Min Cardinality | Max Cardinality | Mandatory / Optional |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `case_study` | *demonstrates* | `service` | 1 | N | Mandatory |
| `case_study` | *cites* | `publication` | 0 | N | Optional |
| `service` | *evidenced by* | `case_study` | 1 | N | Mandatory |
| `publication` | *underpins* | `case_study` | 0 | N | Optional |
| `inquiry` | *scoped to* | `service` | 0 | 1 | Optional (defaults to 'general') |

---

## 5. Role-Based Call-To-Action (CTA) Matrix

| User Role | Object Target | Action Label | Mechanical Target | State Mutation |
| :--- | :--- | :--- | :--- | :--- |
| **GUEST** | `case_study` | *Read Full Architecture* | `/work/{id}` | Navigates to deep case study layout |
| **GUEST** | `case_study` | *Toggle Era Mode* | `SystemBar` / `⇧⌥E` | Toggles `document.documentElement.dataset.era` |
| **GUEST** | `publication` | *Resolve DOI* | `https://doi.org/{doi}` | Opens external canonical journal link |
| **GUEST** | `service` | *Initiate Scoped Inquiry* | `/#contact-drawer` | Pre-selects service option and focuses terminal input |
| **GUEST** | `inquiry` | *Transmit Packet* | `POST /api/contact` | Submits form, shows terminal dispatch confirmation |
| **SYSTEM** | `inquiry` | *Filter Spam* | `functions/api/contact.ts` | Discards bot submissions silently |
| **SYSTEM** | `inquiry` | *Persist Record* | `fotisp_db.inquiries` | Writes permanent audit record to D1 |
| **OWNER** | `case_study` | *Update Case Study* | `src/content/case-studies/*.md` | Git commit on `dev` branch |
| **OWNER** | `publication` | *Register Publication* | `src/content/publications/*.md` | Git commit on `dev` branch |

---

## 6. Verification and Compliance

- **Build Verification:** All routes compile statically via `astro build` (`output: 'static'`).
- **Zero Tailwind:** Styles use custom CSS tokens (`src/styles/tokens.css`) and atomic utilities (`src/styles/atomic.css`).
- **Accessibility:** Tested at 360px and 1440px viewports with zero horizontal overflow and full keyboard navigation support (`Tab`, `Escape`, `Shift+Alt+E`, `Shift+Alt+D`).
