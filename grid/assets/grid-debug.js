/* grid-debug.js — live grid debugger for the product you're building
 *
 * A dev-only floating control panel that drives the grid overlay AND rewrites
 * your product's grid custom properties in place, so dragging a slider reflows
 * the real layout. Tune columns, rows, baseline, gutters, margins, and colours
 * against live content, then copy the result back into your CSS.
 *
 * Pairs with grid-overlay.js (the engine) and grid.css (the variables the panel
 * reads from and writes to). Load both, then this:
 *   <script src="grid-overlay.js" data-auto="false"></script>
 *   <script src="grid-debug.js"></script>
 *
 * Gate it to development so it never ships:
 *   if (import.meta.env.DEV) import('./grid-debug.js');   // Vite
 *   {process.env.NODE_ENV !== 'production' && <script src="/grid-debug.js" />}
 *
 * The panel lives in a shadow root, so the product's CSS can't touch it and its
 * CSS can't touch the product. State persists to localStorage('grid-debug').
 *
 * Hotkeys:  shift+G  show/hide panel    g  toggle overlay    m  cycle layers
 * Exposes:  window.GridDebug.mount() / .unmount() / .reset()
 */
(function (global) {
  'use strict';

  var STORE = 'grid-debug';

  // control key, matching CSS var (or null = overlay-only), unit, range
  var CONTROLS = [
    { k: 'columns',        css: '--grid-columns',     unit: '',   min: 1,   max: 24,   step: 1 },
    { k: 'rows',           css: '--grid-rows',        unit: '',   min: 0,   max: 16,   step: 1 },
    { k: 'gutter',         css: '--grid-gutter',      unit: 'px', min: 0,   max: 80,   step: 1 },
    { k: 'rowGutter',      css: '--grid-row-gutter',  unit: '',   min: 0,   max: 4,    step: 1 },
    { k: 'margin',         css: '--grid-margin',      unit: 'px', min: 0,   max: 160,  step: 1 },
    { k: 'maxWidth',       css: '--grid-max-width',   unit: 'px', min: 0,   max: 1920, step: 10 },
    { k: 'baseline',       css: '--grid-baseline',    unit: 'px', min: 4,   max: 48,   step: 1 },
    { k: 'rowHeight',      css: '--grid-row-height',  unit: '',   min: 1,   max: 12,   step: 1 },
    { k: 'baselineOffset', css: null,                 unit: '',   min: 0,   max: 240,  step: 1 },
    { k: 'opacity',        css: null,                 unit: '',   min: 0,   max: 1,    step: 0.05 }
  ];
  var COLORS = [
    { k: 'color',  css: '--grid-color',  label: 'lines' },
    { k: 'accent', css: '--grid-accent', label: 'fields' }
  ];
  var PRESETS = {
    'M-B 8 (2×4)':  { columns: 2,  rows: 4 },
    'M-B 20 (4×5)': { columns: 4,  rows: 5 },
    'M-B 32 (4×8)': { columns: 4,  rows: 8 },
    'Editorial 6':  { columns: 6,  rows: 0 },
    'General 12':   { columns: 12, rows: 0 },
    'Dashboard 16': { columns: 16, rows: 0 }
  };
  var MODES = ['all', 'columns', 'baseline', 'fields', 'margins', 'off'];

  function ensureEngine() {
    if (!global.GridOverlay) {
      console.warn('[grid-debug] grid-overlay.js not found — load it before grid-debug.js');
      return null;
    }
    if (!global.GridOverlay.root) global.GridOverlay.init();
    return global.GridOverlay;
  }

  function cssValue(c, v) {
    if (c.k === 'maxWidth' && (+v === 0)) return 'none'; // 0 = full bleed, but max-width:0 collapses
    return v + (c.unit || '');
  }

  function applyVar(c, v) {
    if (c.css) document.documentElement.style.setProperty(c.css, cssValue(c, v));
  }

  var GridDebug = {
    el: null, host: null, shadow: null, open: true, _onKey: null,

    mount: function (_opts) {
      var eng = ensureEngine();
      if (!eng) return this;
      this.unmount();
      var saved = this._load();
      if (saved) {
        eng.set(saved.cfg || {});
        if (saved.mode) eng.setMode(saved.mode);
      }
      // mirror current config into the product's CSS vars
      CONTROLS.concat(COLORS).forEach(function (c) { applyVar(c, eng.cfg[c.k]); });
      this._build();
      this._sync();
      this._bind();
      return this;
    },

    _save: function () {
      try {
        global.localStorage.setItem(STORE, JSON.stringify({ cfg: global.GridOverlay.cfg, mode: global.GridOverlay.mode }));
      } catch (e) {}
    },
    _load: function () {
      try { return JSON.parse(global.localStorage.getItem(STORE)); } catch (e) { return null; }
    },

    reset: function () {
      try { global.localStorage.removeItem(STORE); } catch (e) {}
      CONTROLS.concat(COLORS).forEach(function (c) {
        if (c.css) document.documentElement.style.removeProperty(c.css);
      });
      var eng = global.GridOverlay;
      if (eng) eng.init(); // re-read :root defaults
      this.mount();
      return this;
    },

    _set: function (key, value) {
      var eng = global.GridOverlay;
      var patch = {}; patch[key] = value;
      eng.set(patch);
      var c = CONTROLS.concat(COLORS).filter(function (x) { return x.k === key; })[0];
      if (c) applyVar(c, value);
      this._save();
      this._sync();
    },

    _build: function () {
      var host = document.createElement('div');
      host.setAttribute('data-grid-debug', '');
      var shadow = host.attachShadow({ mode: 'open' });
      shadow.innerHTML = STYLE + LAUNCHER + PANEL;
      document.body.appendChild(host);
      this.host = host; this.shadow = shadow;
      this.panel = shadow.querySelector('.panel');
      this.launcher = shadow.querySelector('.launcher');

      // controls
      var body = shadow.querySelector('.controls');
      var self = this;
      CONTROLS.forEach(function (c) {
        var row = document.createElement('label'); row.className = 'row';
        row.innerHTML = '<span class="lbl">' + c.k + '</span>' +
          '<input type="range" min="' + c.min + '" max="' + c.max + '" step="' + c.step + '" data-k="' + c.k + '">' +
          '<input type="number" min="' + c.min + '" max="' + c.max + '" step="' + c.step + '" data-n="' + c.k + '">';
        body.appendChild(row);
      });
      var colorWrap = shadow.querySelector('.colors');
      COLORS.forEach(function (c) {
        var row = document.createElement('label'); row.className = 'crow';
        row.innerHTML = '<span class="lbl">' + c.label + '</span>' +
          '<input type="color" data-c="' + c.k + '">';
        colorWrap.appendChild(row);
      });
      var presetWrap = shadow.querySelector('.presets');
      Object.keys(PRESETS).forEach(function (name) {
        var b = document.createElement('button'); b.className = 'chip'; b.textContent = name;
        b.addEventListener('click', function () {
          Object.keys(PRESETS[name]).forEach(function (k) { self._set(k, PRESETS[name][k]); });
        });
        presetWrap.appendChild(b);
      });
      var modeWrap = shadow.querySelector('.modes');
      MODES.forEach(function (mode) {
        var b = document.createElement('button'); b.className = 'chip mode'; b.dataset.mode = mode; b.textContent = mode;
        b.addEventListener('click', function () { global.GridOverlay.setMode(mode); self._save(); self._sync(); });
        modeWrap.appendChild(b);
      });

      // wire inputs
      body.addEventListener('input', function (e) {
        var k = e.target.getAttribute('data-k') || e.target.getAttribute('data-n');
        if (k) self._set(k, +e.target.value);
      });
      colorWrap.addEventListener('input', function (e) {
        var k = e.target.getAttribute('data-c');
        if (k) self._set(k, e.target.value);
      });

      shadow.querySelector('.copy-css').addEventListener('click', function () { self._copy(self._cssText(), this); });
      shadow.querySelector('.copy-json').addEventListener('click', function () { self._copy(JSON.stringify(global.GridOverlay.cfg, null, 2), this); });
      shadow.querySelector('.reset').addEventListener('click', function () { self.reset(); });
      shadow.querySelector('.close').addEventListener('click', function () { self.toggle(false); });
      this.launcher.addEventListener('click', function () { self.toggle(); });

      this._drag(shadow.querySelector('.head'));
    },

    _sync: function () {
      if (!this.shadow) return;
      var eng = global.GridOverlay, sh = this.shadow;
      CONTROLS.forEach(function (c) {
        var v = eng.cfg[c.k];
        var r = sh.querySelector('[data-k="' + c.k + '"]'); if (r) r.value = v;
        var n = sh.querySelector('[data-n="' + c.k + '"]'); if (n) n.value = v;
      });
      COLORS.forEach(function (c) {
        var i = sh.querySelector('[data-c="' + c.k + '"]'); if (i) i.value = eng.cfg[c.k];
      });
      sh.querySelectorAll('.mode').forEach(function (b) {
        b.classList.toggle('on', b.dataset.mode === eng.mode);
      });
      var fields = eng.cfg.rows > 0 ? (eng.cfg.columns * eng.cfg.rows) + ' fields' : 'tiling';
      sh.querySelector('.count').textContent = eng.cfg.columns + ' × ' + (eng.cfg.rows || '∞') + ' · ' + fields;
    },

    _cssText: function () {
      var cfg = global.GridOverlay.cfg, lines = [':root {'];
      CONTROLS.concat(COLORS).forEach(function (c) {
        if (c.css) lines.push('  ' + c.css + ': ' + cssValue(c, cfg[c.k]) + ';');
      });
      lines.push('}');
      return lines.join('\n');
    },

    _copy: function (text, btn) {
      var done = function () { var t = btn.textContent; btn.textContent = 'copied'; setTimeout(function () { btn.textContent = t; }, 900); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
      else { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) {} ta.remove(); }
    },

    toggle: function (force) {
      this.open = typeof force === 'boolean' ? force : !this.open;
      this.panel.classList.toggle('hidden', !this.open);
      this.launcher.classList.toggle('hidden', this.open);
    },

    _drag: function (handle) {
      var p = this.panel, sx, sy, ox, oy, on = false;
      handle.style.cursor = 'move';
      handle.addEventListener('pointerdown', function (e) {
        on = true; sx = e.clientX; sy = e.clientY;
        var r = p.getBoundingClientRect(); ox = r.left; oy = r.top;
        p.style.right = 'auto'; p.style.bottom = 'auto'; p.style.left = ox + 'px'; p.style.top = oy + 'px';
        handle.setPointerCapture(e.pointerId);
      });
      handle.addEventListener('pointermove', function (e) {
        if (!on) return; p.style.left = (ox + e.clientX - sx) + 'px'; p.style.top = (oy + e.clientY - sy) + 'px';
      });
      handle.addEventListener('pointerup', function () { on = false; });
    },

    _bind: function () {
      var self = this;
      this._onKey = function (e) {
        if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
        if ((e.key === 'G') && e.shiftKey && !e.metaKey && !e.ctrlKey) { e.preventDefault(); self.toggle(); }
      };
      window.addEventListener('keydown', this._onKey);
      // keep panel in step with engine hotkeys (g / m)
      this._poll = setInterval(function () { self._sync(); }, 400);
    },

    unmount: function () {
      if (this._onKey) window.removeEventListener('keydown', this._onKey);
      if (this._poll) clearInterval(this._poll);
      if (this.host && this.host.parentNode) this.host.parentNode.removeChild(this.host);
      this.host = this.shadow = this.panel = null;
    }
  };

  var STYLE = '<style>' +
    ':host{all:initial}' +
    '*{box-sizing:border-box;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}' +
    '.launcher{position:fixed;right:16px;bottom:16px;z-index:2147483601;background:#111;color:#fff;border:0;border-radius:8px;padding:8px 12px;font-size:12px;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.25)}' +
    '.panel{position:fixed;right:16px;bottom:16px;z-index:2147483601;width:268px;background:#141414;color:#eee;border:1px solid #2a2a2a;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,.4);font-size:11px;overflow:hidden}' +
    '.hidden{display:none}' +
    '.head{display:flex;align-items:center;justify-content:space-between;padding:9px 11px;background:#1c1c1c;border-bottom:1px solid #2a2a2a}' +
    '.head .t{font-size:12px;font-weight:500;letter-spacing:.02em}' +
    '.count{color:#8a8a8a;font-size:10px}' +
    '.close{background:0;border:0;color:#aaa;font-size:14px;cursor:pointer;line-height:1}' +
    '.sec{padding:9px 11px;border-bottom:1px solid #222}' +
    '.sec h4{margin:0 0 7px;font-size:10px;font-weight:500;color:#8a8a8a;text-transform:uppercase;letter-spacing:.06em}' +
    '.row{display:grid;grid-template-columns:64px 1fr 46px;align-items:center;gap:7px;margin:5px 0}' +
    '.row .lbl{color:#bbb}' +
    'input[type=range]{width:100%;accent-color:#3b6fff;height:16px}' +
    'input[type=number]{width:46px;background:#0d0d0d;border:1px solid #2c2c2c;color:#eee;border-radius:4px;padding:2px 4px;font-size:10px}' +
    '.colors{display:flex;gap:14px}.crow{display:flex;align-items:center;gap:6px}.crow .lbl{color:#bbb}' +
    'input[type=color]{width:26px;height:20px;padding:0;border:1px solid #2c2c2c;border-radius:4px;background:#0d0d0d}' +
    '.presets,.modes{display:flex;flex-wrap:wrap;gap:5px}' +
    '.chip{background:#0f0f0f;border:1px solid #2c2c2c;color:#ccc;border-radius:5px;padding:4px 7px;font-size:10px;cursor:pointer}' +
    '.chip:hover{border-color:#444}.chip.on{background:#22305c;border-color:#3b6fff;color:#cfe}' +
    '.foot{display:flex;gap:6px;padding:9px 11px}' +
    '.foot button{flex:1;background:#0f0f0f;border:1px solid #2c2c2c;color:#ccc;border-radius:5px;padding:6px;font-size:10px;cursor:pointer}' +
    '.foot button:hover{border-color:#444}' +
    '</style>';

  var LAUNCHER = '<button class="launcher hidden">grid</button>';

  var PANEL =
    '<div class="panel">' +
      '<div class="head"><span class="t">grid debugger</span><span class="count"></span><button class="close" aria-label="close">×</button></div>' +
      '<div class="sec"><h4>layers</h4><div class="modes"></div></div>' +
      '<div class="sec"><h4>grid</h4><div class="controls"></div></div>' +
      '<div class="sec"><h4>colour</h4><div class="colors"></div></div>' +
      '<div class="sec"><h4>presets</h4><div class="presets"></div></div>' +
      '<div class="foot"><button class="copy-css">copy css</button><button class="copy-json">copy json</button><button class="reset">reset</button></div>' +
    '</div>';

  global.GridDebug = GridDebug;

  function boot() {
    var s = document.currentScript || document.querySelector('script[src*="grid-debug"]');
    if (s && s.getAttribute('data-auto') === 'false') return;
    GridDebug.mount();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(typeof window !== 'undefined' ? window : this);
