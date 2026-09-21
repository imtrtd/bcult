'use client'

import { useEffect, useState } from 'react'
import { MIX_STORAGE_KEY, selectedMixLabels } from '@/lib/mix-modules'
import { CONTACT_EMAIL, PACKAGE_KEY, isPackageCode, type PackageCode } from '@/lib/site'
import { useLocale } from './locale-provider'
import { Reveal } from './reveal'

const FIELD =
  'min-h-12 w-full border border-border bg-background/80 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink'

export function Contact() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(false)
  const [pkg, setPkg] = useState<PackageCode | ''>('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const { copy, locale } = useLocale()
  const t = copy.contact

  useEffect(() => {
    function read() {
      try {
        const raw = sessionStorage.getItem(PACKAGE_KEY)
        if (raw && isPackageCode(raw)) setPkg(raw)
      } catch {
        /* ignore */
      }
    }
    read()
    window.addEventListener('bcult-package', read)
    return () => window.removeEventListener('bcult-package', read)
  }, [])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return
    setSending(true)
    setError(false)

    let modules: string[] = []
    try {
      const raw = sessionStorage.getItem(MIX_STORAGE_KEY)
      if (raw) modules = selectedMixLabels(JSON.parse(raw) as Record<string, boolean>, locale)
    } catch {
      modules = []
    }

    try {
      const company = String(new FormData(event.currentTarget).get('company') ?? '')
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          package: pkg,
          message,
          modules: pkg === 'MIX' ? modules : [],
          consent: true,
          company,
          locale,
        }),
      })
      if (!response.ok) throw new Error('delivery')
      setSent(true)
    } catch {
      setError(true)
    } finally {
      setSending(false)
    }
  }

  const mailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`brandcultura · ${pkg || 'offen'}`)}&body=${encodeURIComponent(`${name}\n${email}\n${pkg}\n\n${message}`)}`

  return (
    <section id="kontakt" aria-labelledby="kontakt-heading" className="carbon-surface border-t border-border">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-9 px-4 py-14 sm:gap-12 sm:px-5 sm:py-16 md:grid-cols-2 md:px-8 md:py-24">
        <Reveal>
          <span className="label-mono text-pink">{t.label}</span>
          <h2 id="kontakt-heading" className="display mt-4 text-pretty text-4xl font-bold text-foreground sm:text-5xl md:text-7xl">{t.title}</h2>
          <p className="mt-5 max-w-sm text-pretty leading-relaxed text-muted-foreground sm:mt-6">{t.intro} <span className="text-foreground">{t.hours}</span></p>
          <p className="mt-4 text-sm text-muted-foreground">
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline decoration-pink underline-offset-4">{CONTACT_EMAIL}</a>
          </p>
        </Reveal>
        <Reveal delay={100}>
          {sent ? (
            <div className="premium-panel flex min-h-56 flex-col justify-center border-pink p-6 sm:p-8" role="status">
              <span className="label-mono text-lime">{t.received}</span>
              <p className="mt-3 text-lg text-foreground">{t.thanks}</p>
            </div>
          ) : (
            <form className="carbon-panel flex flex-col gap-4 p-4 sm:p-6" onSubmit={onSubmit}>
              <Field label={t.name}>
                <input name="name" type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} className={FIELD} />
              </Field>
              <Field label={t.email}>
                <input name="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@sound.de" className={FIELD} />
              </Field>
              <Field label={t.package}>
                <select name="package" className={FIELD} value={pkg} onChange={(e) => setPkg(isPackageCode(e.target.value) ? e.target.value : '')}>
                  <option value="">{t.packageOpen}</option>
                  <option value="MARK">MARK</option>
                  <option value="RELEASE">RELEASE</option>
                  <option value="SYSTEM">SYSTEM</option>
                  <option value="MIX">MIX</option>
                </select>
              </Field>
              <Field label={t.message}>
                <textarea name="message" rows={4} required value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t.messagePlaceholder} className={`${FIELD} min-h-28 resize-y`} />
              </Field>
              <label className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                <input type="checkbox" name="consent" required className="mt-1 size-4 accent-lime" />
                <span>
                  {t.consent}{' '}
                  <a href="/datenschutz" className="text-foreground underline decoration-pink underline-offset-4">{t.privacy}</a>
                </span>
              </label>
              <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" defaultValue="" />
              {error ? (
                <p className="text-sm text-pink" role="alert">
                  {t.error}{' '}
                  <a href={mailHref} className="text-foreground underline decoration-pink underline-offset-4">{t.mail}</a>
                </p>
              ) : null}
              <button type="submit" disabled={sending} className="mt-2 min-h-12 bg-lime px-6 py-3 text-sm font-semibold text-lime-foreground transition-colors hover:bg-foreground disabled:opacity-60">
                {sending ? t.sending : t.send}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label-mono text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
