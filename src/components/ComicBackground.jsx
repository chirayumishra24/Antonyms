import { useEffect, useRef } from 'react'

export default function ComicBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId
    let webStrands = []
    let spiderX = -100
    let spiderY = 150
    let spiderSwingAngle = 0
    let spiderDirection = 1

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Building data for skyline
    const buildings = generateBuildings(canvas.width)

    // Twinkling windows
    const windows = generateWindows(buildings, canvas.height)

    // Web strand class
    class WebStrand {
      constructor() {
        this.reset()
      }
      reset() {
        const side = Math.random() > 0.5 ? 'left' : 'right'
        if (side === 'left') {
          this.x = -20
          this.y = Math.random() * canvas.height * 0.6
          this.vx = 2 + Math.random() * 3
          this.vy = 0.5 + Math.random() * 1.5
        } else {
          this.x = canvas.width + 20
          this.y = Math.random() * canvas.height * 0.6
          this.vx = -(2 + Math.random() * 3)
          this.vy = 0.5 + Math.random() * 1.5
        }
        this.length = 40 + Math.random() * 80
        this.opacity = 0.1 + Math.random() * 0.2
        this.thickness = 0.5 + Math.random() * 1.5
        this.life = 0
        this.maxLife = 200 + Math.random() * 200
        this.curve = (Math.random() - 0.5) * 0.02
      }
      update() {
        this.x += this.vx
        this.y += this.vy
        this.vy += this.curve
        this.life++
        if (this.life > this.maxLife || this.x > canvas.width + 100 || this.x < -100 || this.y > canvas.height) {
          this.reset()
        }
      }
      draw(ctx) {
        const fade = this.life < 30
          ? this.life / 30
          : this.life > this.maxLife - 30
          ? (this.maxLife - this.life) / 30
          : 1
        ctx.save()
        ctx.globalAlpha = this.opacity * fade
        ctx.strokeStyle = '#C0C0C0'
        ctx.lineWidth = this.thickness
        ctx.beginPath()
        const angle = Math.atan2(this.vy, this.vx)
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(
          this.x - Math.cos(angle) * this.length,
          this.y - Math.sin(angle) * this.length
        )
        ctx.stroke()
        // Small dots along strand (web nodes)
        for (let i = 0; i < 3; i++) {
          const t = (i + 1) / 4
          const nx = this.x - Math.cos(angle) * this.length * t
          const ny = this.y - Math.sin(angle) * this.length * t
          ctx.beginPath()
          ctx.arc(nx, ny, this.thickness * 0.8, 0, Math.PI * 2)
          ctx.fillStyle = '#C0C0C0'
          ctx.fill()
        }
        ctx.restore()
      }
    }

    // Init web strands
    for (let i = 0; i < 6; i++) {
      const strand = new WebStrand()
      strand.life = Math.random() * 100 // Stagger start
      webStrands.push(strand)
    }

    let frameCount = 0

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frameCount++

      // Draw web strands
      webStrands.forEach(s => {
        s.update()
        s.draw(ctx)
      })

      // Draw skyline
      drawSkyline(ctx, buildings, canvas.width, canvas.height)

      // Draw twinkling windows
      drawWindows(ctx, windows, canvas.height, frameCount)

      // Draw swinging Spider-Man silhouette
      drawSwingingSpiderman(ctx, canvas.width, canvas.height, frameCount)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

function generateBuildings(canvasWidth) {
  const buildings = []
  let x = 0
  while (x < canvasWidth + 100) {
    const w = 30 + Math.random() * 70
    const h = 60 + Math.random() * 180
    const hasAntenna = Math.random() > 0.7
    const antennaH = 10 + Math.random() * 30
    buildings.push({ x, w, h, hasAntenna, antennaH })
    x += w + Math.random() * 15
  }
  return buildings
}

function generateWindows(buildings, canvasHeight) {
  const wins = []
  buildings.forEach(b => {
    const rows = Math.floor(b.h / 18)
    const cols = Math.max(1, Math.floor(b.w / 16))
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.4) {
          wins.push({
            x: b.x + 6 + c * 14,
            yOffset: b.h - 10 - r * 16,
            buildingH: b.h,
            on: Math.random() > 0.3,
            flickerSpeed: 0.005 + Math.random() * 0.02,
            flickerOffset: Math.random() * Math.PI * 2,
            color: Math.random() > 0.5 ? '#FFD700' : '#FFA500',
          })
        }
      }
    }
  })
  return wins
}

function drawSkyline(ctx, buildings, canvasWidth, canvasHeight) {
  ctx.save()

  // Far buildings (lighter, behind)
  ctx.fillStyle = 'rgba(15, 15, 35, 0.6)'
  buildings.forEach(b => {
    const farH = b.h * 0.6
    const farY = canvasHeight - farH - 10
    ctx.fillRect(b.x - 20, farY, b.w * 0.8, farH + 10)
  })

  // Main buildings
  ctx.fillStyle = 'rgba(10, 10, 25, 0.85)'
  buildings.forEach(b => {
    const y = canvasHeight - b.h
    ctx.fillRect(b.x, y, b.w, b.h)

    // Antenna
    if (b.hasAntenna) {
      ctx.strokeStyle = 'rgba(20, 20, 50, 0.9)'
      ctx.lineWidth = 2
      const centerX = b.x + b.w / 2
      ctx.beginPath()
      ctx.moveTo(centerX, y)
      ctx.lineTo(centerX, y - b.antennaH)
      ctx.stroke()
      // Blinking light on antenna
      ctx.beginPath()
      ctx.arc(centerX, y - b.antennaH, 2, 0, Math.PI * 2)
      ctx.fillStyle = '#E23636'
      ctx.fill()
    }

    // Roof detail
    ctx.fillStyle = 'rgba(5, 5, 20, 0.9)'
    ctx.fillRect(b.x, y, b.w, 3)
  })

  // Ground
  ctx.fillStyle = 'rgba(8, 8, 20, 0.95)'
  ctx.fillRect(0, canvasHeight - 8, canvasWidth, 8)

  ctx.restore()
}

function drawWindows(ctx, windows, canvasHeight, frame) {
  ctx.save()
  windows.forEach(w => {
    if (!w.on) return
    const y = canvasHeight - w.yOffset
    const flicker = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(frame * w.flickerSpeed + w.flickerOffset))
    ctx.globalAlpha = flicker * 0.7
    ctx.fillStyle = w.color

    // Glow
    ctx.shadowColor = w.color
    ctx.shadowBlur = 4
    ctx.fillRect(w.x, y, 8, 10)
    ctx.shadowBlur = 0
  })
  ctx.restore()
}

function drawSwingingSpiderman(ctx, canvasWidth, canvasHeight, frame) {
  // Spider-Man swings across the skyline in an arc pattern
  const cycleDuration = 600 // frames for one full swing arc
  const t = (frame % cycleDuration) / cycleDuration

  // Multi-swing path: swings from left to right then resets
  const fullCycle = 1200
  const progress = (frame % fullCycle) / fullCycle

  // Calculate position along a series of swing arcs
  const numSwings = 3
  const swingPhase = (progress * numSwings) % 1
  const swingIndex = Math.floor(progress * numSwings)

  // Pivot points on building tops
  const pivotSpacing = canvasWidth / numSwings
  const pivotX = pivotSpacing * (swingIndex + 0.5)
  const pivotY = canvasHeight * 0.35

  // Pendulum physics
  const ropeLen = 150 + Math.sin(swingIndex * 1.5) * 30
  const swingAngle = Math.sin(swingPhase * Math.PI) * 1.2 - 0.6 // swing arc

  const spideyX = pivotX + Math.sin(swingAngle) * ropeLen
  const spideyY = pivotY + Math.cos(swingAngle) * ropeLen * 0.7

  // Velocity for pose direction
  const vx = Math.cos(swingAngle)

  ctx.save()
  ctx.globalAlpha = 0.25

  // Web line from pivot to Spider-Man's hand
  ctx.strokeStyle = 'rgba(200, 200, 200, 0.6)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(pivotX, pivotY - 80)
  ctx.quadraticCurveTo(
    (pivotX + spideyX) / 2, pivotY - 20,
    spideyX, spideyY - 10
  )
  ctx.stroke()

  // Draw Spider-Man silhouette
  ctx.save()
  ctx.translate(spideyX, spideyY)

  // Lean into the swing
  const lean = swingAngle * 0.4
  ctx.rotate(lean)

  // Flip based on swing direction
  const facing = vx > 0 ? 1 : -1
  ctx.scale(facing, 1)

  const scale = 1.8

  // Head
  ctx.fillStyle = '#E23636'
  ctx.beginPath()
  ctx.ellipse(0, -22 * scale, 7 * scale, 8 * scale, 0, 0, Math.PI * 2)
  ctx.fill()

  // Eyes (white)
  ctx.fillStyle = 'white'
  ctx.beginPath()
  ctx.ellipse(-3 * scale, -23 * scale, 2.5 * scale, 3.5 * scale, -0.3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(3.5 * scale, -23 * scale, 2 * scale, 3 * scale, 0.3, 0, Math.PI * 2)
  ctx.fill()

  // Torso
  ctx.fillStyle = '#E23636'
  ctx.beginPath()
  ctx.moveTo(-6 * scale, -14 * scale)
  ctx.lineTo(6 * scale, -14 * scale)
  ctx.lineTo(5 * scale, 2 * scale)
  ctx.lineTo(-5 * scale, 2 * scale)
  ctx.closePath()
  ctx.fill()

  // Blue sides of torso
  ctx.fillStyle = '#1A3A7A'
  ctx.beginPath()
  ctx.moveTo(-6 * scale, -14 * scale)
  ctx.lineTo(-8 * scale, -10 * scale)
  ctx.lineTo(-6 * scale, 2 * scale)
  ctx.lineTo(-5 * scale, 2 * scale)
  ctx.lineTo(-5 * scale, -12 * scale)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(6 * scale, -14 * scale)
  ctx.lineTo(8 * scale, -10 * scale)
  ctx.lineTo(6 * scale, 2 * scale)
  ctx.lineTo(5 * scale, 2 * scale)
  ctx.lineTo(5 * scale, -12 * scale)
  ctx.closePath()
  ctx.fill()

  // Web pattern on torso (simplified)
  ctx.strokeStyle = 'rgba(0,0,0,0.2)'
  ctx.lineWidth = 0.5
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath()
    ctx.moveTo(i * 3 * scale, -14 * scale)
    ctx.lineTo(i * 2.5 * scale, 2 * scale)
    ctx.stroke()
  }

  // Arms - dynamic pose based on swing
  const armSwing = Math.sin(swingPhase * Math.PI * 2) * 0.4
  ctx.fillStyle = '#E23636'
  ctx.strokeStyle = '#E23636'
  ctx.lineWidth = 4 * scale
  ctx.lineCap = 'round'

  // Leading arm (reaching forward / up for web)
  ctx.beginPath()
  ctx.moveTo(6 * scale, -12 * scale)
  ctx.quadraticCurveTo(
    14 * scale, -20 * scale - armSwing * 10,
    18 * scale, -26 * scale
  )
  ctx.stroke()

  // Trailing arm
  ctx.beginPath()
  ctx.moveTo(-6 * scale, -12 * scale)
  ctx.quadraticCurveTo(
    -12 * scale, -6 * scale + armSwing * 5,
    -14 * scale, -2 * scale
  )
  ctx.stroke()

  // Legs
  ctx.fillStyle = '#1A3A7A'
  ctx.lineWidth = 3.5 * scale
  ctx.strokeStyle = '#1A3A7A'

  // Leading leg (bent, tucked)
  ctx.beginPath()
  ctx.moveTo(3 * scale, 2 * scale)
  ctx.quadraticCurveTo(
    8 * scale, 10 * scale,
    5 * scale, 16 * scale + armSwing * 5
  )
  ctx.stroke()

  // Trailing leg (extended)
  ctx.beginPath()
  ctx.moveTo(-3 * scale, 2 * scale)
  ctx.quadraticCurveTo(
    -10 * scale, 8 * scale,
    -12 * scale, 14 * scale - armSwing * 5
  )
  ctx.stroke()

  // Red boots
  ctx.strokeStyle = '#E23636'
  ctx.lineWidth = 3 * scale
  ctx.beginPath()
  ctx.moveTo(5 * scale, 14 * scale + armSwing * 5)
  ctx.lineTo(5 * scale, 18 * scale + armSwing * 5)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(-12 * scale, 12 * scale - armSwing * 5)
  ctx.lineTo(-12 * scale, 16 * scale - armSwing * 5)
  ctx.stroke()

  ctx.restore()

  // Trailing web sparkle particles
  for (let i = 0; i < 3; i++) {
    const sparkleX = spideyX - vx * (20 + i * 15) + Math.sin(frame * 0.1 + i) * 5
    const sparkleY = spideyY + 5 + Math.cos(frame * 0.08 + i * 2) * 8
    const sparkleAlpha = 0.15 - i * 0.04
    ctx.globalAlpha = sparkleAlpha
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(sparkleX, sparkleY, 1.5 - i * 0.3, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

