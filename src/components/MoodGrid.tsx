import { motion, AnimatePresence } from 'framer-motion'
import type { Mood } from '../types'
import { moods } from '../data/moods'
import MoodCard from './MoodCard'
import TextInput from './TextInput'

interface MoodGridProps {
  onMoodSelect: (mood: Mood) => void
  onTextInput: (text: string) => void
  onBack: () => void
  error: string | null
}

export default function MoodGrid({ onMoodSelect, onTextInput, onBack, error }: MoodGridProps) {
  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #F7F3EC 0%, #FDF8F2 50%, #F0EBE3 100%)' }}
    >
      {/* Subtle background texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(212,168,67,0.04) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(107,143,160,0.04) 0%, transparent 50%)`,
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:gap-3"
            style={{
              color: 'rgba(60,50,40,0.6)',
              background: 'rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.08)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <span>←</span>
            <span>Back</span>
          </button>

          <div
            className="text-xs tracking-widest uppercase"
            style={{ color: 'rgba(60,50,40,0.35)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.14em' }}
          >
            Vibe &amp; Sounds
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1
            className="font-display text-5xl md:text-6xl lg:text-7xl mb-3 leading-tight"
            style={{ color: '#2C2420', fontWeight: 300 }}
          >
            Choose Your{' '}
            <em className="italic" style={{ color: '#D4A843', fontWeight: 600 }}>
              Moment
            </em>
          </h1>
          <p
            className="text-base md:text-lg font-light"
            style={{ color: 'rgba(60,50,40,0.55)', fontFamily: 'Inter, sans-serif' }}
          >
            Each card is a world waiting for its soundtrack
          </p>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 px-5 py-3.5 rounded-2xl text-sm text-center"
              style={{
                background: 'rgba(212,132,122,0.12)',
                border: '1px solid rgba(212,132,122,0.3)',
                color: '#8B3A35',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {error} — please try again
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mood grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {moods.map((mood, i) => (
            <MoodCard key={mood.id} mood={mood} onSelect={onMoodSelect} index={i} />
          ))}
          <TextInput onSubmit={onTextInput} index={moods.length} />
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center mt-10 text-xs"
          style={{ color: 'rgba(60,50,40,0.3)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em' }}
        >
          Powered by Claude AI · Music sourced from the soul of the world
        </motion.p>
      </div>
    </div>
  )
}
