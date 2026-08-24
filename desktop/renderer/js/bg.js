/* The scene behind the cards: a volumetric light beam the spine hangs from,
   plus a selectable backdrop. Everything is one fullscreen shader pass —
   grain and vignette included, so no extra compositing layers are needed. */
(() => {
  'use strict';

  const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const FRAG = `
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform float uHue;
uniform float uEnergy;
uniform vec2  uPointer;
uniform float uPhase;
uniform float uBeamX;      // beam centre, 0..1 across the window
uniform float uMode;       // 0 nebula · 1 void · 2 grid · 3 aurora
uniform float uSat;        // theme saturation, 0 = mono
uniform float uTint;       // theme hue shift in degrees

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){
    v += a * noise(p);
    p = mat2(1.6, 1.2, -1.2, 1.6) * p;
    a *= 0.5;
  }
  return v;
}

vec3 hue2rgb(float h){
  vec3 c = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return mix(vec3(0.62), c, uSat);          // desaturate towards grey for mono themes
}

float stars(vec2 uv, float scale, float speed, float t){
  vec2 g = uv * scale;
  g.y += t * speed;
  vec2 i = floor(g), f = fract(g);
  float h = hash(i);
  if (h < 0.90) return 0.0;
  vec2 c = vec2(hash(i + 1.3), hash(i + 7.7));
  float d = length(f - c);
  float tw = 0.55 + 0.45 * sin(t * 2.2 + h * 40.0);
  return smoothstep(0.09, 0.0, d) * tw * (h - 0.90) * 9.0;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float aspect = uRes.x / uRes.y;
  float bx = (uBeamX - 0.5) * aspect;        // beam centre in uv space
  vec2 p = uv * 2.4 + uPointer * 0.06;
  float t = uTime * 0.024;
  float drift = uPhase * 0.09;

  vec3 base = hue2rgb(fract((uHue + uTint) / 360.0));
  vec3 cool = hue2rgb(fract((uHue + uTint + 40.0) / 360.0));
  vec3 warm = hue2rgb(fract((uHue + uTint - 55.0) / 360.0));
  vec3 col = vec3(0.004, 0.006, 0.017);

  /* ---------------- backdrop ---------------- */
  if (uMode < 0.5) {                          // NEBULA
    vec2 q = vec2(fbm(p + vec2(0.0, drift) + t), fbm(p + vec2(3.2, 1.7 - drift) - t));
    vec2 r = vec2(fbm(p + 2.2 * q + vec2(1.7, 9.2) + 0.16 * t),
                  fbm(p + 2.2 * q + vec2(8.3, 2.8) - 0.13 * t));
    float f = fbm(p + 2.0 * r);
    col = mix(col, base * 0.40, pow(clamp((f - 0.36) * 2.1, 0.0, 1.0), 1.55));
    col += cool * pow(clamp(r.x - 0.32, 0.0, 1.0), 2.4) * 0.46;
    col += warm * pow(clamp(q.y - 0.34, 0.0, 1.0), 2.3) * 0.42;
  } else if (uMode < 1.5) {                   // VOID
    col += base * exp(-length(uv - vec2(bx, 0.0)) * 2.0) * 0.09;
  } else if (uMode < 2.5) {                   // GRID
    float horizon = 0.30;
    float yy = horizon - uv.y;
    if (yy > 0.001) {
      float z = 0.55 / yy;
      float gx = (uv.x - bx) * z;
      float gz = z + uTime * 0.35 + uPhase * 0.6;
      float lx = smoothstep(0.055, 0.0, abs(fract(gx * 0.5) - 0.5) - 0.47);
      float lz = smoothstep(0.055, 0.0, abs(fract(gz * 0.25) - 0.5) - 0.47);
      float fade = exp(-z * 0.10);
      col += base * (lx + lz) * fade * 0.55;
    }
    col += base * exp(-abs(uv.y - horizon) * 7.0) * 0.10;
  } else {                                    // AURORA
    float curtain = fbm(vec2(uv.x * 2.2 + t * 1.6, uv.y * 0.5 - t * 0.9));
    float band = smoothstep(0.30, 0.80, curtain) * smoothstep(0.95, -0.35, uv.y);
    col += mix(base, cool, curtain) * band * 0.85;
    col += warm * band * band * 0.30;
    col += cool * pow(band, 3.0) * 0.25;
  }

  /* ---------------- stars ---------------- */
  if (uMode < 2.5) {
    col += vec3(0.85, 0.95, 1.0) * stars(uv, 22.0, 0.012, uTime) * 0.7;
    col += base * stars(uv + 4.7, 13.0, 0.020, uTime) * 0.5;
  }

  /* ---------------- the beam ---------------- */
  float d = abs(uv.x - bx);
  float flick = 0.94 + 0.06 * sin(uTime * 6.0 + uv.y * 9.0) + 0.03 * noise(vec2(uv.y * 6.0, uTime * 1.7));
  float vert = 0.30 + 0.70 * smoothstep(0.68, 0.16, abs(uv.y));
  float core = exp(-d * 300.0);
  float inner = exp(-d * 52.0);
  float haze = exp(-d * 8.5);
  float gain = (0.80 + uEnergy * 0.55) * flick * vert;

  col += vec3(1.0) * core * gain * 1.5;
  col += base * inner * gain * 0.85;
  col += mix(base, cool, 0.5) * haze * gain * 0.30;

  // motes drifting inside the beam
  float mote = stars(vec2((uv.x - bx) * 7.0, uv.y), 12.0, 0.05, uTime) * exp(-d * 22.0);
  col += vec3(1.0) * mote * 0.7;

  // pool of light where the beam meets the collar
  col += base * exp(-length(vec2((uv.x - bx) * 1.5, uv.y)) * 3.4) * (0.09 + uEnergy * 0.20);

  /* ---------------- finish ---------------- */
  col *= smoothstep(1.55, 0.06, length(uv * vec2(0.78, 1.0))) * 0.94;
  col += (hash(gl_FragCoord.xy + fract(uTime) * 91.7) - 0.5) * 0.030;   // grain
  col *= 1.0 - 0.020 * sin(gl_FragCoord.y * 3.14159);                   // faint scan
  col = pow(clamp(col, 0.0, 1.0), vec3(0.92));

  gl_FragColor = vec4(col, 1.0);
}`;

  function compile(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn('shader:', gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  function create(canvas) {
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' })
      || canvas.getContext('experimental-webgl');
    if (!gl) return null;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('link:', gl.getProgramInfoLog(prog));
      return null;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const names = ['uRes', 'uTime', 'uHue', 'uEnergy', 'uPointer', 'uPhase', 'uBeamX', 'uMode', 'uSat', 'uTint'];
    const u = {};
    for (const n of names) u[n] = gl.getUniformLocation(prog, n);
    return { gl, u };
  }

  const state = {
    hue: 284, energy: 0, phase: 0, px: 0, py: 0,
    beamX: 0.5, mode: 0, sat: 1, tint: 0,
    quality: 0.55, ceiling: 0.55, running: true, auto: true
  };

  let ctx = null, canvas = null, raf = 0, t0 = performance.now();
  let acc = 0, frames = 0, lastT = t0;

  function resize() {
    if (!ctx || !canvas) return;
    const w = Math.max(1, Math.floor(innerWidth * state.quality));
    const h = Math.max(1, Math.floor(innerHeight * state.quality));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      ctx.gl.viewport(0, 0, w, h);
    }
  }

  /** Nudge resolution up or down so the scene keeps a smooth frame rate. */
  function autoQuality(dt) {
    if (!state.auto) return;
    acc += dt;
    frames++;
    if (frames < 60) return;
    const avg = acc / frames;
    acc = 0;
    frames = 0;
    if (avg > 21 && state.quality > 0.3) {
      state.quality = Math.max(0.3, state.quality - 0.08);
      resize();
    } else if (avg < 12.5 && state.quality < state.ceiling) {
      state.quality = Math.min(state.ceiling, state.quality + 0.05);
      resize();
    }
  }

  function frame(now) {
    raf = 0;
    if (!ctx || !state.running) return;
    const dt = now - lastT;
    lastT = now;
    autoQuality(dt);
    resize();

    const { gl, u } = ctx;
    gl.uniform2f(u.uRes, canvas.width, canvas.height);
    gl.uniform1f(u.uTime, (now - t0) / 1000);
    gl.uniform1f(u.uHue, state.hue);
    gl.uniform1f(u.uEnergy, state.energy);
    gl.uniform1f(u.uPhase, state.phase);
    gl.uniform1f(u.uBeamX, state.beamX);
    gl.uniform1f(u.uMode, state.mode);
    gl.uniform1f(u.uSat, state.sat);
    gl.uniform1f(u.uTint, state.tint);
    gl.uniform2f(u.uPointer, state.px, state.py);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(frame);
  }

  window.ITD_BG = {
    init(el) {
      canvas = el;
      ctx = create(el);
      if (!ctx) {
        document.body.classList.add('no-webgl');
        return false;
      }
      resize();
      addEventListener('resize', resize);
      document.addEventListener('visibilitychange', () => {
        state.running = !document.hidden;
        if (state.running && !raf) { lastT = performance.now(); raf = requestAnimationFrame(frame); }
      });
      lastT = performance.now();
      raf = requestAnimationFrame(frame);
      return true;
    },
    set(patch) { Object.assign(state, patch); },
    quality(q) {
      state.ceiling = Math.max(0.25, Math.min(1, q));
      state.quality = state.ceiling;
      resize();
    },
    get current() { return state; },
    get active() { return !!ctx; }
  };
})();
