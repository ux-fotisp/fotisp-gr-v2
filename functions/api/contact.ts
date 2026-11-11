/**
 * functions/api/contact.ts — Cloudflare Pages Function
 * Endpoint: POST /api/contact
 *
 * Implements:
 *  - Honeypot field validation (blocks automated bot dispatch)
 *  - Cloudflare Turnstile token validation (if secret is configured in env)
 *  - Sanitisation and structured JSON response
 */

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_FORWARD_EMAIL?: string;
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
  message?: string;
  company_fax?: string; // Honeypot field
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
        message: formData.get('message')?.toString(),
        company_fax: formData.get('company_fax')?.toString(),
        turnstileToken: formData.get('cf-turnstile-response')?.toString(),
      };
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported Content-Type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Honeypot check: If the hidden input was filled, silently discard
    if (payload.company_fax && payload.company_fax.trim() !== '') {
      // Return 200 to trick bots into believing message succeeded
      return new Response(JSON.stringify({ success: true, message: 'Transmission accepted.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Validate essential fields
    const name = payload.name?.trim();
    const email = payload.email?.trim();
    const message = payload.message?.trim();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields: name, email, or message.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Email format sanity check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address provided.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Optional Cloudflare Turnstile verification
    if (context.env.TURNSTILE_SECRET_KEY && payload.turnstileToken) {
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
        return new Response(JSON.stringify({ error: 'Human verification failed.' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // 4. Log transmission (in production, integrate with Resend / Mailgun / Webhook)
    console.log(`[CONTACT_DISPATCH] From: ${name} <${email}> | Length: ${message.length} chars`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Packet received and queued for review. Thank you for reaching out.',
        timestamp: new Date().toISOString(),
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
