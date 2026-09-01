'use client'

import { useLocale, type Locale } from './locale-provider'
import { Reveal } from './reveal'

type PackageItem = {
  code: string
  name: string
  tag: string
  who: string
  promise: string
  price: string
  focus: string
  deposit: string
  time: string
  includes: string[]
}

const copy: Record<
  Locale,
  {
    label: string
    title: string
    intro: string
    note: string
    listLabel: string
    focusLabel: string
    depositLabel: string
    timeLabel: string
    includesLabel: string
    cta: string
    items: PackageItem[]
  }
> = {
  de: {
    label: '[ Pakete ]',
    title: 'Drei Signale, drei Tiefen.',
    intro:
      'Keine endlose Liste. Drei fertige Pakete — vom ersten Zeichen bis zur arbeitenden Hülle eines Labels. Neue Anfragen laufen zum Listenpreis. Die Focus-Kohorte bleibt 60 Tage offen.',
    note: 'Variante C: Focus-Preis nur gegen Anzahlung und als Case. Dateien nach Restzahlung. Zwei Korrekturrunden inklusive.',
    listLabel: 'Listenpreis',
    focusLabel: 'Focus / Case',
    depositLabel: 'Anzahlung',
    timeLabel: 'Laufzeit',
    includesLabel: 'Enthalten',
    cta: 'Paket anfragen →',
    items: [
      {
        code: '01 · MARK',
        name: 'MARK',
        tag: 'Start',
        who: 'Artist oder DJ ohne Zeichen, ohne Raster, ohne Gesicht des Projekts.',
        promise: 'Dich kann man nennen und erkennen.',
        price: '360 €',
        focus: '280 €',
        deposit: '120 €',
        time: '7–10 Tage',
        includes: [
          'Logo: eine Richtung, ein Finale',
          'Kurzer Code: 2 Farben, 1 Schriftpaar',
          'Avatar + Social Cover',
          '1-Seiten-Guide: so nutzt du es',
        ],
      },
      {
        code: '02 · RELEASE',
        name: 'RELEASE',
        tag: 'Katalog',
        who: 'Tracks auf SoundCloud oder Spotify, Instagram, grobes Portfolio. Der große Teil des Marktes.',
        promise: 'Der Release sieht aus wie ein Release — nicht wie eine Story vom Handy.',
        price: '850 €',
        focus: '650 €',
        deposit: '250 €',
        time: '10–14 Tage',
        includes: [
          'Cover + Quadrat für Streaming',
          '3–5 Teile Raster: Post, Story, Promo',
          'Mini-Site oder Portfolio-Seite',
          'Bestehendes Logo bleibt, wenn es trägt',
        ],
      },
      {
        code: '03 · SYSTEM',
        name: 'SYSTEM',
        tag: 'Label / Pro',
        who: 'Jahre im Spiel, täglicher Umsatz, starke Cover — tote Site, kein Eingang für Kollabs.',
        promise: 'Nicht das schönere Bild. Die arbeitende Hülle des Projekts.',
        price: '2 200 €',
        focus: '1 600 €',
        deposit: '500 €',
        time: '3–5 Wochen',
        includes: [
          'Audit: was bleibt, was stirbt',
          'Site: Releases, Dates, People, Kontakt',
          'Kollab-Block: wer, wie, Rahmen',
          'Cover-System für eine Serie + Presskit',
        ],
      },
    ],
  },
  en: {
    label: '[ Packages ]',
    title: 'Three signals, three depths.',
    intro:
      'Not an endless menu. Three finished packages — from the first mark to a working shell for a label. New briefs run at list price. The focus cohort stays open for 60 days.',
    note: 'Option C: focus price only against a deposit and as a case. Files after the balance. Two revision rounds included.',
    listLabel: 'List price',
    focusLabel: 'Focus / case',
    depositLabel: 'Deposit',
    timeLabel: 'Timeline',
    includesLabel: 'Included',
    cta: 'Request this package →',
    items: [
      {
        code: '01 · MARK',
        name: 'MARK',
        tag: 'Start',
        who: 'Artist or DJ with no mark, no grid, no face for the project.',
        promise: 'You can be named and recognised.',
        price: '360 €',
        focus: '280 €',
        deposit: '120 €',
        time: '7–10 days',
        includes: [
          'Logo: one direction, one final',
          'Short code: 2 colours, 1 type pair',
          'Avatar + social cover',
          'One-page guide: how to use it',
        ],
      },
      {
        code: '02 · RELEASE',
        name: 'RELEASE',
        tag: 'Catalogue',
        who: 'Tracks on SoundCloud or Spotify, Instagram, a rough portfolio. Most of the market.',
        promise: 'The release looks like a release — not a phone story.',
        price: '850 €',
        focus: '650 €',
        deposit: '250 €',
        time: '10–14 days',
        includes: [
          'Cover + streaming square',
          '3–5 grid pieces: post, story, promo',
          'Mini-site or portfolio page',
          'Existing logo stays if it still holds',
        ],
      },
      {
        code: '03 · SYSTEM',
        name: 'SYSTEM',
        tag: 'Label / Pro',
        who: 'Years in, daily income, strong covers — dead site, no door for collabs.',
        promise: 'Not a prettier image. A working shell for the project.',
        price: '2 200 €',
        focus: '1 600 €',
        deposit: '500 €',
        time: '3–5 weeks',
        includes: [
          'Audit: what stays, what dies',
          'Site: releases, dates, people, contact',
          'Collab block: who, how, frame',
          'Cover system for a series + press kit',
        ],
      },
    ],
  },
  ru: {
    label: '[ Пакеты ]',
    title: 'Три сигнала, три глубины.',
    intro:
      'Не бесконечное меню. Три готовых пакета — от первого знака до рабочей оболочки лейбла. Новые заявки — по прайсу. Фокус-когорта открыта 60 дней.',
    note: 'Вариант C: фокус-цена только со взносом и как кейс. Файлы после остатка. Два раунда правок входят.',
    listLabel: 'Прайс',
    focusLabel: 'Фокус / кейс',
    depositLabel: 'Взнос',
    timeLabel: 'Срок',
    includesLabel: 'Входит',
    cta: 'Запросить пакет →',
    items: [
      {
        code: '01 · MARK',
        name: 'MARK',
        tag: 'Старт',
        who: 'Артист или диджей без знака, без сетки, без лица проекта.',
        promise: 'Тебя можно назвать и узнать.',
        price: '360 €',
        focus: '280 €',
        deposit: '120 €',
        time: '7–10 дней',
        includes: [
          'Лого: одна направление, один финал',
          'Короткий код: 2 цвета, 1 пара шрифтов',
          'Аватар + обложка соцсети',
          'Гайд на 1 страницу: как этим пользоваться',
        ],
      },
      {
        code: '02 · RELEASE',
        name: 'RELEASE',
        tag: 'Каталог',
        who: 'Треки на SoundCloud или Spotify, Instagram, черновое портфолио. Большая часть рынка.',
        promise: 'Релиз выглядит как релиз, а не как сторис с телефона.',
        price: '850 €',
        focus: '650 €',
        deposit: '250 €',
        time: '10–14 дней',
        includes: [
          'Обложка + квадрат под стриминг',
          '3–5 единиц сетки: пост, сторис, промо',
          'Мини-сайт или страница-портфолио',
          'Живое лого не пересобираем с нуля',
        ],
      },
      {
        code: '03 · SYSTEM',
        name: 'SYSTEM',
        tag: 'Лейбл / Про',
        who: 'Годы в деле, ежедневный заработок, сильные обложки — мёртвый сайт, нет входа в коллабы.',
        promise: 'Не красивее картинка. Рабочая оболочка проекта.',
        price: '2 200 €',
        focus: '1 600 €',
        deposit: '500 €',
        time: '3–5 недель',
        includes: [
          'Аудит: что оставить, что убрать',
          'Сайт: релизы, даты, люди, контакт',
          'Блок коллабораций: кто, как, рамка',
          'Система обложек на серию + пресс-кит',
        ],
      },
    ],
  },
}

export function Packages() {
  const { locale } = useLocale()
  const t = copy[locale]

  return (
    <section id="pakete" aria-labelledby="pakete-heading" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-16 md:px-8 md:py-24">
        <Reveal>
          <div className="flex flex-col gap-4">
            <span className="label-mono text-pink">{t.label}</span>
            <h2 id="pakete-heading" className="display max-w-3xl text-pretty text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
              {t.title}
            </h2>
            <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">{t.intro}</p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {t.items.map((item, i) => (
            <Reveal key={item.name} delay={i * 80}>
              <article className="carbon-panel flex min-h-full flex-col gap-5 border-pink/30 p-5 transition-colors hover:border-pink sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="label-mono text-muted-foreground">{item.code}</span>
                  <span className="label-mono border border-lime/40 px-2 py-1 text-lime">{item.tag}</span>
                </div>
                <div>
                  <h3 className="font-display text-3xl font-bold tracking-tight text-foreground">{item.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.who}</p>
                  <p className="mt-2 text-base leading-snug text-foreground">{item.promise}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 border-y border-border py-4">
                  <PriceCell label={t.listLabel} value={item.price} accent />
                  <PriceCell label={t.focusLabel} value={item.focus} />
                  <PriceCell label={t.depositLabel} value={item.deposit} />
                  <PriceCell label={t.timeLabel} value={item.time} />
                </div>
                <div>
                  <span className="label-mono text-muted-foreground">{t.includesLabel}</span>
                  <ul className="mt-3 flex flex-col gap-2">
                    {item.includes.map((line) => (
                      <li key={line} className="text-sm leading-relaxed text-foreground">
                        <span className="mr-2 text-lime">→</span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={`#kontakt`}
                  className="mt-auto inline-flex min-h-11 items-center justify-center bg-lime px-4 py-2 text-sm font-semibold text-lime-foreground transition-colors hover:bg-foreground"
                >
                  {t.cta}
                </a>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={240}>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">{t.note}</p>
        </Reveal>
      </div>
    </section>
  )
}

function PriceCell({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="label-mono text-muted-foreground">{label}</span>
      <span className={`font-display text-xl font-bold ${accent ? 'text-lime' : 'text-foreground'}`}>{value}</span>
    </div>
  )
}
