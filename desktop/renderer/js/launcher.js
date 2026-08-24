/* APPS view: launch cards for chat apps, browsers, Explorer and Settings,
 * with pointer-driven drag to merge cards into a group (folder). Persists
 * through the same settings.json as the rest of the app (see app.js's
 * getLauncherSettings / setLauncherSettings). */
(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const body = document.body;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const uid = (p) => `${p}-${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;

  /* ------------------------------------------------------------ icons */

  const GLYPH = {
    telegram: '<path d="M13.6 2.6L2.2 7.3c-.7.3-.7 1.1 0 1.4l2.9 1 1 3.4c.1.4.6.5.9.2l1.6-1.5 3 2.3c.5.4 1.2.1 1.4-.5l2-11.1c.1-.6-.5-1-1.1-.9z"/><path d="M6.1 9.7l6.9-4.9-5.6 5.7"/>',
    diamond: '<path d="M8 1.6L14.4 8 8 14.4 1.6 8z"/>',
    globe: '<circle cx="8" cy="8" r="6.4"/><path d="M1.6 8h12.8M8 1.6c2 2 2 10.8 0 12.8M8 1.6c-2 2-2 10.8 0 12.8" /><path d="M2.6 4.6c1.5.8 9.3.8 10.8 0M2.6 11.4c1.5-.8 9.3-.8 10.8 0"/>',
    folder: '<path d="M1.6 4.4a1 1 0 011-1h3.4l1.4 1.6h5a1 1 0 011 1v6.4a1 1 0 01-1 1H2.6a1 1 0 01-1-1z"/>',
    gear: '<circle cx="8" cy="8" r="2.3"/><path d="M8 1.8v1.8M8 12.4v1.8M14.2 8h-1.8M3.6 8H1.8M12.4 3.6l-1.3 1.3M4.9 11.1l-1.3 1.3M12.4 12.4l-1.3-1.3M4.9 4.9L3.6 3.6"/>',
    spark: '<path d="M8 1.6l1.4 4.9 4.9 1.5-4.9 1.5L8 14.4 6.6 9.5 1.7 8l4.9-1.5z"/>',
    app: '<rect x="2" y="2" width="12" height="12" rx="1.4"/><path d="M5.4 8h5.2M8 5.4v5.2"/>',
    plus: '<path d="M8 2.4v11.2M2.4 8h11.2"/>',
    ellipsis: '<circle cx="8" cy="4" r=".9"/><circle cx="8" cy="8" r=".9"/><circle cx="8" cy="12" r=".9"/>',
    chevron: '<path d="M4.8 6.2L8 9.4l3.2-3.2"/>'
  };
  const svg = (name, cls) => `<svg viewBox="0 0 16 16" ${cls ? `class="${cls}"` : ''} aria-hidden="true">${GLYPH[name] || GLYPH.app}</svg>`;

  /* ------------------------------------------------------------ presets */

  const PRESETS = [
    { icon: 'telegram', title: 'TELEGRAM', sub: 'МЕССЕНДЖЕР', th: 200, launch: { type: 'protocol', value: 'tg://' } },
    { icon: 'diamond', title: 'AYUGRAM', sub: 'УКАЖИТЕ ПУТЬ', th: 264, launch: null },
    { icon: 'globe', title: 'CHROME', sub: 'БРАУЗЕР', th: 8, launch: { type: 'command', value: 'chrome' } },
    { icon: 'globe', title: 'EDGE', sub: 'БРАУЗЕР', th: 200, launch: { type: 'command', value: 'msedge' } },
    { icon: 'globe', title: 'FIREFOX', sub: 'БРАУЗЕР', th: 24, launch: { type: 'command', value: 'firefox' } },
    { icon: 'folder', title: 'ПРОВОДНИК', sub: 'ФАЙЛЫ', th: 46, launch: { type: 'explorer', value: '' } },
    { icon: 'gear', title: 'ПАРАМЕТРЫ', sub: 'WINDOWS', th: 210, launch: { type: 'protocol', value: 'ms-settings:' } },
    { icon: 'spark', title: 'CHATGPT', sub: 'УКАЖИТЕ ПУТЬ', th: 150, launch: null },
    { icon: 'spark', title: 'CLAUDE', sub: 'УКАЖИТЕ ПУТЬ', th: 28, launch: null },
    { icon: 'app', title: 'ПРОИЗВОЛЬНОЕ', sub: 'ВЫБРАТЬ .EXE', th: 284, launch: 'pick' }
  ];

  const makeTile = (p) => ({ id: uid('app'), kind: 'app', title: p.title, sub: p.sub, icon: p.icon, th: p.th, launch: p.launch || null });

  const defaults = () => PRESETS.filter((p) => p.launch !== 'pick').map(makeTile);

  /* ------------------------------------------------------------ state */

  let items = [];
  const expanded = new Set();
  let dragCtx = null;   // { id, fromGroup, el, ghost, startX, startY, moved }

  function load() {
    const saved = window.ITD_APP.getLauncherSettings();
    items = Array.isArray(saved) && saved.length ? saved : defaults();
  }
  function persist() { window.ITD_APP.setLauncherSettings(items); }

  function findTop(id) { return items.find((e) => e.id === id); }
  function findAnywhere(id) {
    for (const e of items) {
      if (e.id === id) return { entry: e, group: null };
      if (e.kind === 'group') {
        const child = e.children.find((c) => c.id === id);
        if (child) return { entry: child, group: e };
      }
    }
    return null;
  }
  function removeAnywhere(id) {
    const idx = items.findIndex((e) => e.id === id);
    if (idx >= 0) return items.splice(idx, 1)[0];
    for (const e of items) {
      if (e.kind === 'group') {
        const ci = e.children.findIndex((c) => c.id === id);
        if (ci >= 0) return e.children.splice(ci, 1)[0];
      }
    }
    return null;
  }
  function dissolveIfThin() {
    for (let i = items.length - 1; i >= 0; i--) {
      const e = items[i];
      if (e.kind !== 'group') continue;
      if (e.children.length === 1) { items.splice(i, 1, e.children[0]); expanded.delete(e.id); }
      else if (e.children.length === 0) { items.splice(i, 1); expanded.delete(e.id); }
    }
  }

  /* ------------------------------------------------------------ launching */

  async function launchEntry(entry) {
    if (!window.itd) { window.ITD_UI.toast('ДОСТУПНО ТОЛЬКО В ПРИЛОЖЕНИИ'); return; }
    if (!entry.launch) { await configureAndLaunch(entry); return; }
    const r = await window.itd.launch(entry.launch);
    if (r && r.ok) {
      window.ITD_AUDIO.step();
    } else {
      window.ITD_UI.toast(`НЕ УДАЛОСЬ ОТКРЫТЬ ${entry.title}`);
    }
  }

  async function configureAndLaunch(entry) {
    const picked = await window.itd.pickPath();
    if (!picked || !picked.ok) return;
    entry.launch = { type: 'path', value: picked.path };
    entry.sub = 'ПРИЛОЖЕНИЕ';
    persist();
    render();
    const r = await window.itd.launch(entry.launch);
    if (!r || !r.ok) window.ITD_UI.toast('НЕ УДАЛОСЬ ЗАПУСТИТЬ');
  }

  /* ------------------------------------------------------------ render */

  function tileHtml(entry, small) {
    const iconBlock = svg(entry.icon, null);
    return `
      <div class="tile-icon">${iconBlock}</div>
      <div class="tile-label">${esc(entry.title)}</div>
      ${small ? '' : `<div class="tile-sub">${esc(entry.sub || '')}</div>`}
      <button class="tile-edit" data-edit type="button" title="Изменить">${svg('ellipsis')}</button>`;
  }

  function buildAppTile(entry, small) {
    const el = document.createElement('div');
    el.className = 'tile';
    el.dataset.id = entry.id;
    el.dataset.kind = 'app';
    el.style.setProperty('--th', entry.th || 284);
    el.innerHTML = tileHtml(entry, small);
    el.querySelector('[data-edit]').addEventListener('click', (e) => { e.stopPropagation(); openEditPanel(entry.id); });
    bindDrag(el, entry.id);
    return el;
  }

  function buildGroupTile(entry) {
    const el = document.createElement('div');
    el.className = 'tile group';
    el.dataset.id = entry.id;
    el.dataset.kind = 'group';
    el.style.setProperty('--th', entry.th || 284);
    const collage = entry.children.slice(0, 4).map((c) => `<i>${svg(c.icon)}</i>`).join('');
    el.innerHTML = `
      <div class="group-collage">${collage}</div>
      <div class="tile-label">${esc(entry.title)}</div>
      <div class="tile-sub">${entry.children.length} ПРИЛОЖЕНИЙ</div>
      <span class="group-count">${entry.children.length}</span>`;
    el.addEventListener('click', () => { expanded.add(entry.id); render(); });
    bindDrag(el, entry.id);
    return el;
  }

  function buildCluster(entry) {
    const el = document.createElement('div');
    el.className = 'cluster';
    el.innerHTML = `
      <div class="cluster-head">
        <span class="cluster-title">${esc(entry.title)}</span>
        <div class="cluster-actions">
          <button data-rename type="button">ПЕРЕИМЕНОВАТЬ</button>
          <button data-ungroup type="button">РАЗГРУППИРОВАТЬ</button>
          <button data-collapse type="button">${svg('chevron')} СВЕРНУТЬ</button>
        </div>
      </div>
      <div class="cluster-body"></div>`;
    const bodyEl = el.querySelector('.cluster-body');
    for (const child of entry.children) bodyEl.appendChild(buildAppTile(child, true));
    el.querySelector('[data-collapse]').addEventListener('click', () => { expanded.delete(entry.id); render(); });
    el.querySelector('[data-ungroup]').addEventListener('click', () => {
      const idx = items.findIndex((e) => e.id === entry.id);
      const kids = entry.children.splice(0);
      items.splice(idx, 1, ...kids);
      expanded.delete(entry.id);
      persist(); render();
      window.ITD_UI.toast('ГРУППА РАЗОБРАНА');
    });
    el.querySelector('[data-rename]').addEventListener('click', () => openEditPanel(entry.id));
    return el;
  }

  function render() {
    const host = $('launcherGrid');
    host.textContent = '';
    for (const entry of items) {
      if (entry.kind === 'group') {
        host.appendChild(expanded.has(entry.id) ? buildCluster(entry) : buildGroupTile(entry));
      } else {
        const t = buildAppTile(entry, false);
        t.addEventListener('click', (e) => { if (!e.target.closest('[data-edit]')) launchEntry(entry); });
        host.appendChild(t);
      }
    }
    const add = document.createElement('div');
    add.className = 'tile add-tile';
    add.innerHTML = `<div class="tile-icon">${svg('plus')}</div><div class="tile-label">ДОБАВИТЬ</div>`;
    add.addEventListener('click', openAddPanel);
    host.appendChild(add);
  }

  /* ------------------------------------------------------------ drag & group */

  function bindDrag(el, id) {
    el.addEventListener('pointerdown', (e) => {
      if (e.button > 0 || e.target.closest('[data-edit]')) return;
      dragCtx = { id, el, startX: e.clientX, startY: e.clientY, moved: false, pid: e.pointerId };
      el.setPointerCapture?.(e.pointerId);
    });
    el.addEventListener('pointermove', (e) => {
      if (!dragCtx || dragCtx.id !== id || e.pointerId !== dragCtx.pid) return;
      const dx = e.clientX - dragCtx.startX, dy = e.clientY - dragCtx.startY;
      if (!dragCtx.moved && Math.hypot(dx, dy) > 8) {
        dragCtx.moved = true;
        el.classList.add('dragging');
        const ghost = el.cloneNode(true);
        ghost.className = 'tile drag-ghost';
        ghost.style.setProperty('--th', el.style.getPropertyValue('--th'));
        ghost.style.width = `${el.offsetWidth}px`;
        document.body.appendChild(ghost);
        dragCtx.ghost = ghost;
      }
      if (dragCtx.moved && dragCtx.ghost) {
        dragCtx.ghost.style.left = `${e.clientX}px`;
        dragCtx.ghost.style.top = `${e.clientY}px`;
        for (const t of document.querySelectorAll('.tile.drop-target')) t.classList.remove('drop-target');
        const under = document.elementFromPoint(e.clientX, e.clientY);
        const target = under && under.closest('.tile');
        if (target && target !== el && target.dataset.id !== id) target.classList.add('drop-target');
      }
    });
    el.addEventListener('pointerup', (e) => {
      if (!dragCtx || dragCtx.id !== id || e.pointerId !== dragCtx.pid) return;
      finishDrag(e.clientX, e.clientY);
    });
    el.addEventListener('pointercancel', () => cleanupDrag());
  }

  function finishDrag(x, y) {
    const ctx = dragCtx;
    if (!ctx) return;
    const wasMoved = ctx.moved;
    cleanupDrag();
    if (!wasMoved) return;   // a plain click already fired its own handler

    const under = document.elementFromPoint(x, y);
    const targetTile = under && under.closest('.tile');
    const targetId = targetTile && targetTile !== null ? targetTile.dataset.id : null;

    if (targetId && targetId !== ctx.id) {
      dropOnto(ctx.id, targetId);
    } else if (!targetTile && under && under.closest('#launcherGrid')) {
      dropOnBackground(ctx.id);
    }
  }

  function cleanupDrag() {
    if (dragCtx?.el) dragCtx.el.classList.remove('dragging');
    if (dragCtx?.ghost) dragCtx.ghost.remove();
    for (const t of document.querySelectorAll('.tile.drop-target')) t.classList.remove('drop-target');
    dragCtx = null;
  }

  function dropOnto(draggedId, targetId) {
    const target = findAnywhere(targetId);
    if (!target) return;

    if (target.entry.kind === 'group') {
      const dragged = removeAnywhere(draggedId);
      if (!dragged || dragged.kind === 'group') { if (dragged) items.push(dragged); return; }
      target.entry.children.push(dragged);
      dissolveIfThin();
      persist(); render();
      return;
    }

    // target is a standalone app, or an app already living inside a group
    if (target.group) {
      const dragged = removeAnywhere(draggedId);
      if (!dragged || dragged.kind === 'group') { if (dragged) items.push(dragged); return; }
      target.group.children.push(dragged);
      dissolveIfThin();
      persist(); render();
      return;
    }

    // two standalone apps → fold into a brand-new group at the target's slot
    const dragged = findAnywhere(draggedId);
    if (!dragged || dragged.entry.kind === 'group' || dragged.group) return;
    const draggedEntry = removeAnywhere(draggedId);
    // re-locate the target by id now — removing the dragged entry may have
    // shifted every index after it, and a stale index would grab the wrong slot
    const idx = items.findIndex((e) => e.id === targetId);
    if (idx < 0) { items.push(draggedEntry); persist(); render(); return; }
    const targetEntry = items.splice(idx, 1)[0];
    const group = { id: uid('group'), kind: 'group', title: 'ГРУППА', th: targetEntry.th, children: [targetEntry, draggedEntry] };
    items.splice(idx, 0, group);
    persist(); render();
    window.ITD_AUDIO.sweep();
  }

  function dropOnBackground(draggedId) {
    const found = findAnywhere(draggedId);
    if (!found || !found.group) return;   // already standalone — nothing to do
    const dragged = removeAnywhere(draggedId);
    if (!dragged) return;
    items.push(dragged);
    dissolveIfThin();
    persist(); render();
  }

  /* ------------------------------------------------------------ panels */

  function openEditPanel(id) {
    const found = findAnywhere(id);
    if (!found) return;
    const { entry, group } = found;
    const isGroup = entry.kind === 'group';
    const launchLine = isGroup ? '' : entry.launch
      ? (entry.launch.type === 'path' ? entry.launch.value
        : entry.launch.type === 'command' ? `команда: ${entry.launch.value}`
          : entry.launch.value)
      : '— не задано';

    window.ITD_UI.openPanel(`
      <div class="kicker">${isGroup ? 'ГРУППА' : 'ПРИЛОЖЕНИЕ'}</div>
      <h2>${esc(entry.title)}</h2>
      <div class="field">
        <label>НАЗВАНИЕ</label>
        <input type="text" id="editTitle" value="${esc(entry.title)}">
      </div>
      ${isGroup ? '' : `
      <div class="field">
        <label>ЗАПУСК</label>
        <input type="text" id="editLaunch" value="${esc(launchLine)}" readonly>
      </div>`}
      <div class="panel-actions">
        ${isGroup ? '' : '<button class="btn" id="editPick" type="button">УКАЗАТЬ ПУТЬ…</button>'}
        <button class="btn ghost" id="editSave" type="button">СОХРАНИТЬ</button>
        <button class="btn ghost" id="editRemove" type="button">${isGroup ? 'РАЗГРУППИРОВАТЬ' : 'УДАЛИТЬ'}</button>
        <button class="btn ghost" data-close type="button">ЗАКРЫТЬ · ESC</button>
      </div>`, 'launcher-edit', (panel) => {
      panel.querySelector('#editSave').addEventListener('click', () => {
        const title = panel.querySelector('#editTitle').value.trim();
        if (title) entry.title = title;
        persist(); render();
        window.ITD_UI.closePanel();
        window.ITD_UI.toast('СОХРАНЕНО');
      });
      const pick = panel.querySelector('#editPick');
      if (pick) pick.addEventListener('click', async () => {
        if (!window.itd) return;
        const picked = await window.itd.pickPath();
        if (!picked || !picked.ok) return;
        entry.launch = { type: 'path', value: picked.path };
        entry.sub = 'ПРИЛОЖЕНИЕ';
        persist();
        window.ITD_UI.closePanel();
        render();
        window.ITD_UI.toast('ПУТЬ ОБНОВЛЁН');
      });
      panel.querySelector('#editRemove').addEventListener('click', () => {
        if (isGroup) {
          const idx = items.findIndex((e) => e.id === entry.id);
          if (idx >= 0) items.splice(idx, 1, ...entry.children);
          expanded.delete(entry.id);
        } else {
          removeAnywhere(entry.id);
          dissolveIfThin();
        }
        persist(); render();
        window.ITD_UI.closePanel();
        window.ITD_UI.toast(isGroup ? 'ГРУППА РАЗОБРАНА' : 'УДАЛЕНО');
      });
    });
  }

  function openAddPanel() {
    const rows = PRESETS.map((p, i) => `
      <button class="preset-row" data-preset="${i}" type="button">
        ${svg(p.icon)}
        <span class="name">${esc(p.title)}</span>
        <span class="desc">${esc(p.sub)}</span>
      </button>`).join('');

    window.ITD_UI.openPanel(`
      <div class="kicker">ДОБАВИТЬ КАРТОЧКУ</div>
      <h2>ВЫБЕРИТЕ ПРИЛОЖЕНИЕ</h2>
      <div class="preset-list">${rows}</div>
      <div class="panel-actions"><button class="btn ghost" data-close type="button">ЗАКРЫТЬ · ESC</button></div>`,
      'launcher-add', (panel) => {
        for (const b of panel.querySelectorAll('[data-preset]')) {
          b.addEventListener('click', async () => {
            const preset = PRESETS[Number(b.dataset.preset)];
            const entry = makeTile(preset);
            items.push(entry);
            persist(); render();
            window.ITD_UI.closePanel();
            window.ITD_UI.toast(`ДОБАВЛЕНО · ${entry.title}`);
            if (preset.launch === 'pick' || !entry.launch) await configureAndLaunch(entry);
          });
        }
      });
  }

  /* ------------------------------------------------------------ view toggle */

  function setApps(on, announce) {
    if (on && window.ITD_UI.state.grid) window.ITD_UI.setGrid(false);
    body.classList.toggle('apps', on);
    window.ITD_UI.setRailOn('view.apps', on);
    $('modeLabel').textContent = on ? 'APPS' : (body.classList.contains('grid') ? 'GRID' : 'SPIRAL');
    window.ITD_SPIRAL.setEnabled(!on && !window.ITD_UI.state.grid && !window.ITD_UI.state.panel);
    if (on) { render(); window.ITD_AUDIO.open(); $('launcherView').scrollTop = 0; }
    else { window.ITD_AUDIO.close(); window.ITD_SPIRAL.nudge(); }
    if (announce) window.ITD_AUDIO.sweep();
  }

  window.ITD_UI.register({ id: 'view.apps', name: 'ПРИЛОЖЕНИЯ', keys: 'L', run: () => setApps(!body.classList.contains('apps'), true) });

  window.ITD_LAUNCHER = {
    close() { if (body.classList.contains('apps')) setApps(false); },
    boot() { load(); },
    get items() { return items; }
  };
})();
