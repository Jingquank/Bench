import { useRef, useEffect, useCallback } from 'react'

const SCALE = 3
const COLOR_INK = '#00FF41'
const COLOR_PAPER = '#10200C'

export default function NoiseCanvas({ mode, mousePos, reducedMotion }) {
  const canvasRef = useRef(null)
  const timeRef = useRef(0)
  const frameRef = useRef(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    if (w === 0 || h === 0) {
      frameRef.current = requestAnimationFrame(draw)
      return
    }

    const columns = Math.ceil(w / SCALE)
    const rows = Math.ceil(h / SCALE)
    const mx = w > 0 ? mousePos.current.x / w : 0.5
    const my = h > 0 ? mousePos.current.y / h : 0.5
    const t = timeRef.current

    ctx.fillStyle = COLOR_PAPER
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = COLOR_INK

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const nx = x / columns
        const ny = y / rows
        let value

        if (mode.current === 'flow') {
          const dist = Math.sqrt((nx - mx) ** 2 + (ny - my) ** 2)
          const wave = Math.sin(nx * 20 + ny * 8 + t * 0.04)
          const wave2 = Math.cos(ny * 15 - t * 0.08)
          value = (wave + wave2) * 0.5 - dist * 0.7
          if (Math.random() > 0.99) value = 1
        } else {
          const noiseX = Math.floor(nx * 8 + t * 0.1)
          const noiseY = Math.floor(ny * 8)
          value = Math.sin(noiseX * noiseY * 43758.5453) > 0 ? 1 : -1
          if (ny > my) value = -1
        }

        if (value > 0.1) {
          ctx.globalAlpha = Math.min(1, value + 0.3)
          ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
        }
      }
    }

    ctx.globalAlpha = 1.0
    timeRef.current++

    if (!reducedMotion) {
      frameRef.current = requestAnimationFrame(draw)
    }
  }, [mode, mousePos, reducedMotion])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      if (w > 0 && h > 0) {
        canvas.width = w
        canvas.height = h
      }
    }

    resize()
    window.addEventListener('resize', resize)
    frameRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [draw])

  useEffect(() => {
    if (reducedMotion) {
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
      draw()
    } else if (frameRef.current == null) {
      frameRef.current = requestAnimationFrame(draw)
    }
  }, [reducedMotion, draw])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Animated tidal phase visualization"
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        imageRendering: 'pixelated',
      }}
    />
  )
}
