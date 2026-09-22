'use client'

import { CONTACT_EMAIL } from '@/lib/site'
import { useLocale, type Locale } from './locale-provider'

type Person = { name: string; line: string; brings: string; leaves: string }
type Tier = { code: string; who: string; price: string; focus: string; deposit: string; time: string; point: string; items: string[] }
type Offer = {
  kicker: string
  title: string
  lead: string
  intro: string
  outcomes: [string, string][]
  forWhom: string
  brings: string
  leaves: string
  people: Person[]
  tiersTitle: string
  rule: string
  cols: { who: string; price: string; focus: string; deposit: string; time: string; in: string }
  tiers: Tier[]
  mixTitle: string
  mix: string
  groups: [string, string][]
  focusTitle: string
  focusBody: string
  startTitle: string
  steps: [string, string][]
  letterTitle: string
  letter: string[]
  cta: string
  note: string
}

const COPY: Record<Locale, Offer> = {
  de: {
    kicker: 'Angebot · September 2026',
    title: 'Für Musiker:innen, Artist:innen und Bands.',
    lead: 'Wir machen Klang sichtbar.',
    intro: 'Ihr habt den Sound. Wir geben ihm ein Zeichen, einen Release oder eine Hülle, die man wiedererkennt. Kein Manifest — ein System, das zum Stand des Projekts passt.',
    outcomes: [
      ['01 Zeichen', 'Name, zwei Farben, ein Schriftpaar. Man kann euch nennen, bevor der große Release kommt.'],
      ['02 Release', 'Cover, Quadrat, Raster. Es sieht aus wie eine Veröffentlichung, nicht wie eine Story vom Handy.'],
      ['03 Hülle', 'Site, Dates, Kontakt und ein Eingang für Kollaborationen. Das Projekt hat eine Tür.'],
    ],
    forWhom: 'Drei Ausgangslagen',
    brings: 'Kommt mit',
    leaves: 'Geht mit',
    people: [
      { name: 'Musiker:in', line: 'Solo. Der Track existiert, das Zeichen noch nicht.', brings: 'Aufnahmen, ein vorläufiger Name, oft noch kein Logo.', leaves: 'Eine Richtung Logo, Farben, Schrift, Avatar, Social Cover und eine Seite, wie ihr es benutzt.' },
      { name: 'Artist:in', line: 'Bild und Sound sollen endlich dasselbe sagen.', brings: 'Einen Klang und eine Bildwelt, die noch nicht zusammengehören.', leaves: 'Cover und Raster aus einer Frequenz, plus eine Fläche, die den Auftritt trägt.' },
      { name: 'Band', line: 'Mehrere Leute, ein Name, der nach außen noch auseinanderfällt.', brings: 'Gemeinsame Tracks, verschiedene Profile, Dates ohne einen gemeinsamen Eingang.', leaves: 'Einen Auftritt für alle, Dates und einen Link, den man an eine Booking-Mail hängen kann.' },
    ],
    tiersTitle: 'Drei Stufen, ein Mix.',
    rule: 'Neue Anfragen laufen zum Listenpreis. Focus ist derselbe Umfang, nur gegen Anzahlung und wenn das Projekt als Case gezeigt werden darf. Dateien nach der Restzahlung. Zwei Korrekturrunden inklusive.',
    cols: { who: 'Für wen', price: 'Listenpreis', focus: 'Focus / Case', deposit: 'Anzahlung', time: 'Laufzeit', in: 'Enthalten' },
    tiers: [
      { code: 'MARK', who: 'Sound da, Zeichen fehlt', price: '360 €', focus: '280 €', deposit: '120 €', time: '7–10 Tage', point: 'Der erste Satz, mit dem man euch nennen kann.', items: ['Logo: eine Richtung, ein Finale', 'Zwei Farben, ein Schriftpaar', 'Avatar und Social Cover', 'Eine Seite: so nutzt du es'] },
      { code: 'RELEASE', who: 'Tracks draußen, Auftritt noch roh', price: '850 €', focus: '650 €', deposit: '250 €', time: '10–14 Tage', point: 'Der Track bekommt ein Gesicht, das im Stream und im Feed dasselbe ist.', items: ['Cover und Quadrat fürs Streaming', 'Drei bis fünf Teile Raster', 'Mini-Site oder Portfolio', 'Logo bleibt, wenn es trägt'] },
      { code: 'SYSTEM', who: 'Output läuft, Hülle fehlt', price: '2 200 €', focus: '1 600 €', deposit: '500 €', time: '3–5 Wochen', point: 'Nicht das schönere Bild. Die Tür für Dates, Leute und Kollabs.', items: ['Audit: was bleibt, was weicht', 'Site: Releases, Dates, People, Kontakt', 'Eingang für Kollaborationen', 'Cover-Serie und Presskit'] },
    ],
    mixTitle: 'MIX, wenn keine Stufe passt',
    mix: 'Ihr stellt selbst zusammen. Der Preis kommt aus dem Brief, nicht aus einem Rechner. Anzahlung und Laufzeit richten sich nach dem Umfang.',
    groups: [
      ['Zeichen', 'Logo, Wortmarke, zwei Farben, ein Schriftpaar, Avatar'],
      ['Release', 'Single-Cover, Stream-Quadrat, Serie, Bühnenvisual'],
      ['Fläche', 'Mini-Site, Releases, Dates, People, Kontakt, Kollab-Block'],
      ['Außen', 'Feed-Raster, Story-Vorlagen, Presskit, Tonalität'],
    ],
    focusTitle: 'Wann Focus Sinn hat',
    focusBody: 'Ihr wollt denselben Umfang günstiger und seid einverstanden, dass die Arbeit als Case sichtbar wird. Ohne dieses Einverständnis und ohne Anzahlung bleibt es beim Listenpreis. Zwei Runden sind in beiden Fällen drin.',
    startTitle: 'Drei Bewegungen',
    steps: [
      ['Schreiben', 'Name, Solo oder Band, ein oder zwei Links, gewünschte Stufe. Antwort innerhalb von 24 Stunden.'],
      ['Bestätigen', 'Wir schicken Scope, Preis und Anzahlung. Focus nur, wenn ihr als Case sichtbar sein wollt.'],
      ['Liefern', 'Nach der Restzahlung die Dateien. Zwei Korrekturrunden sind inklusive.'],
    ],
    letterTitle: 'Was in die erste Nachricht gehört',
    letter: ['Projektname', 'Musiker:in, Artist:in oder Band', 'Link zu ein oder zwei Tracks', 'MARK, RELEASE, SYSTEM oder MIX', 'Ob Focus für euch infrage kommt'],
    cta: 'Angebot anfragen →',
    note: 'Das Angebot gilt für neue Anfragen zum Listenpreis. Es ist kein Vertrag. Scope und Zahlung stehen im Brief, den wir vor dem Start schicken.',
  },
  en: {
    kicker: 'Offer · September 2026',
    title: 'For musicians, artists and bands.',
    lead: 'We make sound visible.',
    intro: 'You have the sound. We give it a mark, a release or a shell people can recognise. Not a manifesto — a system that matches where the project is.',
    outcomes: [
      ['01 Mark', 'A name, two colours, one type pair. People can name you before the big release.'],
      ['02 Release', 'Cover, square, grid. It looks like a release, not a phone story.'],
      ['03 Shell', 'Site, dates, contact and a door for collaborations.'],
    ],
    forWhom: 'Three starting points',
    brings: 'Arrives with',
    leaves: 'Leaves with',
    people: [
      { name: 'Musician', line: 'Solo. The track exists, the mark does not.', brings: 'Recordings and a provisional name, often no logo yet.', leaves: 'One logo direction, colours, type, avatar, social cover and a one-page guide.' },
      { name: 'Artist', line: 'Image and sound should finally say the same thing.', brings: 'A sound and a visual world that do not yet belong together.', leaves: 'Cover and grid from one frequency, plus a surface that carries the presence.' },
      { name: 'Band', line: 'Several people, one name that still falls apart in public.', brings: 'Shared tracks, separate profiles, dates without a shared door.', leaves: 'One presence for everyone, dates and a link you can attach to a booking mail.' },
    ],
    tiersTitle: 'Three tiers, one mix.',
    rule: 'New enquiries run at list price. Focus is the same scope, only with a deposit and if the project may be shown as a case. Files after the balance. Two revision rounds included.',
    cols: { who: 'For whom', price: 'List price', focus: 'Focus / case', deposit: 'Deposit', time: 'Timeline', in: 'Included' },
    tiers: [
      { code: 'MARK', who: 'Sound exists, no mark yet', price: '360 €', focus: '280 €', deposit: '120 €', time: '7–10 days', point: 'The first sentence people can use to name you.', items: ['Logo: one direction, one final', 'Two colours, one type pair', 'Avatar and social cover', 'One page on how to use it'] },
      { code: 'RELEASE', who: 'Tracks are out, the presence is still rough', price: '850 €', focus: '650 €', deposit: '250 €', time: '10–14 days', point: 'The track gets a face that matches on streaming and in the feed.', items: ['Cover and streaming square', 'Three to five grid pieces', 'Mini-site or portfolio', 'The logo stays if it holds'] },
      { code: 'SYSTEM', who: 'Output is regular, the shell is missing', price: '2 200 €', focus: '1 600 €', deposit: '500 €', time: '3–5 weeks', point: 'Not a prettier picture. The door for dates, people and collabs.', items: ['Audit: what stays, what steps back', 'Site: releases, dates, people, contact', 'A door for collaborations', 'Cover series and press kit'] },
    ],
    mixTitle: 'MIX when no tier fits',
    mix: 'You assemble it. The price comes from the brief, not from a calculator. Deposit and timeline follow the scope.',
    groups: [
      ['Mark', 'Logo, wordmark, two colours, one type pair, avatar'],
      ['Release', 'Single cover, stream square, series, stage visual'],
      ['Surface', 'Mini-site, releases, dates, people, contact, collab block'],
      ['Outside', 'Feed grid, story templates, press kit, tone of voice'],
    ],
    focusTitle: 'When Focus makes sense',
    focusBody: 'You want the same scope for less and agree that the work may be shown as a case. Without that agreement and without a deposit, the list price stands. Two rounds are included either way.',
    startTitle: 'Three movements',
    steps: [
      ['Write', 'Name, solo or band, one or two links, the tier you want. We reply within 24 hours.'],
      ['Confirm', 'We send scope, price and deposit. Focus only if you want to be visible as a case.'],
      ['Deliver', 'Files after the balance. Two revision rounds are included.'],
    ],
    letterTitle: 'What belongs in the first message',
    letter: ['Project name', 'Musician, artist or band', 'A link to one or two tracks', 'MARK, RELEASE, SYSTEM or MIX', 'Whether Focus is an option'],
    cta: 'Request this offer →',
    note: 'This offer is for new enquiries at list price. It is not a contract. Scope and payment are set in the brief we send before we start.',
  },
  ru: {
    kicker: 'Предложение · сентябрь 2026',
    title: 'Для музыкантов, артистов и групп.',
    lead: 'Мы делаем звук видимым.',
    intro: 'Звук у вас уже есть. Мы даём ему знак, релиз или оболочку, по которой вас узнают. Не манифест — система под то, на каком этапе проект.',
    outcomes: [
      ['01 Знак', 'Имя, два цвета, пара шрифтов. Вас можно назвать ещё до большого релиза.'],
      ['02 Релиз', 'Обложка, квадрат, сетка. Это выглядит как выпуск, а не как сторис.'],
      ['03 Оболочка', 'Сайт, даты, контакт и вход для коллабораций.'],
    ],
    forWhom: 'Три исходные точки',
    brings: 'Приходит с',
    leaves: 'Уходит с',
    people: [
      { name: 'Музыкант', line: 'Соло. Трек уже есть, знака ещё нет.', brings: 'Записи и рабочее имя, часто без логотипа.', leaves: 'Одно направление лого, цвета, шрифт, аватар, обложка и страница, как этим пользоваться.' },
      { name: 'Артист', line: 'Картинка и звук должны говорить одно и то же.', brings: 'Звук и визуальный мир, которые ещё не вместе.', leaves: 'Обложку и сетку из одной частоты и поверхность, которая держит выход.' },
      { name: 'Группа', line: 'Несколько людей и имя, которое снаружи распадается.', brings: 'Общие треки, разные профили, даты без общего входа.', leaves: 'Один выход на всех, даты и ссылку для письма на букинг.' },
    ],
    tiersTitle: 'Три ступени и сборная.',
    rule: 'Новые заявки идут по прайсу. Фокус — тот же объём, только при взносе и если проект можно показать как кейс. Файлы после остатка. Два раунда правок входят.',
    cols: { who: 'Для кого', price: 'Прайс', focus: 'Фокус / кейс', deposit: 'Взнос', time: 'Срок', in: 'Входит' },
    tiers: [
      { code: 'MARK', who: 'Звук есть, знака нет', price: '360 €', focus: '280 €', deposit: '120 €', time: '7–10 дней', point: 'Первая фраза, которой вас можно назвать.', items: ['Лого: одно направление, один финал', 'Два цвета, одна пара шрифтов', 'Аватар и обложка', 'Страница: как этим пользоваться'] },
      { code: 'RELEASE', who: 'Треки снаружи, образ ещё сырой', price: '850 €', focus: '650 €', deposit: '250 €', time: '10–14 дней', point: 'У трека появляется лицо, одинаковое в стриминге и в ленте.', items: ['Обложка и квадрат для стриминга', 'Три–пять частей сетки', 'Мини-сайт или портфолио', 'Живое лого оставляем, если оно держит'] },
      { code: 'SYSTEM', who: 'Выпуск идёт, оболочки нет', price: '2 200 €', focus: '1 600 €', deposit: '500 €', time: '3–5 недель', point: 'Не более красивая картинка. Дверь для дат, людей и коллабов.', items: ['Аудит: что остаётся, что отходит', 'Сайт: релизы, даты, люди, контакт', 'Вход для коллабораций', 'Серия обложек и пресс-кит'] },
    ],
    mixTitle: 'MIX, если ни одна ступень не подходит',
    mix: 'Собираете сами. Цена из брифа, не из калькулятора. Взнос и срок зависят от объёма.',
    groups: [
      ['Знак', 'Лого, вордмарк, два цвета, пара шрифтов, аватар'],
      ['Релиз', 'Обложка сингла, квадрат, серия, сцена'],
      ['Площадь', 'Мини-сайт, релизы, даты, люди, контакт, блок коллабов'],
      ['Снаружи', 'Сетка ленты, шаблоны сторис, пресс-кит, тон'],
    ],
    focusTitle: 'Когда уместен фокус',
    focusBody: 'Нужен тот же объём дешевле, и вы согласны, чтобы работу показали как кейс. Без этого согласия и без взноса остаётся прайс. Два раунда входят в обоих случаях.',
    startTitle: 'Три движения',
    steps: [
      ['Написать', 'Имя, соло или группа, одна-две ссылки, нужная ступень. Ответ в течение 24 часов.'],
      ['Подтвердить', 'Мы присылаем объём, цену и взнос. Фокус — только если хотите быть кейсом.'],
      ['Получить', 'Файлы после остатка. Два раунда правок входят.'],
    ],
    letterTitle: 'Что положить в первое письмо',
    letter: ['Имя проекта', 'Музыкант, артист или группа', 'Ссылка на один-два трека', 'MARK, RELEASE, SYSTEM или MIX', 'Рассматриваете ли фокус'],
    cta: 'Запросить предложение →',
    note: 'Предложение для новых заявок по прайсу. Это не договор. Объём и оплата фиксируются в брифе до старта.',
  },
}

export function AngebotView() {
  const { locale } = useLocale()
  const t = COPY[locale]
  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-5 md:px-8 md:py-10">
      <div className="grid items-end gap-6 border-b border-border pb-6 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="label-mono text-pink">{t.kicker}</p>
          <h1 className="display mt-2 max-w-xl text-pretty text-4xl font-bold text-foreground sm:text-5xl">{t.title}</h1>
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">{t.lead}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.intro}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 border border-border sm:grid-cols-3">
        {t.outcomes.map(([name, body]) => (
          <p key={name} className="border-b border-border p-4 text-sm leading-relaxed last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
            <span className="label-mono text-pink">{name}</span>
            <span className="mt-1 block text-foreground">{body}</span>
          </p>
        ))}
      </div>
      <h2 className="mt-8 text-xl font-bold text-foreground">{t.forWhom}</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        {t.people.map((person) => (
          <section key={person.name} className="carbon-panel flex flex-col gap-3 p-4">
            <h3 className="text-base font-semibold text-pink">{person.name}</h3>
            <p className="text-sm leading-snug text-foreground">{person.line}</p>
            <p className="text-sm leading-relaxed text-muted-foreground"><span className="label-mono text-foreground">{t.brings}</span><span className="mt-1 block">{person.brings}</span></p>
            <p className="text-sm leading-relaxed text-muted-foreground"><span className="label-mono text-foreground">{t.leaves}</span><span className="mt-1 block">{person.leaves}</span></p>
          </section>
        ))}
      </div>
      <div className="mt-8 grid gap-3 md:grid-cols-[auto_1fr] md:items-end">
        <h2 className="text-xl font-bold text-foreground">{t.tiersTitle}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{t.rule}</p>
      </div>
      <div className="mt-3 hidden overflow-hidden border border-border md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead><tr><th className="p-3" />{t.tiers.map((tier) => <th key={tier.code} className="p-3 text-left font-display text-2xl font-bold text-foreground">{tier.code}</th>)}</tr></thead>
          <tbody>
            <tr className="border-t border-border"><th className="label-mono p-3 text-left font-normal text-muted-foreground">{t.cols.who}</th>{t.tiers.map((tier) => <td key={tier.code} className="p-3">{tier.who}</td>)}</tr>
            <tr className="border-t border-border"><th className="label-mono p-3 text-left font-normal text-muted-foreground">{t.cols.price}</th>{t.tiers.map((tier) => <td key={tier.code} className="p-3 font-display text-3xl font-bold text-lime">{tier.price}</td>)}</tr>
            <tr className="border-t border-border"><th className="label-mono p-3 text-left font-normal text-muted-foreground">{t.cols.focus}</th>{t.tiers.map((tier) => <td key={tier.code} className="p-3">{tier.focus}</td>)}</tr>
            <tr className="border-t border-border"><th className="label-mono p-3 text-left font-normal text-muted-foreground">{t.cols.deposit}</th>{t.tiers.map((tier) => <td key={tier.code} className="p-3">{tier.deposit}</td>)}</tr>
            <tr className="border-t border-border"><th className="label-mono p-3 text-left font-normal text-muted-foreground">{t.cols.time}</th>{t.tiers.map((tier) => <td key={tier.code} className="p-3">{tier.time}</td>)}</tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        {t.tiers.map((tier) => (
          <section key={tier.code} className="carbon-panel p-4">
            <div className="flex items-baseline justify-between gap-3 md:hidden"><h3 className="font-display text-2xl font-bold">{tier.code}</h3><p className="font-display text-3xl font-bold text-lime">{tier.price}</p></div>
            <p className="mt-2 text-sm leading-snug text-foreground md:mt-0">{tier.point}</p>
            <p className="label-mono mt-3 text-muted-foreground">{t.cols.in}</p>
            <ul className="mt-2 flex flex-col gap-1">{tier.items.map((item) => <li key={item} className="text-sm leading-snug"><span className="mr-2 inline-block size-1.5 bg-lime" aria-hidden="true" />{item}</li>)}</ul>
            <p className="mt-3 text-sm text-muted-foreground md:hidden">{t.cols.focus} {tier.focus} · {t.cols.deposit} {tier.deposit} · {tier.time}</p>
          </section>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="carbon-panel p-4">
          <h2 className="text-lg font-bold">{t.mixTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.mix}</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">{t.groups.map(([name, body]) => <p key={name} className="text-sm leading-relaxed"><span className="label-mono text-pink">{name}</span><span className="mt-1 block">{body}</span></p>)}</div>
        </section>
        <section className="border border-lime/40 p-4"><h2 className="text-lg font-bold">{t.focusTitle}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.focusBody}</p></section>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1.15fr_0.85fr]">
        <section>
          <h2 className="text-lg font-bold">{t.startTitle}</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">{t.steps.map(([name, body], index) => <p key={name} className="border border-border p-3 text-sm leading-relaxed"><span className="label-mono text-pink">0{index + 1} {name}</span><span className="mt-1 block">{body}</span></p>)}</div>
        </section>
        <section className="carbon-panel p-4">
          <h2 className="text-lg font-bold">{t.letterTitle}</h2>
          <ul className="mt-3 flex flex-col gap-1">{t.letter.map((item) => <li key={item} className="text-sm leading-snug"><span className="mr-2 inline-block size-1.5 bg-pink" aria-hidden="true" />{item}</li>)}</ul>
        </section>
      </div>
      <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <a href="/#kontakt" className="inline-flex min-h-12 items-center justify-center bg-lime px-6 py-3 text-sm font-semibold text-lime-foreground hover:bg-foreground">{t.cta}</a>
        <a className="text-sm text-foreground underline decoration-pink underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{t.note}</p>
    </article>
  )
}
