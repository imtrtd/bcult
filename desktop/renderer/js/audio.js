/* Synthesised ambience — no audio files. A slow drone tuned to the active hue,
   plus short ticks when the spine snaps. Off until the user turns it on. */
(() => {
  'use strict';

  let ctx = null, master = null, drone = null, enabled = false;

  function ensure() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    return true;
  }

  function startDrone() {
    if (!ctx || drone) return;
    const g = ctx.createGain();
    g.gain.value = 0.055;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 420;
    filter.Q.value = 3;

    const a = ctx.createOscillator();
    a.type = 'sine';
    a.frequency.value = 55;
    const b = ctx.createOscillator();
    b.type = 'triangle';
    b.frequency.value = 82.5;
    b.detune.value = 6;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.06;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 130;
    lfo.connect(lfoGain).connect(filter.frequency);

    a.connect(filter);
    b.connect(filter);
    filter.connect(g).connect(master);
    a.start(); b.start(); lfo.start();
    drone = { a, b, filter, lfo };
  }

  function blip(freq, dur, type, level) {
    if (!enabled || !ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.55), ctx.currentTime + dur);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(level, ctx.currentTime + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(g).connect(master);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.02);
  }

  function noise(dur, level, freq) {
    if (!enabled || !ctx) return;
    const frames = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = 1.4;
    const g = ctx.createGain();
    g.gain.value = level;
    src.connect(filter).connect(g).connect(master);
    src.start();
  }

  window.ITD_AUDIO = {
    get enabled() { return enabled; },
    toggle() { return this.set(!enabled); },
    set(on) {
      if (on && !ensure()) return false;
      enabled = !!on;
      if (enabled) {
        if (ctx.state === 'suspended') ctx.resume();
        startDrone();
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.8);
      } else if (ctx) {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      }
      return enabled;
    },
    tune(hue) {
      if (!ctx || !drone) return;
      const f = 48 + (hue % 360) / 360 * 26;
      drone.a.frequency.linearRampToValueAtTime(f, ctx.currentTime + 1.2);
      drone.b.frequency.linearRampToValueAtTime(f * 1.5, ctx.currentTime + 1.2);
    },
    tick() { blip(880, 0.09, 'triangle', 0.05); },
    step() { blip(520, 0.06, 'square', 0.018); },
    open() { blip(320, 0.24, 'sine', 0.06); noise(0.22, 0.03, 1800); },
    close() { blip(180, 0.18, 'sine', 0.05); },
    sweep() { noise(0.4, 0.05, 900); }
  };
})();
