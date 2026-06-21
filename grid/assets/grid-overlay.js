/* grid-overlay.js — Müller-Brockmann grid overlay for web
 *
 * A toggleable visual overlay that draws the layers of a typographic grid over
 * any live page or webapp: page margins, the column grid, the baseline grid
 * (line-height rhythm), and the grid fields (Rasterfelder) — the columns × rows
 * matrix of modules that text and images snap to.
 *
 * The grid is a matrix: `columns` × `rows` fields. Set `rows` to a number for a
 * bounded matrix anchored to the top of the content (a poster, a hero, a print-
 * like page); set `rows: 0` to tile the field rhythm down a scrolling page.
 *
 * Drop in: <script src="grid-overlay.js"></script>
 * Or paste the whole file into the console / a bookmarklet.
 *
 * Config resolution order (first found wins per key):
 *   1. GridOverlay.init({ ... })            explicit
 *   2. <script data-columns="12" data-rows="6" ...>   script tag attributes
 *   3. window.__GRID_CONFIG__ = { ... }      global
 *   4. :root CSS custom properties           --grid-columns, --grid-rows, …
 *   5. defaults below
 *
 * Hotkeys:  g  toggle on/off      m  cycle mode      [ ]  nudge baseline
 * Modes:    all → columns → baseline → fields → margins → off
 */
(function (global) {
  'use strict';

  var DEFAULTS = {
    columns: 12,        // number of columns
    rows: 0,            // number of field rows; 0 = tile down a scrolling page
    gutter: 24,         // px between columns
    rowGutter: 1,       // baseline rows between field rows
    margin: 32,         // px page margin (each side)
    maxWidth: 1200,     // px outer box (margin is padding inside); 0 = full bleed
    baseline: 24,       // px baseline rhythm — set to your body line-height
    baselineOffset: 0,  // px offset of the first baseline / matrix top from doc top
    rowHeight: 4,       // baseline rows per field row (field depth)
    color: '#3b6fff',   // column + baseline colour
    accent: '#ff4d6d',  // field + margin colour
    opacity: 1,         // overall layer opacity
    start: 'all',       // initial mode, or 'off'
    hud: true,          // show the readout chip
    zIndex: 2147483000  // sit above app chrome
  };

  var MODES = ['all', 'columns', 'baseline', 'fields', 'margins', 'off'];

  var CSS_VARS = {
    columns: '--grid-columns', rows: '--grid-rows', gutter: '--grid-gutter',
    rowGutter: '--grid-row-gutter', margin: '--grid-margin',
    maxWidth: '--grid-max-width', baseline: '--grid-baseline',
    rowHeight: '--grid-row-height', color: '--grid-color', accent: '--grid-accent'
  };

  function parseMaybeNum(v) {
    if (typeof v !== 'string') return v;
    var t = v.trim();
    if (/^-?\d*\.?\d+(px|rem)?$/.test(t)) {
      var n = parseFloat(t);
      return /rem$/.test(t) ? n * 16 : n;
    }
    return t;
  }

  function readCssVars(cfg) {
    var cs = getComputedStyle(document.documentElement);
    Object.keys(CSS_VARS).forEach(function (k) {
      var v = cs.getPropertyValue(CSS_VARS[k]).trim();
      if (v) cfg[k] = parseMaybeNum(v);
    });
    return cfg;
  }

  function readScriptAttrs(cfg) {
    var s = document.currentScript ||
      document.querySelector('script[src*="grid-overlay"]');
    if (!s) return cfg;
    Object.keys(DEFAULTS).forEach(function (k) {
      var attr = 'data-' + k.replace(/[A-Z]/g, function (c) { return '-' + c.toLowerCase(); });
      if (s.hasAttribute(attr)) cfg[k] = parseMaybeNum(s.getAttribute(attr));
    });
    return cfg;
  }

  function resolveConfig(override) {
    var cfg = Object.assign({}, DEFAULTS);
    readCssVars(cfg);
    if (global.__GRID_CONFIG__) Object.assign(cfg, global.__GRID_CONFIG__);
    readScriptAttrs(cfg);
    if (override) Object.assign(cfg, override);
    return cfg;
  }

  var GridOverlay = {
    cfg: null,
    root: null,
    mode: 'all',
    _onScroll: null,
    _onResize: null,
    _onKey: null,

    init: function (override) {
      this.destroy();
      this.cfg = resolveConfig(override);
      this.mode = this.cfg.start === 'off' ? 'off' : this.cfg.start;
      this._build();
      this._bind();
      this.render();
      return this;
    },

    _build: function () {
      var c = this.cfg;
      var root = document.createElement('div');
      root.setAttribute('data-grid-overlay', '');
      root.style.cssText = [
        'position:fixed', 'inset:0', 'pointer-events:none',
        'z-index:' + c.zIndex, 'opacity:' + c.opacity,
        'overflow:hidden', 'contain:strict'
      ].join(';');

      var baseline = document.createElement('div'); // full viewport, scrolls in y
      baseline.setAttribute('data-grid-baseline', '');
      baseline.style.cssText = 'position:absolute;inset:0';

      var box = document.createElement('div');       // centered on the measure
      box.setAttribute('data-grid-box', '');
      box.style.cssText = [
        'position:absolute', 'top:0', 'bottom:0', 'left:50%',
        'transform:translateX(-50%)', 'overflow:hidden'
      ].join(';');

      var fields = document.createElement('div');     // field matrix, clipped to box
      fields.setAttribute('data-grid-fields', '');
      fields.style.cssText = 'position:absolute;left:0;right:0;top:0';

      var cols = document.createElement('div');        // column tracks
      cols.setAttribute('data-grid-cols', '');
      cols.style.cssText = 'position:absolute;left:0;right:0;top:0;display:flex';

      var margins = document.createElement('div');     // page + matrix edges
      margins.setAttribute('data-grid-margins', '');
      margins.style.cssText = 'position:absolute;inset:0';

      box.appendChild(fields);
      box.appendChild(cols);
      root.appendChild(baseline);
      root.appendChild(box);
      root.appendChild(margins);

      var hud = null;
      if (c.hud) {
        hud = document.createElement('div');
        hud.setAttribute('data-grid-hud', '');
        hud.style.cssText = [
          'position:fixed', 'left:8px', 'bottom:8px', 'pointer-events:none',
          'font:11px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace',
          'color:#fff', 'background:rgba(17,17,17,.82)', 'padding:5px 8px',
          'border-radius:6px', 'letter-spacing:.02em', 'white-space:pre'
        ].join(';');
        root.appendChild(hud);
      }

      this.root = root;
      this._el = { box: box, baseline: baseline, fields: fields, cols: cols, margins: margins, hud: hud };
      document.body.appendChild(root);
    },

    _metrics: function () {
      var c = this.cfg;
      var vw = document.documentElement.clientWidth;
      // Match grid.css exactly: the content sits in an OUTER box capped at
      // maxWidth (margin is padding INSIDE that box), so the column area is
      // outer - 2*margin. Treating margin as space outside the measure made
      // the overlay columns wider than the real columns once vw > maxWidth —
      // the "overlay slapped on top / misaligned" drift. Same model both sides.
      var outer = c.maxWidth > 0 ? Math.min(c.maxWidth, vw) : vw;
      var measure = Math.max(0, outer - 2 * c.margin); // column area
      var fieldH = c.rowHeight * c.baseline;
      var period = fieldH + c.rowGutter * c.baseline;
      var bounded = c.rows > 0;
      var H = bounded ? (c.rows * fieldH + (c.rows - 1) * c.rowGutter * c.baseline) : null;
      return { vw: vw, outer: outer, measure: measure, fieldH: fieldH, period: period, bounded: bounded, H: H };
    },

    render: function () {
      if (!this.root) return;
      var c = this.cfg, m = this._metrics();
      this._m = m;
      var show = function (mode) { return GridOverlay.mode === 'all' || GridOverlay.mode === mode; };

      this.root.style.display = this.mode === 'off' ? 'none' : 'block';
      if (this.mode === 'off') { this._renderHud(m); return; }

      // The box is the OUTER content box (capped at maxWidth, centered); the
      // column area is inset from it by `margin` on each side, exactly like
      // grid.css's `max-width + padding-inline: margin`.
      this._el.box.style.width = m.outer + 'px';

      // ---- columns ----------------------------------------------------
      var cols = this._el.cols;
      cols.style.display = show('columns') ? 'flex' : 'none';
      cols.style.left = c.margin + 'px';
      cols.style.right = c.margin + 'px';
      cols.style.gap = c.gutter + 'px';
      cols.style.height = m.bounded ? m.H + 'px' : '100%';
      cols.style.bottom = m.bounded ? 'auto' : '0';
      if (cols.childElementCount !== c.columns) {
        cols.innerHTML = '';
        for (var i = 0; i < c.columns; i++) {
          var col = document.createElement('div');
          col.style.cssText = 'flex:1 1 0;height:100%;background:' +
            rgba(c.color, 0.10) + ';border-left:1px solid ' + rgba(c.color, 0.45) +
            ';border-right:1px solid ' + rgba(c.color, 0.45);
          cols.appendChild(col);
        }
      }

      // ---- baseline (full viewport, scrolls in y) --------------------
      var bl = this._el.baseline;
      bl.style.display = show('baseline') ? 'block' : 'none';
      bl.style.background = 'repeating-linear-gradient(to bottom,' +
        'transparent 0,transparent ' + (c.baseline - 1) + 'px,' +
        rgba(c.color, 0.35) + ' ' + (c.baseline - 1) + 'px,' +
        rgba(c.color, 0.35) + ' ' + c.baseline + 'px)';

      // ---- fields (columns × rows matrix) -----------------------------
      var fr = this._el.fields;
      fr.style.display = show('fields') ? 'block' : 'none';
      fr.style.left = c.margin + 'px';
      fr.style.right = c.margin + 'px';
      fr.style.height = m.bounded ? m.H + 'px' : '100%';
      fr.style.bottom = m.bounded ? 'auto' : '0';
      fr.style.background = 'repeating-linear-gradient(to bottom,' +
        rgba(c.accent, 0.12) + ' 0,' +
        rgba(c.accent, 0.12) + ' ' + m.fieldH + 'px,' +
        'transparent ' + m.fieldH + 'px,' +
        'transparent ' + m.period + 'px)';

      // ---- margins (page edges + matrix top/bottom when bounded) ------
      var mg = this._el.margins;
      mg.style.display = show('margins') ? 'block' : 'none';
      mg.innerHTML = '';
      // Guides sit at the INNER content edge (box edge + margin) — where the
      // real columns start — not at the outer box edge.
      var boxLeft = (m.vw - m.outer) / 2;
      var innerL = boxLeft + c.margin;
      var innerR = m.vw - boxLeft - c.margin;
      [innerL, innerR].forEach(function (x) {
        var line = document.createElement('div');
        line.style.cssText = 'position:absolute;top:0;bottom:0;width:1px;left:' +
          x + 'px;background:' + rgba(c.accent, 0.7);
        mg.appendChild(line);
      });
      if (m.bounded) {
        [0, m.H].forEach(function (y) {
          var line = document.createElement('div');
          line.setAttribute('data-grid-hguide', '');
          line.style.cssText = 'position:absolute;left:' + innerL + 'px;width:' +
            m.measure + 'px;height:1px;top:' + y + 'px;background:' + rgba(c.accent, 0.7);
          mg.appendChild(line);
        });
      }

      this._syncScroll();
      this._renderHud(m);
    },

    _syncScroll: function () {
      var c = this.cfg, m = this._m;
      if (!m) return;
      var top = c.baselineOffset - window.scrollY;
      // baseline: continuous, modulo the rhythm
      var blY = ((top % c.baseline) + c.baseline) % c.baseline;
      this._el.baseline.style.transform = 'translateY(' + blY + 'px)';
      if (m.bounded) {
        // matrix anchored to the page; everything scrolls together
        var t = 'translateY(' + top + 'px)';
        this._el.fields.style.transform = t;
        this._el.cols.style.transform = t;
        var guides = this._el.margins.querySelectorAll('[data-grid-hguide]');
        for (var i = 0; i < guides.length; i++) guides[i].style.transform = t;
      } else {
        var fY = ((top % m.period) + m.period) % m.period;
        this._el.fields.style.transform = 'translateY(' + fY + 'px)';
        this._el.cols.style.transform = 'none';
      }
    },

    _renderHud: function (m) {
      if (!this._el.hud) return;
      var c = this.cfg;
      var matrix = c.rows > 0
        ? c.columns + ' × ' + c.rows + ' = ' + (c.columns * c.rows) + ' fields'
        : c.columns + ' col · rows tile';
      this._el.hud.textContent =
        'grid · ' + this.mode + '\n' + matrix + '\n' +
        'gut ' + c.gutter + ' · marg ' + c.margin + ' · measure ' + Math.round(m.measure) + '\n' +
        'base ' + c.baseline + ' · row ' + c.rowHeight + '+' + c.rowGutter + ' rows';
    },

    setMode: function (mode) { this.mode = mode; this.render(); return this; },
    cycle: function () { var i = MODES.indexOf(this.mode); return this.setMode(MODES[(i + 1) % MODES.length]); },
    toggle: function () { return this.setMode(this.mode === 'off' ? (this.cfg.start === 'off' ? 'all' : this.cfg.start) : 'off'); },
    set: function (patch) { Object.assign(this.cfg, patch); this.render(); return this; },

    _bind: function () {
      var self = this;
      this._onScroll = function () { self._syncScroll(); };
      this._onResize = function () { self.render(); };
      this._onKey = function (e) {
        if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (e.key === 'g' || e.key === 'G') { e.preventDefault(); self.toggle(); }
        else if (e.key === 'm' || e.key === 'M') { e.preventDefault(); self.cycle(); }
        else if (e.key === ']') { self.set({ baseline: self.cfg.baseline + 1 }); }
        else if (e.key === '[') { self.set({ baseline: Math.max(2, self.cfg.baseline - 1) }); }
      };
      window.addEventListener('scroll', this._onScroll, { passive: true });
      window.addEventListener('resize', this._onResize);
      window.addEventListener('keydown', this._onKey);
    },

    destroy: function () {
      if (this._onScroll) window.removeEventListener('scroll', this._onScroll);
      if (this._onResize) window.removeEventListener('resize', this._onResize);
      if (this._onKey) window.removeEventListener('keydown', this._onKey);
      if (this.root && this.root.parentNode) this.root.parentNode.removeChild(this.root);
      this.root = null;
    }
  };

  function rgba(hex, a) {
    if (hex[0] !== '#') return hex;
    var h = hex.slice(1);
    if (h.length === 3) h = h.replace(/./g, '$&$&');
    var n = parseInt(h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  global.GridOverlay = GridOverlay;

  function boot() {
    var s = document.currentScript || document.querySelector('script[src*="grid-overlay"]');
    if (s && s.getAttribute('data-auto') === 'false') return;
    GridOverlay.init();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(typeof window !== 'undefined' ? window : this);
