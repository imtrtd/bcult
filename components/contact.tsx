'use client'
import { useState } from 'react'
import { useLocale } from './locale-provider'
import { Reveal } from './reveal'

const PACKAGE_OPTIONS = {
  de: ['Noch offen', 'MARK', 'RELEASE', 'SYSTEM', 'Focus-Kohorte'],
  en: ['Not sure yet', 'MARK', 'RELEASE', 'SYSTEM', 'Focus cohort'],
  ru: ['Пока не выбрал', 'MARK', 'RELEASE', 'SYSTEM', 'Фокус-когорта'],
} as const

const PACKAGE_LABEL = {
  de: 'Paket',
  en: 'Package',
  ru: 'Пакет',
} as const

export function Contact() {
  const [sent, setSent] = useState(false)
  const { copy, locale } = useLocale()
  const t = copy.contact
  return (
    <section id="kontakt" aria-labelledby="kontakt-heading" className="carbon-surface border-t border-border">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-9 px-4 py-14 sm:gap-12 sm:px-5 sm:py-16 md:grid-cols-2 md:px-8 md:py-24">
        <Reveal>
          <span className="label-mono text-pink">{t.label}</span>
          <h2 id="kontakt-heading" className="display mt-4 text-pretty text-4xl font-bold text-foreground sm:text-5xl md:text-7xl">{t.title}</h2>
          <p className="mt-5 max-w-sm text-pretty leading-relaxed text-muted-foreground sm:mt-6">{t.intro} <span className="text-foreground">{t.hours}</span></p>
        </Reveal>
        <Reveal delay={100}>
          {sent ? (
            <div className="premium-panel flex min-h-56 flex-col justify-center border-pink p-6 sm:p-8">
              <span className="label-mono text-lime">{t.received}</span>
              <p className="mt-3 text-lg text-foreground">{t.thanks}</p>
            </div>
          ) : (
            <form className="carbon-panel flex flex-col gap-4 p-4 sm:p-6" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
              <Field label={t.name}>
                <input type="text" required placeholder={t.namePlaceholder} className="min-h-12 border border-border bg-background/80 px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-pink" />
              </Field>
              <Field label={t.email}>
                <input type="email" required placeholder="you@sound.de" className="min-h-12 border border-border bg-background/80 px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-pink" />
              </Field>
              <Field label={PACKAGE_LABEL[locale]}>
                <select className="min-h-12 border border-border bg-background/80 px-4 py-3 text-base text-foreground outline-none focus:border-pink" defaultValue={PACKAGE_OPTIONS[locale][0]}>
                  {PACKAGE_OPTIONS[locale].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </Field>
              <Field label={t.message}>
                <textarea rows={4} placeholder={t.messagePlaceholder} className="resize-none border border-border bg-background/80 px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-pink" />
              </Field>
              <button type="submit" className="mt-2 min-h-12 bg-lime px-6 py-3 text-sm font-semibold text-lime-foreground transition-colors hover:bg-foreground">{t.send}</button>
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
