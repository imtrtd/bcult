'use client'

import Image from 'next/image'
import { useLocale } from './locale-provider'
import { Reveal } from './reveal'

export function CreativeProjects() {
  const { copy } = useLocale()
  const t = copy.projects

  return (
    <section id="projects" aria-labelledby="projects-heading" className="relative border-y border-border bg-ink">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-16 md:px-8 md:py-24">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-[0.72fr_1.28fr] md:items-end">
            <div>
              <span className="label-mono text-pink">{t.label}</span>
              <p className="label-mono mt-4 text-muted-foreground">{t.kicker}</p>
            </div>
            <div>
              <h2 id="projects-heading" className="display max-w-4xl text-pretty text-4xl font-bold text-foreground sm:text-5xl md:text-7xl">
                {t.title} <span className="text-pink">{t.titleAccent}</span>
              </h2>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t.intro}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-3 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <div className="image-stage group relative aspect-[16/11] overflow-hidden border border-border lg:aspect-auto lg:min-h-[38rem]">
              <Image
                src="/images/emerging-creatives.webp"
                alt={t.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 67vw"
                className="object-cover transition duration-1000 ease-out group-hover:scale-[1.025]"
              />
              <div className="image-luxe-overlay absolute inset-0" aria-hidden />
              <div className="absolute inset-x-0 bottom-0 z-10 grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-end sm:p-6">
                <p className="max-w-lg text-pretty text-sm leading-relaxed text-foreground/90 sm:text-base">{t.caption}</p>
                <span className="label-mono w-fit border border-lime/50 bg-background/80 px-3 py-2 text-lime backdrop-blur-md">
                  {t.status}
                </span>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1">
            {t.steps.map((step, index) => (
              <Reveal key={step[0]} delay={index * 90}>
                <article className="premium-panel group flex h-full min-h-48 flex-col p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="label-mono text-purple">{String(index + 1).padStart(2, '0')}</span>
                    <span className="h-px w-10 bg-pink/60 transition-all duration-500 group-hover:w-16" aria-hidden />
                  </div>
                  <h3 className="mt-8 text-xl font-semibold text-foreground">{step[0]}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step[1]}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={180}>
          <div className="mt-3 grid gap-px border border-border bg-border sm:grid-cols-3">
            {t.outcomes.map(([value, label]) => (
              <div key={label} className="bg-background p-5 sm:p-6">
                <div className="display text-3xl font-bold text-lime sm:text-4xl">{value}</div>
                <p className="label-mono mt-3 text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
