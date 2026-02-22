import { NextRequest, NextResponse } from 'next/server'
import businessData from '@/data/business.json'

// ===========================================
// CONFIGURATION (from env vars)
// ===========================================
const PORTAL_API_URL = process.env.PORTAL_API_URL
const PORTAL_API_KEY = process.env.PORTAL_API_KEY
const PORTAL_SITE_ID = process.env.PORTAL_SITE_ID
const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'leads@yourdomain.com'
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY

// ===========================================
// RATE LIMITING
// ===========================================
// In-memory rate limiting works per serverless instance.
// For production on Vercel, consider Upstash Redis:
//   npm install @upstash/ratelimit @upstash/redis
// For now, in-memory provides per-instance protection which
// still catches rapid-fire abuse from a single client.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 5 // 5 requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now()

  // Lazy cleanup: purge expired entries every 60s to prevent memory leak
  if (rateLimitMap.size > 1000) {
    rateLimitMap.forEach((record, key) => {
      if (now > record.resetTime) rateLimitMap.delete(key)
    })
  }

  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }

  record.count++
  return true
}

// ===========================================
// TURNSTILE VERIFICATION
// ===========================================
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) {
    // Turnstile not configured - skip verification
    return true
  }

  if (!token) {
    return false
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip,
      }),
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('Turnstile verification failed:', error)
    return false
  }
}

// ===========================================
// INPUT SANITIZATION
// ===========================================
function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '')
}

function sanitize(value: string | undefined, maxLength: number): string {
  if (!value) return ''
  return stripHtml(value).trim().slice(0, maxLength)
}

// ===========================================
// TYPES
// ===========================================
interface LeadData {
  name: string
  phone: string
  email?: string
  service?: string
  message?: string
  urgency?: string
  source?: string
  turnstileToken?: string
}

// ===========================================
// MAIN HANDLER
// ===========================================
export async function POST(request: NextRequest) {
  // Get client IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'

  // Check rate limit
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 }
    )
  }

  try {
    const body: LeadData = await request.json()

    // Validate required fields
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    body.name = sanitize(body.name, 100)
    body.phone = sanitize(body.phone, 20)
    body.email = sanitize(body.email, 254)
    body.service = sanitize(body.service, 100)
    body.message = sanitize(body.message, 2000)
    body.urgency = sanitize(body.urgency, 50)
    body.source = sanitize(body.source, 50)

    // Verify Turnstile (if configured)
    if (TURNSTILE_SECRET_KEY) {
      const isHuman = await verifyTurnstile(body.turnstileToken || '', ip)
      if (!isHuman) {
        return NextResponse.json(
          { error: 'Verification failed. Please try again.' },
          { status: 400 }
        )
      }
    }

    const { forms } = businessData
    const lead = {
      name: body.name,
      phone: body.phone,
      email: body.email,
      service: body.service,
      message: body.message,
      urgency: body.urgency,
      source: body.source || 'Website',
      submittedAt: new Date().toISOString(),
      business: businessData.name,
      website: businessData.website,
      ip: ip !== 'unknown' ? ip : undefined,
    }

    // ===========================================
    // 1. FORWARD TO CLIENT PORTAL (if configured)
    // Uses /api/portal/leads/intake endpoint with API key auth
    // ===========================================
    if (PORTAL_API_URL && PORTAL_API_KEY) {
      try {
        const portalPayload = {
          name: body.name,
          phone: body.phone,
          email: body.email,
          service: body.service,
          message: body.message,
          urgency: body.urgency || 'normal',
          source: body.source || 'website_form',
          metadata: {
            ip: ip !== 'unknown' ? ip : undefined,
            submittedAt: new Date().toISOString(),
            businessName: businessData.name,
            website: businessData.website,
          },
        }

        const portalHeaders: Record<string, string> = {
          'X-API-Key': PORTAL_API_KEY,
          'Content-Type': 'application/json',
        }
        if (PORTAL_SITE_ID) {
          portalHeaders['X-Portal-Site-Id'] = PORTAL_SITE_ID
        }

        const portalResponse = await fetch(`${PORTAL_API_URL}/api/portal/leads/intake`, {
          method: 'POST',
          headers: portalHeaders,
          body: JSON.stringify(portalPayload),
        })

        if (!portalResponse.ok) {
          console.error(JSON.stringify({ event: 'portal_forward_failed', status: portalResponse.status, body: await portalResponse.text() }))
        } else if (process.env.NODE_ENV === 'development') {
          console.log('[Portal] Lead forwarded successfully')
        }
      } catch (portalError) {
        console.error(JSON.stringify({ event: 'portal_forward_error', error: portalError instanceof Error ? portalError.message : String(portalError) }))
        // Continue - don't fail the request if portal is down
      }
    }

    // ===========================================
    // 2. SEND TO WEBHOOK (if configured in JSON)
    // ===========================================
    if (forms?.webhookUrl) {
      try {
        await fetch(forms.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead),
        })
      } catch (webhookError) {
        console.error(JSON.stringify({ event: 'webhook_failed', error: webhookError instanceof Error ? webhookError.message : String(webhookError) }))
      }
    }

    // ===========================================
    // 3. SEND EMAIL NOTIFICATION (if configured)
    // ===========================================
    if (forms?.notifyEmail && RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: RESEND_FROM_EMAIL,
            to: forms.notifyEmail,
            subject: `New Lead: ${body.name} - ${body.service || 'General Inquiry'}`,
            html: `
              <h2>New Lead from ${businessData.name}</h2>
              <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${body.name}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${body.phone}</td></tr>
                ${body.email ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${body.email}</td></tr>` : ''}
                ${body.service ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Service</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${body.service}</td></tr>` : ''}
                ${body.urgency ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Urgency</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${body.urgency}</td></tr>` : ''}
                ${body.message ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Message</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${body.message}</td></tr>` : ''}
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Source</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.source}</td></tr>
                <tr><td style="padding: 8px;"><strong>Time</strong></td><td style="padding: 8px;">${lead.submittedAt}</td></tr>
              </table>
            `,
          }),
        })
      } catch (emailError) {
        console.error(JSON.stringify({ event: 'email_notification_failed', error: emailError instanceof Error ? emailError.message : String(emailError) }))
      }
    }

    // Log for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Lead Received]', lead)
    }

    return NextResponse.json({
      success: true,
      message: forms?.successMessage || 'Thank you! We will contact you soon.',
    })
  } catch (error) {
    console.error(JSON.stringify({
      event: 'lead_submission_error',
      error: error instanceof Error ? error.message : String(error),
      ip,
      timestamp: new Date().toISOString(),
    }))
    return NextResponse.json(
      { error: businessData.forms?.errorMessage || 'Failed to submit. Please try again.' },
      { status: 500 }
    )
  }
}
