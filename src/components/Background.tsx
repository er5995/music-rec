import { useRef } from 'react'
import { motion } from 'framer-motion'

// ─── Cream Sunset Background ──────────────────────────────────────────────────
// Soft warm cream / peach / apricot gradient with sage hill silhouettes
export function SunsetBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Main sky — warm cream at bottom, soft peach rose at top */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, #E8D0BE 0%, #F0C8A8 18%, #F5D5B0 35%, #FAE4C8 55%, #FDF0DC 75%, #FEF8F0 100%)',
        }}
      />

      {/* Subtle radial warm glow — sun near upper right */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 55% 40% at 72% 18%, rgba(255,210,160,0.55) 0%, transparent 70%)',
        }}
      />

      {/* Secondary soft blush glow near horizon */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 30% at 50% 80%, rgba(230,175,140,0.25) 0%, transparent 70%)',
        }}
      />

      {/* Back hills — distant muted sage */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '40%',
        }}
      >
        <path
          d="M0,240 C150,190 300,215 450,200 C600,185 720,175 900,195 C1080,215 1200,205 1440,210 L1440,320 L0,320 Z"
          fill="rgba(130,148,115,0.35)"
        />
      </svg>

      {/* Front hills — deeper muted olive sage */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '28%',
        }}
      >
        <path
          d="M0,265 C100,235 240,255 380,240 C520,225 640,260 780,248 C920,236 1060,262 1200,248 C1320,236 1400,255 1440,250 L1440,320 L0,320 Z"
          fill="rgba(100,118,88,0.55)"
        />
      </svg>

      {/* Ground strip */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '7%',
          background: 'rgba(80,98,70,0.7)',
        }}
      />
    </div>
  )
}

// ─── Fireflies ────────────────────────────────────────────────────────────────
// 18 subtle warm golden particles drifting upward — always in front of background
export function Fireflies() {
  const firefliesRef = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: 4 + Math.random() * 92,
      y: 40 + Math.random() * 50,
      size: 2 + Math.random() * 2.5,
      delay: Math.random() * 7,
      duration: 7 + Math.random() * 9,
      drift: -50 + Math.random() * 100,
    }))
  )

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      {firefliesRef.current.map((ff) => (
        <motion.div
          key={ff.id}
          style={{
            position: 'absolute',
            left: `${ff.x}%`,
            top: `${ff.y}%`,
            width: ff.size,
            height: ff.size,
            borderRadius: '50%',
            background: '#D4903A',
            boxShadow: `0 0 ${ff.size * 3}px ${ff.size * 1.5}px rgba(212,144,58,0.45)`,
          }}
          animate={{
            y: [0, -70, -140],
            x: [0, ff.drift * 0.5, ff.drift],
            opacity: [0, 0.75, 0.55, 0.75, 0],
          }}
          transition={{
            duration: ff.duration,
            delay: ff.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
