import { defineCollection, z } from 'astro:content';

// ── Shared sub-schemas ──────────────────────────────────────────

const seoSchema = z.object({
  title: z.string().max(70).optional(),
  description: z.string().max(160).optional(),
  ogImage: z.string().optional(),
});

const mediaSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  caption: z.string().optional(),
});

// ── Case Studies collection ─────────────────────────────────────

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tagline: z.string().max(250),
    client: z.string().optional(),

    category: z.enum([
      'ux-research',
      'product-design',
      'design-system',
      'health-tech',
      'food-tech',
      'ai-ux',
      'enterprise',
      'civic-tech',
      'e-commerce',
      'cultural-heritage',
    ]),
    tags: z.array(z.string()).default([]),
    year: z.number().int().min(2010).max(2030),
    duration: z.string().optional(),
    role: z.string(),
    team: z.string().optional(),

    status: z.enum(['published', 'draft', 'archived']).default('published'),
    featured: z.boolean().default(false),
    protected: z.boolean().default(false),

    cover: mediaSchema,
    palette: z.array(z.string()).max(6).optional(),
    figureTag: z.string().optional(),

    problem: z.string(),
    process: z.array(z.object({
      phase: z.string(),
      description: z.string(),
    })).optional(),
    outcome: z.string(),
    impact: z.array(z.object({
      metric: z.string(),
      value: z.string(),
      context: z.string().optional(),
    })).optional(),

    methods: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),
    deliverables: z.array(z.string()).default([]),

    liveUrl: z.string().url().optional(),
    caseStudyUrl: z.string().url().optional(),

    seo: seoSchema.optional(),
    order: z.number().int().default(99),
  }),
});

// ── Publications collection ─────────────────────────────────────

const publications = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    year: z.number().int().min(2000).max(2030),

    venue: z.string(),
    venueType: z.enum([
      'journal',
      'conference',
      'book-chapter',
      'workshop',
      'preprint',
      'report',
    ]),
    publisher: z.string().optional(),
    volume: z.string().optional(),
    issue: z.string().optional(),
    pages: z.string().optional(),
    articleNumber: z.string().optional(),
    month: z.string().optional(),

    doi: z.string().optional(),
    url: z.string().url().optional(),
    arxiv: z.string().optional(),
    isbn: z.string().optional(),

    // abstract is optional — some entries may only have title+venue
    abstract: z.string().optional(),
    keywords: z.array(z.string()).default([]),

    domain: z.array(z.enum([
      'hci',
      'health-informatics',
      'user-research',
      'ai-ethics',
      'information-architecture',
      'design-thinking',
      'clinical-ux',
      'data-visualization',
      'cultural-heritage',
      'cultural-ux',
      'recommender-systems',
      'mobile-ux',
    ])).default([]),

    featured: z.boolean().default(false),
    peerReviewed: z.boolean().default(true),
    citationCount: z.number().int().min(0).optional(),
    status: z.enum(['published', 'in-press', 'preprint', 'draft']).default('published'),
  }),
});

// ── Services collection ─────────────────────────────────────────

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tagline: z.string().max(250),
    description: z.string(),

    category: z.enum([
      'research',
      'strategy',
      'design',
      'systems',
      'leadership',
      'consulting',
    ]),

    icon: z.string().optional(),
    figureTag: z.string().optional(),

    deliverables: z.array(z.string()).default([]),
    relatedCaseStudies: z.array(z.string()).default([]),

    available: z.boolean().default(true),
    order: z.number().int().default(99),
  }),
});

// ── Export all collections ──────────────────────────────────────
export const collections = {
  caseStudies,
  publications,
  services,
};
