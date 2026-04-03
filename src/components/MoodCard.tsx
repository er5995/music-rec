import { motion } from 'framer-motion'
import type { Mood } from '../types'

interface MoodCardProps {
  mood: Mood
  onSelect: (mood: Mood) => void
  index: number
}

export default function MoodCard({ mood, onSelect, index }: MoodCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ scale: 1.03, transition: { duration: 0.25, ease: 'easeOut' } }}
      whileTap={{ scale: 0.97 }}
      className="mood-card relative overflow-hidden rounded-2xl cursor-pointer group"
      style={{
        aspectRatio: '4/3',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.12)',
      }}
      onClick={() => onSelect(mood)}
    >
      {/* Full-bleed background image */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <img
          src={mood.image}
          alt={mood.name}
          className="mood-card-img w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Dark gradient overlay — transparent top, dark at bottom */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.72) 100%)',
        }}
      />

      {/* Hover overlay — slight lightening */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.55) 100%)`,
        }}
      />

      {/* Accent color glow on hover — top edge */}
      <div
        className="absolute inset-x-0 top-0 h-1 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: mood.accentColor }}
      />

      {/* Content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <h3
          className="font-display text-2xl leading-tight mb-1"
          style={{ color: '#F7F3EC', fontWeight: 600 }}
        >
          {mood.name}
        </h3>
        <p
          className="text-sm leading-snug"
          style={{ color: 'rgba(247,243,236,0.72)', fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
        >
          {mood.description}
        </p>
      </div>

      {/* Small accent dot in corner */}
      <div
        className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: mood.accentColor, boxShadow: `0 0 8px 2px ${mood.accentColor}60` }}
      />
    </motion.div>
  )
}
