---
title: "AETHRA: A CityOps WebApp for Public Safety with Open EU Data"
domain: "CityOps & AI"
role: "UX Research Lead & Product Designer"
timeline: "2024 — 10 months"
summary: "Civic intelligence platform combining Open EU datasets, real-time incident mapping, and AI-driven narrative synthesis for city operations centres."
status: "completed"
featuredOrder: 2
isDraft: false
services:
  - "ux-strategy"
  - "ux-research"
publications:
  - "mdpi-info-2026-modular-ia"
  - "mdpi-info-2026-cultural-ux-taxonomy"
tagline: "Civic intelligence platform combining Open EU datasets, real-time incident mapping, and AI-driven narrative synthesis for city operations centres."
client: "Research prototype — Pfizer / University of the Aegean"
category: "civic-tech"
tags: ["civic tech", "open data", "AI UX", "data visualisation", "public safety", "EU data"]
year: 2024
duration: "10 months"
team: "1 UX designer (Fotis), 2 data engineers, 1 ML researcher, 1 policy advisor"
featured: true
protected: false
cover:
  src: "/images/case-studies/aethra-cover.jpg"
  alt: "AETHRA CityOps interface — dark civic dashboard showing open EU incident data overlaid on a city map with AI-generated briefing panel"
figureTag: "Fig. 03"
problem: "Municipal public safety officers in mid-sized EU cities lack a unified view of open civic data — EU emergency datasets, municipal incident logs, and environmental sensor feeds exist in separate portals with different schemas, update cadences, and access models. Operators were manually reconciling 6–8 data sources per shift, introducing 20–40 minute delays in situational awareness. Meanwhile, AI-generated literature synthesis (developed in parallel at Pfizer) demonstrated that the same narrative-extraction techniques applicable to biomedical research could be adapted for civic event summarisation."
process:
  - phase: "Discovery"
    description: "Shadowing sessions with CityOps operators in two Greek municipalities. Workflow audit across 11 open EU data sources (Copernicus, Open Data Portal, national emergency APIs). Identification of three primary decision failure modes: data staleness, semantic misalignment across schemas, and narrative overload."
  - phase: "Define"
    description: "AETHRA was scoped around three operator jobs: Assess (current situation at a glance), Drill (investigate a specific incident thread), Brief (generate a shareable situation report). The AI narrative synthesis layer — adapted from Pfizer AI-driven literature research workflows — handled automated event clustering and plain-language briefing generation."
  - phase: "Design"
    description: "Dark CityOps dashboard: left panel for real-time incident feed with severity-stratified colour coding (using the same 1-bit severity language developed in MediPulse), central map layer with open EU geodata overlay, right panel for AI-generated briefing with source citations and confidence scores. Mobile companion for field officers: incident thread with offline caching."
  - phase: "Validate"
    description: "Tabletop simulation with 8 CityOps operators across 3 scenario types. Situation-assessment accuracy: from 61% to 87%. Briefing generation time: from 22 minutes (manual) to 3 minutes (AI-assisted). Operator trust score for AI-generated briefings: 4.1/5 when source citations were visible, 2.3/5 without."
outcome: "Research prototype presented to two Greek municipal authorities and submitted to an EU Horizon fund. The AI briefing-transparency finding — that visible citations doubled operator trust — became a design principle for the Pfizer AI literature synthesis tool."
impact:
  - metric: "Situational assessment accuracy"
    value: "87%"
    context: "Up from 61% with legacy multi-source workflow"
  - metric: "AI briefing generation"
    value: "3 min"
    context: "Down from 22 min manual average"
  - metric: "Operator AI trust (with citations)"
    value: "4.1 / 5"
    context: "vs. 2.3 / 5 without source transparency"
methods: ["shadowing", "workflow audit", "tabletop simulation", "co-design", "expert review", "think-aloud protocol"]
tools: ["Figma", "Miro", "Dovetail", "Mapbox GL", "Python notebooks (data schema analysis)"]
deliverables: ["CityOps dashboard design", "AI briefing transparency framework", "Mobile companion prototype", "Open EU data integration guide"]
order: 3
seo:
  title: "AETHRA CityOps — Case Study | Fotis Pastrakis"
  description: "Civic intelligence platform for public safety: open EU data, AI narrative synthesis, operator trust via source transparency."
---

## Two research threads, one design insight

AETHRA started as a civic data problem and became a lesson in AI transparency that now informs how Pfizer presents AI-generated research synthesis to scientists.

The core finding — that operator trust in AI-generated content collapses without visible source citations — sounds obvious in retrospect. In practice, the pressure to present a "clean" AI output without attribution noise is real in both civic and pharmaceutical contexts. The data forced a different conclusion.

> **Status:** Research prototype. Not deployed in production. All scenario data is synthetic.
