'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLocale, type Locale } from './locale-provider'

const LINKS = [
  { href: '/#arbeit', key: 'method' },
  { href: '/#pakete', key: 'packages' },
  { href: '/angebot', key: 'offer' },
  { href: '/#mix', key: 'mix' },
  { href: '/#kontakt', key: 'contact' },
] as const

export function SiteHeader() {
  const { copy, locale, setLocale } = useLocale()
  const [open, setOpen] = useState(false)
  const offer = locale === 'en' ? 'Offer' : locale === 'ru' ? '\u041e\u0444\u0444\u0435\u0440' : 'Angebot'
  const labels: Record<(typeof LINKS)[number]['key'], string> = {
    method: copy.nav.method,
    packages: copy.nav.packages,
    offer,
    mix: 'MIX',
    contact: copy.nav.contact,
  }

  function close() {
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-pink/15 bg-background/88 backdrop-blur-xl">
      <a href="/#kontakt" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[60] focus:bg-lime focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-lime-foreground">{copy.nav.skip}</a>
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:gap-4 sm:px-5 sm:py-3 md:px-8">
        <a href="/#top" className="flex min-h-11 min-w-0 items-center gap-2.5" onClick={close}>
          <Image src="/images/brandcultura-mark-web.webp" alt="" width={42} height={42} priority className="h-9 w-9 shrink-0 object-cover mix-blend-screen sm:h-10 sm:w-10" />
          <span className="truncate font-display text-base font-bold tracking-[0.04em] text-foreground sm:text-lg">brand<span className="text-pink">cultura</span></span>
        </a>
        <nav className="hidden items-center gap-6 md:flex" aria-label={copy.nav.aria}>
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{labels[link.key]}</a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center border border-border sm:flex" role="group" aria-label={copy.nav.language}>
            <LocaleButtons locale={locale} setLocale={setLocale} />
          </div>
          <a href="/#kontakt" className="border border-lime/60 bg-lime px-3 py-2 text-sm font-semibold text-lime-foreground transition-colors hover:bg-foreground">{copy.nav.start}</a>
          <button type="button" className="min-h-11 min-w-11 border border-border px-2 font-mono text-[11px] uppercase text-foreground md:hidden" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((value) => !value)}>{copy.nav.menu}</button>
        </div>
      </div>
      {open ? (
        <div id="site-menu" className="border-t border-border px-3 py-3 md:hidden">
          <nav className="flex flex-col" aria-label={copy.nav.aria}>
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={close} className="flex min-h-11 items-center text-base text-foreground">{labels[link.key]}</a>
            ))}
          </nav>
          <div className="mt-2 flex border border-border sm:hidden" role="group" aria-label={copy.nav.language}>
            <LocaleButtons locale={locale} setLocale={setLocale} />
          </div>
        </div>
      ) : null}
    </header>
  )
}

function LocaleButtons({ locale, setLocale }: { locale: Locale; setLocale: (locale: Locale) => void }) {
  return (['de', 'en', 'ru'] as Locale[]).map((item) => (
    <button key={item} type="button" onClick={() => setLocale(item)} aria-pressed={locale === item} className={`min-h-11 min-w-10 flex-1 px-2 py-2 font-mono text-[11px] uppercase transition-colors ${locale === item ? 'bg-lime text-lime-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{item}</button>
  ))
}
