export const MIX_GROUPS = ['MARK', 'RELEASE', 'SITE', 'INST', 'STRATEGY', 'MERCH', 'SPECIAL'] as const
export type MixGroup = (typeof MIX_GROUPS)[number]
export type MixLocale = 'de' | 'en' | 'ru'

export type MixMod = {
  id: string
  group: MixGroup
  de: string
  en: string
  ru: string
}

export const MIX_MODULES: MixMod[] = [
  { id: 'logo-dir', group: 'MARK', de: 'Logo-Richtung', en: 'Logo direction', ru: 'Направление лого' },
  { id: 'logo-lock', group: 'MARK', de: 'Logo-Lockup', en: 'Logo lockup', ru: 'Локап лого' },
  { id: 'wordmark', group: 'MARK', de: 'Wortmarke', en: 'Wordmark', ru: 'Вордмарк' },
  { id: 'icon-mark', group: 'MARK', de: 'Icon / Zeichen', en: 'Icon / mark', ru: 'Знак / иконка' },
  { id: 'color-code', group: 'MARK', de: 'Farbcode (2)', en: 'Color code (2)', ru: 'Цветовой код (2)' },
  { id: 'type-pair', group: 'MARK', de: 'Schriftpaar', en: 'Type pair', ru: 'Пара шрифтов' },
  { id: 'avatar', group: 'MARK', de: 'Avatar', en: 'Avatar', ru: 'Аватар' },
  { id: 'social-cover', group: 'MARK', de: 'Social-Cover', en: 'Social cover', ru: 'Обложка соцсети' },
  { id: 'usage-guide', group: 'MARK', de: '1-Seiten-Guide', en: '1-page usage guide', ru: 'Гайд на 1 страницу' },
  { id: 'favicon', group: 'MARK', de: 'Favicon / App-Icon', en: 'Favicon / app icon', ru: 'Favicon / иконка приложения' },
  { id: 'single-cover', group: 'RELEASE', de: 'Single-Cover', en: 'Single cover', ru: 'Обложка сингла' },
  { id: 'stream-sq', group: 'RELEASE', de: 'Stream-Quadrat', en: 'Stream square', ru: 'Квадрат для стриминга' },
  { id: 'cover-series', group: 'RELEASE', de: 'Cover-Serie', en: 'Cover series', ru: 'Серия обложек' },
  { id: 'motion-loop', group: 'RELEASE', de: 'Motion-Loop', en: 'Motion loop', ru: 'Motion-loop' },
  { id: 'poster-flyer', group: 'RELEASE', de: 'Poster / Flyer', en: 'Poster / flyer', ru: 'Постер / флаер' },
  { id: 'stage-visual', group: 'RELEASE', de: 'Bühnenvisual', en: 'Stage visual', ru: 'Сценический визуал' },
  { id: 'spectro-form', group: 'RELEASE', de: 'Spektrogramm-Form', en: 'Spectrogram form', ru: 'Форма спектрограммы' },
  { id: 'waveform-id', group: 'RELEASE', de: 'Waveform-Identität', en: 'Waveform identity', ru: 'Волна как идентичность' },
  { id: 'audit', group: 'SITE', de: 'Audit: bleibt / stirbt', en: 'Audit: stay / die', ru: 'Аудит: оставить / убрать' },
  { id: 'mini-site', group: 'SITE', de: 'Mini-Site', en: 'Mini-site', ru: 'Мини-сайт' },
  { id: 'portfolio', group: 'SITE', de: 'Portfolio-Seite', en: 'Portfolio page', ru: 'Страница-портфолио' },
  { id: 'releases-page', group: 'SITE', de: 'Releases-Seite', en: 'Releases page', ru: 'Страница релизов' },
  { id: 'dates', group: 'SITE', de: 'Dates / Events', en: 'Dates / events', ru: 'Даты / события' },
  { id: 'people', group: 'SITE', de: 'People / About', en: 'People / about', ru: 'Люди / about' },
  { id: 'contact', group: 'SITE', de: 'Kontakt', en: 'Contact', ru: 'Контакт' },
  { id: 'collab-block', group: 'SITE', de: 'Kollab-Block', en: 'Collab-block', ru: 'Блок коллабов' },
  { id: 'feed-grid', group: 'INST', de: 'Feed-Raster 3–5', en: 'Feed grid 3–5', ru: 'Сетка 3–5' },
  { id: 'story-tpl', group: 'INST', de: 'Story-Templates', en: 'Story templates', ru: 'Шаблоны сторис' },
  { id: 'highlights', group: 'INST', de: 'Highlight-Cover', en: 'Highlight covers', ru: 'Обложки highlights' },
  { id: 'reels-cover', group: 'INST', de: 'Reels-Cover', en: 'Reels cover', ru: 'Обложка reels' },
  { id: 'carousel-post', group: 'INST', de: 'Carousel-Post', en: 'Carousel post', ru: 'Карусель' },
  { id: 'zones-map', group: 'INST', de: 'Instagram-Zonen', en: 'Instagram zones', ru: 'Зоны Instagram' },
  { id: 'pillars', group: 'INST', de: 'Content-Säulen', en: 'Content pillars', ru: 'Столпы контента' },
  { id: 'calendar', group: 'INST', de: '14-Tage-Kalender', en: '14-day calendar', ru: 'Календарь 14 дней' },
  { id: 'presskit-pdf', group: 'STRATEGY', de: 'Presskit PDF', en: 'Presskit PDF', ru: 'Presskit PDF' },
  { id: 'presskit-page', group: 'STRATEGY', de: 'Presskit-Seite', en: 'Presskit page', ru: 'Страница presskit' },
  { id: 'positioning', group: 'STRATEGY', de: 'Positionierung', en: 'Positioning', ru: 'Позиционирование' },
  { id: 'tone', group: 'STRATEGY', de: 'Tonalität', en: 'Tone of voice', ru: 'Тон' },
  { id: 'manifest', group: 'STRATEGY', de: 'Manifest', en: 'Manifest', ru: 'Манифест' },
  { id: 'launch-plan', group: 'STRATEGY', de: 'Launch-Timing', en: 'Launch timing', ru: 'Тайминг запуска' },
  { id: 'stickers', group: 'MERCH', de: 'Stickerbogen', en: 'Stickers sheet', ru: 'Лист стикеров' },
  { id: 'merch-mock', group: 'MERCH', de: 'Merch-Mockup', en: 'Merch mockup', ru: 'Мокап мерча' },
  { id: 'zine', group: 'MERCH', de: 'Zine / Flyer', en: 'Zine / flyer', ru: 'Зин / флаер' },
  { id: 'biz-card', group: 'MERCH', de: 'Visitenkarte', en: 'Business card', ru: 'Визитка' },
  { id: 'poster-print', group: 'MERCH', de: 'Poster-Print', en: 'Poster print', ru: 'Печатный постер' },
  { id: 'focus-offer', group: 'SPECIAL', de: 'Focus-Gruppen-Angebot', en: 'Focus-group offer', ru: 'Оффер фокус-группы' },
  { id: 'promo', group: 'SPECIAL', de: 'Promo / Special', en: 'Promo / special', ru: 'Промо / special' },
  { id: 'personal-2', group: 'SPECIAL', de: 'Personal · 2 Abende', en: 'Personal · 2 evenings', ru: 'Personal · 2 вечера' },
  { id: 'warmup', group: 'SPECIAL', de: 'Warm-up 7–14 Tage', en: 'Warm-up 7–14 days', ru: 'Разогрев 7–14 дней' },
  { id: 'pay-plan', group: 'SPECIAL', de: 'Zahlungsplan', en: 'Payment plan', ru: 'План оплаты' },
]

export const MIX_COPY: Record<
  MixLocale,
  { heading: string; ticked: string; all: string; none: string; hint: string }
> = {
  de: {
    heading: 'Module wählen',
    ticked: 'Module',
    all: 'Alle',
    none: 'Keine',
    hint: 'Hake an, was der Brief braucht. MIX wird nach Scope kalkuliert.',
  },
  en: {
    heading: 'Pick modules',
    ticked: 'Modules',
    all: 'All',
    none: 'None',
    hint: 'Tick what the brief needs. MIX is quoted by scope.',
  },
  ru: {
    heading: 'Выбор модулей',
    ticked: 'Модули',
    all: 'Все',
    none: 'Сброс',
    hint: 'Отметь, что нужно по брифу. MIX считается по объёму.',
  },
}

export const MIX_STORAGE_KEY = 'bcult-mix'

export function defaultMixOn(on = true): Record<string, boolean> {
  const out: Record<string, boolean> = {}
  for (const m of MIX_MODULES) out[m.id] = on
  return out
}

export function countMix(mixOn: Record<string, boolean>): number {
  return MIX_MODULES.reduce((n, m) => n + (mixOn[m.id] ? 1 : 0), 0)
}

export function mixLabel(m: MixMod, locale: MixLocale): string {
  return m[locale]
}

export function selectedMixLabels(mixOn: Record<string, boolean>, locale: MixLocale): string[] {
  return MIX_MODULES.filter((m) => mixOn[m.id]).map((m) => mixLabel(m, locale))
}
