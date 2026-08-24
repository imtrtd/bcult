/* Desktop glue: window chrome, Electron-only commands, settings, keymap, boot. */
(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const body = document.body;
  const api = window.itd || null;
  const UI = window.ITD_UI;
  const SPIRAL = window.ITD_SPIRAL;

  const settings = { sound: false, filter: 'ALL', quality: 0.55, cursor: true };
  let saveTimer = 0;

  function save() {
    if (!api) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => api.settingsSet({ ...settings }), 250);
  }

  window.ITD_APP = {
    cachedInfo: {},
    openExternal(url) {
      if (api) api.openExternal(url);
      else window.open(url, '_blank', 'noopener');
    },
    settings
  };

  /* ------------------------------------------------------------ window chrome */

  if (api) {
    $('btnMin').addEventListener('click', () => api.minimize());
    $('btnMax').addEventListener('click', () => api.toggleMaximize());
    $('btnClose').addEventListener('click', () => api.close());

    const paint = (s) => {
      body.classList.toggle('maximized', !!s.maximized);
      body.classList.toggle('fullscreen', !!s.fullscreen);
      UI.setRailOn('window.pin', !!s.pinned);
      SPIRAL.nudge();
    };
    api.onState(paint);
    api.queryState().then(paint).catch(() => {});
    api.onSnapshotResult((r) => UI.toast(r && r.ok ? 'КАДР СОХРАНЁН' : 'СОХРАНЕНИЕ ОТМЕНЕНО'));
    api.info().then((info) => { window.ITD_APP.cachedInfo = info || {}; }).catch(() => {});
  } else {
    $('titlebar').remove();
    document.documentElement.style.setProperty('--tb', '0px');
  }

  /* ------------------------------------------------------------ commands */

  UI.register({
    id: 'audio.toggle',
    name: 'ЗВУК ВКЛ / ВЫКЛ',
    keys: 'M',
    run: () => {
      const on = window.ITD_AUDIO.toggle();
      settings.sound = on;
      save();
      UI.setRailOn('audio.toggle', on);
      UI.setRailIcon('audio.toggle', on ? 'sound' : 'mute');
      UI.toast(on ? 'ЗВУК ВКЛЮЧЁН' : 'ЗВУК ВЫКЛЮЧЕН');
    }
  });

  UI.register({
    id: 'app.snapshot',
    name: 'СОХРАНИТЬ КАДР (PNG)',
    keys: 'CTRL+S',
    run: async () => {
      if (!api) return UI.toast('ДОСТУПНО ТОЛЬКО В ПРИЛОЖЕНИИ');
      const r = await api.snapshot();
      UI.toast(r && r.ok ? 'КАДР СОХРАНЁН' : 'СОХРАНЕНИЕ ОТМЕНЕНО');
    }
  });

  UI.register({
    id: 'window.pin',
    name: 'ПОВЕРХ ДРУГИХ ОКОН',
    keys: 'P',
    run: async () => {
      if (!api) return UI.toast('ДОСТУПНО ТОЛЬКО В ПРИЛОЖЕНИИ');
      const on = await api.togglePin();
      UI.setRailOn('window.pin', on);
      UI.toast(on ? 'ОКНО ЗАКРЕПЛЕНО СВЕРХУ' : 'ЗАКРЕПЛЕНИЕ СНЯТО');
    }
  });

  UI.register({
    id: 'window.fullscreen',
    name: 'ПОЛНЫЙ ЭКРАН',
    keys: 'F11',
    run: () => api && api.toggleFullscreen()
  });

  UI.register({
    id: 'view.quality',
    name: 'ФОН: КАЧЕСТВО / ПРОИЗВОДИТЕЛЬНОСТЬ',
    run: () => {
      settings.quality = settings.quality >= 0.8 ? 0.35 : settings.quality >= 0.5 ? 0.9 : 0.55;
      window.ITD_BG.quality(settings.quality);
      save();
      UI.toast(`ФОН · ${Math.round(settings.quality * 100)}%`);
    }
  });

  UI.register({
    id: 'ui.cursor',
    name: 'СВОЙ КУРСОР ВКЛ / ВЫКЛ',
    run: () => {
      settings.cursor = !settings.cursor;
      body.classList.toggle('no-custom-cursor', !settings.cursor);
      save();
      UI.toast(settings.cursor ? 'КУРСОР: НЕОН' : 'КУРСОР: СИСТЕМНЫЙ');
    }
  });

  UI.register({ id: 'app.reload', name: 'ПЕРЕЗАГРУЗИТЬ', keys: 'CTRL+R', run: () => location.reload() });
  UI.register({ id: 'app.quit', name: 'ВЫЙТИ', keys: 'CTRL+Q', run: () => api && api.close() });

  /* ------------------------------------------------------------ keymap */

  addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement) return;

    if (e.key === 'Escape') {
      if (UI.isOverlayOpen()) { UI.closePalette(); UI.closePanel(); }
      else if (UI.isSearching()) UI.setSearching(false);
      else if (UI.state.grid) UI.setGrid(false);
      else if (api) api.leaveFullscreen();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyK') { e.preventDefault(); UI.openPalette(); return; }
    if (e.key === 'F1') { e.preventDefault(); UI.run('app.about'); return; }
    if (e.key === 'F11') { e.preventDefault(); UI.run('window.fullscreen'); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;      // leave the menu accelerators alone
    if (UI.isOverlayOpen()) return;

    switch (e.code) {
      case 'ArrowDown': case 'ArrowRight': case 'PageDown': SPIRAL.next(); return;
      case 'ArrowUp': case 'ArrowLeft': case 'PageUp': SPIRAL.prev(); return;
      case 'Home': SPIRAL.first(); return;
      case 'End': SPIRAL.last(); return;
      case 'Enter': UI.run('project.open'); return;
      case 'KeyG': UI.run('view.grid'); return;
      case 'KeyT': case 'Space': e.preventDefault(); UI.run('view.tour'); return;
      case 'KeyM': UI.run('audio.toggle'); return;
      case 'KeyP': UI.run('window.pin'); return;
      case 'KeyI': UI.run('project.info'); return;
      case 'Slash': e.preventDefault(); UI.run('ui.search'); return;
    }

    if (/^Digit[1-9]$/.test(e.code)) {
      const n = Number(e.code.slice(5)) - 1;
      if (n < SPIRAL.total) SPIRAL.go(n);
    }
  });

  /* ------------------------------------------------------------ boot */

  const STEPS = ['BOOTING SPINE…', 'LOADING SCREENS', 'CALIBRATING NEON', 'READY'];

  async function boot() {
    window.ITD_BG.init($('bg'));

    if (api) {
      try {
        Object.assign(settings, await api.settingsGet());
      } catch { /* first run */ }
    }
    if (typeof settings.quality === 'number') window.ITD_BG.quality(settings.quality);
    if (settings.cursor === false) body.classList.add('no-custom-cursor');

    UI.boot();

    if (settings.filter && settings.filter !== 'ALL') UI.setFilter(settings.filter);
    UI.setRailIcon('audio.toggle', settings.sound ? 'sound' : 'mute');

    let step = 0;
    const bar = $('bootBar');
    const tick = setInterval(() => {
      step++;
      bar.style.width = `${Math.min(100, step * 34)}%`;
      $('bootLine').textContent = STEPS[Math.min(step, STEPS.length - 1)];
      if (step >= 3) {
        clearInterval(tick);
        setTimeout(() => {
          body.classList.add('booted');
          if (settings.sound) {
            const on = window.ITD_AUDIO.set(true);
            UI.setRailOn('audio.toggle', on);
            UI.setRailIcon('audio.toggle', on ? 'sound' : 'mute');
          }
        }, 320);
      }
    }, 260);
  }

  // remember the last filter the user picked — the rail, the grid chips and the
  // palette all land here, so this catches every path
  addEventListener('itd:filter', (e) => {
    settings.filter = e.detail.key;
    save();
  });

  addEventListener('contextmenu', (e) => e.preventDefault());
  addEventListener('dragover', (e) => e.preventDefault());
  addEventListener('drop', (e) => e.preventDefault());
  addEventListener('auxclick', (e) => e.preventDefault());

  boot();
})();
