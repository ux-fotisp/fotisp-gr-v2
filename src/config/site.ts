/**
 * site.ts — Global Executive Positioning & Site Configuration
 * Single strongly-typed source of truth for fotisp.gr
 */

export interface NavLink {
  id: 'top' | 'work' | 'methodology' | 'about';
  label: string;
  href: string;
}

export interface BentoCardCopy {
  id: string;
  caseStudyRef: string;
  kicker: string;
  title: string;
  summary: string;
  metrics?: { label: string; value: string }[];
  colSpanDesktop: 8 | 4 | 6;
}

export interface ResearchRow {
  number: string;
  title: string;
  thesis: string;
  citation: string;
  url?: string;
}

export interface MethodologyPillar {
  step: string;
  title: string;
  description: string;
}

export interface SiteConfig {
  brand: {
    name: string;
    title: string;
    url: string;
    author: string;
    coordinates: {
      label: string;
      lat: string;
      lng: string;
    };
    social: {
      email: string;
      linkedin: string;
      github: string;
    };
  };
  availability: {
    status: string;
    statusCompact: string;
    scope: string;
  };
  contactDrawer: {
    title: string;
    subtitle: string;
    scopes: string[];
  };
  hero: {
    kicker: string;
    headlinePart1: string;
    headlinePart2: string;
    subheadline: string;
    authorityMetrics: { label: string; value: string; context: string }[];
  };
  bento: {
    sectionKicker: string;
    sectionTitle: string;
    cards: {
      medipulse: BentoCardCopy;
      editorialPrinciples: BentoCardCopy;
      healthpulse: BentoCardCopy;
      aethra: BentoCardCopy;
    };
  };
  research: {
    sectionKicker: string;
    sectionTitle: string;
    rows: ResearchRow[];
  };
  methodology: {
    sectionKicker: string;
    sectionTitle: string;
    pillars: MethodologyPillar[];
  };
  executiveBio: {
    headline: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
  };
  navLinks: NavLink[];
}

export const siteConfig: SiteConfig = {
  brand: {
    name: 'fotisp.gr',
    title: 'Fotis Pastrakis · Systems Architect & Principal Product Designer',
    url: 'https://fotisp.gr',
    author: 'Fotis Pastrakis',
    coordinates: {
      label: 'Thessaloniki, GR',
      lat: '40.64° N',
      lng: '22.94° E',
    },
    social: {
      email: 'fotispastrakis@gmail.com',
      linkedin: 'https://www.linkedin.com/in/fotispastrakis',
      github: 'https://github.com/ux-fotisp',
    },
  },

  availability: {
    status: 'Open for Principal Roles & Enterprise Advisory',
    statusCompact: 'Available',
    scope: 'Enterprise Advisory & Principal Systems Architecture',
  },

  contactDrawer: {
    title: 'Initiate Scoped Inquiry',
    subtitle: 'Direct encrypted transmission to Fotis Pastrakis.',
    scopes: [
      '[ Principal / Lead Role ]',
      '[ Enterprise Systems & AI Advisory ]',
      '[ Design Systems & OOUX Audit ]',
    ],
  },

  hero: {
    kicker: 'SYSTEMS ARCHITECT · PRINCIPAL PRODUCT DESIGNER · AI & FRONT-END LEAD',
    headlinePart1: 'Complexity, decoded.',
    headlinePart2: 'Systems, designed.',
    subheadline:
      'I de-risk complex enterprise software before engineering commits sprint cycles. Combining Object-Oriented UX (OOUX), frontier and local AI models, and production front-end code, I bridge Product Owners and engineering teams across regulated domains like Pfizer and Deloitte.',
    authorityMetrics: [
      {
        value: '10+ Years',
        label: 'Enterprise Systems',
        context: 'Regulated health, pharma, & public tech',
      },
      {
        value: 'Pfizer & Deloitte',
        label: 'Verified Delivery',
        context: 'Enterprise-grade clinical and advisory UX',
      },
      {
        value: '4x Peer-Reviewed',
        label: 'MDPI Publications',
        context: 'Modular IA, OOUX, & cultural design taxonomy',
      },
    ],
  },

  bento: {
    sectionKicker: 'PROVEN ARCHITECTURE · SELECTED WORK',
    sectionTitle: 'Systems engineered for zero ambiguity.',
    cards: {
      medipulse: {
        id: 'bento-medipulse',
        caseStudyRef: 'medipulse',
        kicker: '01 / CLINICAL DESIGN SYSTEMS',
        title: 'From clinical signals to production front-end.',
        summary:
          'Static wireframes hide architectural bugs. By pairing OOUX domain modeling with AI-orchestrated front-end engineering (Claude, Gemini, local LLMs), I deliver functional, WCAG-compliant interfaces that engineering teams can inspect, stress-test, and ship.',
        colSpanDesktop: 8,
      },
      editorialPrinciples: {
        id: 'bento-editorial',
        caseStudyRef: 'medipulse',
        kicker: '02 / REGULATED SAFETY ARCHITECTURE',
        title: 'The patient is not a dashboard.',
        summary:
          'In GxP-regulated pharma and clinical environments, cognitive overload is a safety risk. I architect progressive disclosure systems and deterministic alert hierarchies that protect operator focus under high-stakes conditions.',
        colSpanDesktop: 4,
      },
      healthpulse: {
        id: 'bento-healthpulse',
        caseStudyRef: 'healthpulse',
        kicker: '03 / AI RECOMMENDATION & CIVIC INTEL',
        title: 'Culture, beyond the algorithm.',
        summary:
          'Designing external AI products—from open-data civic intelligence (AETHRA) to adaptive recommendation engines—where explainable AI narratives replace opaque black-box outputs.',
        colSpanDesktop: 6,
      },
      aethra: {
        id: 'bento-aethra',
        caseStudyRef: 'aethra',
        kicker: '04 / TOKENIZED COMPONENT GOVERNANCE',
        title: 'One language, every product.',
        summary:
          'Eliminating UI drift between Figma and Git. I architect token-driven Atomic Design systems and strict TypeScript/CSS component contracts that let multi-squad enterprises scale without accumulating front-end debt.',
        colSpanDesktop: 6,
      },
    },
  },

  research: {
    sectionKicker: 'EMPIRICAL RIGOR · PEER-REVIEWED RESEARCH',
    sectionTitle: 'Research, without the black box.',
    rows: [
      {
        number: '01',
        title: 'Model the objects. Then build the pages.',
        thesis:
          'How OOUX and ORCA prevent database and UI refactoring in large-scale enterprise platforms.',
        citation: 'MDPI Information (2026)',
        url: 'https://doi.org/10.3390/info-example',
      },
      {
        number: '02',
        title: 'The most useful AI may never leave the device.',
        thesis:
          'Architecting local-first AI agents and privacy-preserving UX for regulated enterprise workflows where data sovereignty is non-negotiable.',
        citation: 'System Architecture Paper (2026)',
      },
      {
        number: '03',
        title: 'A schema is a hypothesis about the world.',
        thesis:
          'Translating mixed-methods behavioral research into strict Zod/TypeScript contracts and adaptive user profiles.',
        citation: 'MDPI Digital / Information (2022–2026)',
      },
    ],
  },

  methodology: {
    sectionKicker: 'ARCHITECTURAL FRAMEWORK',
    sectionTitle: 'Clarity is an architectural decision.',
    pillars: [
      {
        step: '01',
        title: 'Find the objects',
        description:
          'Extract and validate core domain entities with Product Owners and backend architects before a single screen is drawn.',
      },
      {
        step: '02',
        title: 'Make the system explicit',
        description:
          'Map bidirectional relationships, role permissions, and AI state transitions so edge cases are solved at the architectural level.',
      },
      {
        step: '03',
        title: 'Ship functional front-end',
        description:
          'Combine accessible front-end engineering with local and frontier AI tooling to hand engineering teams living code and verified edge states.',
      },
    ],
  },

  executiveBio: {
    headline: "Hi, I'm Fotis. I make the complicated feel considered.",
    body:
      "Over 10+ years working with global enterprises like Pfizer and Deloitte, I’ve learned that the costliest bugs happen between product strategy and front-end execution. Whether embedding as a Principal Product/UX Architect or advising your leadership team on AI-driven systems, I turn ambiguity into shipping architecture.",
    ctaLabel: 'Discuss a role or advisory scope →',
    ctaHref: '#contact-drawer',
  },

  navLinks: [
    { label: 'Start', href: '/#top', id: 'top' },
    { label: 'Selected work', href: '/#work', id: 'work' },
    { label: 'Methodology', href: '/#methodology', id: 'methodology' },
    { label: 'About', href: '/about', id: 'about' },
  ],
};
