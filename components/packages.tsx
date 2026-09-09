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
  custom?: boolean
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
    customCta: string
    customPriceLabel: string
    items: PackageItem[]
  }
> = {
  de: {
    label: '[ Pakete ]',
    title: 'Drei Stufen, ein Mix.',
    intro:
      'Drei fertige Pakete nach Reichweite und Volumen — vom ersten Zeichen bis zur arbeitenden Hülle. Plus MIX: die Sammelplatte für individuelle Briefs. Neue Anfragen laufen zum Listenpreis. Die Focus-Kohorte bleibt 60 Tage offen.',
    note: 'Variante C: Focus-Preis nur gegen Anzahlung und als Case. Dateien nach Restzahlung. Zwei Korrekturrunden inklusive. MIX wird nach Brief kalkuliert — Modul für Modul.',
    listLabel: 'Listenpreis',
    focusLabel: 'Focus / Case',
    depositLabel: 'Anzahlung',
    timeLabel: 'Laufzeit',
    includesLabel: 'Enthalten',
    cta: 'Paket anfragen →',
    customCta: 'MIX anfragen →',
    customPriceLabel: 'Kalkulation',
    items: [
      {
        code: '01 · MARK',
        name: 'MARK',
        tag: 'Ohne Namen',
        who: 'Artists ohne Namen und Gesicht: kein Logo, kein Raster, kein wiedererkennbares Projekt.',
        promise: 'Dich kann man nennen und erkennen — bevor der erste große Release kommt.',
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
        tag: 'Wenig bekannt',
        who: 'Wenig bekannte Artists mit Tracks auf SoundCloud oder Spotify, Instagram und grobem Portfolio.',
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
        tag: 'Im Aufwind',
        who: 'Artists, die anziehen oder schon ± bekannt sind: starke Cover, täglicher Output — tote Site, kein Eingang für Kollabs.',
        promise: 'Nicht das schönere Bild. Die arbeitende Hülle eines Projekts, das wächst.',
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
      {
        code: '04 · MIX',
        name: 'MIX',
        tag: 'Sammelplatte',
        who: 'Individueller Auftrag: du brauchst keine fertige Stufe, sondern eine eigene Zusammenstellung.',
        promise: 'Baue dein Paket Modul für Modul — Logo, Cover, Site, Raster, Presskit, Strategie.',
        price: 'auf Anfrage',
        focus: 'Brief → Quote',
        deposit: 'nach Umfang',
        time: 'nach Brief',
        includes: [
          'Module aus MARK / RELEASE / SYSTEM frei kombinieren',
          'Nur das, was der Brief wirklich braucht',
          'Klarer Scope und Preis vor dem Start',
          'Zwei Korrekturrunden wie bei den Festpaketen',
        ],
        custom: true,
      },
    ],
  },
  en: {
    label: '[ Packages ]',
    title: 'Three tiers, one mix.',
    intro:
      'Three finished packages by reach and volume — from the first mark to a working shell. Plus MIX: the pick-and-mix for custom briefs. New briefs run at list price. The focus cohort stays open for 60 days.',
    note: 'Option C: focus price only against a deposit and as a case. Files after the balance. Two revision rounds included. MIX is quoted from the brief — module by module.',
    listLabel: 'List price',
    focusLabel: 'Focus / case',
    depositLabel: 'Deposit',
    timeLabel: 'Timeline',
    includesLabel: 'Included',
    cta: 'Request this package →',
    customCta: 'Request MIX →',
    customPriceLabel: 'Quote',
    items: [
      {
        code: '01 · MARK',
        name: 'MARK',
        tag: 'No name yet',
        who: 'Artists without a name or face: no logo, no grid, nothing people can recognise.',
        promise: 'You can be named and recognised — before the first big release.',
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
        tag: 'Little-known',
        who: 'Lesser-known artists with tracks on SoundCloud or Spotify, Instagram, and a rough portfolio.',
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
        tag: 'Rising / known',
        who: 'Artists gaining traction or already ± known: strong covers, daily output — dead site, no door for collabs.',
        promise: 'Not a prettier image. A working shell for a project that is growing.',
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
      {
        code: '04 · MIX',
        name: 'MIX',
        tag: 'Pick & mix',
        who: 'Custom order: you do not need a fixed tier — you need your own combination.',
        promise: 'Build the package module by module — logo, cover, site, grid, press kit, strategy.',
        price: 'on request',
        focus: 'brief → quote',
        deposit: 'by scope',
        time: 'per brief',
        includes: [
          'Combine modules from MARK / RELEASE / SYSTEM',
          'Only what the brief actually needs',
          'Clear scope and price before kickoff',
          'Two revision rounds, same as fixed packages',
        ],
        custom: true,
      },
    ],
  },
  ru: {
    label: '[ Пакеты ]',
    title: 'Три ступени и сборная.',
    intro:
      'Три готовых комплекса по возрастанию цены и объёма — под разные фокус-группы и задачи. Плюс «сборная солянка» под индивидуальный заказ. Новые заявки — по прайсу. Фокус-когорта открыта 60 дней.',
    note: 'Вариант C: фокус-цена только со взносом и как кейс. Файлы после остатка. Два раунда правок входят. MIX / сборная считается по брифу — модуль за модулем.',
    listLabel: 'Прайс',
    focusLabel: 'Фокус / кейс',
    depositLabel: 'Взнос',
    timeLabel: 'Срок',
    includesLabel: 'Входит',
    cta: 'Запросить пакет →',
    customCta: 'Собрать солянку →',
    customPriceLabel: 'Оценка',
    items: [
      {
        code: '01 · MARK',
        name: 'MARK',
        tag: 'Без имени',
        who: 'Артисты без имени: нет знака, нет сетки, нет лица проекта — тебя пока не узнать.',
        promise: 'Тебя можно назвать и узнать — ещё до первого крупного релиза.',
        price: '360 €',
        focus: '280 €',
        deposit: '120 €',
        time: '7–10 дней',
        includes: [
          'Лого: одно направление, один финал',
          'Короткий код: 2 цвета, 1 пара шрифтов',
          'Аватар + обложка соцсети',
          'Гайд на 1 страницу: как этим пользоваться',
        ],
      },
      {
        code: '02 · RELEASE',
        name: 'RELEASE',
        tag: 'Малоизвестные',
        who: 'Малоизвестные артисты: треки на SoundCloud или Spotify, Instagram, черновое портфолио.',
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
        tag: 'Набирают ход',
        who: 'Артисты, которые набирают популярность или уже ± известны: сильные обложки, регулярный выпуск — мёртвый сайт, нет входа в коллабы.',
        promise: 'Не красивее картинка. Рабочая оболочка проекта, который растёт.',
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
      {
        code: '04 · MIX',
        name: 'MIX',
        tag: 'Сборная солянка',
        who: 'Индивидуальный заказ: готовая ступень не подходит — нужна своя сборка под задачу.',
        promise: 'Собери пакет модуль за модулем — лого, обложка, сайт, сетка, пресс-кит, стратегия.',
        price: 'по запросу',
        focus: 'бриф → оценка',
        deposit: 'по объёму',
        time: 'по брифу',
        includes: [
          'Модули из MARK / RELEASE / SYSTEM в любой комбинации',
          'Только то, что реально нужно по брифу',
          'Понятный scope и цена до старта',
          'Два раунда правок — как в фиксированных пакетах',
        ],
        custom: true,
      },
    ],
  },
}

export function Packages() {
  const { locale } = useLocale()
  const t = copy[locale]
  const tiers = t.items.filter((item) => !item.custom)
  const custom = t.items.find((item) => item.custom)

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
          {tiers.map((item, i) => (
            <Reveal key={item.name} delay={i * 80}>
              <PackageCard item={item} labels={t} cta={t.cta} />
            </Reveal>
          ))}
        </div>

        {custom ? (
          <Reveal delay={280}>
            <div className="mt-3">
              <PackageCard item={custom} labels={t} cta={t.customCta} wide />
            </div>
          </Reveal>
        ) : null}

        <Reveal delay={320}>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">{t.note}</p>
        </Reveal>
      </div>
    </section>
  )
}

function PackageCard({
  item,
  labels,
  cta,
  wide = false,
}: {
  item: PackageItem
  labels: {
    listLabel: string
    focusLabel: string
    depositLabel: string
    timeLabel: string
    includesLabel: string
    customPriceLabel: string
  }
  cta: string
  wide?: boolean
}) {
  const priceLabel = item.custom ? labels.customPriceLabel : labels.listLabel

  return (
    <article
      className={`carbon-panel flex min-h-full flex-col gap-5 border-pink/30 p-5 transition-colors hover:border-pink sm:p-6 ${
        wide ? 'lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-10' : ''
      } ${item.custom ? 'border-lime/35 hover:border-lime' : ''}`}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <span className="label-mono text-muted-foreground">{item.code}</span>
          <span
            className={`label-mono border px-2 py-1 ${
              item.custom ? 'border-lime/50 text-lime' : 'border-lime/40 text-lime'
            }`}
          >
            {item.tag}
          </span>
        </div>
        <div>
          <h3 className="font-display text-3xl font-bold tracking-tight text-foreground">{item.name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.who}</p>
          <p className="mt-2 text-base leading-snug text-foreground">{item.promise}</p>
        </div>
        <div className={`grid gap-3 border-y border-border py-4 ${wide ? 'sm:grid-cols-4' : 'grid-cols-2'}`}>
          <PriceCell label={priceLabel} value={item.price} accent />
          <PriceCell label={labels.focusLabel} value={item.focus} />
          <PriceCell label={labels.depositLabel} value={item.deposit} />
          <PriceCell label={labels.timeLabel} value={item.time} />
        </div>
      </div>

      <div className="flex min-h-full flex-col gap-5">
        <div>
          <span className="label-mono text-muted-foreground">{labels.includesLabel}</span>
          <ul className={`mt-3 flex flex-col gap-2 ${wide ? 'sm:grid sm:grid-cols-2 sm:gap-x-6' : ''}`}>
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
          className={`mt-auto inline-flex min-h-11 items-center justify-center px-4 py-2 text-sm font-semibold transition-colors ${
            item.custom
              ? 'border border-lime bg-transparent text-lime hover:bg-lime hover:text-lime-foreground'
              : 'bg-lime text-lime-foreground hover:bg-foreground'
          }`}
        >
          {cta}
        </a>
      </div>
    </article>
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
