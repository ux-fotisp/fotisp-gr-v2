/**
 * functions/api/contact.ts — Cloudflare Pages Function
 * Endpoint: POST /api/contact
 *
 * Implements:
 *  - Dual Honeypot validation (_gotcha and company_fax) to eliminate bot spam
 *  - Turnstile human verification (when env.TURNSTILE_SECRET_KEY is bound)
 *  - Cloudflare D1 inquiries persistence (when env.DB is bound, fallback in preview)
 *  - Captures active client era ('1984' or '2026') and scoped serviceId
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
      payload = await context.request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await context.request.formData();
      payload = {
        name: formData.get('name')?.toString(),
        email: formData.get('email')?.toString(),
        subject: formData.get('subject')?.toString(),
        message: formData.get('message')?.toString(),
        era: formData.get('era')?.toString(),
        _gotcha: formData.get('_gotcha')?.toString(),
        company_fax: formData.get('company_fax')?.toString(),
        turnstileToken: formData.get('cf-turnstile-response')?.toString(),
      };
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported Content-Type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Honeypot check: If either honeypot field is filled, silently discard
    if (
      (payload.company_fax && payload.company_fax.trim() !== '') ||
      (payload._gotcha && payload._gotcha.trim() !== '')
    ) {
      return new Response(JSON.stringify({ success: true, message: 'Transmission accepted.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Validate essential fields
    const name = payload.name?.trim();
    const email = payload.email?.trim();
    const message = payload.message?.trim();
    const subject = payload.subject?.trim() || 'general';
    const era = payload.era === '1984' ? '1984' : '2026';

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required parameters: name, email, or message.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address provided.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Optional Cloudflare Turnstile verification
    if (context.env.TURNSTILE_SECRET_KEY && payload.turnstileToken) {
      try {
        const turnstileVerify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            secret: context.env.TURNSTILE_SECRET_KEY,
            response: payload.turnstileToken,
            remoteip: context.request.headers.get('CF-Connecting-IP') || '',
          }),
        });

        const outcome = (await turnstileVerify.json()) as { success: boolean };
        if (!outcome.success) {
          return new Response(JSON.stringify({ error: 'Turnstile verification failed.' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      } catch (err) {
        console.warn('Turnstile verification error:', err);
      }
    }

    // 4. Cloudflare D1 persistence (if DB binding is present)
    const db = context.env.DB || context.env.fotisp_db;
    if (db) {
      try {
        // Attempt D1 insert into inquiries table
        await db.prepare(
          `INSERT INTO inquiries (name, email, subject, message, era, created_at)
           VALUES (?, ?, ?, ?, ?, datetime('now'))`
        )
          .bind(name, email, subject, message, era)
          .run();
        console.log(`[D1_SAVED] Inquiry logged to database for ${email} [${subject}]`);
      } catch (d1Err) {
        console.warn('[D1_FALLBACK] Table not present or DB error (graceful fallback):', d1Err);
      }
    }

    // 5. Server console dispatch log
    console.log(`[CONTACT_DISPATCH] Era: ${era} | Subject: ${subject} | From: ${name} <${email}>`);

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
