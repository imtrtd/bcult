'use client'

import { useEffect, useState } from 'react'
import { useLocale } from './locale-provider'
import {
  MIX_COLS,
  MIX_COPY,
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

  function toggle(id: string) {
    setMixOn((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      persist(next)
      return next
    })
  }

  function setAll(on: boolean) {
    const next = defaultMixOn(on)
    persist(next)
    setMixOn(next)
  }

  const n = countMix(mixOn)
  const total = MIX_MODULES.length

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="label-mono text-muted-foreground">{t.heading}</span>
          <p className="mt-1 text-sm text-muted-foreground">{t.hint}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-lime">
            {n} / {total}
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

      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MIX_COLS.map((groups) => (
          <div key={groups.join('-')} className="flex flex-col gap-5">
            {groups.map((group) => (
              <MixGroupBlock
                key={group}
                group={group}
                mixOn={mixOn}
                onToggle={toggle}
                locale={locale}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function MixGroupBlock({
  group,
  mixOn,
  onToggle,
  locale,
}: {
  group: MixGroup
  mixOn: Record<string, boolean>
  onToggle: (id: string) => void
  locale: 'de' | 'en' | 'ru'
}) {
  const items = MIX_MODULES.filter((m) => m.group === group)
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-block size-1.5 bg-lime" />
        <span className="label-mono text-pink">{group}</span>
      </div>
      <ul className="flex flex-col gap-1">
        {items.map((m) => {
          const on = !!mixOn[m.id]
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => onToggle(m.id)}
                className="flex w-full min-h-9 items-center gap-2.5 px-1 py-1 text-left"
                aria-pressed={on}
              >
                <span
                  className="flex size-4 shrink-0 items-center justify-center border"
                  style={{
                    borderColor: on ? '#c6ef00' : '#ff2b8a',
                    background: on ? '#c6ef00' : 'transparent',
                  }}
                >
                  {on ? (
                    <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
                      <path
                        d="M2 6.4 4.8 9.2 10 3"
                        fill="none"
                        stroke="#0d0b0e"
                        strokeWidth="2.2"
                        strokeLinecap="square"
                      />
                    </svg>
                  ) : null}
                </span>
                <span className={`text-sm leading-snug ${on ? 'text-foreground' : 'text-muted-foreground'}`}>
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
