/* GridOverlay.jsx — Müller-Brockmann grid overlay as a React component
 *
 * Mount once near the root of a webapp. Draws the layers of a typographic grid
 * over the viewport: page margins, columns, the baseline rhythm, and the grid
 * fields (the columns × rows matrix of modules).
 *
 *   import GridOverlay from './GridOverlay';
 *   // bounded matrix (poster / hero):
 *   <GridOverlay columns={6} rows={8} baseline={24} />
 *   // scrolling page (field rhythm tiles down):
 *   <GridOverlay columns={12} rows={0} baseline={24} />
 *
 * Hotkeys:  g toggle · m cycle mode · [ ] nudge baseline
 * Modes:    all → columns → baseline → fields → margins → off
 */
import { useEffect, useState, useCallback } from 'react';

const MODES = ['all', 'columns', 'baseline', 'fields', 'margins', 'off'];

function rgba(hex, a) {
  if (hex[0] !== '#') return hex;
  let h = hex.slice(1);
  if (h.length === 3) h = h.replace(/./g, '$&$&');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export default function GridOverlay({
  columns = 12,
  rows = 0,            // number of field rows; 0 = tile down a scrolling page
  gutter = 24,
  rowGutter = 1,       // baseline rows between field rows
  margin = 32,
  maxWidth = 1200,
  baseline = 24,
  baselineOffset = 0,
  rowHeight = 4,       // baseline rows per field row
  color = '#3b6fff',
  accent = '#ff4d6d',
  opacity = 1,
  start = 'all',
  hud = true,
  zIndex = 2147483000,
  hotkeys = true,
}) {
  const [mode, setMode] = useState(start);
  const [base, setBase] = useState(baseline);
  const [vw, setVw] = useState(typeof window !== 'undefined' ? document.documentElement.clientWidth : 1280);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => setBase(baseline), [baseline]);

  const cycle = useCallback(() => setMode((m) => MODES[(MODES.indexOf(m) + 1) % MODES.length]), []);
  const toggle = useCallback(() => setMode((m) => (m === 'off' ? (start === 'off' ? 'all' : start) : 'off')), [start]);

  useEffect(() => {
    const onResize = () => setVw(document.documentElement.clientWidth);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!hotkeys) return;
    const onKey = (e) => {
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'g' || e.key === 'G') { e.preventDefault(); toggle(); }
      else if (e.key === 'm' || e.key === 'M') { e.preventDefault(); cycle(); }
      else if (e.key === ']') setBase((b) => b + 1);
      else if (e.key === '[') setBase((b) => Math.max(2, b - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hotkeys, toggle, cycle]);

  // Same model as grid.css: outer box capped at maxWidth, margin is padding
  // INSIDE it, so the column area = outer - 2*margin. (Treating margin as
  // outside the measure drifts the overlay off the real columns once
  // vw > maxWidth — see grid-overlay.js _metrics for the full note.)
  const outer = maxWidth > 0 ? Math.min(maxWidth, vw) : vw;
  const measure = Math.max(0, outer - 2 * margin);
  const boxLeft = (vw - outer) / 2;
  const innerL = boxLeft + margin;
  const innerR = vw - boxLeft - margin;
  const fieldH = rowHeight * base;
  const period = fieldH + rowGutter * base;
  const bounded = rows > 0;
  const H = bounded ? rows * fieldH + (rows - 1) * rowGutter * base : null;
  const top = baselineOffset - scrollY;
  const blY = ((top % base) + base) % base;
  const fY = bounded ? top : ((top % period) + period) % period;

  const show = (m) => mode === 'all' || mode === m;
  const layer = { position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' };

  if (mode === 'off') {
    return hud ? <Hud {...{ mode, columns, rows, gutter, margin, baseline: base, rowHeight, rowGutter, measure: 0, zIndex }} /> : null;
  }

  return (
    <div style={{ ...layer, zIndex, opacity }} aria-hidden>
      {show('baseline') && (
        <div style={{
          ...layer, transform: `translateY(${blY}px)`,
          background: `repeating-linear-gradient(to bottom,transparent 0,transparent ${base - 1}px,${rgba(color, 0.35)} ${base - 1}px,${rgba(color, 0.35)} ${base}px)`,
        }} />
      )}
      <div style={{ position: 'fixed', top: 0, bottom: 0, left: boxLeft, width: outer, overflow: 'hidden' }}>
        {show('fields') && (
          <div style={{
            position: 'absolute', left: margin, right: margin, top: 0,
            height: bounded ? H : '100%',
            transform: `translateY(${fY}px)`,
            background: `repeating-linear-gradient(to bottom,${rgba(accent, 0.12)} 0,${rgba(accent, 0.12)} ${fieldH}px,transparent ${fieldH}px,transparent ${period}px)`,
          }} />
        )}
        {show('columns') && (
          <div style={{
            position: 'absolute', left: margin, right: margin, top: 0,
            height: bounded ? H : '100%',
            transform: bounded ? `translateY(${top}px)` : 'none',
            display: 'flex', gap: gutter,
          }}>
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} style={{
                flex: '1 1 0', height: '100%',
                background: rgba(color, 0.1),
                borderLeft: `1px solid ${rgba(color, 0.45)}`,
                borderRight: `1px solid ${rgba(color, 0.45)}`,
              }} />
            ))}
          </div>
        )}
      </div>
      {show('margins') && (
        <>
          {[innerL, innerR].map((x, i) => (
            <div key={i} style={{ position: 'fixed', top: 0, bottom: 0, left: x, width: 1, background: rgba(accent, 0.7) }} />
          ))}
          {bounded && [0, H].map((y, i) => (
            <div key={`h${i}`} style={{ position: 'fixed', left: innerL, width: measure, height: 1, top: 0, transform: `translateY(${top + y}px)`, background: rgba(accent, 0.7) }} />
          ))}
        </>
      )}
      {hud && <Hud {...{ mode, columns, rows, gutter, margin, baseline: base, rowHeight, rowGutter, measure, zIndex }} />}
    </div>
  );
}

function Hud({ mode, columns, rows, gutter, margin, baseline, rowHeight, rowGutter, measure, zIndex }) {
  const matrix = rows > 0 ? `${columns} × ${rows} = ${columns * rows} fields` : `${columns} col · rows tile`;
  return (
    <div style={{
      position: 'fixed', left: 8, bottom: 8, zIndex: zIndex + 1, pointerEvents: 'none',
      font: '11px/1.4 ui-monospace,Menlo,monospace', color: '#fff',
      background: 'rgba(17,17,17,.82)', padding: '5px 8px', borderRadius: 6, whiteSpace: 'pre',
    }}>
      {`grid · ${mode}\n${matrix}\ngut ${gutter} · marg ${margin} · measure ${Math.round(measure)}\nbase ${baseline} · row ${rowHeight}+${rowGutter} rows`}
    </div>
  );
}
