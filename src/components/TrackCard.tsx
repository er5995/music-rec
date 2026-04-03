import { motion } from 'framer-motion'
import type { Track } from '../types'

interface TrackCardProps {
  track: Track
  index: number
  accentColor?: string
}

export default function TrackCard({ track, index, accentColor = '#D4A843' }: TrackCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.075, ease: 'easeOut' }}
      whileHover={{
        y: -3,
        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
        transition: { duration: 0.2 },
      }}
      className="flex gap-4 p-4 rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* Album artwork */}
      <div
        className="flex-shrink-0 rounded-xl overflow-hidden"
        style={{ width: '80px', height: '80px' }}
      >
        {track.artworkUrl ? (
          <img
            src={track.artworkUrl}
            alt={`${track.album} artwork`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // On error, hide the image and show gradient placeholder
              const target = e.currentTarget as HTMLImageElement
              target.style.display = 'none'
              if (target.parentElement) {
                target.parentElement.style.background = `linear-gradient(135deg, ${accentColor}40, ${accentColor}15)`
                target.parentElement.innerHTML = `
                  <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;opacity:0.5;">
                    ♪
                  </div>
                `
              }
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${accentColor}40 0%, ${accentColor}15 100%)`,
            }}
          >
            <span style={{ fontSize: '1.6rem', opacity: 0.45 }}>♪</span>
          </div>
        )}
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* Track number */}
          <div
            className="text-xs font-medium mb-1"
            style={{ color: `${accentColor}99`, fontFamily: 'Inter, sans-serif', letterSpacing: '0.06em' }}
          >
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Title */}
          <h3
            className="font-semibold leading-tight truncate"
            style={{
              color: '#2C2420',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.95rem',
            }}
          >
            {track.title}
          </h3>

          {/* Artist */}
          <p
            className="text-sm mt-0.5 truncate"
            style={{ color: 'rgba(44,36,32,0.65)', fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
          >
            {track.artist}
          </p>

          {/* Album */}
          {track.album && (
            <p
              className="text-xs mt-0.5 truncate italic"
              style={{ color: 'rgba(44,36,32,0.38)', fontFamily: 'Inter, sans-serif' }}
            >
              {track.album}
            </p>
          )}
        </div>

        {/* Separator + Reason */}
        {track.reason && (
          <>
            <div
              className="my-2"
              style={{ height: '1px', background: `linear-gradient(to right, ${accentColor}30, transparent)` }}
            />
            <p
              className="text-xs italic leading-relaxed line-clamp-2"
              style={{ color: accentColor, fontFamily: 'Inter, sans-serif', fontWeight: 400, opacity: 0.85 }}
            >
              {track.reason}
            </p>
          </>
        )}
      </div>
    </motion.div>
  )
}
