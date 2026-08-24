'use client'

import Image from 'next/image'
import { useLocale } from './locale-provider'
import { Reveal } from './reveal'
import { DrumMachine } from './drum-machine'

const EQ_BARS = Array.from({ length: 24 })

export function Hero() {
  const { copy } = useLocale()
  const t = copy.hero

  return (
    <section id="top" className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-5 sm:pb-14 sm:pt-12 md:px-8 md:pb-20 md:pt-16">
      {/* meta bar */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border pb-4">
        <span className="label-mono text-pink">{t.eyebrow}</span>
        <span className="label-mono text-muted-foreground">{t.arts}</span>
        <span className="label-mono ml-auto hidden text-muted-foreground sm:inline">{t.audience}</span>
      </div>

      {/* headline + equalizer */}
      <div className="grid gap-8 pt-10 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-10 md:pt-16">
        <Reveal>
          <p className="label-mono mb-6 text-purple">01 / sound identity</p>
          <h1 className="display text-balance text-[clamp(3.4rem,11vw,9rem)] font-extrabold leading-[0.82] tracking-[-0.07em] text-foreground">
            {t.title}{' '}
            <span className="text-muted-foreground">{t.titleEnd}</span>
            <span className="text-pink">.</span>
          </h1>
        </Reveal>

        <Reveal delay={120} className="min-w-0">
          <div className="premium-panel flex h-full flex-col justify-between gap-5 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="label-mono text-pink">{t.signal}</span>
              <span className="label-mono text-muted-foreground">SIGNAL v1</span>
            </div>
            <div className="relative mx-auto w-full max-w-[18rem] overflow-hidden sm:max-w-[20rem]">
              <Image
                src="/images/brandcultura-logo-web.webp"
                alt="brandcultura agency"
                width={1000}
                height={1000}
                priority
                className="brand-lockup h-auto w-full object-contain mix-blend-screen"
              />
            </div>
            {/* signature live equalizer */}
            <div className="flex h-16 items-end gap-1 sm:h-20" aria-hidden="true">
              {EQ_BARS.map((_, i) => (
                <span
                  key={i}
                  className={`eq-bar flex-1 rounded-sm ${i % 7 === 0 ? 'bg-purple' : i % 3 === 0 ? 'bg-lime' : 'bg-pink/85'}`}
                  style={{ height: '100%', animationDelay: `${(i % 8) * 0.11}s`, animationDuration: `${1 + (i % 5) * 0.14}s` }}
                />
              ))}
            </div>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              {t.intro} <span className="text-foreground">{t.emphasis}</span>
            </p>
          </div>
        </Reveal>
      </div>

      {/* SIGNAL — live drum machine + looper */}
      <DrumMachine />

      {/* bottom action + metrics */}
      <Reveal delay={220} className="mt-10 border-t border-border pt-8 sm:mt-14">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
          <dl className="grid grid-cols-3 gap-4 sm:gap-8">
            {[['20 Hz - 20 kHz', t.frequency], ['∞', t.titleEnd], ['2026', t.eyebrow]].map(([value, label]) => (
              <div key={value} className="border-l border-pink/50 pl-3 sm:pl-4">
                <dt className="display text-2xl font-extrabold leading-none tracking-tight text-foreground sm:text-4xl">{value}</dt>
                <dd className="label-mono mt-2 text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#kontakt" className="flex min-h-12 items-center justify-center bg-lime px-6 py-3 text-sm font-semibold text-lime-foreground transition-transform hover:-translate-y-0.5 hover:bg-foreground">{t.discuss}</a>
            <a href="#analyse" className="flex min-h-12 items-center justify-center border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-purple hover:text-purple">{t.spectrum}</a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
