import { CONTACT_EMAIL, isPackageCode } from '@/lib/site'

export const runtime = 'nodejs'

type Payload = {
  name?: string
  email?: string
  package?: string
  message?: string
  modules?: string[]
  consent?: boolean
  company?: string
  locale?: string
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let body: Payload
  try {
    body = (await request.json()) as Payload
  } catch {
    return Response.json({ ok: false, error: 'invalid' }, { status: 400 })
  }

  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return Response.json({ ok: false, error: 'invalid' }, { status: 400 })
  }

  const name = (body.name ?? '').trim()
  const email = (body.email ?? '').trim()
  const message = (body.message ?? '').trim()
  const pkg = (body.package ?? '').trim()
  const locale = body.locale === 'en' || body.locale === 'ru' ? body.locale : 'de'
  const modules = Array.isArray(body.modules)
    ? body.modules.map((item) => String(item).trim()).filter(Boolean).slice(0, 40)
    : []

  if (!name || name.length > 200 || !EMAIL.test(email) || email.length > 200) {
    return Response.json({ ok: false, error: 'invalid' }, { status: 400 })
  }
  if (!message || message.length > 4000 || !body.consent) {
    return Response.json({ ok: false, error: 'invalid' }, { status: 400 })
  }
  if (pkg && !isPackageCode(pkg)) {
    return Response.json({ ok: false, error: 'invalid' }, { status: 400 })
  }

  const moduleLine = modules.length ? modules.join(', ') : '—'
  const text = [`Paket: ${pkg || 'offen'}`, `Module: ${moduleLine}`, '', message].join('\n')

  const sent = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      message: text,
      package: pkg || 'offen',
      modules: moduleLine,
      locale,
      _subject: `brandcultura · ${pkg || 'offen'} · ${name}`,
      _replyto: email,
      _template: 'table',
      _captcha: 'false',
    }),
  })

  if (!sent.ok) {
    return Response.json({ ok: false, error: 'delivery' }, { status: 502 })
  }

  let data: { success?: string | boolean } = {}
  try {
    data = (await sent.json()) as { success?: string | boolean }
  } catch {
    return Response.json({ ok: false, error: 'delivery' }, { status: 502 })
  }

  if (data.success !== true && data.success !== 'true') {
    return Response.json({ ok: false, error: 'delivery' }, { status: 502 })
  }

  return Response.json({ ok: true })
}
