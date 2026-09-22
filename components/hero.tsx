'use client'

import Image from 'next/image'
import { useLocale } from './locale-provider'
import { Reveal } from './reveal'

export function Hero() {
  const { copy, locale } = useLocale()
  const t = copy.hero
  const focus = {
    de: ['Musiker:innen', 'Bands', 'Labels'],
    en: ['Musicians', 'Bands', 'Labels'],
    ru: ['Музыканты', 'Группы', 'Лейблы'],
  }[locale]

  return (
    <section id="top" className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-5 sm:pb-16 sm:pt-14 md:px-8 md:pb-24 md:pt-20">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border pb-4">
        <span className="label-mono text-pink">{t.eyebrow}</span>
        <span className="label-mono text-muted-foreground">{focus.join(' · ')}</span>
      </div>

      <div className="grid gap-8 pt-10 md:grid-cols-[1.2fr_0.8fr] md:items-end md:gap-12 md:pt-16">
        <Reveal>
          <p className="label-mono mb-6 text-purple">brandcultura / music identity</p>
          <h1 className="display max-w-3xl text-balance text-[clamp(3.4rem,10vw,8rem)] font-extrabold leading-[0.84] tracking-[-0.07em] text-foreground">
            {t.title} <span className="text-pink">{t.titleEnd}.</span>
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.intro} <span className="text-foreground">{t.emphasis}</span>
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="/#kontakt" className="flex min-h-12 items-center justify-center bg-lime px-6 py-3 text-sm font-semibold text-lime-foreground transition-colors hover:bg-foreground">{t.discuss}</a>
            <a href="/#pakete" className="flex min-h-12 items-center justify-center border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-pink hover:text-pink">{copy.nav.packages}</a>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="premium-panel flex flex-col gap-6 p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <span className="label-mono text-pink">{t.signal}</span>
              <span className="label-mono text-muted-foreground">brandcultura.agency</span>
            </div>
            <div className="brand-lockup mx-auto flex w-full max-w-[18rem] flex-col items-center">
              <Image src="/images/brandcultura-mark-web.webp" alt="" width={360} height={360} priority className="h-auto w-[62%] object-contain mix-blend-screen" />
              <div className="mt-2 whitespace-nowrap font-display text-[clamp(1.65rem,4.2vw,2.65rem)] font-medium leading-none"><span className="text-white">brand</span><span className="text-pink">cultura</span></div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="label-mono text-muted-foreground">{locale === 'ru' ? 'Работаем с' : locale === 'en' ? 'Working with' : 'Für'}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {focus.map((item) => <li key={item} className="border border-border px-3 py-2 text-sm text-foreground">{item}</li>)}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
