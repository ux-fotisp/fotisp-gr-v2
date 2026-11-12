/**
 * functions/api/contact.ts — Cloudflare Pages Function
 * Endpoint: POST /api/contact
 *
 * Implements:
 *  - Dual Honeypot validation (_gotcha and company_fax) to eliminate bot spam
 *  - Optional Turnstile human verification (when env.TURNSTILE_SECRET_KEY is bound)
 *  - Cloudflare D1 inquiries persistence with SHA-256 ip_hash and era_mode
 *  - Graceful fallback for local development and preview builds
 *  - Structured JSON response adhering to OOUX specification
 */

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_FORWARD_EMAIL?: string;
  DB?: {
    prepare: (query: string) => {
      bind: (...args: unknown[]) => {
        run: () => Promise<{ success: boolean }>;
      };
    };
  };
  fotisp_db?: {
    prepare: (query: string) => {
      bind: (...args: unknown[]) => {
        run: () => Promise<{ success: boolean }>;
      };
    };
  };
}

type PagesFunction<T = Record<string, unknown>> = (context: {
  request: Request;
  env: T;
  next?: () => Promise<Response>;
  data?: Record<string, unknown>;
}) => Response | Promise<Response>;

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  era?: string;
  _gotcha?: string;       // Honeypot 1
  company_fax?: string;   // Honeypot 2
  turnstileToken?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const contentType = context.request.headers.get('content-type') || '';
    let payload: ContactPayload = {};

    if (contentType.includes('application/json')) {
      const raw = (await context.request.json()) as Record<string, unknown>;
      payload = {
        name: typeof raw.name === 'string' ? raw.name : undefined,
        email: typeof raw.email === 'string' ? raw.email : undefined,
        subject: typeof raw.subject === 'string' ? raw.subject : undefined,
        message: typeof raw.message === 'string' ? raw.message : undefined,
        era: typeof raw.era === 'string' ? raw.era : undefined,
        _gotcha: typeof raw._gotcha === 'string' ? raw._gotcha : undefined,
        company_fax: typeof raw.company_fax === 'string' ? raw.company_fax : undefined,
        turnstileToken:
          typeof raw.turnstileToken === 'string'
            ? raw.turnstileToken
            : typeof raw['cf-turnstile-response'] === 'string'
            ? (raw['cf-turnstile-response'] as string)
            : undefined,
      };
    } else if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      const formData = await context.request.formData();
      payload = {
        name: formData.get('name')?.toString(),
        email: formData.get('email')?.toString(),
        subject: formData.get('subject')?.toString(),
        message: formData.get('message')?.toString(),
        era: formData.get('era')?.toString(),
        _gotcha: formData.get('_gotcha')?.toString(),
        company_fax: formData.get('company_fax')?.toString(),
        turnstileToken:
          formData.get('cf-turnstile-response')?.toString() ||
          formData.get('turnstileToken')?.toString(),
      };
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported Content-Type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Honeypot check: If either honeypot field is filled, reject transmission
    if (
      (payload.company_fax && payload.company_fax.trim() !== '') ||
      (payload._gotcha && payload._gotcha.trim() !== '')
    ) {
      return new Response(
        JSON.stringify({ error: 'Transmission rejected by security filter.' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 2. Validate essential fields
    const name = payload.name?.trim();
    const email = payload.email?.trim();
    const message = payload.message?.trim();
    const subject = payload.subject?.trim() || 'general';
    const era = payload.era === '1984' ? '1984' : '2026';

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: name, email, or message.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address provided.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. Compute anonymized IP hash using Web Crypto SHA-256
    const rawIp = context.request.headers.get('CF-Connecting-IP') || '127.0.0.1';
    let ipHash = 'anon_local';
    try {
      const hashBuffer = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(rawIp)
      );
      ipHash = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, 32);
    } catch (cryptoErr) {
      console.warn('IP hashing fallback:', cryptoErr);
    }

    // 4. Optional Cloudflare Turnstile verification
    if (context.env.TURNSTILE_SECRET_KEY && payload.turnstileToken) {
      try {
        const turnstileVerify = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              secret: context.env.TURNSTILE_SECRET_KEY,
              response: payload.turnstileToken,
              remoteip: rawIp,
            }),
          }
        );

        const outcome = (await turnstileVerify.json()) as { success: boolean };
        if (!outcome.success) {
          return new Response(
            JSON.stringify({ error: 'Turnstile verification failed.' }),
            {
              status: 403,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      } catch (err) {
        console.warn('Turnstile verification error:', err);
      }
    }

    // 5. Cloudflare D1 persistence
    const db = context.env.DB || context.env.fotisp_db;
    if (db) {
      try {
        await db
          .prepare(
            `INSERT INTO inquiries (name, email, subject, message, era_mode, ip_hash, created_at)
             VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
          )
          .bind(name, email, subject, message, era, ipHash)
          .run();
        console.log(`[D1_SAVED] Inquiry logged: ${email} [${subject}] (${era} era)`);
      } catch (d1Err) {
        // Also attempt fallback query if table has legacy 'era' column
        try {
          await db
            .prepare(
              `INSERT INTO inquiries (name, email, subject, message, era, created_at)
               VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
            )
            .bind(name, email, subject, message, era)
            .run();
          console.log(`[D1_LEGACY_SAVED] Inquiry logged via legacy schema for ${email}`);
        } catch (innerErr) {
          console.warn('[D1_FALLBACK] Table not present or DB error (graceful fallback):', innerErr);
        }
      }
    }

    // 6. Structured console logging
    console.log(`[CONTACT_DISPATCH] Era: ${era} | Subject: ${subject} | IP: ${ipHash} | From: ${name} <${email}>`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Packet received and queued for review. Thank you for reaching out.',
        timestamp: new Date().toISOString(),
        era,
        subject,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (err) {
    console.error('Contact handler error:', err);
    return new Response(JSON.stringify({ error: 'Internal processing fault.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
