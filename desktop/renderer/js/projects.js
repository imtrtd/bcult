/* The spine. Edit this file to change what the app shows.
 *
 *   title       — name on the card
 *   description — one line shown on the active card, in the detail bar and in
 *                 the info panel. Written from the fields below — replace with
 *                 real copy per project.
 *   category    — drives the CATEGORY facet (any string; the dock builds itself)
 *   stack       — drives the STACK facet
 *   access      — PUBLIC / PRIVATE, drives the ACCESS facet
 *   status      — "live"    → full accent, link active
 *                 "paused"  → amber, half-drained (on hold, not dead)
 *                 "offline" → cold grey (not working / not reachable)
 *   url         — optional. With it, OPEN PROJECT and Enter open the browser.
 */
window.ITD_PROJECTS = [
  { title: "HOME / WEB OS",         description: "Оболочка рабочего стола I/TD — спираль проектов на чистом JavaScript.", category: "SYSTEM",     stack: "JAVASCRIPT", access: "PRIVATE", status: "offline", url: "https://app.imtryingtodesign.com/" },
  { title: "BRANDCULTURA LANDING",  description: "Посадочная страница бренда Brandcultura на статическом HTML.",          category: "BRAND",      stack: "HTML",       access: "PUBLIC",  status: "live" },
  { title: "NAMENLOS WEBSITE",      description: "Сайт Namenlos: витрина бренда, вёрстка без фреймворков.",               category: "BRAND",      stack: "HTML",       access: "PRIVATE", status: "live" },
  { title: "IMTRTD WEB",            description: "Основной веб-проект I/TD на TypeScript, публичный репозиторий.",        category: "BRAND",      stack: "TYPESCRIPT", access: "PUBLIC",  status: "live" },
  { title: "CUEBOX",                description: "Продукт Cuebox — первая публичная версия на TypeScript.",               category: "PRODUCT",    stack: "TYPESCRIPT", access: "PUBLIC",  status: "live", url: "https://app.imtryingtodesign.com/" },
  { title: "TATTOO DESIGN EDITOR",  description: "Редактор эскизов татуировок: холст, слои, экспорт.",                    category: "PRODUCT",    stack: "TYPESCRIPT", access: "PRIVATE", status: "live" },
  { title: "EVE SLACK AGENT",       description: "Агент EVE для Slack: команды, ответы, интеграции. Сейчас на паузе.",    category: "AI",         stack: "TYPESCRIPT", access: "PUBLIC",  status: "paused" },
  { title: "EVE CHAT",              description: "Чат-интерфейс к агенту EVE, закрытая разработка.",                      category: "AI",         stack: "TYPESCRIPT", access: "PRIVATE", status: "offline" },
  { title: "BRANDCULTURA REDESIGN", description: "Редизайн Brandcultura — новая сетка и типографика. На паузе.",          category: "BRAND",      stack: "HTML",       access: "PUBLIC",  status: "paused" },
  { title: "BRANDCULTURA CORE",     description: "Служебные скрипты и сборка инфраструктуры Brandcultura.",               category: "BRAND",      stack: "SHELL",      access: "PRIVATE", status: "offline" },
  { title: "NAMENLOS APP",          description: "Монорепозиторий приложения Namenlos: клиент, сервер, общие пакеты.",    category: "PRODUCT",    stack: "MONOREPO",   access: "PRIVATE", status: "offline" },
  { title: "CUEBOX V2",             description: "Вторая версия Cuebox: переписанное ядро, закрытая разработка.",         category: "PRODUCT",    stack: "TYPESCRIPT", access: "PRIVATE", status: "offline" },
  { title: "IMTRTD WWW",            description: "Витрина I/TD — эксперименты со стилями и анимацией на CSS.",            category: "BRAND",      stack: "CSS",        access: "PRIVATE", status: "offline" },
  { title: "PREMIUM MERCHANDISE",   description: "Эксперимент: конфигуратор премиального мерча.",                         category: "EXPERIMENT", stack: "TYPESCRIPT", access: "PRIVATE", status: "offline" },
  { title: "HAPPY BIRTHDAY",        description: "Поздравительный интерактив — небольшой эксперимент с анимацией.",       category: "EXPERIMENT", stack: "TYPESCRIPT", access: "PRIVATE", status: "offline" },
  { title: "NEXT.JS NAMENLOS",      description: "Перенос Namenlos на Next.js: маршрутизация и рендер на сервере.",       category: "SYSTEM",     stack: "TYPESCRIPT", access: "PRIVATE", status: "offline" },
  { title: "INTRO",                 description: "Концепт вступительной заставки I/TD.",                                  category: "EXPERIMENT", stack: "CONCEPT",    access: "PUBLIC",  status: "live" }
];
