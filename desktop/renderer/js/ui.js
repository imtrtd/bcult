/* Interface layer: filters, menu rail, search, command palette, grid view,
   panels, toasts, the custom cursor and the detail bar. */
(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const body = document.body;

  const raw = Array.isArray(window.ITD_PROJECTS) ? window.ITD_PROJECTS : [];
  const ALL = raw.map((p, i) => ({
    origin: i,
    title: String(p.title || 'UNTITLED'),
    category: String(p.category || 'MISC').toUpperCase(),
    stack: String(p.stack || '—').toUpperCase(),
    access: String(p.access || 'PRIVATE').toUpperCase(),
    status: p.status === 'live' ? 'live' : 'offline',
    url: typeof p.url === 'string' && /^https?:\/\//i.test(p.url) ? p.url : '',
    note: typeof p.note === 'string' ? p.note : ''
  }));

  const state = { filter: 'ALL', query: '', tour: false, grid: false, panel: null };
  let tourTimer = 0;

  /* ------------------------------------------------------------ commands */

  const commands = [];
  const register = (cmd) => { commands.push(cmd); return cmd; };
  const run = (id) => {
    const cmd = commands.find((c) => c.id === id);
    if (cmd) cmd.run();
  };

  /* ------------------------------------------------------------ toasts */

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

  /* ------------------------------------------------------------ working set */

  function matches(p) {
    if (state.filter === 'LIVE' && p.status !== 'live') return false;
    if (state.filter === 'OFFLINE' && p.status !== 'offline') return false;
    if (state.filter !== 'ALL' && state.filter !== 'LIVE' && state.filter !== 'OFFLINE' && p.category !== state.filter) return false;
    if (state.query) {
      const q = state.query.toUpperCase();
      if (!(p.title + ' ' + p.category + ' ' + p.stack + ' ' + p.access).includes(q)) return false;
    }
    return true;
  }

  function applySet({ keepCurrent = true, quiet = false } = {}) {
    const keepId = keepCurrent && window.ITD_SPIRAL.total ? window.ITD_SPIRAL.current().item?.origin : null;
    const list = ALL.filter(matches);
    const hits = list.length;
    $('hitcount').textContent = state.query ? String(hits).padStart(2, '0') : '';

    if (!hits) {
      if (!quiet) toast('НИЧЕГО НЕ НАЙДЕНО');
      return false;
    }
    window.ITD_SPIRAL.mount(list, keepId);
    $('coreCount').textContent = String(hits).padStart(2, '0');
    $('coreLabel').textContent = state.filter === 'ALL' && !state.query ? 'CONNECTED SCREENS' : 'IN VIEW';
    renderGrid(list);
    paintFilters();
    return true;
  }

  /* ------------------------------------------------------------ filters */

  function categories() {
    const seen = [];
    for (const p of ALL) if (!seen.includes(p.category)) seen.push(p.category);
    return seen;
  }

  function countFor(key) {
    return ALL.filter((p) => {
      if (key === 'ALL') return true;
      if (key === 'LIVE') return p.status === 'live';
      if (key === 'OFFLINE') return p.status === 'offline';
      return p.category === key;
    }).length;
  }

  function buildFilters() {
    const host = $('filters');
    host.textContent = '';
    const add = (key, label) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.key = key;
      const name = document.createElement('span');
      name.textContent = label;
      const cnt = document.createElement('span');
      cnt.className = 'cnt';
      cnt.textContent = String(countFor(key)).padStart(2, '0');
      b.append(name, cnt);
      b.addEventListener('click', () => setFilter(key));
      host.appendChild(b);
    };
    const rule = () => {
      const r = document.createElement('div');
      r.className = 'rule';
      host.appendChild(r);
    };

    add('ALL', 'ALL');
    rule();
    categories().forEach((c) => add(c, c));
    rule();
    add('LIVE', 'LIVE');
    add('OFFLINE', 'OFFLINE');

    const chips = $('gridFilters');
    chips.textContent = '';
    for (const key of ['ALL', ...categories(), 'LIVE', 'OFFLINE']) {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.key = key;
      b.innerHTML = `${key}<span class="cnt">${String(countFor(key)).padStart(2, '0')}</span>`;
      b.addEventListener('click', () => setFilter(key));
      chips.appendChild(b);
    }
    paintFilters();
  }

  function paintFilters() {
    for (const b of [...$('filters').querySelectorAll('button'), ...$('gridFilters').querySelectorAll('button')]) {
      b.classList.toggle('on', b.dataset.key === state.filter);
    }
    $('gridFilter').textContent = `FILTER · ${state.filter}${state.query ? ' · "' + state.query + '"' : ''}`;
  }

  function setFilter(key) {
    const prev = state.filter;
    state.filter = key;
    if (!applySet({ keepCurrent: false })) {
      state.filter = prev;
      applySet({ keepCurrent: false, quiet: true });
      return;
    }
    window.ITD_AUDIO.sweep();
    toast(`ФИЛЬТР · ${key} · ${window.ITD_SPIRAL.total}`);
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
    if (e.key === 'Enter') { $('searchInput').blur(); }
  });

  /* ------------------------------------------------------------ rail menu */

  const ICONS = {
    grid: '<rect x="1.5" y="1.5" width="5.5" height="5.5"/><rect x="9.5" y="1.5" width="5.5" height="5.5"/><rect x="1.5" y="9.5" width="5.5" height="5.5"/><rect x="9.5" y="9.5" width="5.5" height="5.5"/>',
    search: '<circle cx="7.2" cy="7.2" r="4.6"/><path d="M10.6 10.6L14.5 14.5"/>',
    tour: '<path d="M4.5 3.2l8.4 5.3-8.4 5.3z"/>',
    stop: '<rect x="4" y="4" width="8" height="8"/>',
    sound: '<path d="M3 6.4h2.6L9 3.4v9.2L5.6 9.6H3z"/><path d="M11.2 6a3.4 3.4 0 010 4"/><path d="M13 4.3a6 6 0 010 7.4"/>',
    mute: '<path d="M3 6.4h2.6L9 3.4v9.2L5.6 9.6H3z"/><path d="M11.4 6.4l3.2 3.2M14.6 6.4l-3.2 3.2"/>',
    shot: '<rect x="1.6" y="4.2" width="12.8" height="9.4"/><circle cx="8" cy="8.9" r="2.8"/><path d="M5.6 4.2l1.1-1.8h2.6l1.1 1.8"/>',
    pin: '<path d="M8 9.6V14"/><path d="M4.6 2.4h6.8l-1 3.1 2 2.2H3.6l2-2.2z"/>',
    info: '<circle cx="8" cy="8" r="6.4"/><path d="M8 7.2v4.2"/><circle cx="8" cy="4.9" r=".5"/>',
    keys: '<rect x="1.6" y="4" width="12.8" height="8"/><path d="M4.2 6.6h.01M6.6 6.6h.01M9 6.6h.01M11.4 6.6h.01M4.8 9.4h6.4"/>'
  };

  function buildRail() {
    const host = $('rail');
    host.textContent = '';
    const spec = [
      { id: 'view.grid', icon: 'grid', tip: 'СЕТКА · G' },
      { id: 'ui.search', icon: 'search', tip: 'ПОИСК · /' },
      { rule: true },
      { id: 'view.tour', icon: 'tour', tip: 'АВТО-ТУР · T' },
      { id: 'audio.toggle', icon: 'mute', tip: 'ЗВУК · M' },
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
      b.dataset.icon = s.icon;
      b.innerHTML = `<svg viewBox="0 0 16 16" aria-hidden="true">${ICONS[s.icon]}</svg><span class="tip">${s.tip}</span>`;
      b.addEventListener('click', () => run(s.id));
      host.appendChild(b);
    }
  }

  function setRailIcon(cmd, icon) {
    const b = $('rail').querySelector(`[data-cmd="${cmd}"]`);
    if (b) b.querySelector('svg').innerHTML = ICONS[icon];
  }

  function setRailOn(cmd, on) {
    const b = $('rail').querySelector(`[data-cmd="${cmd}"]`);
    if (b) b.classList.toggle('on', !!on);
  }

  /* ------------------------------------------------------------ detail bar */

  function kinetic(el, text) {
    el.textContent = '';
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.textContent = ch === ' ' ? ' ' : ch;
      s.style.animationDelay = `${Math.min(i * 14, 320)}ms`;
      el.appendChild(s);
    });
  }

  addEventListener('itd:change', (e) => {
    const { index, item, total } = e.detail;
    $('count').textContent = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    kinetic($('detailTitle'), item.title);
    $('detailMeta').textContent = `${item.category} · ${item.stack} · ${item.access}`;
    body.classList.toggle('muted-detail', item.status !== 'live');

    const live = item.status === 'live';
    $('statusText').textContent = live ? 'LIVE' : 'OFFLINE';
    $('statusPill').classList.toggle('off', !live);
    $('actOpen').disabled = !item.url;
    $('actOpen').textContent = item.url ? 'OPEN PROJECT' : (live ? 'NO LINK SET' : 'OFFLINE');

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

  function openPanel(html, id) {
    $('panel').innerHTML = html;
    $('panel').classList.add('open');
    body.classList.add('overlay');
    state.panel = id;
    window.ITD_SPIRAL.setEnabled(false);
    window.ITD_AUDIO.open();
    for (const b of $('panel').querySelectorAll('[data-cmd]')) {
      b.addEventListener('click', () => run(b.dataset.cmd));
    }
    const close = $('panel').querySelector('[data-close]');
    if (close) close.addEventListener('click', closePanel);
  }

  function closePanel() {
    if (!state.panel) return;
    $('panel').classList.remove('open');
    body.classList.remove('overlay');
    state.panel = null;
    window.ITD_SPIRAL.setEnabled(true);
    window.ITD_AUDIO.close();
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function showProjectInfo() {
    const { item, index, total } = window.ITD_SPIRAL.current();
    if (!item) return;
    openPanel(`
      <div class="kicker">${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')} · ${esc(item.category)}</div>
      <h2>${esc(item.title)}</h2>
      <div class="rows">
        <div class="row"><span>STATUS</span><span>${item.status === 'live' ? 'LIVE · РАБОЧИЙ' : 'OFFLINE · НЕ РАБОТАЕТ'}</span></div>
        <div class="row"><span>CATEGORY</span><span>${esc(item.category)}</span></div>
        <div class="row"><span>STACK</span><span>${esc(item.stack)}</span></div>
        <div class="row"><span>ACCESS</span><span>${esc(item.access)}</span></div>
        <div class="row"><span>LINK</span><span>${item.url ? esc(item.url) : '— НЕ ЗАДАНА (renderer/js/projects.js)'}</span></div>
        ${item.note ? `<div class="row"><span>NOTE</span><span>${esc(item.note)}</span></div>` : ''}
      </div>
      <div class="panel-actions">
        <button class="btn" data-cmd="project.open" ${item.url ? '' : 'disabled'} type="button">ОТКРЫТЬ ССЫЛКУ</button>
        <button class="btn ghost" data-cmd="project.copy" type="button">КОПИРОВАТЬ НАЗВАНИЕ</button>
        <button class="btn ghost" data-close type="button">ЗАКРЫТЬ · ESC</button>
      </div>`, 'project');
  }

  function showAbout() {
    const info = window.ITD_APP.cachedInfo || {};
    const keys = [
      ['КОЛЕСО / ПЕРЕТАСКИВАНИЕ', 'листать спираль'],
      ['↑ ↓ ← → · PGUP / PGDN', 'шаг по спине'],
      ['HOME / END', 'первый / последний'],
      ['1…9', 'перейти к номеру'],
      ['ENTER', 'открыть проект'],
      ['I', 'карточка проекта'],
      ['G', 'сетка / спираль'],
      ['/', 'поиск'],
      ['CTRL + K', 'палитра команд'],
      ['T', 'авто-тур'],
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
      <div class="panel-actions">
        <button class="btn ghost" data-close type="button">ЗАКРЫТЬ · ESC</button>
      </div>`, 'about');
  }

  $('scrim').addEventListener('click', () => { closePanel(); closePalette(); });

  /* ------------------------------------------------------------ grid view */

  function renderGrid(list) {
    const host = $('gridCards');
    host.textContent = '';
    list.forEach((p, i) => {
      const card = document.createElement('button');
      card.className = 'card';
      card.type = 'button';
      card.dataset.status = p.status;
      card.dataset.origin = String(p.origin);
      card.style.setProperty('--ch', [187, 318, 264, 208, 78, 342, 229, 171][p.origin % 8]);
      card.style.animationDelay = `${Math.min(i * 26, 520)}ms`;
      card.innerHTML = `
        <div class="card-idx">${String(i + 1).padStart(2, '0')}</div>
        <h3>${esc(p.title)}</h3>
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
    state.grid = on;
    body.classList.toggle('grid', on);
    setRailOn('view.grid', on);
    $('modeLabel').textContent = on ? 'GRID' : 'SPIRAL';
    window.ITD_SPIRAL.setEnabled(!on);
    if (on) { window.ITD_AUDIO.open(); $('gridView').scrollTop = 0; }
    else { window.ITD_AUDIO.close(); window.ITD_SPIRAL.nudge(); }
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
      .filter((p) => !q || p.title.includes(q) || p.category.includes(q))
      .map((p) => ({
        kind: 'GOTO',
        name: p.title,
        key: p.status === 'live' ? '' : 'OFFLINE',
        off: p.status !== 'live',
        run: () => {
          const inSet = window.ITD_SPIRAL.items.findIndex((x) => x.origin === p.origin);
          if (inSet >= 0) {
            window.ITD_SPIRAL.go(inSet);
          } else {
            state.filter = 'ALL';
            state.query = '';
            $('searchInput').value = '';
            applySet({ keepCurrent: false, quiet: true });
            window.ITD_SPIRAL.go(window.ITD_SPIRAL.items.findIndex((x) => x.origin === p.origin));
          }
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
        (item.off ? '<span class="off-flag">OFFLINE</span>' : '') +
        (item.key && !item.off ? `<span class="key">${esc(item.key)}</span>` : '');
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
    const hot = !!e.target.closest?.('button, .node, .card, a, input');
    body.classList.toggle('cursor-hot', hot);
  });

  let frames = 0, fpsMark = performance.now();
  function hud(now) {
    frames++;
    if (now - fpsMark >= 1000) {
      $('fps').textContent = String(Math.round(frames * 1000 / (now - fpsMark)));
      frames = 0;
      fpsMark = now;
    }
    tx += (cx - tx) * .16;
    ty += (cy - ty) * .16;
    trail.style.transform = `translate(${tx}px, ${ty}px)`;
    const d = new Date();
    $('clock').textContent = [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map((v) => String(v).padStart(2, '0')).join(':');
    requestAnimationFrame(hud);
  }
  requestAnimationFrame(hud);

  /* ------------------------------------------------------------ registry */

  register({ id: 'view.grid', name: 'СЕТКА / СПИРАЛЬ', keys: 'G', run: () => setGrid(!state.grid) });
  register({ id: 'ui.search', name: 'ПОИСК ПРОЕКТА', keys: '/', run: () => setSearching(!body.classList.contains('searching')) });
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
  register({ id: 'filter.all', name: 'ФИЛЬТР · ВСЕ', run: () => setFilter('ALL') });
  register({ id: 'filter.live', name: 'ФИЛЬТР · РАБОЧИЕ', run: () => setFilter('LIVE') });
  register({ id: 'filter.offline', name: 'ФИЛЬТР · НЕРАБОЧИЕ', run: () => setFilter('OFFLINE') });

  window.ITD_UI = {
    ALL,
    state,
    register,
    run,
    toast,
    setGrid,
    setTour,
    setSearching,
    setFilter,
    openPalette,
    closePalette,
    closePanel,
    showAbout,
    showProjectInfo,
    setRailIcon,
    setRailOn,
    applySet,
    isOverlayOpen: () => !!state.panel || body.classList.contains('palette-open'),
    isSearching: () => body.classList.contains('searching'),
    boot() {
      buildFilters();
      buildRail();
      applySet({ keepCurrent: false, quiet: true });
    }
  };
})();
