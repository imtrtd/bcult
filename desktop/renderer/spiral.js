/* I/TD Neon Spiral — motion engine.
   Behaviour is identical to the original web preview: wheel / drag / arrows
   descend the spine, the nearest node snaps to the front. */
(() => {
  'use strict';

  const projects = Array.isArray(window.ITD_PROJECTS) && window.ITD_PROJECTS.length
    ? window.ITD_PROJECTS
    : [{ title: 'NO PROJECTS', meta: 'EDIT renderer/projects.js' }];
  const palette = [187, 318, 264, 208, 78, 342, 229, 171];

  const shell = document.getElementById('shell');
  const host = document.getElementById('nodes');
  const count = document.getElementById('count');
  const title = document.getElementById('title');
  const meta = document.getElementById('meta');
  const coreCount = document.getElementById('coreCount');
  const filterAll = document.getElementById('filterAll');

  if (coreCount) coreCount.textContent = String(projects.length);
  if (filterAll) filterAll.textContent = `ALL / ${projects.length}`;

  let phase = 0, target = 0, raf = 0, last = performance.now();
  let drag = false, pid = null, lastX = 0, lastY = 0, lastT = 0;
  let velocity = 0, travel = 0, suppress = 0, snapTimer = 0, announced = -1;

  projects.forEach((p, i) => {
    const n = document.createElement('div');
    n.className = 'node';
    n.style.setProperty('--nh', palette[i % palette.length]);
    n.innerHTML = `<div class="idx">${String(i + 1).padStart(2, '0')}</div><div class="title"></div><div class="meta"></div>`;
    n.querySelector('.title').textContent = p.title;
    n.querySelector('.meta').textContent = p.meta;
    n.addEventListener('click', () => {
      if (performance.now() < suppress) return;
      target = i;
      start();
    });
    host.appendChild(n);
  });

  function layout() {
    const nodes = [...document.querySelectorAll('.node')],
      total = nodes.length,
      r = Math.min(innerWidth * (innerWidth < 760 ? .33 : .36), 565),
      step = innerWidth < 760 ? 92 : 116;

    nodes.forEach((n, i) => {
      let d = i - phase;
      while (d > total / 2) d -= total;
      while (d < -total / 2) d += total;
      const th = d * 1.035 - Math.PI / 2,
        depth = (Math.cos(th) + 1) / 2,
        x = Math.sin(th) * r,
        y = d * step,
        z = -290 + depth * 545,
        sc = .59 + depth * .43,
        op = Math.max(.07, 1 - Math.abs(d) / 6.5);
      n.classList.toggle('left', x < 0);
      n.classList.toggle('right', x >= 0);
      n.classList.toggle('active', Math.abs(d) < .5);
      n.style.setProperty('--connector', Math.max(24, Math.abs(x) - n.offsetWidth * .48) + 'px');
      n.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,${z}px) rotateY(${-Math.sin(th) * 25}deg) rotateZ(${Math.sin(th) * 3.1}deg) scale(${sc})`;
      n.style.opacity = op;
      n.style.filter = `blur(${Math.max(0, (1 - depth) * 2)}px) saturate(${.78 + depth * .52}) brightness(${.8 + depth * .28})`;
      n.style.zIndex = Math.round(depth * 100);
    });

    const idx = ((Math.round(target) % total) + total) % total;
    document.documentElement.style.setProperty('--h', palette[idx % palette.length]);
    document.documentElement.style.setProperty('--energy', Math.min(1.35, Math.abs(target - phase) * .98 + Math.abs(velocity) * 80 + (drag ? .18 : 0)));
    count.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    title.textContent = projects[idx].title;
    meta.textContent = projects[idx].meta;

    if (idx !== announced) {
      announced = idx;
      dispatchEvent(new CustomEvent('itd:change', { detail: { index: idx, project: projects[idx] } }));
    }
  }

  function frame(now) {
    const dt = Math.min(34, now - last);
    last = now;
    const ease = 1 - Math.pow(drag ? .58 : .82, dt / 16.67);
    phase += (target - phase) * ease;
    if (!drag) velocity *= Math.pow(.82, dt / 16.67);
    layout();
    if (Math.abs(target - phase) > .001 || drag || Math.abs(velocity) > .0002) {
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
    target = Math.round(target + extra);
    start();
  }

  addEventListener('wheel', e => {
    e.preventDefault();
    const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX,
      delta = d * .00165;
    velocity = velocity * .62 + (delta / 16) * .38;
    target += delta;
    start();
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => snap(), 95);
  }, { passive: false });

  shell.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    drag = true;
    pid = e.pointerId;
    lastX = e.clientX;
    lastY = e.clientY;
    lastT = performance.now();
    velocity = 0;
    travel = 0;
    shell.setPointerCapture?.(pid);
    shell.classList.add('dragging');
    start();
  });

  shell.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== pid) return;
    const now = performance.now(),
      dx = e.clientX - lastX,
      dy = e.clientY - lastY,
      dt = Math.max(8, now - lastT),
      delta = (-dy * .0085) + (dx * .0034);
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
    shell.classList.remove('dragging');
    if (shell.hasPointerCapture?.(pid)) shell.releasePointerCapture(pid);
    pid = null;
    if (travel > 9) suppress = performance.now() + 320;
    snap(Math.max(-1.25, Math.min(1.25, velocity * 190)));
  }
  shell.addEventListener('pointerup', end);
  shell.addEventListener('pointercancel', end);

  addEventListener('keydown', e => {
    if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key)) { target = Math.round(target) + 1; start(); }
    if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) { target = Math.round(target) - 1; start(); }
    if (e.key === 'Home') { target = 0; start(); }
    if (e.key === 'End') { target = projects.length - 1; start(); }
  });

  addEventListener('resize', layout);
  layout();

  window.ITD_SPIRAL = {
    projects,
    go(i) { target = i; start(); },
    next() { target = Math.round(target) + 1; start(); },
    prev() { target = Math.round(target) - 1; start(); },
    current() {
      const total = projects.length;
      const idx = ((Math.round(target) % total) + total) % total;
      return { index: idx, project: projects[idx] };
    }
  };
})();
