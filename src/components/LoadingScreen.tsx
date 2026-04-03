import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { Mood } from '../types'

interface LoadingScreenProps {
  selectedMood: Mood | null
  isCustomMode: boolean
}

const MUSICAL_NOTES = ['♩', '♪', '♫', '♬', '♭', '♮']

interface FloatingNote {
  id: number
  note: string
  left: string
  delay: number
  duration: number
  size: string
}

function generateNotes(count: number): FloatingNote[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    note: MUSICAL_NOTES[i % MUSICAL_NOTES.length],
    left: `${15 + Math.random() * 70}%`,
    delay: Math.random() * 2,
    duration: 2.5 + Math.random() * 2,
    size: `${1 + Math.random() * 0.8}rem`,
  }))
}

export default function LoadingScreen({ selectedMood, isCustomMode }: LoadingScreenProps) {
  const [dots, setDots] = useState(1)
  const [notes] = useState<FloatingNote[]>(() => generateNotes(10))

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d >= 3 ? 1 : d + 1))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const bgFrom = selectedMood?.gradientFrom || '#0a0e1a'
  const bgTo = selectedMood?.gradientTo || '#1a1430'
  const accent = selectedMood?.accentColor || '#D4A843'

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${bgFrom} 0%, ${bgTo} 100%)` }}
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${accent}18 0%, transparent 65%)`,
        }}
      />

      {/* Floating musical notes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {notes.map((n) => (
          <motion.div
            key={n.id}
            className="absolute"
            style={{
              left: n.left,
              bottom: '20%',
              fontSize: n.size,
              color: accent,
              opacity: 0,
            }}
            animate={{
              y: [0, -160],
              opacity: [0, 0.9, 0.5, 0],
            }}
            transition={{
              duration: n.duration,
              delay: n.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          >
            {n.note}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Vinyl record */}
        <div className="relative mb-10" style={{ width: '200px', height: '200px' }}>
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 60px ${accent}40, 0 0 120px ${accent}20`,
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Outer spinning ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, #1a1a2e, #16213e, #0f3460, #1a1a2e, #1a1a2e)`,
              border: `2px solid ${accent}30`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            {/* Vinyl grooves */}
            {[22, 36, 50, 64, 78].map((r) => (
              <div
                key={r}
                className="absolute rounded-full border"
                style={{
                  inset: `${r}px`,
                  borderColor: `rgba(255,255,255,0.04)`,
                }}
              />
            ))}
          </motion.div>

          {/* Inner disc spinning slightly different speed */}
          <motion.div
            className="absolute rounded-full"
            style={{
              inset: '18px',
              background: `radial-gradient(circle at 40% 35%, #2a2a3e, #0d0d1a)`,
              border: `1px solid rgba(255,255,255,0.06)`,
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          />

          {/* Label area */}
          <div
            className="absolute rounded-full flex flex-col items-center justify-center"
            style={{
              inset: '68px',
              background: `radial-gradient(circle, ${accent}22, ${accent}08)`,
              border: `1px solid ${accent}40`,
            }}
          >
            <div className="text-center" style={{ lineHeight: 1.1 }}>
              <div
                className="font-display italic text-xs"
                style={{ color: accent, opacity: 0.85, fontSize: '9px' }}
              >
                {selectedMood?.name || (isCustomMode ? 'Your Words' : 'Curating')}
              </div>
            </div>
          </div>

          {/* Center spindle hole */}
          <div
            className="absolute rounded-full"
            style={{
              inset: '94px',
              background: '#06060e',
              boxShadow: `0 0 6px ${accent}30`,
            }}
          />

          {/* Tonearm */}
          <motion.div
            className="absolute"
            style={{
              width: '2px',
              height: '80px',
              background: `linear-gradient(to bottom, ${accent}90, ${accent}20)`,
              transformOrigin: 'top center',
              top: '-15px',
              right: '10px',
              borderRadius: '1px',
            }}
            animate={{ rotate: [-12, -6, -12] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <h2
            className="font-display text-3xl md:text-4xl mb-3"
            style={{ color: '#F7F3EC', fontWeight: 300 }}
          >
            Reading the vibe
            <span style={{ color: accent }}>{'.'.repeat(dots)}</span>
            <span style={{ opacity: 0 }}>{'.'.repeat(3 - dots)}</span>
          </h2>

          <p
            className="text-sm tracking-wider"
            style={{
              color: 'rgba(247,243,236,0.4)',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.1em',
            }}
          >
            Curating your perfect soundtrack
          </p>

          {selectedMood && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xs mt-3 tracking-widest uppercase"
              style={{ color: `${accent}99`, fontFamily: 'Inter, sans-serif', letterSpacing: '0.18em' }}
            >
              {selectedMood.name}
            </motion.p>
          )}
          {isCustomMode && !selectedMood && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xs mt-3 tracking-widest uppercase"
              style={{ color: `${accent}99`, fontFamily: 'Inter, sans-serif', letterSpacing: '0.18em' }}
            >
              Reading your words
            </motion.p>
          )}
        </motion.div>
      </motion.div>

      {/* Bottom ambient particles */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none">
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: '3px',
              height: '3px',
              bottom: `${Math.random() * 60}px`,
              left: `${10 + Math.random() * 80}%`,
              background: accent,
              boxShadow: `0 0 6px 2px ${accent}60`,
            }}
            animate={{
              y: [0, -80 - Math.random() * 80],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}
