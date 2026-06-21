/* grid-optical.js — optical alignment for display type (opt-in, off by default)
 *
 * Large display glyphs carry a left side-bearing: the ink sits inside the
 * layout box, so a headline whose BOX is on the column line still LOOKS
 * indented against body text. (Box-on-grid ≠ ink-on-grid.) This measures each
 * element's first glyph in the ACTUALLY-LOADED font (canvas
 * actualBoundingBoxLeft) and nudges its margin-left so the visible INK lands on
 * the line. It re-runs after webfonts load and on resize, so it scales with
 * fluid type.
 *
 * It does NOTHING until you opt elements in:
 *
 *   <script src="grid-optical.js"></script>
 *   <script>
 *     GridOptical.align('.masthead, h1, .numeral');  // align now + stay aligned
 *   </script>
 *
 *   GridOptical.once('h1');   // measure + nudge a one-off, no resize binding
 *   GridOptical.clear();      // remove every nudge it applied
 *
 * Apply it only to large display type (mastheads, big numerals, section heads) —
 * body text is small enough that the side-bearing is visually irrelevant, and
 * nudging every paragraph would be wrong.
 *
 * CAVEAT — the measurement is FONT-SPECIFIC. It is only correct when the real
 * webfont is loaded; measuring against a fallback grotesque yields the wrong
 * nudge (e.g. ~-16px on a fallback vs ~-7px on real Inter for the same "H"). In
 * the browser this reads the loaded font, so it is correct for the user; for
 * offline / headless verification, embed the real font (@font-face local()) so
 * canvas measures the right shape.
 */
(function (global) {
  'use strict';

  var ctx = null;
  function context() {
    if (!ctx) ctx = document.createElement('canvas').getContext('2d');
    return ctx;
  }

  var GridOptical = {
    _sel: null,
    _onResize: null,
    _t: null,

    // Align elements matching `selector` now, and keep them aligned on resize
    // and after webfonts finish loading. Call again with a new selector to
    // change the target set.
    align: function (selector) {
      this._sel = selector;
      this._applySelector(selector);
      this._bind();
      if (document.fonts && document.fonts.ready) {
        var self = this;
        document.fonts.ready.then(function () { self._applySelector(self._sel); });
      }
      return this;
    },

    // Measure + nudge once, without binding resize/font listeners.
    once: function (selector) {
      this._applySelector(selector || this._sel);
      return this;
    },

    _applySelector: function (selector) {
      if (!selector) return;
      var c = context();
      var els = document.querySelectorAll(selector);
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        el.style.marginLeft = '0px';            // reset before measuring
        var cs = getComputedStyle(el);
        var text = (el.textContent || '').replace(/^\s+/, '');
        if (!text) continue;
        var ch = text.charAt(0);
        if (cs.textTransform === 'uppercase') ch = ch.toUpperCase();
        c.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
        c.textAlign = 'left';
        // actualBoundingBoxLeft: distance from the x=0 alignment point to the
        // ink's left edge, positive going left. For the common case (ink inset
        // by a positive side-bearing) it is negative, so setting it as
        // margin-left shifts the box left until the ink sits on the line.
        var abl = c.measureText(ch).actualBoundingBoxLeft;
        if (isFinite(abl)) el.style.marginLeft = abl.toFixed(2) + 'px';
      }
    },

    // Remove every nudge applied to the current selector and stop listening.
    clear: function () {
      if (this._sel) {
        var els = document.querySelectorAll(this._sel);
        for (var i = 0; i < els.length; i++) els[i].style.marginLeft = '';
      }
      this._unbind();
      this._sel = null;
      return this;
    },

    _bind: function () {
      if (this._onResize) return;
      var self = this;
      this._onResize = function () {
        clearTimeout(self._t);
        self._t = setTimeout(function () { self._applySelector(self._sel); }, 120);
      };
      window.addEventListener('resize', this._onResize);
    },

    _unbind: function () {
      if (this._onResize) window.removeEventListener('resize', this._onResize);
      this._onResize = null;
      clearTimeout(this._t);
    }
  };

  global.GridOptical = GridOptical;
})(typeof window !== 'undefined' ? window : this);
