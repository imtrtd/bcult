/* Interface layer: faceted filter dock, menu rail, themes, search, command
   palette, grid view, panels, toasts, cursor and the detail bar. */
(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const body = document.body;

  /* ------------------------------------------------------------ data */

  const raw = Array.isArray(window.ITD_PROJECTS) ? window.ITD_PROJECTS : [];
  const ALL = raw.map((p, i) => ({
    origin: i,
    title: String(p.title || 'UNTITLED'),
    description: String(p.description || '').trim(),
    category: String(p.category || 'MISC').toUpperCase(),
    stack: String(p.stack || '—').toUpperCase(),
    access: String(p.access || 'PRIVATE').toUpperCase(),
    status: ['live', 'paused', 'offline'].includes(p.status) ? p.status : 'offline',
    url: typeof p.url === 'string' && /^https?:\/\/./i.test(p.url) ? p.url : ''
  }));

  const STATUS_TEXT = {
    live: 'LIVE · РАБОЧИЙ',
    paused: 'PAUSED · НА ПАУЗЕ',
    offline: 'OFFLINE · НЕ РАБОТАЕТ'
  };

  /* ------------------------------------------------------------ themes */

  const THEMES = [
    { id: 'violet', name: 'VIOLET NEON', sub: 'исходная', sat: '100%', tint: 0, glass: 210, bgSat: 1, hues: [187, 318, 264, 208, 78, 342, 229, 171] },
    { id: 'ice', name: 'ICE', sub: 'холодная', sat: '92%', tint: 0, glass: 205, bgSat: .85, hues: [188, 200, 212, 224, 196, 176, 206, 218] },
    { id: 'magenta', name: 'MAGENTA', sub: 'горячая', sat: '100%', tint: 0, glass: 300, bgSat: 1, hues: [320, 336, 300, 348, 310, 288, 330, 356] },
    { id: 'solar', name: 'SOLAR', sub: 'янтарная', sat: '96%', tint: 0, glass: 34, bgSat: .95, hues: [38, 24, 48, 14, 56, 32, 42, 20] },
    { id: 'mono', name: 'MONO', sub: 'без цвета', sat: '7%', tint: 0, glass: 210, bgSat: .06, hues: [210, 210, 210, 210, 210, 210, 210, 210] }
  ];

  const BACKGROUNDS = [
    { id: 0, name: 'NEBULA', sub: 'облака и звёзды' },
    { id: 1, name: 'VOID', sub: 'только луч' },
    { id: 2, name: 'GRID', sub: 'уходящая сетка' },
    { id: 3, name: 'AURORA', sub: 'вертикальные полотна' }
  ];

  const SCALES = [
    { id: 0.9, name: 'S' },
    { id: 1, name: 'M' },
    { id: 1.15, name: 'L' },
    { id: 1.3, name: 'XL' }
  ];

  /* ------------------------------------------------------------ state */

  const state = {
    facets: { status: new Set(), category: new Set(), stack: new Set(), access: new Set() },
    query: '',
    tour: false,
    grid: false,
    panel: null,
    theme: 'violet',
    background: 0,
    scale: 1
  };
  let tourTimer = 0;

  const commands = [];
  const register = (cmd) => { commands.push(cmd); return cmd; };
  const run = (id) => {
    const cmd = commands.find((c) => c.id === id);
    if (cmd) cmd.run();
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function toast(text) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = text;
    $('toasts').appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 320);
    }, 2400);
  }

  /* ------------------------------------------------------------ facets */

  const FACETS = [
    { key: 'status', label: 'СТАТУС', values: ['live', 'paused', 'offline'], text: (v) => v.toUpperCase() },
    { key: 'category', label: 'КАТЕГОРИЯ', values: null, text: (v) => v },
    { key: 'stack', label: 'СТЕК', values: null, text: (v) => v },
    { key: 'access', label: 'ДОСТУП', values: null, text: (v) => v }
  ];

  function valuesOf(key) {
    const seen = [];
    for (const p of ALL) if (!seen.includes(p[key])) seen.push(p[key]);
    return seen;
  }

  function matches(p) {
    for (const f of FACETS) {
      const chosen = state.facets[f.key];
      if (chosen.size && !chosen.has(p[f.key])) return false;
    }
    if (state.query) {
      const q = state.query.toUpperCase();
      const hay = `${p.title} ${p.description.toUpperCase()} ${p.category} ${p.stack} ${p.access}`;
      if (!hay.includes(q)) return false;
    }
    return true;
  }

  /** How many projects a value would yield alongside the other facets. */
  function countFor(key, value) {
    return ALL.filter((p) => {
      if (p[key] !== value) return false;
      for (const f of FACETS) {
        if (f.key === key) continue;
        const chosen = state.facets[f.key];
        if (chosen.size && !chosen.has(p[f.key])) return false;
      }
      return true;
    }).length;
  }

  function activeFilterText() {
    const parts = [];
    for (const f of FACETS) {
      const chosen = state.facets[f.key];
      if (chosen.size) parts.push([...chosen].map((v) => v.toUpperCase()).join('/'));
    }
    if (state.query) parts.push(`"${state.query}"`);
    return parts.length ? parts.join(' · ') : 'ALL';
  }

  function buildDock() {
    const host = $('dockBody');
    host.textContent = '';
    for (const f of FACETS) {
      const group = document.createElement('section');
      group.className = 'facet';
      const h = document.createElement('h4');
      h.textContent = f.label;
      group.appendChild(h);

      for (const value of (f.values || valuesOf(f.key))) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'opt';
        b.dataset.facet = f.key;
        b.dataset.value = value;
        if (f.key === 'status') b.dataset.state = value;
        b.innerHTML = `<span class="box"></span><span class="name">${esc(f.text(value))}</span><span class="cnt">00</span>`;
        b.addEventListener('click', () => toggleFacet(f.key, value));
        group.appendChild(b);
      }
      host.appendChild(group);
    }
    paintDock();
  }

  function paintDock() {
    for (const b of $('dockBody').querySelectorAll('.opt')) {
      const { facet, value } = b.dataset;
      b.classList.toggle('on', state.facets[facet].has(value));
      b.querySelector('.cnt').textContent = String(countFor(facet, value)).padStart(2, '0');
    }
    $('gridFilter').textContent = `FILTER · ${activeFilterText()}`;
  }

  function toggleFacet(key, value) {
    const set = state.facets[key];
    if (set.has(value)) set.delete(value);
    else set.add(value);
    if (!applySet({ keepCurrent: false })) {
      // nothing matches — undo so the view never goes blank
      if (set.has(value)) set.delete(value);
      else set.add(value);
      applySet({ keepCurrent: false, quiet: true });
      toast('НЕТ ПРОЕКТОВ ПО ЭТИМ УСЛОВИЯМ');
      return;
    }
    window.ITD_AUDIO.sweep();
    dispatchEvent(new CustomEvent('itd:filter', { detail: { facets: serializeFacets() } }));
  }

  function resetFacets() {
    for (const f of FACETS) state.facets[f.key].clear();
    state.query = '';
    $('searchInput').value = '';
    applySet({ keepCurrent: false, quiet: true });
    dispatchEvent(new CustomEvent('itd:filter', { detail: { facets: serializeFacets() } }));
    toast('ФИЛЬТРЫ СБРОШЕНЫ');
  }

  const serializeFacets = () => {
    const out = {};
    for (const f of FACETS) out[f.key] = [...state.facets[f.key]];
    return out;
  };

  function restoreFacets(saved) {
    if (!saved || typeof saved !== 'object') return;
    for (const f of FACETS) {
      const list = Array.isArray(saved[f.key]) ? saved[f.key] : [];
      state.facets[f.key] = new Set(list.filter((v) => ALL.some((p) => p[f.key] === v)));
    }
  }

  /* ------------------------------------------------------------ working set */

  function applySet({ keepCurrent = true, quiet = false } = {}) {
    const keepId = keepCurrent && window.ITD_SPIRAL.total ? window.ITD_SPIRAL.current().item?.origin : null;
    const list = ALL.filter(matches);
    $('hitcount').textContent = state.query ? String(list.length).padStart(2, '0') : '';
    if (!list.length) {
      if (!quiet) toast('НИЧЕГО НЕ НАЙДЕНО');
      return false;
    }
    window.ITD_SPIRAL.mount(list, keepId);
    $('coreCount').textContent = String(list.length).padStart(2, '0');
    $('coreLabel').textContent = list.length === ALL.length ? 'CONNECTED SCREENS' : 'IN VIEW';
    $('dockCount').textContent = `${String(list.length).padStart(2, '0')} / ${String(ALL.length).padStart(2, '0')}`;
    renderGrid(list);
    paintDock();
    return true;
  }

  /* ------------------------------------------------------------ search */

  function setSearching(on) {
    body.classList.toggle('searching', on);
    if (on) {
      $('searchInput').focus();
      $('searchInput').select();
    } else {
      $('searchInput').blur();
      if (state.query) {
        state.query = '';
        $('searchInput').value = '';
        applySet({ keepCurrent: false });
      }
    }
  }

  $('searchInput').addEventListener('input', (e) => {
    state.query = e.target.value.trim();
    applySet({ keepCurrent: false, quiet: true });
  });
  $('searchInput').addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Escape') setSearching(false);
    if (e.key === 'Enter') $('searchInput').blur();
  });
  $('dockReset').addEventListener('click', resetFacets);

  /* ------------------------------------------------------------ rail */

  const ICONS = {
    grid: '<rect x="1.5" y="1.5" width="5.5" height="5.5"/><rect x="9.5" y="1.5" width="5.5" height="5.5"/><rect x="1.5" y="9.5" width="5.5" height="5.5"/><rect x="9.5" y="9.5" width="5.5" height="5.5"/>',
    search: '<circle cx="7.2" cy="7.2" r="4.6"/><path d="M10.6 10.6L14.5 14.5"/>',
    tour: '<path d="M4.5 3.2l8.4 5.3-8.4 5.3z"/>',
    stop: '<rect x="4" y="4" width="8" height="8"/>',
    sound: '<path d="M3 6.4h2.6L9 3.4v9.2L5.6 9.6H3z"/><path d="M11.2 6a3.4 3.4 0 010 4"/><path d="M13 4.3a6 6 0 010 7.4"/>',
    mute: '<path d="M3 6.4h2.6L9 3.4v9.2L5.6 9.6H3z"/><path d="M11.4 6.4l3.2 3.2M14.6 6.4l-3.2 3.2"/>',
    theme: '<circle cx="8" cy="8" r="6.4"/><path d="M8 1.6a6.4 6.4 0 000 12.8 2.1 2.1 0 001.5-3.6 2.1 2.1 0 011.5-3.6h1.8A6.4 6.4 0 008 1.6z"/>',
    shot: '<rect x="1.6" y="4.2" width="12.8" height="9.4"/><circle cx="8" cy="8.9" r="2.8"/><path d="M5.6 4.2l1.1-1.8h2.6l1.1 1.8"/>',
    pin: '<path d="M8 9.6V14"/><path d="M4.6 2.4h6.8l-1 3.1 2 2.2H3.6l2-2.2z"/>',
    info: '<circle cx="8" cy="8" r="6.4"/><path d="M8 7.2v4.2"/><circle cx="8" cy="4.9" r=".5"/>',
    keys: '<rect x="1.6" y="4" width="12.8" height="8"/><path d="M4.2 6.6h.01M6.6 6.6h.01M9 6.6h.01M11.4 6.6h.01M4.8 9.4h6.4"/>',
    apps: '<rect x="1.6" y="1.6" width="4.6" height="4.6" rx=".5"/><rect x="9.8" y="1.6" width="4.6" height="4.6" rx=".5"/><rect x="1.6" y="9.8" width="4.6" height="4.6" rx=".5"/><circle cx="12.1" cy="12.1" r="2.3"/>'
  };

  function buildRail() {
    const host = $('rail');
    host.textContent = '';
    const spec = [
      { id: 'view.grid', icon: 'grid', tip: 'СЕТКА · G' },
      { id: 'view.apps', icon: 'apps', tip: 'ПРИЛОЖЕНИЯ · L' },
      { id: 'ui.search', icon: 'search', tip: 'ПОИСК · /' },
      { rule: true },
      { id: 'view.tour', icon: 'tour', tip: 'АВТО-ТУР · T' },
      { id: 'audio.toggle', icon: 'mute', tip: 'ЗВУК · M' },
      { id: 'ui.theme', icon: 'theme', tip: 'ТЕМА И ФОН · B' },
      { rule: true },
      { id: 'app.snapshot', icon: 'shot', tip: 'КАДР · CTRL+S' },
      { id: 'window.pin', icon: 'pin', tip: 'ПОВЕРХ ОКОН · P' },
      { rule: true },
      { id: 'project.info', icon: 'info', tip: 'О ПРОЕКТЕ · I' },
      { id: 'app.about', icon: 'keys', tip: 'КЛАВИШИ · F1' }
    ];
    for (const s of spec) {
      if (s.rule) {
        const r = document.createElement('div');
        r.className = 'rule';
        host.appendChild(r);
        continue;
      }
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.cmd = s.id;
      b.innerHTML = `<svg viewBox="0 0 16 16" aria-hidden="true">${ICONS[s.icon]}</svg><span class="tip">${s.tip}</span>`;
      b.addEventListener('click', () => run(s.id));
      host.appendChild(b);
    }
  }

  const setRailIcon = (cmd, icon) => {
    const b = $('rail').querySelector(`[data-cmd="${cmd}"]`);
    if (b) b.querySelector('svg').innerHTML = ICONS[icon];
  };
  const setRailOn = (cmd, on) => {
    const b = $('rail').querySelector(`[data-cmd="${cmd}"]`);
    if (b) b.classList.toggle('on', !!on);
  };

  /* ------------------------------------------------------------ detail bar */

  function kinetic(el, text) {
    el.textContent = '';
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.textContent = ch === ' ' ? ' ' : ch;
      s.style.animationDelay = `${Math.min(i * 13, 300)}ms`;
      el.appendChild(s);
    });
  }

  addEventListener('itd:change', (e) => {
    const { index, item, total } = e.detail;
    $('count').textContent = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    kinetic($('detailTitle'), item.title);
    $('detailDesc').textContent = item.description;
    $('detailMeta').textContent = `${item.category} · ${item.stack} · ${item.access}`;
    body.classList.toggle('muted-detail', item.status === 'offline');
    body.classList.toggle('paused-detail', item.status === 'paused');

    $('statusText').textContent = item.status.toUpperCase();
    $('statusPill').classList.toggle('off', item.status === 'offline');
    $('statusPill').classList.toggle('paused', item.status === 'paused');
    $('actOpen').disabled = !item.url;
    $('actOpen').textContent = item.url ? 'OPEN PROJECT'
      : item.status === 'live' ? 'NO LINK SET'
        : item.status === 'paused' ? 'PAUSED · NO LINK'
          : 'OFFLINE';

    for (const card of $('gridCards').children) {
      card.classList.toggle('current', Number(card.dataset.origin) === item.origin);
    }
    window.ITD_AUDIO.tune(e.detail.hue);
  });

  addEventListener('itd:snap', () => window.ITD_AUDIO.step());
  addEventListener('itd:activate', () => openProject());

  function openProject() {
    const { item } = window.ITD_SPIRAL.current();
    if (!item) return;
    if (item.url) {
      window.ITD_APP.openExternal(item.url);
      toast('ОТКРЫТО В БРАУЗЕРЕ');
    } else {
      showProjectInfo();
    }
  }

  $('actOpen').addEventListener('click', openProject);
  $('actInfo').addEventListener('click', () => showProjectInfo());

  /* ------------------------------------------------------------ panels */

  function openPanel(html, id, onMount) {
    $('panel').innerHTML = html;
    $('panel').classList.add('open');
    body.classList.add('overlay');
    state.panel = id;
    window.ITD_SPIRAL.setEnabled(false);
    window.ITD_AUDIO.open();
    for (const b of $('panel').querySelectorAll('[data-cmd]')) b.addEventListener('click', () => run(b.dataset.cmd));
    for (const b of $('panel').querySelectorAll('[data-theme]')) b.addEventListener('click', () => setTheme(b.dataset.theme, true));
    for (const b of $('panel').querySelectorAll('[data-bg]')) b.addEventListener('click', () => setBackground(Number(b.dataset.bg), true));
    for (const b of $('panel').querySelectorAll('[data-scale]')) b.addEventListener('click', () => setScale(Number(b.dataset.scale), true));
    const close = $('panel').querySelector('[data-close]');
    if (close) close.addEventListener('click', closePanel);
    if (typeof onMount === 'function') onMount($('panel'));
  }

  function closePanel() {
    if (!state.panel) return;
    $('panel').classList.remove('open');
    body.classList.remove('overlay');
    state.panel = null;
    window.ITD_SPIRAL.setEnabled(!state.grid && !body.classList.contains('apps'));
    window.ITD_AUDIO.close();
  }

  function showProjectInfo() {
    const { item, index, total } = window.ITD_SPIRAL.current();
    if (!item) return;
    openPanel(`
      <div class="kicker">${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')} · ${esc(item.category)}</div>
      <h2>${esc(item.title)}</h2>
      <p class="lede">${esc(item.description || 'Описание не задано — добавьте поле description в renderer/js/projects.js.')}</p>
      <div class="rows">
        <div class="row"><span>STATUS</span><span>${STATUS_TEXT[item.status]}</span></div>
        <div class="row"><span>CATEGORY</span><span>${esc(item.category)}</span></div>
        <div class="row"><span>STACK</span><span>${esc(item.stack)}</span></div>
        <div class="row"><span>ACCESS</span><span>${esc(item.access)}</span></div>
        <div class="row"><span>LINK</span><span>${item.url ? esc(item.url) : '— НЕ ЗАДАНА (renderer/js/projects.js)'}</span></div>
      </div>
      <div class="panel-actions">
        <button class="btn" data-cmd="project.open" ${item.url ? '' : 'disabled'} type="button">ОТКРЫТЬ ССЫЛКУ</button>
        <button class="btn ghost" data-cmd="project.copy" type="button">КОПИРОВАТЬ НАЗВАНИЕ</button>
        <button class="btn ghost" data-close type="button">ЗАКРЫТЬ · ESC</button>
      </div>`, 'project');
  }

  function showTheme() {
    const swatch = (t) => `
      <button class="swatch ${t.id === state.theme ? 'on' : ''}" data-theme="${t.id}" type="button">
        <span class="bars">${t.hues.slice(0, 5).map((h) => `<i style="background:hsl(${h} ${t.sat} 58%)"></i>`).join('')}</span>
        <span class="name">${t.name}</span><span class="sub">${t.sub}</span>
      </button>`;
    const bg = (b) => `
      <button class="swatch ${b.id === state.background ? 'on' : ''}" data-bg="${b.id}" type="button">
        <span class="name">${b.name}</span><span class="sub">${b.sub}</span>
      </button>`;
    const sc = (s) => `<button class="btn ${s.id === state.scale ? '' : 'ghost'}" data-scale="${s.id}" type="button">${s.name}</button>`;

    openPanel(`
      <div class="kicker">ОФОРМЛЕНИЕ</div>
      <h2>ТЕМА И ФОН</h2>
      <p class="lede">Цвет карточек и луча, фон сцены и масштаб интерфейса. Выбор сохраняется.</p>
      <div class="swatches">${THEMES.map(swatch).join('')}</div>
      <div class="kicker" style="margin-top:22px">ФОН СЦЕНЫ</div>
      <div class="swatches">${BACKGROUNDS.map(bg).join('')}</div>
      <div class="kicker" style="margin-top:22px">МАСШТАБ ИНТЕРФЕЙСА</div>
      <div class="panel-actions">${SCALES.map(sc).join('')}</div>
      <div class="panel-actions">
        <button class="btn ghost" data-cmd="view.quality" type="button">КАЧЕСТВО ФОНА</button>
        <button class="btn ghost" data-cmd="ui.cursor" type="button">КУРСОР</button>
        <button class="btn ghost" data-close type="button">ЗАКРЫТЬ · ESC</button>
      </div>`, 'theme');
  }

  function showAbout() {
    const info = window.ITD_APP.cachedInfo || {};
    const keys = [
      ['КОЛЕСО / ПЕРЕТАСКИВАНИЕ', 'двигать карточки вдоль луча'],
      ['↑ ↓ ← → · PGUP / PGDN', 'шаг по лучу'],
      ['HOME / END', 'первый / последний'],
      ['1…9', 'перейти к номеру'],
      ['ENTER', 'открыть проект'],
      ['I', 'карточка проекта'],
      ['G', 'сетка / спираль'],
      ['L', 'приложения (Telegram, браузеры…)'],
      ['/', 'поиск'],
      ['B', 'тема и фон'],
      ['D', 'скрыть / показать фильтры'],
      ['CTRL + K', 'палитра команд'],
      ['T · ПРОБЕЛ', 'авто-тур'],
      ['M', 'звук'],
      ['P', 'поверх других окон'],
      ['CTRL + S', 'сохранить кадр'],
      ['F11 · ESC', 'полный экран / выход'],
      ['CTRL + R', 'перезагрузить'],
      ['CTRL + Q', 'выход']
    ];
    openPanel(`
      <div class="kicker">I/TD WEB OS · DESKTOP BUILD</div>
      <h2>NEON SPIRAL</h2>
      <div class="rows">
        ${keys.map(([k, v]) => `<div class="row"><span>${esc(k)}</span><span>${esc(v)}</span></div>`).join('')}
        <div class="row"><span>ВЕРСИЯ</span><span>${esc(info.version || '—')} · ELECTRON ${esc(info.electron || '—')}</span></div>
        <div class="row"><span>ДАННЫЕ</span><span>${esc(info.userData || '—')}</span></div>
      </div>
      <div class="panel-actions"><button class="btn ghost" data-close type="button">ЗАКРЫТЬ · ESC</button></div>`, 'about');
  }

  $('scrim').addEventListener('click', () => { closePanel(); closePalette(); });

  /* ------------------------------------------------------------ theme */

  function setTheme(id, announce) {
    const t = THEMES.find((x) => x.id === id) || THEMES[0];
    state.theme = t.id;
    window.ITD_PALETTE = t.hues;
    const root = document.documentElement.style;
    root.setProperty('--sat', t.sat);
    root.setProperty('--tint', String(t.tint));
    root.setProperty('--glass-tint', String(t.glass));
    if (window.ITD_BG) window.ITD_BG.set({ sat: t.bgSat, tint: t.tint });
    applySet({ quiet: true });
    if (state.panel === 'theme') showTheme();
    if (announce) {
      toast(`ТЕМА · ${t.name}`);
      dispatchEvent(new CustomEvent('itd:appearance', { detail: appearance() }));
    }
  }

  function setBackground(id, announce) {
    state.background = BACKGROUNDS.some((b) => b.id === id) ? id : 0;
    if (window.ITD_BG) window.ITD_BG.set({ mode: state.background });
    if (state.panel === 'theme') showTheme();
    if (announce) {
      toast(`ФОН · ${BACKGROUNDS[state.background].name}`);
      dispatchEvent(new CustomEvent('itd:appearance', { detail: appearance() }));
    }
  }

  function setScale(v, announce) {
    state.scale = Math.max(0.9, Math.min(1.3, v || 1));
    document.documentElement.style.setProperty('--ui', String(state.scale));
    requestAnimationFrame(() => window.ITD_SPIRAL.remeasure());
    if (state.panel === 'theme') showTheme();
    if (announce) {
      toast(`МАСШТАБ · ${Math.round(state.scale * 100)}%`);
      dispatchEvent(new CustomEvent('itd:appearance', { detail: appearance() }));
    }
  }

  const appearance = () => ({ theme: state.theme, background: state.background, scale: state.scale });

  /* ------------------------------------------------------------ grid */

  function renderGrid(list) {
    const host = $('gridCards');
    host.textContent = '';
    const hues = window.ITD_PALETTE || [187, 318, 264, 208, 78, 342, 229, 171];
    list.forEach((p, i) => {
      const card = document.createElement('button');
      card.className = 'card';
      card.type = 'button';
      card.dataset.status = p.status;
      card.dataset.origin = String(p.origin);
      card.style.setProperty('--ch', hues[p.origin % hues.length]);
      card.style.animationDelay = `${Math.min(i * 24, 480)}ms`;
      card.innerHTML = `
        <div class="card-head">
          <span class="card-idx">${String(i + 1).padStart(2, '0')}</span>
          ${p.status === 'live' ? '' : `<span class="state-chip">${p.status.toUpperCase()}</span>`}
        </div>
        <h3>${esc(p.title)}</h3>
        <p class="card-desc">${esc(p.description)}</p>
        <div class="card-meta"><i class="dot"></i><span>${esc(p.category)} · ${esc(p.stack)} · ${esc(p.access)}</span></div>`;
      card.addEventListener('click', () => {
        window.ITD_SPIRAL.go(i);
        setGrid(false);
      });
      host.appendChild(card);
    });
    $('gridCount').textContent = `${String(list.length).padStart(2, '0')} PROJECTS`;
  }

  function setGrid(on) {
    if (on && window.ITD_LAUNCHER) window.ITD_LAUNCHER.close();
    state.grid = on;
    body.classList.toggle('grid', on);
    setRailOn('view.grid', on);
    $('modeLabel').textContent = on ? 'GRID' : 'SPIRAL';
    window.ITD_SPIRAL.setEnabled(!on && !state.panel && !body.classList.contains('apps'));
    if (on) { window.ITD_AUDIO.open(); $('gridView').scrollTop = 0; }
    else { window.ITD_AUDIO.close(); window.ITD_SPIRAL.nudge(); }
  }

  function setDock(on, announce) {
    body.classList.toggle('no-dock', !on);
    requestAnimationFrame(() => window.ITD_SPIRAL.remeasure());
    setTimeout(() => window.ITD_SPIRAL.remeasure(), 480);
    if (announce) dispatchEvent(new CustomEvent('itd:dock', { detail: { on } }));
  }

  /* ------------------------------------------------------------ tour */

  function setTour(on) {
    state.tour = on;
    setRailOn('view.tour', on);
    setRailIcon('view.tour', on ? 'stop' : 'tour');
    clearInterval(tourTimer);
    if (on) {
      tourTimer = setInterval(() => window.ITD_SPIRAL.next(), 2800);
      toast('АВТО-ТУР ВКЛЮЧЁН');
    } else {
      toast('АВТО-ТУР ОСТАНОВЛЕН');
    }
  }
  const pauseTour = () => { if (state.tour) setTour(false); };
  addEventListener('wheel', pauseTour, { passive: true });
  addEventListener('pointerdown', pauseTour);

  /* ------------------------------------------------------------ palette */

  let paletteItems = [], paletteSel = 0;

  function openPalette() {
    body.classList.add('palette-open', 'overlay');
    window.ITD_SPIRAL.setEnabled(false);
    $('paletteInput').value = '';
    fillPalette('');
    $('paletteInput').focus();
    window.ITD_AUDIO.open();
  }

  function closePalette() {
    if (!body.classList.contains('palette-open')) return;
    body.classList.remove('palette-open');
    if (!state.panel) body.classList.remove('overlay');
    $('paletteInput').blur();
    window.ITD_SPIRAL.setEnabled(!state.grid && !state.panel);
    window.ITD_AUDIO.close();
  }

  function fillPalette(query) {
    const q = query.trim().toUpperCase();
    const cmds = commands
      .filter((c) => !c.hidden && (!q || c.name.toUpperCase().includes(q)))
      .map((c) => ({ kind: 'CMD', name: c.name, key: c.keys || '', run: c.run }));
    const projects = ALL
      .filter((p) => !q || p.title.includes(q) || p.category.includes(q) || p.description.toUpperCase().includes(q))
      .map((p) => ({
        kind: 'GOTO',
        name: p.title,
        off: p.status !== 'live',
        flag: p.status === 'live' ? '' : p.status.toUpperCase(),
        run: () => {
          let at = window.ITD_SPIRAL.items.findIndex((x) => x.origin === p.origin);
          if (at < 0) {
            resetFacets();
            at = window.ITD_SPIRAL.items.findIndex((x) => x.origin === p.origin);
          }
          if (at >= 0) window.ITD_SPIRAL.go(at);
          if (state.grid) setGrid(false);
        }
      }));

    paletteItems = [...cmds, ...projects].slice(0, 60);
    paletteSel = 0;
    const ul = $('paletteList');
    ul.textContent = '';
    paletteItems.forEach((item, i) => {
      const li = document.createElement('li');
      li.setAttribute('aria-selected', String(i === 0));
      li.innerHTML = `<span class="kind">${item.kind}</span><span class="name">${esc(item.name)}</span>` +
        (item.off ? `<span class="off-flag ${item.flag === 'PAUSED' ? 'paused' : ''}">${esc(item.flag)}</span>` : '') +
        (item.key ? `<span class="key">${esc(item.key)}</span>` : '');
      li.addEventListener('click', () => { item.run(); closePalette(); });
      ul.appendChild(li);
    });
  }

  function movePalette(delta) {
    if (!paletteItems.length) return;
    paletteSel = (paletteSel + delta + paletteItems.length) % paletteItems.length;
    const ul = $('paletteList');
    [...ul.children].forEach((li, i) => li.setAttribute('aria-selected', String(i === paletteSel)));
    ul.children[paletteSel]?.scrollIntoView({ block: 'nearest' });
  }

  $('paletteInput').addEventListener('input', (e) => fillPalette(e.target.value));
  $('paletteInput').addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'ArrowDown') { e.preventDefault(); movePalette(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); movePalette(-1); }
    else if (e.key === 'Enter') {
      const item = paletteItems[paletteSel];
      closePalette();
      if (item) item.run();
    } else if (e.key === 'Escape') closePalette();
  });

  /* ------------------------------------------------------------ cursor + hud */

  const cursor = $('cursor'), trail = $('cursorTrail');
  let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;

  addEventListener('pointermove', (e) => {
    cx = e.clientX;
    cy = e.clientY;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    const nx = (cx / innerWidth - .5) * 2, ny = (cy / innerHeight - .5) * 2;
    document.documentElement.style.setProperty('--px', nx.toFixed(3));
    document.documentElement.style.setProperty('--py', ny.toFixed(3));
    if (window.ITD_BG) window.ITD_BG.set({ px: nx, py: ny });
    body.classList.toggle('cursor-hot', !!e.target.closest?.('button, .node, .card, a, input'));
  }, { passive: true });

  let frames = 0, fpsMark = performance.now(), clockMark = 0;
  function hud(now) {
    frames++;
    if (now - fpsMark >= 1000) {
      $('fps').textContent = String(Math.round(frames * 1000 / (now - fpsMark)));
      frames = 0;
      fpsMark = now;
    }
    if (now - clockMark >= 1000) {
      clockMark = now;
      const d = new Date();
      $('clock').textContent = [d.getHours(), d.getMinutes(), d.getSeconds()].map((v) => String(v).padStart(2, '0')).join(':');
    }
    tx += (cx - tx) * .16;
    ty += (cy - ty) * .16;
    trail.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
    requestAnimationFrame(hud);
  }
  requestAnimationFrame(hud);

  /* ------------------------------------------------------------ commands */

  register({ id: 'view.grid', name: 'СЕТКА / СПИРАЛЬ', keys: 'G', run: () => setGrid(!state.grid) });
  register({ id: 'ui.search', name: 'ПОИСК ПРОЕКТА', keys: '/', run: () => setSearching(!body.classList.contains('searching')) });
  register({ id: 'ui.theme', name: 'ТЕМА И ФОН', keys: 'B', run: () => (state.panel === 'theme' ? closePanel() : showTheme()) });
  register({ id: 'ui.dock', name: 'ПАНЕЛЬ ФИЛЬТРОВ', keys: 'D', run: () => setDock(body.classList.contains('no-dock'), true) });
  register({ id: 'filter.reset', name: 'СБРОСИТЬ ФИЛЬТРЫ', run: resetFacets });
  register({ id: 'view.tour', name: 'АВТО-ТУР', keys: 'T', run: () => setTour(!state.tour) });
  register({ id: 'project.info', name: 'КАРТОЧКА ПРОЕКТА', keys: 'I', run: () => (state.panel === 'project' ? closePanel() : showProjectInfo()) });
  register({ id: 'project.open', name: 'ОТКРЫТЬ ПРОЕКТ', keys: 'ENTER', run: openProject });
  register({
    id: 'project.copy',
    name: 'КОПИРОВАТЬ НАЗВАНИЕ',
    run: () => {
      const { item } = window.ITD_SPIRAL.current();
      if (!item) return;
      navigator.clipboard?.writeText(item.title).then(() => toast('СКОПИРОВАНО'), () => toast('НЕ УДАЛОСЬ СКОПИРОВАТЬ'));
    }
  });
  register({ id: 'app.about', name: 'КЛАВИШИ И О ПРИЛОЖЕНИИ', keys: 'F1', run: () => (state.panel === 'about' ? closePanel() : showAbout()) });
  for (const t of THEMES) register({ id: `theme.${t.id}`, name: `ТЕМА · ${t.name}`, run: () => setTheme(t.id, true) });
  for (const b of BACKGROUNDS) register({ id: `bg.${b.id}`, name: `ФОН · ${b.name}`, run: () => setBackground(b.id, true) });

  /* ------------------------------------------------------------ export */

  window.ITD_UI = {
    ALL, state, register, run, toast,
    setGrid, setTour, setSearching, setDock, setTheme, setBackground, setScale,
    resetFacets, applySet, appearance, serializeFacets,
    openPalette, closePalette, openPanel, closePanel, showAbout, showProjectInfo, showTheme,
    setRailIcon, setRailOn,
    isOverlayOpen: () => !!state.panel || body.classList.contains('palette-open'),
    isSearching: () => body.classList.contains('searching'),
    boot(saved = {}) {
      if (saved.theme) setTheme(saved.theme, false);
      else setTheme('violet', false);
      setBackground(Number(saved.background) || 0, false);
      setScale(Number(saved.scale) || 1, false);
      restoreFacets(saved.facets);
      if (saved.dock === false) body.classList.add('no-dock');
      buildDock();
      buildRail();
      if (!applySet({ keepCurrent: false, quiet: true })) {
        resetFacets();
      }
    }
  };
})();
