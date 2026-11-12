---
title: "MediPulse: Accessible Science Hub & High-Density Clinical Reading System"
domain: "Clinical & HealthTech"
role: "Lead UX Researcher & Product Designer"
timeline: "2023 — 8 months"
summary: "Redesigning a clinical literature platform for hospital floors — 56px touch-bar, high-density filter panels, and 800ms debounced auto-save."
status: "completed"
featuredOrder: 1
isDraft: false
services:
  - "design-systems"
  - "ux-research"
publications:
  - "mdpi-info-2026-modular-ia"
testimonials:
  - "pfizer"
tagline: "Redesigning a clinical literature platform for hospital floors — 56px touch-bar, high-density filter panels, and 800ms debounced auto-save."
client: "MediPulse Health Technologies"
category: "health-tech"
tags: ["accessibility", "clinical UX", "reading system", "design system", "mobile-first", "debounce"]
year: 2023
duration: "8 months"
team: "2 UX designers, 1 clinical advisor, 3 engineers"
featured: true
protected: false
cover:
  src: "/images/case-studies/medipulse-cover.jpg"
  alt: "MediPulse science hub — high-density clinical reading interface with filter panel and 56px touch-bar on mobile"
figureTag: "Fig. 01"
diagramType: "3d"
problem: "Clinical staff on hospital floors needed rapid access to medical literature during rounds — on mobile devices, in noisy environments, with gloved hands. The existing system had an 8px tap-target navbar, no auto-save on annotation, and filter panels that collapsed context on every search. Data showed 73% of mobile sessions under 90 seconds, abandoned without a successful read."
process:
  - phase: "Discovery"
    description: "Contextual research on three hospital floors across two shifts. 14 nurse and physician participants. Device and posture audit: 68% of mobile use was single-handed, 41% with gloves. Heat-map analysis of 3,200 session recordings identified the bottom 56px as the highest-reliability interaction zone."
  - phase: "Define"
    description: "Three distinct interaction modes emerged: Scan (triage-speed overview), Read (deep annotation), Filter (high-density query construction). Each required a different information density and touch target scale. The 56px bottom touch-bar became the navigation spine for mobile Scan and Filter modes."
  - phase: "Design"
    description: "Mobile: 56px fixed touch-bar with five core actions; swipe-up filter drawer; 800ms debounced auto-save on all annotation actions to prevent data loss during interruptions. Desktop: high-density filter panel (compact 32px row height for expert users) with progressive disclosure for novice mode. Shared Figma token library across both viewports."
  - phase: "Validate"
    description: "Moderated usability testing with 18 clinical staff. Mobile task completion: from 54% to 91%. Auto-save prevented annotation loss in 100% of simulated interruption scenarios. SUS: 82 (up from 54)."
outcome: "Shipped to 11 hospitals across Greece and Cyprus. 30-day mobile retention increased from 22% to 61%. The 56px touch-bar pattern was adopted as a platform standard for all MediPulse mobile products."
impact:
  - metric: "Mobile task completion"
    value: "91%"
    context: "Up from 54% at baseline"
  - metric: "Auto-save coverage"
    value: "100%"
    context: "Annotation loss eliminated in interruption scenarios"
  - metric: "SUS score"
    value: "82"
    context: "Up from 54 (industry avg: 68)"
  - metric: "30-day mobile retention"
    value: "61%"
    context: "Up from 22%"
methods: ["contextual inquiry", "session recording analysis", "device audit", "moderated usability testing", "SUS", "heat-map analysis"]
tools: ["Figma", "Maze", "Dovetail", "FullStory", "Miro"]
deliverables: ["Research report", "Clinical design system", "Mobile interaction specifications", "Auto-save engineering brief", "Handoff documentation"]
order: 1
seo:
  title: "MediPulse Clinical Reading System — Case Study | Fotis Pastrakis"
  description: "Accessible science hub for hospital floors: 56px touch-bar, high-density filters, 800ms auto-save — 91% mobile task completion."
---

## The constraint that became the design

Hospital floors are brutal UX environments. Noise, interruptions, gloved hands, and bright overhead lighting conspire against anything requiring precision. When I joined the MediPulse project, the mobile interface demanded the same precision as a desktop — a 8px navigation link, a filter form with 14 inputs, no recovery path when the system crashed mid-annotation.

The 56px touch-bar was not an aesthetic decision. It emerged directly from posture data: on a 6-inch phone held single-handed at waist height by a gloved hand during a hallway conversation, the bottom 56px is the only zone that reliably registers intentional input.

> **Note on screenshots:** Clinical environment mockups are used in place of real patient-facing screens per NDA.
