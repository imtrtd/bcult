'use client'

import { CONTACT_EMAIL } from '@/lib/site'
import { useLocale, type Locale } from './locale-provider'

type Offer = {
  kicker: string
  title: string
  audience: string
  lead: string
  intro: string
  forWhom: string
  people: [string, string][]
  tiersTitle: string
  rule: string
  headers: [string, string, string]
  rows: [string, string, string, string][]
  mixTitle: string
  mix: string
  startTitle: string
  steps: string[]
  cta: string
  note: string
}

const COPY: Record<Locale, Offer> = {
  de: {
    kicker: 'Angebot · September 2026',
    title: 'Für Musiker:innen, Artist:innen und Bands.',
    audience: 'Listenpreise',
    lead: 'Wir machen Klang sichtbar.',
    intro: 'Ihr habt den Sound. Wir geben ihm ein Zeichen, einen Release oder eine Hülle, die man wiedererkennt. Kein Manifest — ein System, das zum Stand des Projekts passt.',
    forWhom: 'Für wen',
    people: [
      ['Musiker:in', 'Solo. Tracks liegen schon irgendwo, der Name trägt noch nicht. Du brauchst ein Zeichen, bevor der nächste Release rausgeht.'],
      ['Artist:in', 'Bild und Sound sollen dasselbe sagen. Cover, Raster und Auftritt kommen aus einer Frequenz, nicht aus drei Ästhetiken.'],
      ['Band', 'Mehrere Leute, ein Name. Dates, Kollaborationen und ein Eingang, den man einer Booking-Anfrage schicken kann.'],
    ],
    tiersTitle: 'Drei Stufen, ein Mix.',
    rule: 'Neue Anfragen laufen zum Listenpreis. Focus nur gegen Anzahlung und wenn das Projekt als Case gezeigt werden darf. Dateien nach der Restzahlung. Zwei Korrekturrunden inklusive.',
    headers: ['MARK', 'RELEASE', 'SYSTEM'],
    rows: [
      ['Für wen', 'Sound da, Zeichen fehlt', 'Tracks draußen, Auftritt noch roh', 'Output läuft, Hülle fehlt'],
      ['Listenpreis', '360 €', '850 €', '2 200 €'],
      ['Focus / Case', '280 €', '650 €', '1 600 €'],
      ['Anzahlung', '120 €', '250 €', '500 €'],
      ['Laufzeit', '7–10 Tage', '10–14 Tage', '3–5 Wochen'],
      ['Enthalten', 'Logo, eine Richtung. Zwei Farben, ein Schriftpaar. Avatar und Social Cover. Eine Seite: so nutzt du es.', 'Cover und Quadrat fürs Streaming. Drei bis fünf Teile Raster. Mini-Site oder Portfolio. Logo bleibt, wenn es trägt.', 'Audit: was bleibt, was weicht. Site mit Releases, Dates, People, Kontakt. Eingang für Kollaborationen. Cover-Serie und Presskit.'],
    ],
    mixTitle: 'MIX',
    mix: 'Wenn keine Stufe passt, stellt ihr das Paket selbst zusammen: Logo, Cover, Site, Raster, Presskit, Strategie. Der Preis kommt aus dem Brief, nicht aus einem Rechner.',
    startTitle: 'So geht es los',
    steps: [
      'Schreibt, was ihr schafft: Name, Link zu ein, zwei Tracks, welches Paket. Antwort innerhalb von 24 Stunden.',
      'Wir bestätigen Scope, Preis und Anzahlung. Focus nur, wenn ihr als Case sichtbar sein wollt.',
      'Nach der Restzahlung bekommt ihr die Dateien. Zwei Korrekturrunden sind drin.',
    ],
    cta: 'Angebot anfragen →',
    note: 'Das Angebot gilt für neue Anfragen zum Listenpreis. Es ist kein Vertrag. Scope und Zahlung stehen im Brief, den wir vor dem Start schicken.',
  },
  en: {
    kicker: 'Offer · September 2026',
    title: 'For musicians, artists and bands.',
    audience: 'List prices',
    lead: 'We make sound visible.',
    intro: 'You have the sound. We give it a mark, a release or a shell people can recognise. Not a manifesto — a system that matches where the project is.',
    forWhom: 'Who it is for',
    people: [
      ['Musician', 'Solo. The tracks already exist, the name does not carry yet. You need a mark before the next release goes out.'],
      ['Artist', 'Image and sound should say the same thing. Cover, grid and presence come from one frequency, not three aesthetics.'],
      ['Band', 'Several people, one name. Dates, collaborations and a door you can send with a booking enquiry.'],
    ],
    tiersTitle: 'Three tiers, one mix.',
    rule: 'New enquiries run at list price. Focus applies only with a deposit and if the project may be shown as a case. Files after the balance. Two revision rounds included.',
    headers: ['MARK', 'RELEASE', 'SYSTEM'],
    rows: [
      ['For whom', 'Sound exists, no mark yet', 'Tracks are out, the presence is still rough', 'Output is regular, the shell is missing'],
      ['List price', '360 €', '850 €', '2 200 €'],
      ['Focus / case', '280 €', '650 €', '1 600 €'],
      ['Deposit', '120 €', '250 €', '500 €'],
      ['Timeline', '7–10 days', '10–14 days', '3–5 weeks'],
      ['Included', 'Logo, one direction. Two colours, one type pair. Avatar and social cover. One page on how to use it.', 'Cover and streaming square. Three to five grid pieces. Mini-site or portfolio. The logo stays if it holds.', 'Audit: what stays, what steps back. Site with releases, dates, people, contact. A door for collaborations. Cover series and press kit.'],
    ],
    mixTitle: 'MIX',
    mix: 'If no tier fits, you assemble the package: logo, cover, site, grid, press kit, strategy. The price comes from the brief, not from a calculator.',
    startTitle: 'How it starts',
    steps: [
      'Write what you make: name, a link to one or two tracks, which package. We reply within 24 hours.',
      'We confirm scope, price and deposit. Focus only if you want to be visible as a case.',
      'You receive the files after the balance. Two revision rounds are included.',
    ],
    cta: 'Request this offer →',
    note: 'This offer is for new enquiries at list price. It is not a contract. Scope and payment are set in the brief we send before we start.',
  },
  ru: {
    kicker: 'Предложение · сентябрь 2026',
    title: 'Для музыкантов, артистов и групп.',
    audience: 'Прайс',
    lead: 'Мы делаем звук видимым.',
    intro: 'Звук у вас уже есть. Мы даём ему знак, релиз или оболочку, по которой вас узнают. Не манифест — система под то, на каком этапе проект.',
    forWhom: 'Для кого',
    people: [
      ['Музыкант', 'Соло. Треки уже где-то лежат, имя ещё не держит. Нужен знак до следующего релиза.'],
      ['Артист', 'Картинка и звук должны говорить одно и то же. Обложка, сетка и выход — из одной частоты, не из трёх эстетик.'],
      ['Группа', 'Несколько людей, одно имя. Даты, коллаборации и вход, который можно приложить к заявке на букинг.'],
    ],
    tiersTitle: 'Три ступени и сборная.',
    rule: 'Новые заявки идут по прайсу. Фокус-цена только при взносе и если проект можно показать как кейс. Файлы после остатка. Два раунда правок входят.',
    headers: ['MARK', 'RELEASE', 'SYSTEM'],
    rows: [
      ['Для кого', 'Звук есть, знака нет', 'Треки снаружи, образ ещё сырой', 'Выпуск идёт, оболочки нет'],
      ['Прайс', '360 €', '850 €', '2 200 €'],
      ['Фокус / кейс', '280 €', '650 €', '1 600 €'],
      ['Взнос', '120 €', '250 €', '500 €'],
      ['Срок', '7–10 дней', '10–14 дней', '3–5 недель'],
      ['Входит', 'Лого, одно направление. Два цвета, пара шрифтов. Аватар и обложка. Одна страница: как этим пользоваться.', 'Обложка и квадрат для стриминга. Три–пять частей сетки. Мини-сайт или портфолио. Живое лого оставляем, если оно держит.', 'Аудит: что остаётся, что отходит. Сайт: релизы, даты, люди, контакт. Вход для коллабораций. Серия обложек и пресс-кит.'],
    ],
    mixTitle: 'MIX',
    mix: 'Если ни одна ступень не подходит, пакет собирается сам: лого, обложка, сайт, сетка, пресс-кит, стратегия. Цена из брифа, не из калькулятора.',
    startTitle: 'Как начать',
    steps: [
      'Напишите, что вы делаете: имя, ссылка на один-два трека, какой пакет. Ответ в течение 24 часов.',
      'Мы подтверждаем объём, цену и взнос. Фокус — только если хотите быть кейсом.',
      'Файлы после остатка. Два раунда правок входят.',
    ],
    cta: 'Запросить предложение →',
    note: 'Предложение для новых заявок по прайсу. Это не договор. Объём и оплата фиксируются в брифе до старта.',
  },
}

export function AngebotView() {
  const { locale } = useLocale()
  const t = COPY[locale]
  return (
    <article className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-16 md:px-8 md:py-20">
      <p className="label-mono text-pink">{t.kicker}</p>
      <h1 className="display mt-4 max-w-4xl text-pretty text-4xl font-bold text-foreground sm:text-6xl">{t.title}</h1>
      <p className="label-mono mt-4 text-muted-foreground">{t.audience}</p>
      <p className="mt-8 max-w-2xl text-2xl font-semibold text-foreground">{t.lead}</p>
      <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">{t.intro}</p>
      <h2 className="mt-14 text-2xl font-bold text-foreground">{t.forWhom}</h2>
      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        {t.people.map(([name, body]) => (
          <section key={name} className="carbon-panel flex flex-col gap-3 p-5">
            <h3 className="text-lg font-semibold text-pink">{name}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
          </section>
        ))}
      </div>
      <h2 className="mt-14 text-2xl font-bold text-foreground">{t.tiersTitle}</h2>
      <p className="mt-4 max-w-3xl text-pretty leading-relaxed text-muted-foreground">{t.rule}</p>
      <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {t.headers.map((name, index) => (
          <section key={name} className="carbon-panel flex flex-col gap-4 border-pink/30 p-5">
            <h3 className="font-display text-3xl font-bold text-foreground">{name}</h3>
            {t.rows.map(([label, a, b, c]) => {
              const value = [a, b, c][index]
              const price = label === t.rows[1][0]
              return (
                <p key={label} className="text-sm leading-relaxed">
                  <span className="label-mono text-muted-foreground">{label}</span>
                  <span className={`mt-1 block ${price ? 'font-display text-4xl font-bold text-lime' : 'text-foreground'}`}>{value}</span>
                </p>
              )
            })}
          </section>
        ))}
      </div>
      <h2 className="mt-14 text-2xl font-bold text-foreground">{t.mixTitle}</h2>
      <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{t.mix}</p>
      <h2 className="mt-14 text-2xl font-bold text-foreground">{t.startTitle}</h2>
      <ol className="mt-4 flex max-w-3xl flex-col gap-3">
        {t.steps.map((step, index) => (
          <li key={step} className="flex gap-3 text-sm leading-relaxed text-foreground">
            <span className="font-semibold text-pink">{index + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <a href="/#kontakt" className="mt-8 inline-flex min-h-12 items-center bg-lime px-6 py-3 text-sm font-semibold text-lime-foreground hover:bg-foreground">{t.cta}</a>
      <p className="mt-4 text-sm text-foreground">
        <a className="underline decoration-pink underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">{t.note}</p>
    </article>
  )
}
