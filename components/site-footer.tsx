'use client'

import { CONTACT_EMAIL } from '@/lib/site'
import { useLocale } from './locale-provider'

export function SiteFooter() {
  const { copy, locale } = useLocale()
  const t = copy.footer
  const offer = locale === 'en' ? 'Offer' : locale === 'ru' ? 'Оффер' : 'Angebot'
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-display text-lg font-bold tracking-tight">brandcultura</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-foreground underline decoration-pink underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            <span className="label-mono text-muted-foreground">© 2026 · SHAPE YOUR SOUND</span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label={t.aria}>
            <a href="/angebot" className="label-mono text-muted-foreground transition-colors hover:text-foreground">{offer}</a>
            <a href="/#pakete" className="label-mono text-muted-foreground transition-colors hover:text-foreground">{t.packages}</a>
            <a href="/#mix" className="label-mono text-muted-foreground transition-colors hover:text-foreground">MIX</a>
            <a href="/#kontakt" className="label-mono text-muted-foreground transition-colors hover:text-foreground">{t.contact}</a>
            <a href="/impressum" className="label-mono text-muted-foreground transition-colors hover:text-foreground">{t.impressum}</a>
            <a href="/datenschutz" className="label-mono text-muted-foreground transition-colors hover:text-foreground">{t.privacy}</a>
          </nav>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          <a href="https://imtryingtodesign.com" className="text-foreground underline decoration-pink underline-offset-4">{t.credit}</a>
        </p>
      </div>
    </footer>
  )
}
