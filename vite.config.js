import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { statSync, readFileSync } from 'fs'
import { resolve } from 'path'

// Shipped skills — "last updated" reflects the most recently touched one.
const SKILL_FILES = ['XRAY.md', 'DRILL.md', 'REALITYCHECK.md', 'LORE.md']

function packMetaPlugin() {
  return {
    name: 'pack-meta',
    config() {
      // Version is pack-wide: package.json is the single source of truth.
      let version
      try {
        const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))
        version = pkg.version || '0.0.0'
      } catch {
        version = '0.0.0'
      }
      let mtime
      try {
        const times = SKILL_FILES.map((f) => statSync(resolve(__dirname, f)).mtimeMs)
        mtime = new Date(Math.max(...times)).toISOString()
      } catch {
        mtime = new Date().toISOString()
      }
      return {
        define: {
          __SKILL_MTIME__: JSON.stringify(mtime),
          __SKILL_VERSION__: JSON.stringify(version),
        },
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), packMetaPlugin()],
  base: '/Bench/',
  // Treat 3D model files as static assets so `import url from '*.glb'` returns a URL.
  assetsInclude: ['**/*.glb', '**/*.gltf'],
})
