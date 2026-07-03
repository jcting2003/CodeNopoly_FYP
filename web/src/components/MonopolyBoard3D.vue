<template>
  <section class="board-shell">
    <div ref="containerEl" class="board-canvas" aria-label="3D CodeNopoly board"></div>

    <div class="board-hud">
      <div>
        <span class="hud-label">Position</span>
        <strong>{{ currentPosition ?? '-' }}</strong>
      </div>
      <div>
        <span class="hud-label">Dice</span>
        <strong>{{ diceLabel }}</strong>
      </div>
      <div>
        <span class="hud-label">Players</span>
        <strong>{{ players.length }}</strong>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import * as THREE from 'three'

type BoardPlayer = {
  id: number
  name: string
  position: number | null
  isCurrentTurn: boolean
}

type BoardProperty = {
  tile_number: number
  owner_user_id: number | null
  color_group?: string | null
  houses?: number
  hotel?: boolean
}

type BoardTile = {
  tile_number: number
  tile_type: string
  difficulty?: string | null
}

const props = defineProps<{
  players: BoardPlayer[]
  properties: BoardProperty[]
  tiles: BoardTile[]
  currentPosition: number | null
  diceOne: number | null
  diceTwo: number | null
  lastDiceRoll: number | null
}>()

const containerEl = ref<HTMLDivElement | null>(null)

const diceLabel = computed(() => {
  if (props.diceOne !== null && props.diceTwo !== null) return `${props.diceOne} + ${props.diceTwo}`
  if (props.lastDiceRoll !== null) return `${props.lastDiceRoll}`
  return '-'
})

let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let animationFrame = 0
let resizeObserver: ResizeObserver | null = null

const boardGroup = new THREE.Group()
const tokenGroup = new THREE.Group()
const diceGroup = new THREE.Group()
const tileMeshes: THREE.Mesh[] = []
const tokenMeshes = new Map<number, THREE.Mesh>()
const diceMeshes: THREE.Mesh[] = []

const tileGeometry = new THREE.BoxGeometry(0.92, 0.16, 0.92)
const tokenGeometry = new THREE.CylinderGeometry(0.16, 0.16, 0.22, 24)
const diceGeometry = new THREE.BoxGeometry(0.62, 0.62, 0.62)
const tileBaseMaterial = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.62 })
const currentTileMaterial = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.48 })
const ownedTileMaterial = new THREE.MeshStandardMaterial({ color: 0x93c5fd, roughness: 0.55 })
const diceMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.05 })
const currentTokenMaterial = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35 })
const defaultTileColor = 0xf8fafc
const tokenPalette = [0x2563eb, 0x0f766e, 0xdc2626, 0x7c3aed, 0x0891b2, 0xdb2777]
const getTokenColor = (index: number) => tokenPalette[index % tokenPalette.length] ?? tokenPalette[0] ?? 0x2563eb
const groupColors: Record<string, number> = {
  syntax: 0x60a5fa,
  tooling: 0xa78bfa,
  data: 0x34d399,
  backend: 0xf97316,
  frontend: 0x22d3ee,
  security: 0xef4444,
  cloud: 0x38bdf8,
  ai: 0xd946ef,
  ops: 0x84cc16,
}
const typeColors: Record<string, number> = {
  start: 0x14b8a6,
  checkpoint: 0xfbbf24,
  penalty: 0xf87171,
  question: 0xfacc15,
  property: 0x93c5fd,
}

const getTilePosition = (tileNumber: number) => {
  const n = ((tileNumber % 40) + 40) % 40
  const half = 4.5
  const step = 1

  if (n <= 10) return new THREE.Vector3(half - n * step, 0, half)
  if (n <= 20) return new THREE.Vector3(-half, 0, half - (n - 10) * step)
  if (n <= 30) return new THREE.Vector3(-half + (n - 20) * step, 0, -half)
  return new THREE.Vector3(half, 0, -half + (n - 30) * step)
}

const setRendererSize = () => {
  if (!containerEl.value || !renderer || !camera) return

  const { clientWidth, clientHeight } = containerEl.value
  const width = Math.max(clientWidth, 320)
  const height = Math.max(clientHeight, 320)

  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

const createBoard = () => {
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(10.8, 0.08, 10.8),
    new THREE.MeshStandardMaterial({ color: 0xdbeafe, roughness: 0.8 })
  )
  base.position.y = -0.08
  boardGroup.add(base)

  const center = new THREE.Mesh(
    new THREE.BoxGeometry(7.4, 0.1, 7.4),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.85 })
  )
  center.position.y = 0.02
  boardGroup.add(center)

  for (let i = 0; i < 40; i += 1) {
    const tile = new THREE.Mesh(tileGeometry, tileBaseMaterial.clone())
    tile.position.copy(getTilePosition(i))
    tile.position.y = 0.08
    tile.userData.tileNumber = i
    tileMeshes.push(tile)
    boardGroup.add(tile)
  }
}

const createDice = () => {
  for (let i = 0; i < 2; i += 1) {
    const die = new THREE.Mesh(diceGeometry, diceMaterial.clone())
    die.position.set(i === 0 ? -0.48 : 0.48, 0.78, 0)
    diceMeshes.push(die)
    diceGroup.add(die)
  }
}

const updateTiles = () => {
  const propertyByTile = new Map(props.properties.map((property) => [property.tile_number, property]))
  const tileByNumber = new Map(props.tiles.map((tile) => [tile.tile_number, tile]))

  tileMeshes.forEach((tile) => {
    const tileNumber = tile.userData.tileNumber as number
    const material = tile.material as THREE.MeshStandardMaterial
    const property = propertyByTile.get(tileNumber)
    const boardTile = tileByNumber.get(tileNumber)
    const baseColor = property?.color_group
      ? groupColors[property.color_group] ?? typeColors.property ?? defaultTileColor
      : typeColors[boardTile?.tile_type || ''] ?? defaultTileColor

    if (props.currentPosition === tileNumber) {
      material.color.set(currentTileMaterial.color)
      tile.position.y = 0.18
    } else if (property?.owner_user_id !== null && property?.owner_user_id !== undefined) {
      material.color.set(ownedTileMaterial.color)
      tile.position.y = 0.1
    } else {
      material.color.set(baseColor)
      tile.position.y = 0.08
    }
  })
}

const updateTokens = () => {
  const activeIds = new Set<number>()

  props.players.forEach((player, index) => {
    if (typeof player.position !== 'number') return

    activeIds.add(player.id)
    let token = tokenMeshes.get(player.id)

    if (!token) {
      const material = player.isCurrentTurn
        ? currentTokenMaterial.clone()
        : new THREE.MeshStandardMaterial({ color: getTokenColor(index), roughness: 0.42 })

      token = new THREE.Mesh(tokenGeometry, material)
      tokenMeshes.set(player.id, token)
      tokenGroup.add(token)
    }

    const basePosition = getTilePosition(player.position)
    const offsetAngle = (index / Math.max(props.players.length, 1)) * Math.PI * 2
    token.position.set(
      basePosition.x + Math.cos(offsetAngle) * 0.18,
      0.42,
      basePosition.z + Math.sin(offsetAngle) * 0.18
    )

    const material = token.material as THREE.MeshStandardMaterial
    material.color.set(player.isCurrentTurn ? currentTokenMaterial.color : getTokenColor(index))
    token.scale.setScalar(player.isCurrentTurn ? 1.18 : 1)
  })

  tokenMeshes.forEach((token, id) => {
    if (activeIds.has(id)) return
    tokenGroup.remove(token)
    token.geometry.dispose()
    const material = token.material as THREE.Material
    material.dispose()
    tokenMeshes.delete(id)
  })
}

const updateDice = () => {
  const values = [props.diceOne, props.diceTwo]

  diceMeshes.forEach((die, index) => {
    const value = values[index] ?? null
    const lift = value === null ? 0 : Math.min(value, 6) * 0.03

    die.position.y = 0.78 + lift
    die.rotation.x = (value ?? props.lastDiceRoll ?? 1) * 0.34 + index * 0.3
    die.rotation.y = (value ?? 2) * 0.46 + index * 0.5
  })
}

const syncScene = () => {
  updateTiles()
  updateTokens()
  updateDice()
}

const animate = () => {
  if (!renderer || !scene || !camera) return

  renderer.render(scene, camera)
  animationFrame = window.requestAnimationFrame(animate)
}

const initScene = async () => {
  await nextTick()
  if (!containerEl.value) return

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xeef2ff)

  camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100)
  camera.position.set(7.8, 8.6, 8.4)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  containerEl.value.appendChild(renderer.domElement)

  const ambient = new THREE.AmbientLight(0xffffff, 1.3)
  scene.add(ambient)

  const key = new THREE.DirectionalLight(0xffffff, 1.4)
  key.position.set(4, 8, 5)
  scene.add(key)

  boardGroup.add(tokenGroup)
  boardGroup.add(diceGroup)
  scene.add(boardGroup)

  createBoard()
  createDice()
  syncScene()
  setRendererSize()

  resizeObserver = new ResizeObserver(setRendererSize)
  resizeObserver.observe(containerEl.value)

  animate()
}

const disposeScene = () => {
  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame)
    animationFrame = 0
  }

  resizeObserver?.disconnect()
  resizeObserver = null

  tileGeometry.dispose()
  tokenGeometry.dispose()
  diceGeometry.dispose()
  tileBaseMaterial.dispose()
  currentTileMaterial.dispose()
  ownedTileMaterial.dispose()
  diceMaterial.dispose()
  currentTokenMaterial.dispose()

  renderer?.dispose()
  renderer?.domElement.remove()

  renderer = null
  camera = null
  scene = null
}

watch(
  () => [props.players, props.properties, props.tiles, props.currentPosition, props.diceOne, props.diceTwo, props.lastDiceRoll],
  syncScene,
  { deep: true }
)

onMounted(initScene)
onUnmounted(disposeScene)
</script>

<style scoped>
.board-shell {
  position: relative;
  min-height: 420px;
  border-radius: 24px;
  overflow: hidden;
  background: #e0f2fe;
  box-shadow: 0 18px 60px rgba(15, 23, 42, 0.12);
}

.board-canvas {
  width: 100%;
  height: 480px;
  min-height: 360px;
}

.board-canvas :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}

.board-hud {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  pointer-events: none;
}

.board-hud > div {
  min-width: 0;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.78);
  padding: 10px 12px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.hud-label {
  display: block;
  color: #475569;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.board-hud strong {
  display: block;
  color: #0f172a;
  font-size: 18px;
  line-height: 1.1;
}

@media (max-width: 768px) {
  .board-shell {
    min-height: 360px;
  }

  .board-canvas {
    height: 380px;
  }
}
</style>
