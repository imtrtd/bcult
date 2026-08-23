/* Desktop chrome behaviour: window controls, fullscreen, external links. */
(() => {
  'use strict';

  const api = window.itd;
  const body = document.body;

  /* ---- window controls -------------------------------------------------- */

  if (api) {
    document.getElementById('btnMin').addEventListener('click', () => api.minimize());
    document.getElementById('btnMax').addEventListener('click', () => api.toggleMaximize());
    document.getElementById('btnClose').addEventListener('click', () => api.close());

    const paint = (state) => {
      body.classList.toggle('maximized', !!state.maximized);
      body.classList.toggle('fullscreen', !!state.fullscreen);
      dispatchEvent(new Event('resize'));
    };

    api.onState(paint);
    api.queryState().then(paint).catch(() => {});

    addEventListener('keydown', (e) => {
      if (e.key === 'F11') { e.preventDefault(); api.toggleFullscreen(); }
      if (e.key === 'Escape') api.leaveFullscreen();
    });
  } else {
    // Opened as a plain page (no Electron): drop the fake titlebar entirely.
    const bar = document.getElementById('titlebar');
    if (bar) bar.remove();
    document.documentElement.style.setProperty('--tb', '0px');
  }

  /* ---- OPEN PROJECT ----------------------------------------------------- */

  const open = document.getElementById('open');
  let activeUrl = null;

  addEventListener('itd:change', (e) => {
    const url = e.detail.project && e.detail.project.url;
    activeUrl = /^https?:\/\//i.test(url || '') ? url : null;
    open.classList.toggle('live', !!activeUrl);
    open.title = activeUrl || '';
  });

  open.addEventListener('click', () => {
    if (activeUrl) window.open(activeUrl, '_blank', 'noopener');
  });

  /* Middle-click and browser-style back/forward mouse buttons do nothing here. */
  addEventListener('auxclick', (e) => e.preventDefault());
  addEventListener('contextmenu', (e) => e.preventDefault());
  addEventListener('dragover', (e) => e.preventDefault());
  addEventListener('drop', (e) => e.preventDefault());
})();
