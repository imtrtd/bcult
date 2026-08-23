'use client'

import { useLocale } from './locale-provider'
import { Reveal } from './reveal'
import { SpectrogramCanvas, type SpectrogramAudioBundle } from './spectrogram-canvas'
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'

const EQ_BARS = Array.from({ length: 24 })
const MIN_FREQ = 60
const MAX_FREQ = 20000

function markerPosition(frequency: number) {
  const logMin = Math.log(MIN_FREQ)
  const logMax = Math.log(MAX_FREQ)
  const t = (Math.log(frequency) - logMin) / (logMax - logMin)
  return `${(1 - Math.min(1, Math.max(0, t))) * 100}%`
}

export function Hero() {
  const { copy } = useLocale()
  const t = copy.hero
  const [frequency, setFrequency] = useState(440)
  const audioRef = useRef<(SpectrogramAudioBundle & { oscillator: OscillatorNode; gain: GainNode }) | null>(null)

  useEffect(() => {
    return () => {
      void audioRef.current?.context.close()
      audioRef.current = null
    }
  }, [])

  function ensureAudio() {
    if (audioRef.current) return audioRef.current
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    const context = new AudioContextClass()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const analyser = context.createAnalyser()
    analyser.fftSize = 2048
    analyser.smoothingTimeConstant = 0.72
    oscillator.type = 'sine'
    gain.gain.value = 0.0001
    oscillator.connect(gain).connect(analyser).connect(context.destination)
    oscillator.start()
    const bundle = { context, oscillator, gain, analyser }
    audioRef.current = bundle
    return bundle
  }

  function updateFrequency(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
    const nextFrequency = Math.round(80 + x * 880 + (1 - y) * 120)
    setFrequency(nextFrequency)
    const active = audioRef.current
    if (active) {
      active.oscillator.frequency.setTargetAtTime(nextFrequency, active.context.currentTime, 0.025)
      active.gain.gain.setTargetAtTime(0.018 + (1 - y) * 0.012, active.context.currentTime, 0.04)
    }
  }

  function startFrequency(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    ensureAudio()
    updateFrequency(event)
  }

  function stopFrequency(event: PointerEvent<HTMLDivElement>) {
    const active = audioRef.current
    if (active) {
      active.gain.gain.setTargetAtTime(0.0001, active.context.currentTime, 0.08)
    }
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  return (
    <section id="top" className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-5 sm:pb-14 sm:pt-12 md:px-8 md:pb-20 md:pt-16">
      {/* meta bar */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border pb-4">
        <span className="label-mono text-lime">{t.eyebrow}</span>
        <span className="label-mono text-muted-foreground">{t.arts}</span>
        <span className="label-mono ml-auto hidden text-muted-foreground sm:inline">{t.audience}</span>
      </div>

      {/* headline + equalizer */}
      <div className="grid gap-8 pt-10 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-10 md:pt-16">
        <Reveal>
          <p className="label-mono mb-6 text-lime/80">01 / sound identity</p>
          <h1 className="display text-balance text-[clamp(3.4rem,11vw,9rem)] font-extrabold leading-[0.82] tracking-[-0.07em] text-foreground">
            {t.title}{' '}
            <span className="text-muted-foreground">{t.titleEnd}</span>
            <span className="text-lime">.</span>
          </h1>
        </Reveal>

        <Reveal delay={120} className="min-w-0">
          <div className="carbon-surface flex h-full flex-col justify-between gap-5 border border-border p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="label-mono text-lime">{t.signal}</span>
              <span className="label-mono text-muted-foreground">{frequency} Hz</span>
            </div>
            {/* signature live equalizer */}
            <div className="flex h-24 items-end gap-1 sm:h-28" aria-hidden="true">
              {EQ_BARS.map((_, i) => (
                <span
                  key={i}
                  className="eq-bar flex-1 rounded-sm bg-lime/80"
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

      {/* wide interactive frequency console */}
      <Reveal delay={160} className="mt-10 sm:mt-14">
        <div
          role="application"
          aria-label={`${t.alt}. Drag to explore.`}
          className="carbon-panel signal-glow group relative aspect-[16/7] cursor-crosshair touch-none overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-lime"
          style={{ '--frequency': `${frequency}Hz` } as CSSProperties}
          onPointerDown={startFrequency}
          onPointerMove={(event) => { if (event.buttons) updateFrequency(event) }}
          onPointerUp={stopFrequency}
          onPointerCancel={stopFrequency}
          tabIndex={0}
        >
          <SpectrogramCanvas
            audioRef={audioRef}
            className="absolute inset-0 h-full w-full opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-background/10" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-x-0 h-px bg-lime/80 transition-[top] duration-75"
            style={{ top: markerPosition(frequency), boxShadow: '0 0 10px oklch(0.895 0.19 118 / 55%)' }}
            aria-hidden="true"
          />
          <span className="label-mono absolute left-4 top-4 rounded-sm bg-background/70 px-2 py-1 text-lime backdrop-blur-sm">{t.frequency}</span>
          <span className="label-mono absolute right-4 top-4 rounded-sm bg-background/70 px-2 py-1 text-muted-foreground backdrop-blur-sm">drag / feel</span>
          <span className="label-mono absolute bottom-4 left-4 rounded-sm bg-background/70 px-2 py-1 text-muted-foreground backdrop-blur-sm">60 / 24000 Hz</span>
          <span className="label-mono absolute bottom-4 right-4 rounded-sm bg-background/70 px-2 py-1 text-lime backdrop-blur-sm">LIVE TRANSLATION</span>
        </div>
      </Reveal>

      {/* bottom action + metrics */}
      <Reveal delay={220} className="mt-10 border-t border-border pt-8 sm:mt-14">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
          <dl className="grid grid-cols-3 gap-4 sm:gap-8">
            {[['20 Hz – 20 kHz', t.frequency], ['∞', t.titleEnd], ['2026', t.eyebrow]].map(([value, label]) => (
              <div key={value} className="border-l border-lime/40 pl-3 sm:pl-4">
                <dt className="display text-2xl font-extrabold leading-none tracking-tight text-foreground sm:text-4xl">{value}</dt>
                <dd className="label-mono mt-2 text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#kontakt" className="flex min-h-12 items-center justify-center bg-lime px-6 py-3 text-sm font-semibold text-lime-foreground transition-transform hover:-translate-y-0.5 hover:opacity-90">{t.discuss}</a>
            <a href="#analyse" className="flex min-h-12 items-center justify-center border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-lime hover:text-lime">{t.spectrum}</a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
