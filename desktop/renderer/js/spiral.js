/* Motion engine. Same spiral maths as the original preview — wheel / drag /
   keys descend the spine and the nearest node snaps to the front — with a
   swappable working set so filters and search can change what's on the spine. */
(() => {
  'use strict';

  const PALETTE = [187, 318, 264, 208, 78, 342, 229, 171];

  const shell = document.getElementById('shell');
  const host = document.getElementById('nodes');

  let items = [];
  let phase = 0, target = 0, raf = 0, last = performance.now();
  let drag = false, pid = null, lastX = 0, lastY = 0, lastT = 0;
  let velocity = 0, travel = 0, suppress = 0, snapTimer = 0;
  let announced = -1, mountedAt = 0, enabled = true;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const wrap = (i, total) => ((i % total) + total) % total;

  function hueOf(item) {
    return PALETTE[item.origin % PALETTE.length];
  }

  function build() {
    host.textContent = '';
    items.forEach((p, i) => {
      const n = document.createElement('article');
      n.className = 'node';
      n.dataset.status = p.status;
      n.dataset.i = String(i);
      n.style.setProperty('--nh', hueOf(p));

      const head = document.createElement('div');
      head.className = 'node-head';
      const idx = document.createElement('span');
      idx.className = 'idx';
      idx.textContent = String(i + 1).padStart(2, '0');
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = p.category;
      head.append(idx, chip);
      if (p.status !== 'live') {
        const state = document.createElement('span');
        state.className = 'chip state-chip';
        state.textContent = p.status.toUpperCase();
        head.appendChild(state);
      }

      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = p.title;

      const meta = document.createElement('div');
      meta.className = 'meta';
      const dot = document.createElement('i');
      dot.className = 'dot';
      const label = document.createElement('span');
      label.textContent = `${p.category} · ${p.stack} · ${p.access}`;
      meta.append(dot, label);

      n.append(head, title, meta);
      n.addEventListener('click', () => {
        if (!enabled || performance.now() < suppress) return;
        if (Math.abs(wrapDelta(i - target)) < .5) {
          dispatchEvent(new CustomEvent('itd:activate', { detail: current() }));
        } else {
          go(i);
        }
      });
      host.appendChild(n);
    });
    mountedAt = performance.now();
  }

  function wrapDelta(d) {
    const total = items.length;
    while (d > total / 2) d -= total;
    while (d < -total / 2) d += total;
    return d;
  }

  function layout() {
    const nodes = host.children;
    const total = nodes.length;
    if (!total) return;

    const now = performance.now();
    const r = Math.min(innerWidth * (innerWidth < 900 ? .33 : .36), 565);
    const step = innerWidth < 900 ? 92 : 116;

    for (let i = 0; i < total; i++) {
      const n = nodes[i];
      const d = wrapDelta(i - phase);
      const th = d * 1.035 - Math.PI / 2;
      const depth = (Math.cos(th) + 1) / 2;
      const x = Math.sin(th) * r;
      const y = d * step;
      const z = -290 + depth * 545;
      const sc = .59 + depth * .43;
      const drain = n.dataset.status === 'offline' ? .20 : n.dataset.status === 'paused' ? .52 : 1;

      // staggered entrance after a filter change
      const enter = easeOut(Math.min(1, Math.max(0, (now - mountedAt - i * 32) / 460)));
      const op = Math.max(.07, 1 - Math.abs(d) / 6.5) * enter;

      n.classList.toggle('left', x < 0);
      n.classList.toggle('right', x >= 0);
      n.classList.toggle('active', Math.abs(d) < .5);
      n.style.setProperty('--connector', Math.max(24, Math.abs(x) - n.offsetWidth * .48) + 'px');
      n.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y + (1 - enter) * 40}px,${z - (1 - enter) * 180}px) rotateY(${-Math.sin(th) * 25}deg) rotateZ(${Math.sin(th) * 3.1}deg) scale(${sc})`;
      n.style.opacity = op;
      const sat = (.78 + depth * .52) * drain;
      const bri = (.8 + depth * .28) * (drain < 1 ? .84 + (drain - .2) * .2 : 1);
      n.style.filter = `blur(${Math.max(0, (1 - depth) * 2)}px) saturate(${sat}) brightness(${bri})`;
      n.style.zIndex = Math.round(depth * 100);
    }

    const idx = wrap(Math.round(target), total);
    const item = items[idx];
    const hue = hueOf(item);
    const energy = Math.min(1.35, Math.abs(target - phase) * .98 + Math.abs(velocity) * 80 + (drag ? .18 : 0));
    const root = document.documentElement.style;
    root.setProperty('--h', hue);
    root.setProperty('--energy', energy);

    if (window.ITD_BG) window.ITD_BG.set({ hue, energy, phase });

    if (idx !== announced) {
      announced = idx;
      dispatchEvent(new CustomEvent('itd:change', {
        detail: { index: idx, item, total, hue }
      }));
    }
  }

  function frame(now) {
    const dt = Math.min(34, now - last);
    last = now;
    const ease = 1 - Math.pow(drag ? .58 : .82, dt / 16.67);
    phase += (target - phase) * ease;
    if (!drag) velocity *= Math.pow(.82, dt / 16.67);
    layout();
    const entering = now - mountedAt < items.length * 32 + 500;
    if (Math.abs(target - phase) > .001 || drag || Math.abs(velocity) > .0002 || entering) {
      raf = requestAnimationFrame(frame);
    } else {
      phase = target;
      velocity = 0;
      layout();
      raf = 0;
    }
  }

  function start() {
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  function snap(extra = 0) {
    const before = wrap(Math.round(target), items.length || 1);
    target = Math.round(target + extra);
    const after = wrap(Math.round(target), items.length || 1);
    if (before !== after) dispatchEvent(new Event('itd:snap'));
    start();
  }

  function go(i, { silent } = {}) {
    if (!items.length) return;
    // take the shortest way round the loop instead of unwinding the whole spine
    const delta = wrapDelta(i - wrap(Math.round(target), items.length));
    target = Math.round(target) + delta;
    if (!silent) dispatchEvent(new Event('itd:snap'));
    start();
  }

  function current() {
    if (!items.length) return { index: 0, item: null, total: 0 };
    const index = wrap(Math.round(target), items.length);
    return { index, item: items[index], total: items.length, hue: hueOf(items[index]) };
  }

  /* ------------------------------------------------------------- input */

  addEventListener('wheel', (e) => {
    e.preventDefault();
    if (!enabled) return;
    const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    const delta = d * .00165;
    velocity = velocity * .62 + (delta / 16) * .38;
    target += delta;
    start();
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => snap(), 95);
  }, { passive: false });

  shell.addEventListener('pointerdown', (e) => {
    if (e.button > 0 || !enabled) return;
    drag = true;
    pid = e.pointerId;
    lastX = e.clientX;
    lastY = e.clientY;
    lastT = performance.now();
    velocity = 0;
    travel = 0;
    shell.setPointerCapture?.(pid);
    document.body.classList.add('cursor-drag');
    start();
  });

  shell.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== pid) return;
    const now = performance.now();
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const dt = Math.max(8, now - lastT);
    const delta = (-dy * .0085) + (dx * .0034);
    travel += Math.abs(dx) + Math.abs(dy);
    velocity = velocity * .68 + (delta / dt) * .32;
    target += delta;
    lastX = e.clientX;
    lastY = e.clientY;
    lastT = now;
    start();
  });

  function end(e) {
    if (!drag || (e && e.pointerId !== pid)) return;
    drag = false;
    document.body.classList.remove('cursor-drag');
    if (shell.hasPointerCapture?.(pid)) shell.releasePointerCapture(pid);
    pid = null;
    if (travel > 9) suppress = performance.now() + 320;
    snap(Math.max(-1.25, Math.min(1.25, velocity * 190)));
  }
  shell.addEventListener('pointerup', end);
  shell.addEventListener('pointercancel', end);
  addEventListener('resize', () => { layout(); start(); });

  /* ------------------------------------------------------------- api */

  window.ITD_SPIRAL = {
    /** Replace the working set. `list` items carry an `origin` index into the
        full project list so colours stay stable when filtering. */
    mount(list, keepId) {
      items = list;
      build();
      const found = keepId != null ? items.findIndex((p) => p.origin === keepId) : -1;
      phase = target = found > 0 ? found : 0;
      announced = -1;
      layout();
      start();
    },
    go,
    next() { snap(1); },
    prev() { snap(-1); },
    first() { go(0); },
    last() { go(items.length - 1); },
    current,
    get total() { return items.length; },
    get items() { return items; },
    setEnabled(v) { enabled = !!v; if (!v) { drag = false; document.body.classList.remove('cursor-drag'); } },
    nudge() { start(); }
  };
})();
