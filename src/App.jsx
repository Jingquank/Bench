import { useState, useCallback, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import TidalArtifact from './components/TidalArtifact'
import ErrorBoundary from './components/ErrorBoundary'

const nexusModule = import.meta.glob('./components/Nexus.jsx')
const Nexus = nexusModule['./components/Nexus.jsx']
  ? lazy(nexusModule['./components/Nexus.jsx'])
  : () => null

function Home() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  const handleMouseMove = useCallback((e) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    })
  }, [])

  return (
    <div style={styles.page} onMouseMove={handleMouseMove}>
      <ErrorBoundary>
        <TidalArtifact mousePos={mousePos} />
      </ErrorBoundary>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/playground" element={<Suspense><Nexus /></Suspense>} />
    </Routes>
  )
}

const styles = {
  page: {
    width: '100%',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 16, 9, 1)',
    overflow: 'hidden',
  },
}
