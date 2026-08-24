/* WebGL nebula behind the spine. Domain-warped fbm + starfield, driven by the
   active hue and by how hard the spiral is moving. Falls back to CSS gradients. */
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
  return clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
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
  vec2 p  = uv * 2.4 + uPointer * 0.06;
  float t = uTime * 0.024;
  float drift = uPhase * 0.09;

  vec2 q = vec2(fbm(p + vec2(0.0, drift) + t), fbm(p + vec2(3.2, 1.7 - drift) - t));
  vec2 r = vec2(fbm(p + 2.2 * q + vec2(1.7, 9.2) + 0.16 * t),
                fbm(p + 2.2 * q + vec2(8.3, 2.8) - 0.13 * t));
  float f = fbm(p + 2.0 * r);

  vec3 base = hue2rgb(fract(uHue / 360.0 + uv.x * 0.05));
  vec3 cyan = vec3(0.21, 1.0, 1.0);
  vec3 mag  = vec3(1.0, 0.18, 0.82);
  vec3 lime = vec3(0.79, 1.0, 0.22);

  float clouds = pow(clamp((f - 0.34) * 2.1, 0.0, 1.0), 1.55);
  vec3 col = vec3(0.004, 0.005, 0.020);
  col = mix(col, base * 0.46, clouds);
  col += cyan * pow(clamp(r.x - 0.30, 0.0, 1.0), 2.4) * 0.52;
  col += mag  * pow(clamp(q.y - 0.32, 0.0, 1.0), 2.2) * 0.62;
  col += lime * pow(clamp(r.y * f - 0.22, 0.0, 1.0), 2.6) * 0.22;

  float d = length(uv);
  col += base * exp(-d * 3.0) * (0.09 + uEnergy * 0.26);
  col += cyan * exp(-abs(uv.x) * 30.0) * (0.030 + uEnergy * 0.06);   // haze along the spine

  col += vec3(0.85, 0.95, 1.0) * stars(uv, 22.0, 0.012, uTime) * 0.75;
  col += base * stars(uv + 4.7, 13.0, 0.020, uTime) * 0.55;

  col *= smoothstep(1.45, 0.05, d) * 0.82;
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

    const u = {
      res: gl.getUniformLocation(prog, 'uRes'),
      time: gl.getUniformLocation(prog, 'uTime'),
      hue: gl.getUniformLocation(prog, 'uHue'),
      energy: gl.getUniformLocation(prog, 'uEnergy'),
      pointer: gl.getUniformLocation(prog, 'uPointer'),
      phase: gl.getUniformLocation(prog, 'uPhase')
    };
    return { gl, u };
  }

  const state = { hue: 284, energy: 0, phase: 0, px: 0, py: 0, quality: 0.55, running: true };
  let ctx = null, canvas = null, raf = 0, t0 = performance.now();

  function resize() {
    if (!ctx || !canvas) return;
    const s = state.quality;
    const w = Math.max(1, Math.floor(innerWidth * s));
    const h = Math.max(1, Math.floor(innerHeight * s));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      ctx.gl.viewport(0, 0, w, h);
    }
  }

  function frame(now) {
    raf = 0;
    if (!ctx || !state.running) return;
    resize();
    const { gl, u } = ctx;
    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform1f(u.time, (now - t0) / 1000);
    gl.uniform1f(u.hue, state.hue);
    gl.uniform1f(u.energy, state.energy);
    gl.uniform1f(u.phase, state.phase);
    gl.uniform2f(u.pointer, state.px, state.py);
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
        if (state.running && !raf) raf = requestAnimationFrame(frame);
      });
      raf = requestAnimationFrame(frame);
      return true;
    },
    set(patch) { Object.assign(state, patch); },
    quality(q) {
      state.quality = Math.max(0.25, Math.min(1, q));
      resize();
    },
    get active() { return !!ctx; }
  };
})();
