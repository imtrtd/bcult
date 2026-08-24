/* The spine. Edit this file to change what the app shows.
 *
 *   title     — name on the card
 *   category  — used by the left-hand filters (any string; filters build themselves)
 *   stack     — free text, shown in the meta line
 *   access    — PUBLIC / PRIVATE, shown in the meta line
 *   status    — "live"    → full neon treatment (working project)
 *               "offline" → muted, desaturated card (not working / not reachable)
 *   url       — optional. With it, OPEN PROJECT and Enter open the link in the browser.
 *   note      — optional line shown in the info panel (Enter / I).
 */
window.ITD_PROJECTS = [
  { title: "HOME / WEB OS",         category: "SYSTEM",     stack: "JAVASCRIPT", access: "PRIVATE", status: "offline" },
  { title: "BRANDCULTURA LANDING",  category: "BRAND",      stack: "HTML",       access: "PUBLIC",  status: "live" },
  { title: "NAMENLOS WEBSITE",      category: "BRAND",      stack: "HTML",       access: "PRIVATE", status: "offline" },
  { title: "IMTRTD WEB",            category: "BRAND",      stack: "TYPESCRIPT", access: "PUBLIC",  status: "live" },
  { title: "CUEBOX",                category: "PRODUCT",    stack: "TYPESCRIPT", access: "PUBLIC",  status: "live" },
  { title: "TATTOO DESIGN EDITOR",  category: "PRODUCT",    stack: "TYPESCRIPT", access: "PRIVATE", status: "offline" },
  { title: "EVE SLACK AGENT",       category: "AI",         stack: "TYPESCRIPT", access: "PUBLIC",  status: "live" },
  { title: "EVE CHAT",              category: "AI",         stack: "TYPESCRIPT", access: "PRIVATE", status: "offline" },
  { title: "BRANDCULTURA REDESIGN", category: "BRAND",      stack: "HTML",       access: "PUBLIC",  status: "live" },
  { title: "BRANDCULTURA CORE",     category: "BRAND",      stack: "SHELL",      access: "PRIVATE", status: "offline" },
  { title: "NAMENLOS APP",          category: "PRODUCT",    stack: "MONOREPO",   access: "PRIVATE", status: "offline" },
  { title: "CUEBOX V2",             category: "PRODUCT",    stack: "TYPESCRIPT", access: "PRIVATE", status: "offline" },
  { title: "IMTRTD WWW",            category: "BRAND",      stack: "CSS",        access: "PRIVATE", status: "offline" },
  { title: "PREMIUM MERCHANDISE",   category: "EXPERIMENT", stack: "TYPESCRIPT", access: "PRIVATE", status: "offline" },
  { title: "HAPPY BIRTHDAY",        category: "EXPERIMENT", stack: "TYPESCRIPT", access: "PRIVATE", status: "offline" },
  { title: "NEXT.JS NAMENLOS",      category: "SYSTEM",     stack: "TYPESCRIPT", access: "PRIVATE", status: "offline" },
  { title: "INTRO",                 category: "EXPERIMENT", stack: "CONCEPT",    access: "PUBLIC",  status: "live" }
];
