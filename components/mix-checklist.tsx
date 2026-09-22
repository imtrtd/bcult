'use client'

import { useEffect, useState } from 'react'
import { useLocale } from './locale-provider'
import {
  MIX_COPY,
  MIX_GROUPS,
  MIX_MODULES,
  MIX_STORAGE_KEY,
  countMix,
  defaultMixOn,
  mixLabel,
  type MixGroup,
} from '@/lib/mix-modules'

function persist(mixOn: Record<string, boolean>) {
  try {
    sessionStorage.setItem(MIX_STORAGE_KEY, JSON.stringify(mixOn))
  } catch {
    /* ignore */
  }
}

export function MixChecklist() {
  const { locale } = useLocale()
  const t = MIX_COPY[locale]
  const [mixOn, setMixOn] = useState<Record<string, boolean>>(() => defaultMixOn(true))

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(MIX_STORAGE_KEY)
      if (!raw) {
        persist(defaultMixOn(true))
        return
      }
      const parsed = JSON.parse(raw) as Record<string, boolean>
      setMixOn({ ...defaultMixOn(true), ...parsed })
    } catch {
      /* keep default */
    }
  }, [])

  function apply(next: Record<string, boolean>) {
    persist(next)
    setMixOn(next)
  }

  function toggle(id: string) {
    setMixOn((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      persist(next)
      return next
    })
  }

  function toggleGroup(group: MixGroup) {
    const items = MIX_MODULES.filter((m) => m.group === group)
    setMixOn((prev) => {
      const allOn = items.every((m) => prev[m.id])
      const next = { ...prev }
      for (const m of items) next[m.id] = !allOn
      persist(next)
      return next
    })
  }

  function setAll(on: boolean) {
    apply(defaultMixOn(on))
  }

  const n = countMix(mixOn)
  const total = MIX_MODULES.length

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <span className="label-mono text-pink">{t.heading}</span>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">{t.hint}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm tabular-nums text-lime">
            {n}/{total}
          </span>
          <button
            type="button"
            onClick={() => setAll(true)}
            className="min-h-9 border border-lime/50 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-lime hover:bg-lime hover:text-lime-foreground"
          >
            {t.all}
          </button>
          <button
            type="button"
            onClick={() => setAll(false)}
            className="min-h-9 border border-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
          >
            {t.none}
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MIX_GROUPS.map((group) => (
          <MixGroupBlock
            key={group}
            group={group}
            mixOn={mixOn}
            onToggle={toggle}
            onToggleGroup={toggleGroup}
            locale={locale}
          />
        ))}
      </div>
    </div>
  )
}

function MixGroupBlock({
  group,
  mixOn,
  onToggle,
  onToggleGroup,
  locale,
}: {
  group: MixGroup
  mixOn: Record<string, boolean>
  onToggle: (id: string) => void
  onToggleGroup: (group: MixGroup) => void
  locale: 'de' | 'en' | 'ru'
}) {
  const items = MIX_MODULES.filter((m) => m.group === group)
  const onCount = items.reduce((n, m) => n + (mixOn[m.id] ? 1 : 0), 0)

  return (
    <div className="flex flex-col border border-border bg-background/40 p-3">
      <button
        type="button"
        onClick={() => onToggleGroup(group)}
        className="mb-1.5 flex min-h-8 items-center justify-between gap-2 px-0.5 text-left"
        aria-pressed={onCount === items.length}
      >
        <span className="flex items-center gap-2">
          <span className="inline-block size-1.5 bg-lime" aria-hidden />
          <span className="label-mono text-pink">{group}</span>
        </span>
        <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
          {onCount}/{items.length}
        </span>
      </button>
      <ul className="flex flex-col">
        {items.map((m) => {
          const on = !!mixOn[m.id]
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => onToggle(m.id)}
                className="flex w-full min-h-8 items-center gap-2 px-0.5 text-left"
                aria-pressed={on}
              >
                <span
                  className={`flex size-3.5 shrink-0 items-center justify-center border ${on ? 'border-lime bg-lime' : 'border-pink/60 bg-transparent'}`}
                >
                  {on ? (
                    <svg viewBox="0 0 12 12" className="size-2.5" aria-hidden>
                      <path
                        d="M2 6.4 4.8 9.2 10 3"
                        fill="none"
                        stroke="currentColor"
                        className="text-lime-foreground"
                        strokeWidth="2.2"
                        strokeLinecap="square"
                      />
                    </svg>
                  ) : null}
                </span>
                <span className={`text-[13px] leading-snug ${on ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {mixLabel(m, locale)}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
