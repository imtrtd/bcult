'use client'

import Image from 'next/image'
import { useLocale } from './locale-provider'
import { Reveal } from './reveal'

export function ShapeYourSound() {
  const { copy } = useLocale()
  const t = copy.shape
  const ticker = [...t.cards.map((c) => c[0]), ...t.pillars.map((p) => p[0].replace(/^\d+\s*·\s*/, ''))]

  return (
    <section id="shape" aria-labelledby="shape-heading" className="carbon-surface border-y border-border">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-16 md:px-8 md:py-24">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="node-pulse h-2 w-2 bg-purple" aria-hidden />
            <span className="label-mono text-pink">{t.label}</span>
          </div>
          <h2
            id="shape-heading"
            className="display mt-4 break-words text-pretty text-[clamp(2.8rem,12vw,6rem)] font-extrabold text-foreground"
          >
            {t.title}
          </h2>
          <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-muted-foreground sm:mt-6">{t.intro}</p>
        </Reveal>

        {/* feature row: image + cards */}
        <div className="mt-9 grid grid-cols-1 gap-3 sm:mt-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="image-stage signal-scan group relative aspect-[16/10] overflow-hidden border border-pink/20">
              <Image
                src="/images/shape-your-sound.png"
                alt={t.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 58vw"
                className="object-cover opacity-95 contrast-110 saturate-75 transition-transform duration-1000 ease-out group-hover:scale-[1.035] motion-safe:animate-[shape-breathe_18s_ease-in-out_infinite]"
              />
              <div className="image-luxe-overlay absolute inset-0" aria-hidden />
              <span className="label-mono absolute bottom-4 left-4 z-10 border border-pink/40 bg-background/75 px-3 py-2 text-pink backdrop-blur-md">
                spectrogram → form
              </span>
            </div>
          </Reveal>

          <div className="flex flex-col gap-3 lg:col-span-5">
            {t.cards.map((card, index) => (
              <Reveal key={card[0]} delay={index * 100} className="flex-1">
                <div className="premium-panel group flex h-full flex-col gap-3 p-5 transition-colors hover:border-pink sm:p-6">
                  <span className="label-mono text-muted-foreground transition-colors group-hover:text-pink">
                    {card[0]}
                  </span>
                  <h3 className="text-xl font-semibold text-foreground sm:text-2xl">{card[1]}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{card[2]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* marquee ticker */}
        <Reveal delay={120}>
          <div className="mt-3 overflow-hidden border-y border-border py-3" aria-hidden>
            <div className="marquee-track">
              {[0, 1].map((dup) => (
                <span key={dup} className="inline-flex items-center">
                  {ticker.map((word, i) => (
                    <span key={`${dup}-${i}`} className="label-mono inline-flex items-center text-muted-foreground">
                      <span className="text-pink">{word}</span>
                      <span className="mx-5 h-1 w-1 rounded-full bg-purple/70" />
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* pillars */}
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          {t.pillars.map((p, index) => (
            <Reveal key={p[0]} delay={index * 100}>
              <div className="premium-panel group flex min-h-full flex-col gap-4 p-5 transition-colors hover:border-pink sm:p-6 md:p-10">
                <div className="flex items-center justify-between">
                  <span className="label-mono text-pink">{p[0]}</span>
                  <span
                    className="display text-4xl font-extrabold text-border transition-colors group-hover:text-purple/40 md:text-5xl"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="display whitespace-pre-line text-3xl font-bold text-foreground md:text-4xl">{p[1]}</h3>
                <p className="mt-auto text-sm leading-relaxed text-muted-foreground">{p[2]}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
