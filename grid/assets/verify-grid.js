/* verify-grid.js — prove a page actually sits on its grid (in-page, no deps)
 *
 * "A grid you can't measure is a mood board, not a system." This runs IN THE
 * PAGE — paste it in the console, or have an agent inject it via browser tools —
 * and measures, for the CURRENT viewport, how well the real layout adheres to
 * its grid. No Puppeteer, no Node, no build step.
 *
 *   GridVerify();                       // check, log a one-line summary, return data
 *   GridVerify({ optical: '.masthead, h1' });   // also check ink-on-line
 *   GridVerify({ grid: '.grid', baseline: 24, tol: 0.75 });
 *
 * To test the width-dependent drift the overlay used to have, resize the window
 * (or set the viewport via your browser tools) to a few widths above AND below
 * --grid-max-width — e.g. 1440 / 1180 / 900 — and call GridVerify() at each.
 * The centered-container bug only shows when the viewport is wider than the max.
 *
 * Checks (all in px; ~0 is the goal):
 *   1. column   — every placed grid item's left snaps to a column START line and
 *                 its right to a column END line. Builds BOTH the start-set and
 *                 the end-set: an item spanning "to line N" ends at the FAR side
 *                 of the gutter, so single-edge math falsely reports a one-gutter
 *                 error. Optically-aligned display elements are EXCLUDED here
 *                 (their box is intentionally offset; they're checked in #4).
 *   2. overlay  — if the overlay is mounted, each of its columns matches the
 *                 content column rect. This is what proves the overlay shares
 *                 the content box.
 *   3. baseline — text tops, modulo the baseline unit, ~0 (tolerance ≈ ½ unit;
 *                 the box top is a proxy — the leading does the real work).
 *   4. ink      — (only if `optical` is given) each display element's visible
 *                 INK-left sits on its own column line, measured in the loaded
 *                 font. CAVEAT: side-bearing is font-specific; correct only when
 *                 the real webfont is loaded.
 */
(function (global) {
  'use strict';

  function num(v, fallback) { var n = parseFloat(v); return isNaN(n) ? fallback : n; }

  // Column START (L) and END (R) x-coordinates of a real grid's tracks.
  function columnsOf(grid) {
    var cs = getComputedStyle(grid);
    if (cs.display.indexOf('grid') === -1) return null;
    var tracks = cs.gridTemplateColumns.split(/\s+/)
      .filter(function (t) { return /^-?[\d.]/.test(t); })
      .map(parseFloat);
    if (!tracks.length) return null;
    var gap = num(cs.columnGap, 0);
    var r = grid.getBoundingClientRect();
    var x = r.left + num(cs.borderLeftWidth, 0) + num(cs.paddingLeft, 0);
    var top = r.top + num(cs.borderTopWidth, 0) + num(cs.paddingTop, 0);
    var L = [], R = [];
    for (var i = 0; i < tracks.length; i++) {
      L.push(x); x += tracks[i]; R.push(x);
      if (i < tracks.length - 1) x += gap;
    }
    return { L: L, R: R, top: top, count: tracks.length };
  }

  function nearest(v, arr) {
    var best = Infinity;
    for (var i = 0; i < arr.length; i++) {
      var d = Math.abs(arr[i] - v);
      if (d < best) best = d;
    }
    return best;
  }

  global.GridVerify = function (opts) {
    opts = opts || {};
    var rootCs = getComputedStyle(document.documentElement);
    var baseline = opts.baseline || num(rootCs.getPropertyValue('--grid-baseline'), 24);
    var gridSel = opts.grid || '.grid';
    var textSel = opts.text || 'p, li, .body, .lede, .cap, .caption, blockquote';
    var opticalSel = opts.optical || null;
    var tol = opts.tol != null ? opts.tol : 0.75;
    var baseTol = opts.baselineTol != null ? opts.baselineTol : baseline / 2;

    var grids = [].slice.call(document.querySelectorAll(gridSel));
    if (!grids.length) {
      var none = { error: 'no ' + gridSel + ' found', pass: false };
      console.warn('[GridVerify] no grid (' + gridSel + ') on the page');
      return none;
    }

    var colErr = 0, colWorst = null, colChecked = 0;
    var baselineErr = 0;
    var firstCols = null;

    grids.forEach(function (grid) {
      var cols = columnsOf(grid);
      if (!cols) return;
      if (!firstCols) firstCols = cols;

      // 1. column adherence — direct grid children + any subgrid .band children
      var items = [].slice.call(grid.children);
      [].forEach.call(grid.querySelectorAll('.band > *'), function (el) { items.push(el); });
      items.forEach(function (el) {
        if (el.hasAttribute && el.hasAttribute('data-grid-overlay')) return;
        if (opticalSel && el.matches && el.matches(opticalSel)) return;
        if (el.classList && el.classList.contains('band')) return; // checked via its children
        var r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 1) return;
        var e = Math.max(nearest(r.left, cols.L), nearest(r.right, cols.R));
        colChecked++;
        if (e > colErr) { colErr = e; colWorst = (el.className || el.tagName) + ''; }
      });

      // 3. baseline — text tops modulo the unit, relative to this grid's top
      [].forEach.call(grid.querySelectorAll(textSel), function (el) {
        var t = el.getBoundingClientRect().top - cols.top;
        var m = ((t % baseline) + baseline) % baseline;
        baselineErr = Math.max(baselineErr, Math.min(m, baseline - m));
      });
    });

    // 2. overlay match — compare the mounted overlay's columns to the content's
    var overlayChecked = false, overlayErr = 0;
    var ovCols = document.querySelectorAll('[data-grid-overlay] [data-grid-cols] > div');
    if (ovCols.length && firstCols) {
      overlayChecked = true;
      for (var i = 0; i < ovCols.length; i++) {
        var rr = ovCols[i].getBoundingClientRect();
        if (firstCols.L[i] != null) overlayErr = Math.max(overlayErr, Math.abs(rr.left - firstCols.L[i]));
        if (firstCols.R[i] != null) overlayErr = Math.max(overlayErr, Math.abs(rr.right - firstCols.R[i]));
      }
    }

    // 4. optical ink — display ink-left on its own column line (loaded font)
    var inkChecked = false, inkErr = 0, inkWorst = null;
    if (opticalSel && firstCols) {
      inkChecked = true;
      var ctx = document.createElement('canvas').getContext('2d');
      [].forEach.call(document.querySelectorAll(opticalSel), function (el) {
        var cs = getComputedStyle(el);
        var text = (el.textContent || '').replace(/^\s+/, '');
        if (!text) return;
        var ch = text.charAt(0);
        if (cs.textTransform === 'uppercase') ch = ch.toUpperCase();
        ctx.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
        ctx.textAlign = 'left';
        var abl = ctx.measureText(ch).actualBoundingBoxLeft;
        if (!isFinite(abl)) return;
        var box = el.getBoundingClientRect().left;
        var ink = box - abl;                          // visible ink-left
        // its own column line = nearest column START to the box
        var target = firstCols.L.reduce(function (b, e2) {
          return Math.abs(e2 - box) < Math.abs(b - box) ? e2 : b;
        }, firstCols.L[0]);
        var e = Math.abs(ink - target);
        if (e > inkErr) { inkErr = e; inkWorst = (el.className || el.tagName) + ' "' + ch + '"'; }
      });
    }

    var pass = colErr <= tol &&
      (!overlayChecked || overlayErr <= tol) &&
      baselineErr <= baseTol &&
      (!inkChecked || inkErr <= 1.0);

    var out = {
      viewport: window.innerWidth,
      columns: firstCols ? firstCols.count : 0,
      itemsChecked: colChecked,
      colErr: +colErr.toFixed(2), colWorst: colWorst,
      overlayChecked: overlayChecked, overlayErr: +overlayErr.toFixed(2),
      baselineErr: +baselineErr.toFixed(2),
      inkChecked: inkChecked, inkErr: +inkErr.toFixed(2), inkWorst: inkWorst,
      pass: pass
    };
    console.log('[GridVerify] ' + (pass ? 'PASS' : 'FAIL') +
      '  vw=' + out.viewport + ' col=' + out.colErr + 'px' +
      (overlayChecked ? ' overlay=' + out.overlayErr + 'px' : '') +
      ' baseline=' + out.baselineErr + 'px' +
      (inkChecked ? ' ink=' + out.inkErr + 'px' : '') +
      (pass ? '' : '  (worstCol=' + colWorst + (inkWorst ? ', worstInk=' + inkWorst : '') + ')'));
    return out;
  };
})(typeof window !== 'undefined' ? window : this);
