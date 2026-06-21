import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import modelUrl from '../media/workbench.glb'

// @xray-generated — tweakable defaults. Reset restores these; on xray clean
// the live-tweaked values get baked back in here as the permanent constants.
export const XRAY_DEFAULTS = {
  // Render / camera
  fov: 30,
  exposure: 1.21,
  bgColor: '#277500',
  // Lighting
  envIntensity: 2,
  keyIntensity: 2.6,
  fillIntensity: 3.3,
  fillColor: '#ffffff',
  // Motion / controls
  autoRotate: true,
  autoRotateSpeed: 5,
  damping: 0.21,
  modelSize: 1.8,
  // PS1 — core (screen-space)
  ps1Enabled: true,
  pixelSize: 3,
  colorLevels: 16,
  dither: 0.8,
  // PS1 — model (vertex)
  vertexWobble: 0.8,
  vertexGrid: 142,
  affine: 0.8,
  nearestFilter: true,
  // PS1 — CRT / fx
  scanlines: 0.3,
  vignette: 1,
  curvature: 0.1,
  colorFilter: '#00ff41',
  colorFilterAmount: 1,
  // Distance fog
  fogEnabled: true,
  fogColor: '#0b0f09',
  fogNear: 5.3,
  fogFar: 6,
}

// PS1 post-processing shader: CRT curvature → pixelation → color crunch +
// ordered (Bayer) dithering → scanlines → vignette. Preserves source alpha.
const PS1Shader = {
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uPixelSize: { value: 3 },
    uColorLevels: { value: 16 },
    uDither: { value: 0.6 },
    uScanlines: { value: 0.25 },
    uVignette: { value: 0.5 },
    uCurvature: { value: 0.12 },
    uFilterColor: { value: new THREE.Color('#00ff41') },
    uFilterAmount: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform float uPixelSize;
    uniform float uColorLevels;
    uniform float uDither;
    uniform float uScanlines;
    uniform float uVignette;
    uniform float uCurvature;
    uniform vec3 uFilterColor;
    uniform float uFilterAmount;
    varying vec2 vUv;

    float bayerValue(int i) {
      if (i == 0) return 0.0;   if (i == 1) return 8.0;   if (i == 2) return 2.0;   if (i == 3) return 10.0;
      if (i == 4) return 12.0;  if (i == 5) return 4.0;   if (i == 6) return 14.0;  if (i == 7) return 6.0;
      if (i == 8) return 3.0;   if (i == 9) return 11.0;  if (i == 10) return 1.0;  if (i == 11) return 9.0;
      if (i == 12) return 15.0; if (i == 13) return 7.0;  if (i == 14) return 13.0; return 5.0;
    }
    float getBayer(vec2 p) {
      int x = int(mod(p.x, 4.0));
      int y = int(mod(p.y, 4.0));
      return bayerValue(y * 4 + x) / 16.0 - 0.46875;
    }

    void main() {
      vec2 uv = vUv;

      // CRT barrel curvature
      if (uCurvature > 0.0) {
        vec2 c = uv * 2.0 - 1.0;
        c += c.yx * c.yx * c * uCurvature;
        uv = c * 0.5 + 0.5;
      }
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }

      // Pixelation (snap to low-res block grid)
      float px = max(uPixelSize, 1.0);
      vec2 blocks = uResolution / px;
      vec2 puv = (floor(uv * blocks) + 0.5) / blocks;
      vec4 texel = texture2D(tDiffuse, puv);
      vec3 color = texel.rgb;

      // Color crunch + ordered dithering (matched to the block grid)
      float levels = max(uColorLevels, 2.0);
      float d = getBayer(floor(gl_FragCoord.xy / px));
      color += d * uDither / levels;
      color = floor(color * levels) / (levels - 1.0);
      color = clamp(color, 0.0, 1.0);

      // Scanlines
      if (uScanlines > 0.0) {
        float s = 0.5 + 0.5 * sin(uv.y * blocks.y * 6.28318);
        color *= 1.0 - uScanlines * (1.0 - s);
      }

      // Vignette
      if (uVignette > 0.0) {
        vec2 q = uv - 0.5;
        color *= clamp(1.0 - uVignette * dot(q, q) * 2.5, 0.0, 1.0);
      }

      // Color filter (tint / color grade)
      color = mix(color, color * uFilterColor, uFilterAmount);

      gl_FragColor = vec4(color, texel.a);
    }
  `,
}

// Patch a standard material with PS1 vertex effects: vertex "snap" jitter +
// affine (perspective-incorrect) texture mapping. Driven by shared uniforms so
// every material reacts to the same live controls.
function applyPS1ToMaterial(material, matUniforms) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uPS1 = matUniforms.uPS1
    shader.uniforms.uVertAmt = matUniforms.uVertAmt
    shader.uniforms.uVertGrid = matUniforms.uVertGrid
    shader.uniforms.uAffineAmt = matUniforms.uAffineAmt

    shader.vertexShader =
      `uniform float uPS1; uniform float uVertAmt; uniform float uVertGrid; uniform float uAffineAmt;
       varying float vPs1W; varying vec2 vPs1UvW;\n` +
      shader.vertexShader.replace(
        '#include <project_vertex>',
        `#include <project_vertex>
         {
           float amt = clamp(uVertAmt, 0.0, 1.0) * step(0.5, uPS1);
           if (amt > 0.0) {
             float g = max(uVertGrid, 1.0);
             vec3 ndc = gl_Position.xyz / gl_Position.w;
             ndc.xy = floor(ndc.xy * g) / g;
             vec4 snapped = vec4(ndc * gl_Position.w, gl_Position.w);
             gl_Position = mix(gl_Position, snapped, amt);
           }
           vPs1W = gl_Position.w;
           #ifdef USE_UV
             vPs1UvW = uv * gl_Position.w;
           #else
             vPs1UvW = vec2(0.0);
           #endif
         }`
      )

    shader.fragmentShader =
      `uniform float uPS1; uniform float uAffineAmt;
       varying float vPs1W; varying vec2 vPs1UvW;\n` +
      shader.fragmentShader.replace(
        '#include <map_fragment>',
        `#ifdef USE_MAP
           vec2 ps1Uv = mix(vMapUv, vPs1UvW / max(vPs1W, 1e-4), clamp(uAffineAmt, 0.0, 1.0) * step(0.5, uPS1));
           vec4 sampledDiffuseColor = texture2D(map, ps1Uv);
           diffuseColor *= sampledDiffuseColor;
         #endif`
      )
  }
  material.customProgramCacheKey = () => 'ps1-bench'
  material.needsUpdate = true
}

// 3D preview of the workbench model with a live-tweakable PS1 look.
// Drag to rotate. `config` is supplied by the xray debug panel (optional).
export default function BenchModelCanvas({ reducedMotion = false, config }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const configRef = useRef(config)
  configRef.current = config

  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'

  // ---- Build the scene / composer once. ------------------------------------
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const cfg = { ...XRAY_DEFAULTS, ...(configRef.current || {}) }

    let width = container.clientWidth || 320
    let height = container.clientHeight || 200

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(cfg.bgColor)
    const fog = new THREE.Fog(cfg.fogColor, cfg.fogNear, cfg.fogFar)
    if (cfg.fogEnabled) scene.fog = fog

    const camera = new THREE.PerspectiveCamera(cfg.fov, width / height, 0.01, 100)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = cfg.exposure
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.cursor = 'grab'
    container.appendChild(renderer.domElement)

    // Image-based lighting so PBR materials read properly.
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = cfg.envIntensity

    const key = new THREE.DirectionalLight(0xffffff, cfg.keyIntensity)
    key.position.set(3, 5, 4)
    scene.add(key)
    const fill = new THREE.DirectionalLight(new THREE.Color(cfg.fillColor), cfg.fillIntensity)
    fill.position.set(-4, 1.5, -3)
    scene.add(fill)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = cfg.damping
    controls.enablePan = false
    controls.enableZoom = false
    controls.autoRotate = cfg.autoRotate && !reducedMotion
    controls.autoRotateSpeed = cfg.autoRotateSpeed
    controls.addEventListener('start', () => { renderer.domElement.style.cursor = 'grabbing' })
    controls.addEventListener('end', () => { renderer.domElement.style.cursor = 'grab' })

    // Post-processing chain.
    const composer = new EffectComposer(renderer)
    composer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    composer.setSize(width, height)
    composer.addPass(new RenderPass(scene, camera))
    const ps1Pass = new ShaderPass(PS1Shader)
    ps1Pass.uniforms.uResolution.value.set(width, height)
    ps1Pass.enabled = cfg.ps1Enabled
    composer.addPass(ps1Pass)

    // Shared uniforms for the model-space PS1 effects.
    const matUniforms = {
      uPS1: { value: cfg.ps1Enabled ? 1 : 0 },
      uVertAmt: { value: cfg.vertexWobble },
      uVertGrid: { value: cfg.vertexGrid },
      uAffineAmt: { value: cfg.affine },
    }

    const textures = new Set()
    let model = null
    let modelMaxDim = 1
    let disposed = false
    let frame = 0

    sceneRef.current = {
      scene, camera, renderer, composer, controls, fog,
      keyLight: key, fillLight: fill, ps1Pass, matUniforms, textures,
      get model() { return model }, get modelMaxDim() { return modelMaxDim },
      nearestFilter: cfg.nearestFilter,
    }

    const loader = new GLTFLoader()
    loader.load(
      modelUrl,
      (gltf) => {
        if (disposed) {
          gltf.scene.traverse(disposeObject)
          return
        }
        model = gltf.scene
        const live = { ...XRAY_DEFAULTS, ...(configRef.current || {}) }

        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        model.position.sub(center)
        modelMaxDim = Math.max(size.x, size.y, size.z) || 1
        model.scale.setScalar(live.modelSize / modelMaxDim)

        // Patch every material for the PS1 vertex / affine look, collect textures.
        model.traverse((obj) => {
          if (!obj.isMesh) return
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => {
            applyPS1ToMaterial(m, matUniforms)
            for (const k in m) {
              const v = m[k]
              if (v && v.isTexture) textures.add(v)
            }
          })
        })
        applyTextureFilter(textures, live.nearestFilter)
        scene.add(model)

        // Frame the camera at a three-quarter angle (reference size = default).
        const ref = 1.6
        const dist = (ref / (2 * Math.tan((camera.fov * Math.PI) / 360))) * 1.5
        camera.position.copy(new THREE.Vector3(0.7, 0.45, 1).normalize().multiplyScalar(dist))
        controls.target.set(0, 0, 0)
        controls.update()
        setStatus('ready')
      },
      undefined,
      (err) => {
        console.error('[BenchModelCanvas] failed to load model', err)
        if (!disposed) setStatus('error')
      }
    )

    const animate = () => {
      frame = requestAnimationFrame(animate)
      controls.update()
      composer.render()
    }
    animate()

    const ro = new ResizeObserver(() => {
      width = container.clientWidth
      height = container.clientHeight
      if (!width || !height) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      composer.setSize(width, height)
      ps1Pass.uniforms.uResolution.value.set(width, height)
    })
    ro.observe(container)

    function disposeObject(obj) {
      if (obj.geometry) obj.geometry.dispose()
      const material = obj.material
      if (!material) return
      const mats = Array.isArray(material) ? material : [material]
      mats.forEach((m) => {
        for (const k in m) {
          const v = m[k]
          if (v && v.isTexture) v.dispose()
        }
        m.dispose()
      })
    }

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      ro.disconnect()
      controls.dispose()
      if (model) scene.traverse(disposeObject)
      if (scene.environment) scene.environment.dispose()
      pmrem.dispose()
      composer.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      sceneRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- Apply live config changes without rebuilding the scene. -------------
  useEffect(() => {
    const s = sceneRef.current
    if (!s) return
    const cfg = { ...XRAY_DEFAULTS, ...(config || {}) }

    s.camera.fov = cfg.fov
    s.camera.updateProjectionMatrix()
    s.renderer.toneMappingExposure = cfg.exposure
    s.scene.background.set(cfg.bgColor)
    s.scene.environmentIntensity = cfg.envIntensity

    s.keyLight.intensity = cfg.keyIntensity
    s.fillLight.intensity = cfg.fillIntensity
    s.fillLight.color.set(cfg.fillColor)

    s.controls.autoRotate = cfg.autoRotate && !reducedMotion
    s.controls.autoRotateSpeed = cfg.autoRotateSpeed
    s.controls.dampingFactor = cfg.damping

    if (s.model && s.modelMaxDim) s.model.scale.setScalar(cfg.modelSize / s.modelMaxDim)

    s.fog.color.set(cfg.fogColor)
    s.fog.near = cfg.fogNear
    s.fog.far = cfg.fogFar
    s.scene.fog = cfg.fogEnabled ? s.fog : null

    s.ps1Pass.enabled = cfg.ps1Enabled
    s.ps1Pass.uniforms.uPixelSize.value = cfg.pixelSize
    s.ps1Pass.uniforms.uColorLevels.value = cfg.colorLevels
    s.ps1Pass.uniforms.uDither.value = cfg.dither
    s.ps1Pass.uniforms.uScanlines.value = cfg.scanlines
    s.ps1Pass.uniforms.uVignette.value = cfg.vignette
    s.ps1Pass.uniforms.uCurvature.value = cfg.curvature
    s.ps1Pass.uniforms.uFilterColor.value.set(cfg.colorFilter)
    s.ps1Pass.uniforms.uFilterAmount.value = cfg.colorFilterAmount

    s.matUniforms.uPS1.value = cfg.ps1Enabled ? 1 : 0
    s.matUniforms.uVertAmt.value = cfg.vertexWobble
    s.matUniforms.uVertGrid.value = cfg.vertexGrid
    s.matUniforms.uAffineAmt.value = cfg.affine

    if (s.nearestFilter !== cfg.nearestFilter) {
      applyTextureFilter(s.textures, cfg.nearestFilter)
      s.nearestFilter = cfg.nearestFilter
    }
  }, [config, reducedMotion])

  return (
    <div ref={containerRef} style={styles.canvasHost}>
      {status !== 'ready' && (
        <span style={styles.statusLabel}>
          {status === 'error' ? 'MODEL UNAVAILABLE' : 'LOADING MODEL…'}
        </span>
      )}
    </div>
  )
}

function applyTextureFilter(textures, nearest) {
  textures.forEach((t) => {
    t.magFilter = nearest ? THREE.NearestFilter : THREE.LinearFilter
    t.minFilter = nearest ? THREE.NearestFilter : THREE.LinearMipmapLinearFilter
    t.needsUpdate = true
  })
}

const styles = {
  canvasHost: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  statusLabel: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Ubuntu Mono', monospace",
    fontSize: 10,
    letterSpacing: 1,
    color: 'var(--ink)',
    opacity: 0.6,
    pointerEvents: 'none',
  },
}
