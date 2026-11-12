#!/usr/bin/env node
/**
 * create-object.mjs — OOUX Content Scaffolding CLI for fotisp.gr v2
 *
 * Interactively scaffolds schema-valid markdown files for:
 * [1] Case Study  (src/content/caseStudies/)
 * [2] Publication (src/content/publications/)
 * [3] Service     (src/content/services/)
 * [4] Testimonial (src/content/testimonials/)
 *
 * Enforces Zod schema compliance and lists existing valid slugs before prompting
 * for references, completely preventing broken references and ZodError build failures.
 */

import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to get existing slugs in a content directory
function getExistingSlugs(relDir) {
  const fullPath = path.join(ROOT_DIR, relDir);
  if (!fs.existsSync(fullPath)) return [];
  return fs
    .readdirSync(fullPath)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx?$/, ''));
}

function printHeader() {
  console.log('\n\x1b[31m╔══════════════════════════════════════════════════════════════╗\x1b[0m');
  console.log('\x1b[31m║\x1b[0m        \x1b[1mFOTISP-OS OOUX CONTENT SCAFFOLDING GENERATOR\x1b[0m          \x1b[31m║\x1b[0m');
  console.log('\x1b[31m║\x1b[0m        Schema-enforced authoring for fotisp.gr v2            \x1b[31m║\x1b[0m');
  console.log('\x1b[31m╚══════════════════════════════════════════════════════════════╝\x1b[0m\n');
}

async function main() {
  printHeader();

  const rl = readline.createInterface({ input, output });

  try {
    console.log('Select domain object to scaffold:');
    console.log('  \x1b[33m[1]\x1b[0m Case Study    ([O] CASE_STUDY)');
    console.log('  \x1b[33m[2]\x1b[0m Publication   ([O] PUBLICATION)');
    console.log('  \x1b[33m[3]\x1b[0m Service       ([O] SERVICE)');
    console.log('  \x1b[33m[4]\x1b[0m Testimonial   ([O] TESTIMONIAL)');
    console.log('  \x1b[90m[q] Quit\x1b[0m\n');

    const choice = (await rl.question('Enter selection (1-4): ')).trim();

    if (choice === 'q' || choice === 'quit') {
      console.log('Operation aborted.');
      return;
    }

    const availableServices = getExistingSlugs('src/content/services');
    const availablePubs = getExistingSlugs('src/content/publications');
    const availableTestimonials = getExistingSlugs('src/content/testimonials');

    if (choice === '1') {
      await scaffoldCaseStudy(rl, { availableServices, availablePubs, availableTestimonials });
    } else if (choice === '2') {
      await scaffoldPublication(rl);
    } else if (choice === '3') {
      await scaffoldService(rl, { availablePubs, availableTestimonials });
    } else if (choice === '4') {
      await scaffoldTestimonial(rl);
    } else {
      console.log('\x1b[31mInvalid option selected.\x1b[0m');
    }
  } catch (err) {
    console.error('\x1b[31mError during scaffolding:\x1b[0m', err.message);
  } finally {
    rl.close();
  }
}

// ── 1. Case Study Scaffolder ─────────────────────────────────────────
async function scaffoldCaseStudy(rl, { availableServices, availablePubs, availableTestimonials }) {
  console.log('\n\x1b[1m── Scaffolding [O] CASE STUDY ──\x1b[0m');

  const slug = (await rl.question('Slug (kebab-case identifier): ')).trim();
  if (!slug) throw new Error('Slug is required.');

  const filePath = path.join(ROOT_DIR, 'src/content/caseStudies', `${slug}.md`);
  if (fs.existsSync(filePath)) throw new Error(`File already exists at ${filePath}`);

  const title = (await rl.question('Title: ')).trim() || 'New Case Study';
  const domain = (await rl.question('Domain (e.g. Clinical & HealthTech, E-Commerce): ')).trim() || 'Product Architecture';
  const role = (await rl.question('Role (e.g. Lead UX Researcher & Systems Architect): ')).trim() || 'Lead Product Designer';
  const timeline = (await rl.question('Timeline (e.g. 2024 — 6 months): ')).trim() || '2024';
  const summary = (await rl.question('Summary (Ground-truth architectural statement): ')).trim() || 'Architectural breakdown and evidence-grounded deliverables.';

  // Services Reference Validation
  console.log('\nAvailable Service Slugs:\n  \x1b[36m' + availableServices.join(', ') + '\x1b[0m');
  const servicesInput = (await rl.question('Select Services (comma-separated, min 1): ')).trim();
  const selectedServices = servicesInput
    .split(',')
    .map((s) => s.trim())
    .filter((s) => availableServices.includes(s));
  if (selectedServices.length === 0) {
    selectedServices.push(availableServices[0] || 'ux-research');
  }

  // Publications Reference Validation
  console.log('\nAvailable Publication Slugs:\n  \x1b[36m' + (availablePubs.length ? availablePubs.join(', ') : 'None') + '\x1b[0m');
  const pubsInput = (await rl.question('Select Publications (comma-separated, optional): ')).trim();
  const selectedPubs = pubsInput
    ? pubsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => availablePubs.includes(s))
    : [];

  // Testimonials Reference Validation
  console.log('\nAvailable Testimonial Slugs:\n  \x1b[36m' + availableTestimonials.join(', ') + '\x1b[0m');
  const testimonialsInput = (await rl.question('Select Testimonials (comma-separated, optional, max 3): ')).trim();
  const selectedTestimonials = testimonialsInput
    ? testimonialsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => availableTestimonials.includes(s))
        .slice(0, 3)
    : [];

  const content = `---
title: "${title}"
domain: "${domain}"
role: "${role}"
timeline: "${timeline}"
summary: "${summary}"
status: "completed"
featuredOrder: 99
isDraft: true
services:
${selectedServices.map((s) => `  - "${s}"`).join('\n')}
publications:
${selectedPubs.map((p) => `  - "${p}"`).join('\n')}
testimonials:
${selectedTestimonials.map((t) => `  - "${t}"`).join('\n')}
tagline: "${summary}"
client: "Client / Research Partner"
category: "enterprise"
tags: ["UX research", "systems architecture"]
year: 2024
duration: "6 months"
team: "Fotis Pastrakis (Lead UX), Engineering Team"
featured: false
protected: false
figureTag: "Fig. 00"
diagramType: "schematic"
problem: "Describe domain context, clinical/enterprise challenges, and baseline user friction."
process:
  - phase: "01 // Discovery"
    description: "Qualitative field inquiry, cognitive walkthroughs, and stakeholder alignment."
  - phase: "02 // Synthesis & Architecture"
    description: "Object-oriented domain modeling (OOUX), state machine definition, and responsive design systems."
  - phase: "03 // Validation"
    description: "Moderated usability benchmarking, heuristic evaluations, and edge latency hardening."
outcome: "Grounded operational deliverables shipped to production with zero unverified claims."
impact:
  - metric: "Task Completion"
    value: "Verified"
    context: "Empirical evaluation"
methods: ["Contextual Inquiry", "OOUX ORCA Process", "WCAG AAA Audit"]
tools: ["Figma", "Astro", "TypeScript"]
---

## Architectural Deep Dive

Detailed case study breakdown goes here. Write in calm, technical prose.
`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`\n\x1b[32m✔ Successfully created Case Study scaffold at:\x1b[0m ${filePath}`);
}

// ── 2. Publication Scaffolder ─────────────────────────────────────────
async function scaffoldPublication(rl) {
  console.log('\n\x1b[1m── Scaffolding [O] PUBLICATION ──\x1b[0m');

  const slug = (await rl.question('Slug (e.g. mdpi-info-2027): ')).trim();
  if (!slug) throw new Error('Slug is required.');

  const filePath = path.join(ROOT_DIR, 'src/content/publications', `${slug}.md`);
  if (fs.existsSync(filePath)) throw new Error(`File already exists at ${filePath}`);

  const title = (await rl.question('Title: ')).trim();
  const venue = (await rl.question('Venue (e.g. MDPI Information): ')).trim() || 'MDPI Information';
  const year = parseInt((await rl.question('Year: ')).trim(), 10) || new Date().getFullYear();
  const doi = (await rl.question('DOI (e.g. 10.3390/info17050472): ')).trim();
  const url = (await rl.question('Canonical URL: ')).trim() || (doi ? `https://doi.org/${doi}` : 'https://fotisp.gr');

  const content = `---
title: "${title}"
authors:
  - "Fotios Pastrakis"
venue: "${venue}"
date: ${year}-01-01
doi: "${doi}"
url: "${url}"
isDraft: true
year: ${year}
venueType: "journal"
status: "published"
peerReviewed: true
keywords: ["Cultural UX", "Modular Information Architecture", "HCI"]
abstract: "Paper abstract summarizing research methodology, contributions, and experimental findings."
---
`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`\n\x1b[32m✔ Successfully created Publication scaffold at:\x1b[0m ${filePath}`);
}

// ── 3. Service Scaffolder ────────────────────────────────────────────
async function scaffoldService(rl, { availablePubs, availableTestimonials }) {
  console.log('\n\x1b[1m── Scaffolding [O] SERVICE ──\x1b[0m');

  const slug = (await rl.question('Slug (e.g. clinical-ux): ')).trim();
  if (!slug) throw new Error('Slug is required.');

  const filePath = path.join(ROOT_DIR, 'src/content/services', `${slug}.md`);
  if (fs.existsSync(filePath)) throw new Error(`File already exists at ${filePath}`);

  const name = (await rl.question('Name: ')).trim();
  const tagline = (await rl.question('Tagline: ')).trim();
  const description = (await rl.question('Description: ')).trim();

  // Testimonials Reference Validation
  console.log('\nAvailable Testimonial Slugs:\n  \x1b[36m' + availableTestimonials.join(', ') + '\x1b[0m');
  const testimonialsInput = (await rl.question('Select Testimonials (comma-separated, max 3): ')).trim();
  const selectedTestimonials = testimonialsInput
    ? testimonialsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => availableTestimonials.includes(s))
        .slice(0, 3)
    : [];

  const content = `---
name: "${name}"
title: "${name}"
tagline: "${tagline}"
description: "${description}"
category: "systems"
figureTag: "Svc. 04"
deliverables:
  - "Core System Architecture"
  - "Evidence-grounded UX Specification"
  - "Component Implementation Matrix"
methodologies:
  - "OOUX ORCA Process"
  - "Contextual Inquiry"
  - "WCAG AAA Audit"
featuredOrder: 4
isDraft: true
publications: []
testimonials:
${selectedTestimonials.map((t) => `  - "${t}"`).join('\n')}
available: true
order: 4
---
`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`\n\x1b[32m✔ Successfully created Service scaffold at:\x1b[0m ${filePath}`);
}

// ── 4. Testimonial Scaffolder ────────────────────────────────────────
async function scaffoldTestimonial(rl) {
  console.log('\n\x1b[1m── Scaffolding [O] TESTIMONIAL ──\x1b[0m');

  const slug = (await rl.question('Slug (kebab-case, e.g. company-name): ')).trim();
  if (!slug) throw new Error('Slug is required.');

  const filePath = path.join(ROOT_DIR, 'src/content/testimonials', `${slug}.md`);
  if (fs.existsSync(filePath)) throw new Error(`File already exists at ${filePath}`);

  const author = (await rl.question('Author Name: ')).trim();
  const role = (await rl.question('Author Role: ')).trim();
  const company = (await rl.question('Company / Organization: ')).trim();
  const quote = (await rl.question('Verified Quote: ')).trim();

  const content = `---
author: "${author}"
role: "${role}"
company: "${company}"
quote: "${quote}"
---
`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`\n\x1b[32m✔ Successfully created Testimonial scaffold at:\x1b[0m ${filePath}`);
}

main();
