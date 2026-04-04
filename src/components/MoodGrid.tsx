import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Mood } from '../types'

// ─── Props ────────────────────────────────────────────────────────────────────
interface MoodGridProps {
  moods: Mood[]
  selectedMoodId: string | null
  onSelectMood: (id: string) => void
  customText: string
  onCustomTextChange: (text: string) => void
  onSubmit: () => void
  canSubmit: boolean
  isLoading: boolean
}

// ─── Individual preset mood card ──────────────────────────────────────────────
interface MoodCardProps {
  mood: Mood
  isSelected: boolean
  onSelect: () => void
  index: number
}

function MoodCard({ mood, isSelected, onSelect, index }: MoodCardProps) {
  const imgRef = useRef<HTMLImageElement>(null)

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.055, duration: 0.45, ease: 'easeOut' }}
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.97 }}
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: isSelected
          ? `0 0 0 3px ${mood.accent}, 0 12px 40px rgba(0,0,0,0.22)`
          : '0 4px 20px rgba(0,0,0,0.14)',
        transition: 'box-shadow 0.2s ease',
        outline: 'none',
      }}
    >
      {/* Card image */}
      <img
        ref={imgRef}
        src={`/images/${mood.image}`}
        alt={mood.name}
        onError={() => {
          if (imgRef.current) imgRef.current.src = mood.fallbackImage
        }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />

      {/* Bottom gradient overlay for text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Selected checkmark badge */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: mood.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            color: 'white',
            fontWeight: 700,
          }}
        >
          ✓
        </motion.div>
      )}

      {/* Card text */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 13px',
        }}
      >
        <div
          className="font-display"
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.2,
            marginBottom: 3,
          }}
        >
          {mood.name}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>
          {mood.description}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Custom mood input card (8th card) ────────────────────────────────────────
interface CustomCardProps {
  value: string
  onChange: (v: string) => void
  index: number
}

function CustomCard({ value, onChange, index }: CustomCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.055, duration: 0.45, ease: 'easeOut' }}
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        borderRadius: 20,
        overflow: 'hidden',
        background: 'rgba(255,248,240,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1.5px solid rgba(196,130,90,0.3)',
        boxShadow: value.trim()
          ? '0 0 0 2.5px #C4825A, 0 12px 40px rgba(0,0,0,0.16)'
          : '0 4px 20px rgba(0,0,0,0.10)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        gap: 14,
        transition: 'box-shadow 0.2s ease',
      }}
    >
      {/* Icon */}
      <div style={{ fontSize: 32, lineHeight: 1 }}>✏️</div>

      {/* Label */}
      <div
        className="font-display"
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#3D2B1F',
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        Your Moment
      </div>

      {/* Textarea input */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Put it into words…"
        rows={4}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(196,130,90,0.4)',
          borderRadius: 12,
          color: '#3D2B1F',
          fontSize: 13,
          lineHeight: 1.5,
          padding: '10px 12px',
          resize: 'none',
          outline: 'none',
          fontFamily: 'Inter, sans-serif',
          transition: 'border-color 0.15s',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(196,130,90,0.8)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(196,130,90,0.4)')}
      />

      <div style={{ fontSize: 11, color: '#9B7B6A', textAlign: 'center', lineHeight: 1.4 }}>
        What’s on your mind? Say it your way. Leave the rest to us.
      </div>
    </motion.div>
  )
}

// ─── MoodGrid (the 4x2 grid + submit CTA) ─────────────────────────────────────
export function MoodGrid({
  moods,
  selectedMoodId,
  onSelectMood,
  customText,
  onCustomTextChange,
  onSubmit,
  canSubmit,
  isLoading,
}: MoodGridProps) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth <= 768
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ width: '100%', maxWidth: 960, margin: '0 auto' }}>
      {/* 4-column grid on desktop, 2-column on mobile */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: 14,
        }}
        className="mood-grid"
      >
        {/* 7 preset mood cards */}
        {moods.map((mood, i) => (
          <MoodCard
            key={mood.id}
            mood={mood}
            isSelected={selectedMoodId === mood.id}
            onSelect={() => onSelectMood(mood.id)}
            index={i}
          />
        ))}

        {/* 8th card: custom text input */}
        <CustomCard value={customText} onChange={onCustomTextChange} index={7} />
      </div>

      {/* CTA button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.4 }}
        style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}
      >
        <motion.button
          onClick={onSubmit}
          disabled={!canSubmit || isLoading}
          whileHover={canSubmit && !isLoading ? { scale: 1.04, y: -2 } : {}}
          whileTap={canSubmit && !isLoading ? { scale: 0.97 } : {}}
          style={{
            background: canSubmit
              ? 'linear-gradient(135deg, #C4825A 0%, #A06040 100%)'
              : 'rgba(160,120,100,0.3)',
            color: canSubmit ? 'white' : 'rgba(100,70,50,0.5)',
            border: 'none',
            borderRadius: 999,
            padding: '14px 44px',
            fontSize: 15,
            fontWeight: 600,
            cursor: canSubmit && !isLoading ? 'pointer' : 'not-allowed',
            letterSpacing: '0.03em',
            boxShadow: canSubmit
              ? '0 8px 28px rgba(196,130,90,0.38)'
              : 'none',
            transition: 'all 0.2s ease',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {isLoading ? '♫ Finding tracks…' : '✦ Find My Tracks'}
        </motion.button>
      </motion.div>
    </div>
  )
}
