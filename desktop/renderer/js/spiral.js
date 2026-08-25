/* Motion engine. Cards hang off the light beam; the wheel, a drag or the arrow
   keys run them past it. Layout writes only — widths are measured once per
   mount so the per-frame pass never forces a reflow. */
(() => {
  'use strict';

  const FALLBACK = [187, 318, 264, 208, 78, 342, 229, 171];
  const NEAR = 2.2;                     // how many cards either side get frosting

  const shell = document.getElementById('shell');
  const host = document.getElementById('nodes');

  let items = [];
  let cards = [];                       // { el, w, status, connector }
  let phase = 0, target = 0, raf = 0, last = performance.now();
  let drag = false, pid = null, lastX = 0, lastY = 0, lastT = 0;
  let velocity = 0, travel = 0, suppress = 0, snapTimer = 0;
  let announced = -1, mountedAt = 0, enabled = true;
  let radius = 480, step = 150;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const wrap = (i, total) => ((i % total) + total) % total;
  const hueOf = (item) => {
    const p = window.ITD_PALETTE && window.ITD_PALETTE.length ? window.ITD_PALETTE : FALLBACK;
    return p[item.origin % p.length];
  };

  function measure() {
    const w = shell.clientWidth || innerWidth;
    const h = shell.clientHeight || innerHeight;
    const cardW = cards.length ? cards[0].el.offsetWidth : 340;
    radius = Math.max(cardW / 2 + 78, Math.min(w * 0.34, 660));
    step = Math.max(112, Math.min(178, h * 0.165));
    for (const c of cards) {
      c.w = c.el.offsetWidth;           // one reflow per resize, never per frame
      c.connector = -1;
    }
    // tell the shader where the beam should stand
    const beamX = (shell.offsetLeft + w / 2) / innerWidth;
    if (window.ITD_BG) window.ITD_BG.set({ beamX });
  }

  function build() {
    host.textContent = '';
    cards = items.map((p, i) => {
      const n = document.createElement('article');
      n.className = 'node';
      n.dataset.status = p.status;
      n.dataset.i = String(i);
      n.style.setProperty('--nh', hueOf(p));

      const sheen = document.createElement('span');
      sheen.className = 'sheen';
      const bolt = document.createElement('span');
      bolt.className = 'bolt';

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
        const st = document.createElement('span');
        st.className = 'chip state-chip';
        st.textContent = p.status.toUpperCase();
        head.appendChild(st);
      }

      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = p.title;

      const desc = document.createElement('p');
      desc.className = 'node-desc';
      desc.textContent = p.description;

      const meta = document.createElement('div');
      meta.className = 'meta';
      const dot = document.createElement('i');
      dot.className = 'dot';
      const label = document.createElement('span');
      label.textContent = `${p.category} · ${p.stack} · ${p.access}`;
      meta.append(dot, label);

      n.append(sheen, bolt, head, title, desc, meta);
      n.addEventListener('click', () => {
        if (!enabled || performance.now() < suppress) return;
        if (Math.abs(wrapDelta(i - target)) < .5) {
          dispatchEvent(new CustomEvent('itd:activate', { detail: current() }));
        } else {
          go(i);
        }
      });
      host.appendChild(n);
      return { el: n, w: 320, status: p.status, connector: -1, near: false, active: false, side: 0 };
    });
    measure();
    mountedAt = performance.now();
  }

  function wrapDelta(d) {
    const total = items.length;
    while (d > total / 2) d -= total;
    while (d < -total / 2) d += total;
    return d;
  }

  function layout() {
    const total = cards.length;
    if (!total) return;
    const now = performance.now();

    for (let i = 0; i < total; i++) {
      const c = cards[i];
      const n = c.el;
      const d = wrapDelta(i - phase);
      const ad = Math.abs(d);
      const th = d * 1.035 - Math.PI / 2;
      const depth = (Math.cos(th) + 1) / 2;
      const x = Math.sin(th) * radius;
      const y = d * step;
      const z = -300 + depth * 560;
      const sc = .60 + depth * .42;

      const enter = easeOut(Math.min(1, Math.max(0, (now - mountedAt - i * 30) / 460)));
      const op = Math.max(.05, 1 - ad / 6.2) * enter;

      const side = x < 0 ? -1 : 1;
      if (side !== c.side) {
        n.classList.toggle('left', side < 0);
        n.classList.toggle('right', side > 0);
        c.side = side;
      }
      const active = ad < .5;
      if (active !== c.active) {
        n.classList.toggle('active', active);
        c.active = active;
      }
      const near = ad < NEAR;
      if (near !== c.near) {
        n.classList.toggle('near', near);       // frosting only where it shows
        c.near = near;
      }

      // strut length in the card's own units, reaching a little into the beam
      const reach = Math.max(0, Math.abs(x) / sc - c.w / 2) * 1.06;
      const rounded = Math.round(reach);
      if (rounded !== c.connector) {
        n.style.setProperty('--connector', rounded + 'px');
        c.connector = rounded;
      }

      n.style.transform = `translate(-50%,-50%) translate3d(${x.toFixed(2)}px,${(y + (1 - enter) * 40).toFixed(2)}px,${(z - (1 - enter) * 180).toFixed(2)}px) rotateY(${(-Math.sin(th) * 23).toFixed(2)}deg) rotateZ(${(Math.sin(th) * 2.6).toFixed(2)}deg) scale(${sc.toFixed(3)})`;
      n.style.opacity = op.toFixed(3);

      const drain = c.status === 'offline' ? .20 : c.status === 'paused' ? .55 : 1;
      const blur = Math.min(1.6, (1 - depth) * 1.8);
      n.style.filter = `blur(${blur.toFixed(2)}px) saturate(${((.82 + depth * .5) * drain).toFixed(2)}) brightness(${((.84 + depth * .26) * (drain < 1 ? .9 : 1)).toFixed(2)})`;
      n.style.zIndex = Math.round(depth * 100);
    }

    const idx = wrap(Math.round(target), total);
    const item = items[idx];
    const hue = hueOf(item);
    const energy = Math.min(1.35, Math.abs(target - phase) * .98 + Math.abs(velocity) * 80 + (drag ? .18 : 0));
    const root = document.documentElement.style;
    root.setProperty('--h', hue);
    root.setProperty('--energy', energy.toFixed(3));

    if (window.ITD_BG) window.ITD_BG.set({ hue, energy, phase });

    if (idx !== announced) {
      announced = idx;
      dispatchEvent(new CustomEvent('itd:change', { detail: { index: idx, item, total, hue } }));
    }
  }

  function frame(now) {
    const dt = Math.min(34, now - last);
    last = now;
    const ease = 1 - Math.pow(drag ? .58 : .80, dt / 16.67);
    phase += (target - phase) * ease;
    if (!drag) velocity *= Math.pow(.82, dt / 16.67);
    layout();
    const entering = now - mountedAt < items.length * 30 + 520;
    if (Math.abs(target - phase) > .0008 || drag || Math.abs(velocity) > .0002 || entering) {
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
    const delta = Math.max(-1.2, Math.min(1.2, d * .0016));
    velocity = velocity * .62 + (delta / 16) * .38;
    target += delta;
    start();
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => snap(), 130);
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
    const delta = (-dy * .0082) + (dx * .0032);
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
    snap(Math.max(-1.4, Math.min(1.4, velocity * 190)));
  }
  shell.addEventListener('pointerup', end);
  shell.addEventListener('pointercancel', end);

  let resizeTimer = 0;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { measure(); layout(); start(); }, 60);
  });

  /* ------------------------------------------------------------- api */

  window.ITD_SPIRAL = {
    mount(list, keepId) {
      items = list;
      build();
      const found = keepId != null ? items.findIndex((p) => p.origin === keepId) : -1;
      phase = target = found > 0 ? found : 0;
      announced = -1;
      layout();
      start();
    },
    remeasure() { measure(); layout(); start(); },
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
