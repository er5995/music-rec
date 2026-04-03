import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TextInputProps {
  onSubmit: (text: string) => void
  index: number
}

export default function TextInput({ onSubmit, index }: TextInputProps) {
  const [isActive, setIsActive] = useState(false)
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isActive && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isActive])

  const handleSubmit = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
    if (e.key === 'Escape') {
      setIsActive(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl group"
      style={{
        aspectRatio: '4/3',
        cursor: isActive ? 'default' : 'pointer',
        boxShadow: isActive
          ? '0 8px 40px rgba(212,168,67,0.18), 0 2px 12px rgba(0,0,0,0.1)'
          : '0 4px 24px rgba(0,0,0,0.10)',
        background: isActive
          ? 'linear-gradient(140deg, #13101f 0%, #1e1630 100%)'
          : 'linear-gradient(140deg, rgba(184,169,201,0.13) 0%, rgba(212,168,67,0.07) 100%)',
        border: isActive
          ? '1.5px solid rgba(212,168,67,0.35)'
          : '1.5px dashed rgba(184,169,201,0.4)',
        transition: 'box-shadow 0.4s ease, background 0.4s ease, border 0.4s ease',
      }}
      onClick={() => !isActive && setIsActive(true)}
    >
      {/* Hover glow (idle state only) */}
      {!isActive && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, rgba(212,168,67,0.07) 0%, transparent 70%)',
          }}
        />
      )}

      <AnimatePresence mode="wait">
        {/* ── IDLE STATE ── */}
        {!isActive && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6"
          >
            {/* Pen icon */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-4"
            >
              <svg viewBox="0 0 48 48" className="w-14 h-14" fill="none">
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  stroke="rgba(184,169,201,0.38)"
                  strokeWidth="1.5"
                />
                {/* pen body */}
                <path
                  d="M30 14l4 4-14 14H16v-4L30 14z"
                  stroke="#B8A9C9"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* pen highlight */}
                <path
                  d="M28 16l4 4"
                  stroke="#D4A843"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                {/* sparkle dots */}
                <circle cx="12" cy="14" r="1" fill="#D4A843" opacity="0.5" />
                <circle cx="36" cy="34" r="1.2" fill="#B8A9C9" opacity="0.4" />
              </svg>
            </motion.div>

            <h3
              className="font-display text-2xl leading-tight mb-1.5 text-center"
              style={{ color: '#4a3f5c', fontWeight: 600 }}
            >
              In your own words
            </h3>
            <p
              className="text-sm text-center"
              style={{
                color: 'rgba(74,63,92,0.62)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 300,
              }}
            >
              Describe how you're feeling
            </p>
            <p
              className="text-xs mt-2.5"
              style={{ color: 'rgba(184,169,201,0.55)', fontFamily: 'Inter, sans-serif' }}
            >
              tap to write ✦
            </p>
          </motion.div>
        )}

        {/* ── ACTIVE STATE ── */}
        {isActive && (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="absolute inset-0 flex flex-col p-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Label */}
            <p
              className="text-xs font-medium tracking-widest uppercase mb-2.5"
              style={{ color: 'rgba(212,168,67,0.65)', fontFamily: 'Inter, sans-serif' }}
            >
              How are you feeling?
            </p>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. tired but grateful, excited for tomorrow, missing someone far away..."
              className="flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none placeholder-shown:placeholder-opacity-40"
              style={{
                color: '#F7F3EC',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 300,
                caretColor: '#D4A843',
              }}
              maxLength={300}
            />

            {/* Bottom row */}
            <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={() => { setIsActive(false); setText('') }}
                className="text-xs transition-opacity hover:opacity-70"
                style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif' }}
              >
                cancel
              </button>

              <motion.button
                onClick={handleSubmit}
                disabled={!text.trim()}
                whileTap={text.trim() ? { scale: 0.96 } : {}}
                className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-250"
                style={{
                  background: text.trim()
                    ? 'linear-gradient(90deg, #D4A843, #C49530)'
                    : 'rgba(212,168,67,0.15)',
                  color: text.trim() ? '#13101f' : 'rgba(212,168,67,0.35)',
                  fontFamily: 'Inter, sans-serif',
                  cursor: text.trim() ? 'pointer' : 'default',
                  boxShadow: text.trim() ? '0 2px 12px rgba(212,168,67,0.25)' : 'none',
                }}
              >
                Find My Soundtrack →
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
