import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import NoiseCanvas from './NoiseCanvas'
import { useReducedMotion } from '../hooks/useReducedMotion'
import asciiVideo from '../media/ascii-art(1).mp4'

const INSTALL_CMD = 'npx github:Jingquank/Bench'
const MAX_TILT = 7

const SKILL_LAST_UPDATED = new Date(__SKILL_MTIME__).toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric',
})
const SKILL_VERSION = `v${__SKILL_VERSION__}`

export default function TidalArtifact({ mousePos = { x: 0.5, y: 0.5 } }) {
  const topVideoSrc = asciiVideo
  const [timestamp, setTimestamp] = useState(() =>
    new Date().toLocaleTimeString('en-US', { hour12: false })
  )
  const [copied, setCopied] = useState(false)
  const [cardMouse, setCardMouse] = useState({ x: 0.5, y: 0.5, inside: false })
  const modeRef = useRef('flow')
  const mouseRef = useRef({ x: 0, y: 0 })
  const containerRef = useRef(null)
  const widgetRef = useRef(null)
  const reducedMotion = useReducedMotion()

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — fail silently */
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setTimestamp(now.toLocaleTimeString('en-US', { hour12: false }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const updatePointer = useCallback((clientX, clientY) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return
    const x = clientX - rect.left
    const y = clientY - rect.top
    mouseRef.current = { x, y }
  }, [])

  const handleMouseMove = useCallback(
    (e) => updatePointer(e.clientX, e.clientY),
    [updatePointer]
  )

  const handleTouchMove = useCallback(
    (e) => {
      const touch = e.touches[0]
      if (touch) updatePointer(touch.clientX, touch.clientY)
    },
    [updatePointer]
  )

  const handleWidgetMouseMove = useCallback((e) => {
    const rect = widgetRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return
    setCardMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
      inside: true,
    })
  }, [])

  const handleWidgetMouseLeave = useCallback(() => {
    setCardMouse((prev) => ({ ...prev, inside: false }))
  }, [])

  const { rotateX, rotateY, shadowX, shadowY } = useMemo(() => {
    if (reducedMotion) {
      return { rotateX: 0, rotateY: 0, shadowX: 0, shadowY: 10 }
    }
    const rx = (0.5 - mousePos.y) * MAX_TILT * 2
    const ry = (mousePos.x - 0.5) * MAX_TILT * 2
    return {
      rotateX: rx,
      rotateY: ry,
      shadowX: -ry * 2,
      shadowY: rx * 2 + 10,
    }
  }, [mousePos, reducedMotion])

  const { glareX, glareY } = useMemo(() => {
    if (reducedMotion || !cardMouse.inside) {
      return { glareX: 50, glareY: 50 }
    }
    return { glareX: cardMouse.x * 100, glareY: cardMouse.y * 100 }
  }, [cardMouse, reducedMotion])

  const widgetStyle = {
    ...styles.widget,
    transform: reducedMotion
      ? 'none'
      : `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    boxShadow: reducedMotion
      ? '0 10px 30px rgba(0,0,0,0.5)'
      : `${shadowX}px ${shadowY}px 30px rgba(0,0,0,0.5)`,
    transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
    willChange: 'transform',
  }

  const glareStyle = reducedMotion ? null : {
    position: 'absolute',
    inset: 0,
    borderRadius: 8,
    background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(0,255,65,${cardMouse.inside ? 0.45 : 0}), transparent 60%)`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'exclude',
    padding: 1.5,
    pointerEvents: 'none',
    zIndex: 20,
    transition: 'background 0.15s ease-out',
  }

  const tickerStyle = reducedMotion
    ? { ...styles.tickerText, animation: 'none' }
    : styles.tickerText

  return (
    <div
      ref={widgetRef}
      style={widgetStyle}
      onMouseMove={handleWidgetMouseMove}
      onMouseLeave={handleWidgetMouseLeave}
      role="region"
      aria-label="Tidal Phase Artifact — ocean monitoring widget"
    >
      {glareStyle && <div style={glareStyle} />}
      {/* Top Visual Area */}
      <div style={styles.topVisualContainer}>
        <video
          style={styles.topVideo}
          src={topVideoSrc}
          autoPlay
          loop
          muted
          playsInline
          aria-label="ASCII art video preview"
        />
      </div>

      {/* Info Panel */}
      <div style={styles.infoPanel}>
        <div style={styles.cmdRow}>
          <span style={styles.cmdText}>{INSTALL_CMD}</span>
          <button
            style={styles.copyBtn}
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : 'Copy install command'}
          >
            {copied ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </div>
        <div style={styles.headerGroup}>
          <pre style={styles.title} aria-label="BENCH">{
`██████╗ ███████╗███╗   ██╗ ██████╗██╗  ██╗
██╔══██╗██╔════╝████╗  ██║██╔════╝██║  ██║
██████╔╝█████╗  ██╔██╗ ██║██║     ███████║
██╔══██╗██╔══╝  ██║╚██╗██║██║     ██╔══██║
██████╔╝███████╗██║ ╚████║╚██████╗██║  ██║
╚═════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝`
          }</pre>
          <div style={styles.metaData}>
            <span>LAT: 43.65° N</span>
            <span>LON: 79.39° W</span>
            <span aria-live="off" aria-atomic="true">{timestamp}</span>
          </div>
        </div>

        <div style={styles.dataGrid}>
          <div style={styles.dataItem}>
            <span style={styles.label}>Last Update</span>
            <span style={styles.value}>{SKILL_LAST_UPDATED}</span>
          </div>
          <div style={styles.dataItem}>
            <span style={styles.label}>Version Number</span>
            <span style={styles.value}>{SKILL_VERSION}</span>
          </div>
        </div>

        <div style={styles.ticker} aria-hidden="true">
          <span style={tickerStyle}>
           BENCH, XRAY, DRILL. DESIGNED BY BENCH DESIGN TEAM.&nbsp;
          </span>
          <span style={tickerStyle}>
           BENCH, XRAY, DRILL. DESIGNED BY BENCH DESIGN TEAM.&nbsp;
          </span>
        </div>
      </div>

      {/* Visual Area */}
      <div
        ref={containerRef}
        style={styles.bottomVisualContainer}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        <div style={styles.gridOverlay} />
        <NoiseCanvas mode={modeRef} mousePos={mouseRef} reducedMotion={reducedMotion} />
      </div>
    </div>
  )
}

const styles = {
  widget: {
    width: 320,
    height: 'fit-content',
    backgroundColor: 'var(--paper)',
    color: 'var(--ink)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflow: 'hidden',
    borderRadius: 8,
    border: '1px solid rgba(0, 255, 65, 0.2)',
    userSelect: 'none',
    flexShrink: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: 0,
    marginBottom: 4,
  },
  topVisualContainer: {
    position: 'relative',
    width: '100%',
    height: 'fit-content',
    flexShrink: 0,
    overflow: 'hidden',
    touchAction: 'none',
  },
  bottomVisualContainer: {
    position: 'relative',
    width: '100%',
    height: 24,
    minHeight: 24,
    overflow: 'hidden',
    touchAction: 'none',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage:
      'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
    backgroundSize: '15px 15px',
    pointerEvents: 'none',
    zIndex: 10,
  },
  infoPanel: {
    padding: 12,
    background: 'var(--paper)',
    position: 'relative',
    zIndex: 15,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    fontFamily: 'var(--v-font)',
    borderBottom: '1px solid var(--ink)',
    width: '100%',
  },
  headerGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 255, 65, 0.3)',
    paddingBottom: 8,
    height: 'fit-content',
    width: '100%',
    gap: 8,
  },
  title: {
    fontSize: 4.6,
    margin: 0,
    fontFamily: "'Ubuntu Mono', monospace",
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: 0,
    textShadow: '0 0 6px rgba(0, 255, 65, 0.4)',
    overflow: 'hidden',
    flexShrink: 1,
    minWidth: 0,
  },
  metaData: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'right',
    gap: 1,
    opacity: 0.8,
    width: 96,
  },
  dataGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  dataItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    width: 143,
    minWidth: 0,
  },
  label: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'normal',
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  ticker: {
    fontSize: 12,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    borderTop: '1px solid rgba(0, 255, 65, 0.5)',
    paddingTop: 8,
    display: 'flex',
    opacity: 0.7,
  },
  tickerText: {
    display: 'inline-block',
    paddingRight: 0,
    animation: 'marquee 11s linear infinite',
  },
  topVideo: {
    width: '100%',
    height: 'fit-content',
    display: 'block',
    objectFit: 'cover',
  },
  cmdRow: {
    background: '#0b0f09',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    borderRadius: 4,
    padding: '1px 9px',
    height: 38,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    boxSizing: 'border-box',
  },
  cmdText: {
    fontFamily: "'Ubuntu Mono', monospace",
    fontSize: 12,
    color: 'var(--ink)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minWidth: 0,
  },
  copyBtn: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
}
