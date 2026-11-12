import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

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

// ── Publications collection ([O] PUBLICATION) ───────────────────

const publications = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    date: z.coerce.date(),
    doi: z.string().optional(),
    url: z.string().url().optional(),
    isDraft: z.boolean().default(false),

    // Rich metadata for academic schema and citation rendering
    year: z.number().int().optional(),
    month: z.string().optional(),
    venueType: z.enum([
      'journal',
      'conference',
      'book-chapter',
      'workshop',
      'preprint',
      'report',
    ]).optional(),
    publisher: z.string().optional(),
    volume: z.string().optional(),
    issue: z.string().optional(),
    pages: z.string().optional(),
    articleNumber: z.string().optional(),
    abstract: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    domain: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    peerReviewed: z.boolean().default(true),
    citationCount: z.number().int().min(0).optional(),
    status: z.enum(['published', 'in-press', 'preprint', 'draft']).default('published'),
  }),
});

// ── Services collection ([O] SERVICE) ───────────────────────────

const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    deliverables: z.array(z.string()),
    methodologies: z.array(z.string()),
    featuredOrder: z.number(),
    isDraft: z.boolean().default(false),
    publications: z.array(reference('publications')).max(5).default([]),

    // Rich fields for UI rendering & backward compatibility
    title: z.string().optional(),
    tagline: z.string().max(250).optional(),
    category: z.string().optional(),
    icon: z.string().optional(),
    figureTag: z.string().optional(),
    relatedCaseStudies: z.array(z.string()).default([]),
    available: z.boolean().default(true),
    order: z.number().int().optional(),
  }),
});

// ── Case Studies collection ([O] CASE_STUDY) ────────────────────

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/caseStudies' }),
  schema: z.object({
    title: z.string(),
    client: z.string().optional(),
    domain: z.string(),
    role: z.string(),
    timeline: z.string(),
    summary: z.string(),
    deliverables: z.array(z.string()).default([]),
    status: z.enum(['completed', 'in-progress', 'archived']).default('completed'),
    coverImage: z.string().optional(),
    lottieUrl: z.string().optional(),
    diagramType: z.enum(['3d', 'schematic']).default('schematic'),
    featuredOrder: z.number().optional(),
    isDraft: z.boolean().default(false),
    services: z.array(reference('services')).min(1).max(5),
    publications: z.array(reference('publications')).max(3).default([]),

    // Rich fields for deep reading case study templates
    tagline: z.string().max(250).optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    year: z.number().int().min(2010).max(2030).optional(),
    duration: z.string().optional(),
    team: z.string().optional(),
    featured: z.boolean().default(false),
    protected: z.boolean().default(false),
    cover: mediaSchema.optional(),
    palette: z.array(z.string()).max(6).optional(),
    figureTag: z.string().optional(),
    problem: z.string().optional(),
    process: z.array(z.object({
      phase: z.string(),
      description: z.string(),
    })).optional(),
    outcome: z.string().optional(),
    impact: z.array(z.object({
      metric: z.string(),
      value: z.string(),
      context: z.string().optional(),
    })).optional(),
    methods: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),
    liveUrl: z.string().url().optional(),
    caseStudyUrl: z.string().url().optional(),
    seo: seoSchema.optional(),
    order: z.number().int().optional(),
  }),
});

export const collections = {
  caseStudies,
  publications,
  services,
};
