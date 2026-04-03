import { motion } from 'framer-motion'
import type { Mood, RecommendationResult } from '../types'
import TrackCard from './TrackCard'

interface ResultsScreenProps {
  results: RecommendationResult
  selectedMood: Mood | null
  onReset: () => void
  onBack: () => void
}

export default function ResultsScreen({ results, selectedMood, onReset, onBack }: ResultsScreenProps) {
  const accent = selectedMood?.accentColor || '#D4A843'

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #F7F3EC 0%, #FDF8F2 50%, #F0EBE3 100%)' }}
    >
      {/* Top ambient gradient from mood */}
      <div
        className="fixed top-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${selectedMood?.gradientFrom || '#0a0e1a'}55, transparent)`,
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:gap-3"
            style={{
              color: 'rgba(247,243,236,0.8)',
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.15)',
              fontFamily: 'Inter, sans-serif',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span>←</span>
            <span>Home</span>
          </button>

          {selectedMood && (
            <div
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs"
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: `1px solid ${accent}40`,
                color: accent,
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: accent }}
              />
              {selectedMood.name}
            </div>
          )}

          {results.detectedMood && !selectedMood && (
            <div
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs"
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: `1px solid ${accent}40`,
                color: accent,
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.12em',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: accent }}
              />
              {results.detectedMood}
            </div>
          )}
        </motion.div>

        {/* Motivational message card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
          className="relative mb-10 p-7 rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          }}
        >
          {/* Gold left accent border */}
          <div
            className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full"
            style={{ background: `linear-gradient(to bottom, ${accent}, ${accent}40)` }}
          />

          {/* Decorative quote mark */}
          <div
            className="font-display absolute top-3 right-6 select-none pointer-events-none"
            style={{ fontSize: '5rem', color: `${accent}12`, lineHeight: 1, fontStyle: 'italic' }}
          >
            "
          </div>

          <div className="pl-5">
            <p
              className="font-display italic text-2xl md:text-3xl leading-relaxed"
              style={{ color: '#2C2420', fontWeight: 400 }}
            >
              {results.message}
            </p>
          </div>
        </motion.div>

        {/* "Your Soundtrack" heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${accent}40, transparent)` }} />
          <h2
            className="font-display text-2xl md:text-3xl"
            style={{ color: '#2C2420', fontWeight: 600 }}
          >
            Your Soundtrack
          </h2>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, ${accent}40, transparent)` }} />
        </motion.div>

        {/* Track grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {results.tracks.map((track, i) => (
            <TrackCard
              key={`${track.title}-${track.artist}-${i}`}
              track={track}
              index={i}
              accentColor={accent}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85 }}
          className="flex flex-col items-center gap-4 pb-12"
        >
          <button
            onClick={onReset}
            className="px-8 py-3.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${accent}, ${accent}CC)`,
              color: '#1a1008',
              fontFamily: 'Inter, sans-serif',
              boxShadow: `0 4px 24px ${accent}40`,
            }}
          >
            Explore Another Mood →
          </button>

          <p
            className="text-xs"
            style={{ color: 'rgba(44,36,32,0.3)', fontFamily: 'Inter, sans-serif' }}
          >
            Powered by Claude AI · {results.tracks.length} songs curated just for you
          </p>
        </motion.div>
      </div>
    </div>
  )
}
