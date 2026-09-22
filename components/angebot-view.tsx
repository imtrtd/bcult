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
    kicker: 'Angebot \u00b7 September 2026',
    title: 'F\u00fcr Musiker:innen, Artist:innen und Bands.',
    lead: 'Wir machen Klang sichtbar.',
    intro: 'Ihr habt den Sound. Wir geben ihm ein Zeichen, einen Release oder eine H\u00fclle, die man wiedererkennt. Kein Manifest \u2014 ein System, das zum Stand des Projekts passt.',
    outcomes: [
      ['01 Zeichen', 'Name, zwei Farben, ein Schriftpaar. Man kann euch nennen, bevor der gro\u00dfe Release kommt.'],
      ['02 Release', 'Cover, Quadrat, Raster. Es sieht aus wie eine Ver\u00f6ffentlichung, nicht wie eine Story vom Handy.'],
      ['03 H\u00fclle', 'Site, Dates, Kontakt und ein Eingang f\u00fcr Kollaborationen. Das Projekt hat eine T\u00fcr.'],
    ],
    forWhom: 'Drei Ausgangslagen',
    brings: 'Kommt mit',
    leaves: 'Geht mit',
    people: [
      { name: 'Musiker:in', line: 'Solo. Der Track existiert, das Zeichen noch nicht.', brings: 'Aufnahmen, ein vorl\u00e4ufiger Name, oft noch kein Logo.', leaves: 'Eine Richtung Logo, Farben, Schrift, Avatar, Social Cover und eine Seite, wie ihr es benutzt.' },
      { name: 'Artist:in', line: 'Bild und Sound sollen endlich dasselbe sagen.', brings: 'Einen Klang und eine Bildwelt, die noch nicht zusammengeh\u00f6ren.', leaves: 'Cover und Raster aus einer Frequenz, plus eine Fl\u00e4che, die den Auftritt tr\u00e4gt.' },
      { name: 'Band', line: 'Mehrere Leute, ein Name, der nach au\u00dfen noch auseinanderf\u00e4llt.', brings: 'Gemeinsame Tracks, verschiedene Profile, Dates ohne einen gemeinsamen Eingang.', leaves: 'Einen Auftritt f\u00fcr alle, Dates und einen Link, den man an eine Booking-Mail h\u00e4ngen kann.' },
    ],
    tiersTitle: 'Drei Stufen, ein Mix.',
    rule: 'Neue Anfragen laufen zum Listenpreis. Focus ist derselbe Umfang, nur gegen Anzahlung und wenn das Projekt als Case gezeigt werden darf. Dateien nach der Restzahlung. Zwei Korrekturrunden inklusive.',
    cols: { who: 'F\u00fcr wen', price: 'Listenpreis', focus: 'Focus / Case', deposit: 'Anzahlung', time: 'Laufzeit', in: 'Enthalten' },
    tiers: [
      { code: 'MARK', who: 'Sound da, Zeichen fehlt', price: '360 \u20ac', focus: '280 \u20ac', deposit: '120 \u20ac', time: '7\u201310 Tage', point: 'Der erste Satz, mit dem man euch nennen kann.', items: ['Logo: eine Richtung, ein Finale', 'Zwei Farben, ein Schriftpaar', 'Avatar und Social Cover', 'Eine Seite: so nutzt du es'] },
      { code: 'RELEASE', who: 'Tracks drau\u00dfen, Auftritt noch roh', price: '850 \u20ac', focus: '650 \u20ac', deposit: '250 \u20ac', time: '10\u201314 Tage', point: 'Der Track bekommt ein Gesicht, das im Stream und im Feed dasselbe ist.', items: ['Cover und Quadrat f\u00fcrs Streaming', 'Drei bis f\u00fcnf Teile Raster', 'Mini-Site oder Portfolio', 'Logo bleibt, wenn es tr\u00e4gt'] },
      { code: 'SYSTEM', who: 'Output l\u00e4uft, H\u00fclle fehlt', price: '2 200 \u20ac', focus: '1 600 \u20ac', deposit: '500 \u20ac', time: '3\u20135 Wochen', point: 'Nicht das sch\u00f6nere Bild. Die T\u00fcr f\u00fcr Dates, Leute und Kollabs.', items: ['Audit: was bleibt, was weicht', 'Site: Releases, Dates, People, Kontakt', 'Eingang f\u00fcr Kollaborationen', 'Cover-Serie und Presskit'] },
    ],
    mixTitle: 'MIX, wenn keine Stufe passt',
    mix: 'Ihr stellt selbst zusammen. Der Preis kommt aus dem Brief, nicht aus einem Rechner. Anzahlung und Laufzeit richten sich nach dem Umfang.',
    groups: [
      ['Zeichen', 'Logo, Wortmarke, zwei Farben, ein Schriftpaar, Avatar'],
      ['Release', 'Single-Cover, Stream-Quadrat, Serie, B\u00fchnenvisual'],
      ['Fl\u00e4che', 'Mini-Site, Releases, Dates, People, Kontakt, Kollab-Block'],
      ['Au\u00dfen', 'Feed-Raster, Story-Vorlagen, Presskit, Tonalit\u00e4t'],
    ],
    focusTitle: 'Wann Focus Sinn hat',
    focusBody: 'Ihr wollt denselben Umfang g\u00fcnstiger und seid einverstanden, dass die Arbeit als Case sichtbar wird. Ohne dieses Einverst\u00e4ndnis und ohne Anzahlung bleibt es beim Listenpreis. Zwei Runden sind in beiden F\u00e4llen drin.',
    startTitle: 'Drei Bewegungen',
    steps: [
      ['Schreiben', 'Name, Solo oder Band, ein oder zwei Links, gew\u00fcnschte Stufe. Antwort innerhalb von 24 Stunden.'],
      ['Best\u00e4tigen', 'Wir schicken Scope, Preis und Anzahlung. Focus nur, wenn ihr als Case sichtbar sein wollt.'],
      ['Liefern', 'Nach der Restzahlung die Dateien. Zwei Korrekturrunden sind inklusive.'],
    ],
    letterTitle: 'Was in die erste Nachricht geh\u00f6rt',
    letter: ['Projektname', 'Musiker:in, Artist:in oder Band', 'Link zu ein oder zwei Tracks', 'MARK, RELEASE, SYSTEM oder MIX', 'Ob Focus f\u00fcr euch infrage kommt'],
    cta: 'Angebot anfragen \u2192',
    note: 'Das Angebot gilt f\u00fcr neue Anfragen zum Listenpreis. Es ist kein Vertrag. Scope und Zahlung stehen im Brief, den wir vor dem Start schicken.',
  },
  en: {
    kicker: 'Offer \u00b7 September 2026',
    title: 'For musicians, artists and bands.',
    lead: 'We make sound visible.',
    intro: 'You have the sound. We give it a mark, a release or a shell people can recognise. Not a manifesto \u2014 a system that matches where the project is.',
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
      { code: 'MARK', who: 'Sound exists, no mark yet', price: '360 \u20ac', focus: '280 \u20ac', deposit: '120 \u20ac', time: '7\u201310 days', point: 'The first sentence people can use to name you.', items: ['Logo: one direction, one final', 'Two colours, one type pair', 'Avatar and social cover', 'One page on how to use it'] },
      { code: 'RELEASE', who: 'Tracks are out, the presence is still rough', price: '850 \u20ac', focus: '650 \u20ac', deposit: '250 \u20ac', time: '10\u201314 days', point: 'The track gets a face that matches on streaming and in the feed.', items: ['Cover and streaming square', 'Three to five grid pieces', 'Mini-site or portfolio', 'The logo stays if it holds'] },
      { code: 'SYSTEM', who: 'Output is regular, the shell is missing', price: '2 200 \u20ac', focus: '1 600 \u20ac', deposit: '500 \u20ac', time: '3\u20135 weeks', point: 'Not a prettier picture. The door for dates, people and collabs.', items: ['Audit: what stays, what steps back', 'Site: releases, dates, people, contact', 'A door for collaborations', 'Cover series and press kit'] },
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
    cta: 'Request this offer \u2192',
    note: 'This offer is for new enquiries at list price. It is not a contract. Scope and payment are set in the brief we send before we start.',
  },
  ru: {
    kicker: '\u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u00b7 \u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044c 2026',
    title: '\u0414\u043b\u044f \u043c\u0443\u0437\u044b\u043a\u0430\u043d\u0442\u043e\u0432, \u0430\u0440\u0442\u0438\u0441\u0442\u043e\u0432 \u0438 \u0433\u0440\u0443\u043f\u043f.',
    lead: '\u041c\u044b \u0434\u0435\u043b\u0430\u0435\u043c \u0437\u0432\u0443\u043a \u0432\u0438\u0434\u0438\u043c\u044b\u043c.',
    intro: '\u0417\u0432\u0443\u043a \u0443 \u0432\u0430\u0441 \u0443\u0436\u0435 \u0435\u0441\u0442\u044c. \u041c\u044b \u0434\u0430\u0451\u043c \u0435\u043c\u0443 \u0437\u043d\u0430\u043a, \u0440\u0435\u043b\u0438\u0437 \u0438\u043b\u0438 \u043e\u0431\u043e\u043b\u043e\u0447\u043a\u0443, \u043f\u043e \u043a\u043e\u0442\u043e\u0440\u043e\u0439 \u0432\u0430\u0441 \u0443\u0437\u043d\u0430\u044e\u0442. \u041d\u0435 \u043c\u0430\u043d\u0438\u0444\u0435\u0441\u0442 \u2014 \u0441\u0438\u0441\u0442\u0435\u043c\u0430 \u043f\u043e\u0434 \u0442\u043e, \u043d\u0430 \u043a\u0430\u043a\u043e\u043c \u044d\u0442\u0430\u043f\u0435 \u043f\u0440\u043e\u0435\u043a\u0442.',
    outcomes: [
      ['01 \u0417\u043d\u0430\u043a', '\u0418\u043c\u044f, \u0434\u0432\u0430 \u0446\u0432\u0435\u0442\u0430, \u043f\u0430\u0440\u0430 \u0448\u0440\u0438\u0444\u0442\u043e\u0432. \u0412\u0430\u0441 \u043c\u043e\u0436\u043d\u043e \u043d\u0430\u0437\u0432\u0430\u0442\u044c \u0435\u0449\u0451 \u0434\u043e \u0431\u043e\u043b\u044c\u0448\u043e\u0433\u043e \u0440\u0435\u043b\u0438\u0437\u0430.'],
      ['02 \u0420\u0435\u043b\u0438\u0437', '\u041e\u0431\u043b\u043e\u0436\u043a\u0430, \u043a\u0432\u0430\u0434\u0440\u0430\u0442, \u0441\u0435\u0442\u043a\u0430. \u042d\u0442\u043e \u0432\u044b\u0433\u043b\u044f\u0434\u0438\u0442 \u043a\u0430\u043a \u0432\u044b\u043f\u0443\u0441\u043a, \u0430 \u043d\u0435 \u043a\u0430\u043a \u0441\u0442\u043e\u0440\u0438\u0441.'],
      ['03 \u041e\u0431\u043e\u043b\u043e\u0447\u043a\u0430', '\u0421\u0430\u0439\u0442, \u0434\u0430\u0442\u044b, \u043a\u043e\u043d\u0442\u0430\u043a\u0442 \u0438 \u0432\u0445\u043e\u0434 \u0434\u043b\u044f \u043a\u043e\u043b\u043b\u0430\u0431\u043e\u0440\u0430\u0446\u0438\u0439.'],
    ],
    forWhom: '\u0422\u0440\u0438 \u0438\u0441\u0445\u043e\u0434\u043d\u044b\u0435 \u0442\u043e\u0447\u043a\u0438',
    brings: '\u041f\u0440\u0438\u0445\u043e\u0434\u0438\u0442 \u0441',
    leaves: '\u0423\u0445\u043e\u0434\u0438\u0442 \u0441',
    people: [
      { name: '\u041c\u0443\u0437\u044b\u043a\u0430\u043d\u0442', line: '\u0421\u043e\u043b\u043e. \u0422\u0440\u0435\u043a \u0443\u0436\u0435 \u0435\u0441\u0442\u044c, \u0437\u043d\u0430\u043a\u0430 \u0435\u0449\u0451 \u043d\u0435\u0442.', brings: '\u0417\u0430\u043f\u0438\u0441\u0438 \u0438 \u0440\u0430\u0431\u043e\u0447\u0435\u0435 \u0438\u043c\u044f, \u0447\u0430\u0441\u0442\u043e \u0431\u0435\u0437 \u043b\u043e\u0433\u043e\u0442\u0438\u043f\u0430.', leaves: '\u041e\u0434\u043d\u043e \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043b\u043e\u0433\u043e, \u0446\u0432\u0435\u0442\u0430, \u0448\u0440\u0438\u0444\u0442, \u0430\u0432\u0430\u0442\u0430\u0440, \u043e\u0431\u043b\u043e\u0436\u043a\u0430 \u0438 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430, \u043a\u0430\u043a \u044d\u0442\u0438\u043c \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c\u0441\u044f.' },
      { name: '\u0410\u0440\u0442\u0438\u0441\u0442', line: '\u041a\u0430\u0440\u0442\u0438\u043d\u043a\u0430 \u0438 \u0437\u0432\u0443\u043a \u0434\u043e\u043b\u0436\u043d\u044b \u0433\u043e\u0432\u043e\u0440\u0438\u0442\u044c \u043e\u0434\u043d\u043e \u0438 \u0442\u043e \u0436\u0435.', brings: '\u0417\u0432\u0443\u043a \u0438 \u0432\u0438\u0437\u0443\u0430\u043b\u044c\u043d\u044b\u0439 \u043c\u0438\u0440, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0435\u0449\u0451 \u043d\u0435 \u0432\u043c\u0435\u0441\u0442\u0435.', leaves: '\u041e\u0431\u043b\u043e\u0436\u043a\u0443 \u0438 \u0441\u0435\u0442\u043a\u0443 \u0438\u0437 \u043e\u0434\u043d\u043e\u0439 \u0447\u0430\u0441\u0442\u043e\u0442\u044b \u0438 \u043f\u043e\u0432\u0435\u0440\u0445\u043d\u043e\u0441\u0442\u044c, \u043a\u043e\u0442\u043e\u0440\u0430\u044f \u0434\u0435\u0440\u0436\u0438\u0442 \u0432\u044b\u0445\u043e\u0434.' },
      { name: '\u0413\u0440\u0443\u043f\u043f\u0430', line: '\u041d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u043e \u043b\u044e\u0434\u0435\u0439 \u0438 \u0438\u043c\u044f, \u043a\u043e\u0442\u043e\u0440\u043e\u0435 \u0441\u043d\u0430\u0440\u0443\u0436\u0438 \u0440\u0430\u0441\u043f\u0430\u0434\u0430\u0435\u0442\u0441\u044f.', brings: '\u041e\u0431\u0449\u0438\u0435 \u0442\u0440\u0435\u043a\u0438, \u0440\u0430\u0437\u043d\u044b\u0435 \u043f\u0440\u043e\u0444\u0438\u043b\u0438, \u0434\u0430\u0442\u044b \u0431\u0435\u0437 \u043e\u0431\u0449\u0435\u0433\u043e \u0432\u0445\u043e\u0434\u0430.', leaves: '\u041e\u0434\u0438\u043d \u0432\u044b\u0445\u043e\u0434 \u043d\u0430 \u0432\u0441\u0435\u0445, \u0434\u0430\u0442\u044b \u0438 \u0441\u0441\u044b\u043b\u043a\u0443 \u0434\u043b\u044f \u043f\u0438\u0441\u044c\u043c\u0430 \u043d\u0430 \u0431\u0443\u043a\u0438\u043d\u0433.' },
    ],
    tiersTitle: '\u0422\u0440\u0438 \u0441\u0442\u0443\u043f\u0435\u043d\u0438 \u0438 \u0441\u0431\u043e\u0440\u043d\u0430\u044f.',
    rule: '\u041d\u043e\u0432\u044b\u0435 \u0437\u0430\u044f\u0432\u043a\u0438 \u0438\u0434\u0443\u0442 \u043f\u043e \u043f\u0440\u0430\u0439\u0441\u0443. \u0424\u043e\u043a\u0443\u0441 \u2014 \u0442\u043e\u0442 \u0436\u0435 \u043e\u0431\u044a\u0451\u043c, \u0442\u043e\u043b\u044c\u043a\u043e \u043f\u0440\u0438 \u0432\u0437\u043d\u043e\u0441\u0435 \u0438 \u0435\u0441\u043b\u0438 \u043f\u0440\u043e\u0435\u043a\u0442 \u043c\u043e\u0436\u043d\u043e \u043f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043a\u0430\u043a \u043a\u0435\u0439\u0441. \u0424\u0430\u0439\u043b\u044b \u043f\u043e\u0441\u043b\u0435 \u043e\u0441\u0442\u0430\u0442\u043a\u0430. \u0414\u0432\u0430 \u0440\u0430\u0443\u043d\u0434\u0430 \u043f\u0440\u0430\u0432\u043e\u043a \u0432\u0445\u043e\u0434\u044f\u0442.',
    cols: { who: '\u0414\u043b\u044f \u043a\u043e\u0433\u043e', price: '\u041f\u0440\u0430\u0439\u0441', focus: '\u0424\u043e\u043a\u0443\u0441 / \u043a\u0435\u0439\u0441', deposit: '\u0412\u0437\u043d\u043e\u0441', time: '\u0421\u0440\u043e\u043a', in: '\u0412\u0445\u043e\u0434\u0438\u0442' },
    tiers: [
      { code: 'MARK', who: '\u0417\u0432\u0443\u043a \u0435\u0441\u0442\u044c, \u0437\u043d\u0430\u043a\u0430 \u043d\u0435\u0442', price: '360 \u20ac', focus: '280 \u20ac', deposit: '120 \u20ac', time: '7\u201310 \u0434\u043d\u0435\u0439', point: '\u041f\u0435\u0440\u0432\u0430\u044f \u0444\u0440\u0430\u0437\u0430, \u043a\u043e\u0442\u043e\u0440\u043e\u0439 \u0432\u0430\u0441 \u043c\u043e\u0436\u043d\u043e \u043d\u0430\u0437\u0432\u0430\u0442\u044c.', items: ['\u041b\u043e\u0433\u043e: \u043e\u0434\u043d\u043e \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435, \u043e\u0434\u0438\u043d \u0444\u0438\u043d\u0430\u043b', '\u0414\u0432\u0430 \u0446\u0432\u0435\u0442\u0430, \u043e\u0434\u043d\u0430 \u043f\u0430\u0440\u0430 \u0448\u0440\u0438\u0444\u0442\u043e\u0432', '\u0410\u0432\u0430\u0442\u0430\u0440 \u0438 \u043e\u0431\u043b\u043e\u0436\u043a\u0430', '\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430: \u043a\u0430\u043a \u044d\u0442\u0438\u043c \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c\u0441\u044f'] },
      { code: 'RELEASE', who: '\u0422\u0440\u0435\u043a\u0438 \u0441\u043d\u0430\u0440\u0443\u0436\u0438, \u043e\u0431\u0440\u0430\u0437 \u0435\u0449\u0451 \u0441\u044b\u0440\u043e\u0439', price: '850 \u20ac', focus: '650 \u20ac', deposit: '250 \u20ac', time: '10\u201314 \u0434\u043d\u0435\u0439', point: '\u0423 \u0442\u0440\u0435\u043a\u0430 \u043f\u043e\u044f\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u043b\u0438\u0446\u043e, \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u043e\u0435 \u0432 \u0441\u0442\u0440\u0438\u043c\u0438\u043d\u0433\u0435 \u0438 \u0432 \u043b\u0435\u043d\u0442\u0435.', items: ['\u041e\u0431\u043b\u043e\u0436\u043a\u0430 \u0438 \u043a\u0432\u0430\u0434\u0440\u0430\u0442 \u0434\u043b\u044f \u0441\u0442\u0440\u0438\u043c\u0438\u043d\u0433\u0430', '\u0422\u0440\u0438\u2013\u043f\u044f\u0442\u044c \u0447\u0430\u0441\u0442\u0435\u0439 \u0441\u0435\u0442\u043a\u0438', '\u041c\u0438\u043d\u0438-\u0441\u0430\u0439\u0442 \u0438\u043b\u0438 \u043f\u043e\u0440\u0442\u0444\u043e\u043b\u0438\u043e', '\u0416\u0438\u0432\u043e\u0435 \u043b\u043e\u0433\u043e \u043e\u0441\u0442\u0430\u0432\u043b\u044f\u0435\u043c, \u0435\u0441\u043b\u0438 \u043e\u043d\u043e \u0434\u0435\u0440\u0436\u0438\u0442'] },
      { code: 'SYSTEM', who: '\u0412\u044b\u043f\u0443\u0441\u043a \u0438\u0434\u0451\u0442, \u043e\u0431\u043e\u043b\u043e\u0447\u043a\u0438 \u043d\u0435\u0442', price: '2 200 \u20ac', focus: '1 600 \u20ac', deposit: '500 \u20ac', time: '3\u20135 \u043d\u0435\u0434\u0435\u043b\u044c', point: '\u041d\u0435 \u0431\u043e\u043b\u0435\u0435 \u043a\u0440\u0430\u0441\u0438\u0432\u0430\u044f \u043a\u0430\u0440\u0442\u0438\u043d\u043a\u0430. \u0414\u0432\u0435\u0440\u044c \u0434\u043b\u044f \u0434\u0430\u0442, \u043b\u044e\u0434\u0435\u0439 \u0438 \u043a\u043e\u043b\u043b\u0430\u0431\u043e\u0432.', items: ['\u0410\u0443\u0434\u0438\u0442: \u0447\u0442\u043e \u043e\u0441\u0442\u0430\u0451\u0442\u0441\u044f, \u0447\u0442\u043e \u043e\u0442\u0445\u043e\u0434\u0438\u0442', '\u0421\u0430\u0439\u0442: \u0440\u0435\u043b\u0438\u0437\u044b, \u0434\u0430\u0442\u044b, \u043b\u044e\u0434\u0438, \u043a\u043e\u043d\u0442\u0430\u043a\u0442', '\u0412\u0445\u043e\u0434 \u0434\u043b\u044f \u043a\u043e\u043b\u043b\u0430\u0431\u043e\u0440\u0430\u0446\u0438\u0439', '\u0421\u0435\u0440\u0438\u044f \u043e\u0431\u043b\u043e\u0436\u0435\u043a \u0438 \u043f\u0440\u0435\u0441\u0441-\u043a\u0438\u0442'] },
    ],
    mixTitle: 'MIX, \u0435\u0441\u043b\u0438 \u043d\u0438 \u043e\u0434\u043d\u0430 \u0441\u0442\u0443\u043f\u0435\u043d\u044c \u043d\u0435 \u043f\u043e\u0434\u0445\u043e\u0434\u0438\u0442',
    mix: '\u0421\u043e\u0431\u0438\u0440\u0430\u0435\u0442\u0435 \u0441\u0430\u043c\u0438. \u0426\u0435\u043d\u0430 \u0438\u0437 \u0431\u0440\u0438\u0444\u0430, \u043d\u0435 \u0438\u0437 \u043a\u0430\u043b\u044c\u043a\u0443\u043b\u044f\u0442\u043e\u0440\u0430. \u0412\u0437\u043d\u043e\u0441 \u0438 \u0441\u0440\u043e\u043a \u0437\u0430\u0432\u0438\u0441\u044f\u0442 \u043e\u0442 \u043e\u0431\u044a\u0451\u043c\u0430.',
    groups: [
      ['\u0417\u043d\u0430\u043a', '\u041b\u043e\u0433\u043e, \u0432\u043e\u0440\u0434\u043c\u0430\u0440\u043a, \u0434\u0432\u0430 \u0446\u0432\u0435\u0442\u0430, \u043f\u0430\u0440\u0430 \u0448\u0440\u0438\u0444\u0442\u043e\u0432, \u0430\u0432\u0430\u0442\u0430\u0440'],
      ['\u0420\u0435\u043b\u0438\u0437', '\u041e\u0431\u043b\u043e\u0436\u043a\u0430 \u0441\u0438\u043d\u0433\u043b\u0430, \u043a\u0432\u0430\u0434\u0440\u0430\u0442, \u0441\u0435\u0440\u0438\u044f, \u0441\u0446\u0435\u043d\u0430'],
      ['\u041f\u043b\u043e\u0449\u0430\u0434\u044c', '\u041c\u0438\u043d\u0438-\u0441\u0430\u0439\u0442, \u0440\u0435\u043b\u0438\u0437\u044b, \u0434\u0430\u0442\u044b, \u043b\u044e\u0434\u0438, \u043a\u043e\u043d\u0442\u0430\u043a\u0442, \u0431\u043b\u043e\u043a \u043a\u043e\u043b\u043b\u0430\u0431\u043e\u0432'],
      ['\u0421\u043d\u0430\u0440\u0443\u0436\u0438', '\u0421\u0435\u0442\u043a\u0430 \u043b\u0435\u043d\u0442\u044b, \u0448\u0430\u0431\u043b\u043e\u043d\u044b \u0441\u0442\u043e\u0440\u0438\u0441, \u043f\u0440\u0435\u0441\u0441-\u043a\u0438\u0442, \u0442\u043e\u043d'],
    ],
    focusTitle: '\u041a\u043e\u0433\u0434\u0430 \u0443\u043c\u0435\u0441\u0442\u0435\u043d \u0444\u043e\u043a\u0443\u0441',
    focusBody: '\u041d\u0443\u0436\u0435\u043d \u0442\u043e\u0442 \u0436\u0435 \u043e\u0431\u044a\u0451\u043c \u0434\u0435\u0448\u0435\u0432\u043b\u0435, \u0438 \u0432\u044b \u0441\u043e\u0433\u043b\u0430\u0441\u043d\u044b, \u0447\u0442\u043e\u0431\u044b \u0440\u0430\u0431\u043e\u0442\u0443 \u043f\u043e\u043a\u0430\u0437\u0430\u043b\u0438 \u043a\u0430\u043a \u043a\u0435\u0439\u0441. \u0411\u0435\u0437 \u044d\u0442\u043e\u0433\u043e \u0441\u043e\u0433\u043b\u0430\u0441\u0438\u044f \u0438 \u0431\u0435\u0437 \u0432\u0437\u043d\u043e\u0441\u0430 \u043e\u0441\u0442\u0430\u0451\u0442\u0441\u044f \u043f\u0440\u0430\u0439\u0441. \u0414\u0432\u0430 \u0440\u0430\u0443\u043d\u0434\u0430 \u0432\u0445\u043e\u0434\u044f\u0442 \u0432 \u043e\u0431\u043e\u0438\u0445 \u0441\u043b\u0443\u0447\u0430\u044f\u0445.',
    startTitle: '\u0422\u0440\u0438 \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u044f',
    steps: [
      ['\u041d\u0430\u043f\u0438\u0441\u0430\u0442\u044c', '\u0418\u043c\u044f, \u0441\u043e\u043b\u043e \u0438\u043b\u0438 \u0433\u0440\u0443\u043f\u043f\u0430, \u043e\u0434\u043d\u0430-\u0434\u0432\u0435 \u0441\u0441\u044b\u043b\u043a\u0438, \u043d\u0443\u0436\u043d\u0430\u044f \u0441\u0442\u0443\u043f\u0435\u043d\u044c. \u041e\u0442\u0432\u0435\u0442 \u0432 \u0442\u0435\u0447\u0435\u043d\u0438\u0435 24 \u0447\u0430\u0441\u043e\u0432.'],
      ['\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c', '\u041c\u044b \u043f\u0440\u0438\u0441\u044b\u043b\u0430\u0435\u043c \u043e\u0431\u044a\u0451\u043c, \u0446\u0435\u043d\u0443 \u0438 \u0432\u0437\u043d\u043e\u0441. \u0424\u043e\u043a\u0443\u0441 \u2014 \u0442\u043e\u043b\u044c\u043a\u043e \u0435\u0441\u043b\u0438 \u0445\u043e\u0442\u0438\u0442\u0435 \u0431\u044b\u0442\u044c \u043a\u0435\u0439\u0441\u043e\u043c.'],
      ['\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c', '\u0424\u0430\u0439\u043b\u044b \u043f\u043e\u0441\u043b\u0435 \u043e\u0441\u0442\u0430\u0442\u043a\u0430. \u0414\u0432\u0430 \u0440\u0430\u0443\u043d\u0434\u0430 \u043f\u0440\u0430\u0432\u043e\u043a \u0432\u0445\u043e\u0434\u044f\u0442.'],
    ],
    letterTitle: '\u0427\u0442\u043e \u043f\u043e\u043b\u043e\u0436\u0438\u0442\u044c \u0432 \u043f\u0435\u0440\u0432\u043e\u0435 \u043f\u0438\u0441\u044c\u043c\u043e',
    letter: ['\u0418\u043c\u044f \u043f\u0440\u043e\u0435\u043a\u0442\u0430', '\u041c\u0443\u0437\u044b\u043a\u0430\u043d\u0442, \u0430\u0440\u0442\u0438\u0441\u0442 \u0438\u043b\u0438 \u0433\u0440\u0443\u043f\u043f\u0430', '\u0421\u0441\u044b\u043b\u043a\u0430 \u043d\u0430 \u043e\u0434\u0438\u043d-\u0434\u0432\u0430 \u0442\u0440\u0435\u043a\u0430', 'MARK, RELEASE, SYSTEM \u0438\u043b\u0438 MIX', '\u0420\u0430\u0441\u0441\u043c\u0430\u0442\u0440\u0438\u0432\u0430\u0435\u0442\u0435 \u043b\u0438 \u0444\u043e\u043a\u0443\u0441'],
    cta: '\u0417\u0430\u043f\u0440\u043e\u0441\u0438\u0442\u044c \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u2192',
    note: '\u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0434\u043b\u044f \u043d\u043e\u0432\u044b\u0445 \u0437\u0430\u044f\u0432\u043e\u043a \u043f\u043e \u043f\u0440\u0430\u0439\u0441\u0443. \u042d\u0442\u043e \u043d\u0435 \u0434\u043e\u0433\u043e\u0432\u043e\u0440. \u041e\u0431\u044a\u0451\u043c \u0438 \u043e\u043f\u043b\u0430\u0442\u0430 \u0444\u0438\u043a\u0441\u0438\u0440\u0443\u044e\u0442\u0441\u044f \u0432 \u0431\u0440\u0438\u0444\u0435 \u0434\u043e \u0441\u0442\u0430\u0440\u0442\u0430.',
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
          <thead>
            <tr>
              <th className="p-3" />
              {t.tiers.map((tier) => <th key={tier.code} className="p-3 text-left font-display text-2xl font-bold text-foreground">{tier.code}</th>)}
            </tr>
          </thead>
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
            <div className="flex items-baseline justify-between gap-3 md:hidden">
              <h3 className="font-display text-2xl font-bold">{tier.code}</h3>
              <p className="font-display text-3xl font-bold text-lime">{tier.price}</p>
            </div>
            <p className="mt-2 text-sm leading-snug text-foreground md:mt-0">{tier.point}</p>
            <p className="label-mono mt-3 text-muted-foreground">{t.cols.in}</p>
            <ul className="mt-2 flex flex-col gap-1">
              {tier.items.map((item) => <li key={item} className="text-sm leading-snug"><span className="mr-2 text-lime">\u2192</span>{item}</li>)}
            </ul>
            <p className="mt-3 text-sm text-muted-foreground md:hidden">{t.cols.focus} {tier.focus} \u00b7 {t.cols.deposit} {tier.deposit} \u00b7 {tier.time}</p>
          </section>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="carbon-panel p-4">
          <h2 className="text-lg font-bold">{t.mixTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.mix}</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {t.groups.map(([name, body]) => (
              <p key={name} className="text-sm leading-relaxed"><span className="label-mono text-pink">{name}</span><span className="mt-1 block">{body}</span></p>
            ))}
          </div>
        </section>
        <section className="border border-lime/40 p-4">
          <h2 className="text-lg font-bold">{t.focusTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.focusBody}</p>
        </section>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1.15fr_0.85fr]">
        <section>
          <h2 className="text-lg font-bold">{t.startTitle}</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {t.steps.map(([name, body], index) => (
              <p key={name} className="border border-border p-3 text-sm leading-relaxed"><span className="label-mono text-pink">0{index + 1} {name}</span><span className="mt-1 block">{body}</span></p>
            ))}
          </div>
        </section>
        <section className="carbon-panel p-4">
          <h2 className="text-lg font-bold">{t.letterTitle}</h2>
          <ul className="mt-3 flex flex-col gap-1">
            {t.letter.map((item) => <li key={item} className="text-sm leading-snug"><span className="mr-2 text-pink">\u2192</span>{item}</li>)}
          </ul>
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
