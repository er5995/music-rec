import { motion } from 'framer-motion'

interface SpinningDiskProps {
  moodName: string
  moodInterpretation?: string
  accentColor: string
  imageUrl?: string
}

// ─── SpinningDisk ─────────────────────────────────────────────────────────────
// Full-screen loading overlay shown while Claude + Spotify fetch data
export function SpinningDisk({ moodName, moodInterpretation, accentColor, imageUrl }: SpinningDiskProps) {
  return (
    <motion.div
      key="spinning"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(253,245,235,0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        gap: 28,
      }}
    >
      {/* Outer pulsing glow ring */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}30 0%, ${accentColor}10 50%, transparent 72%)`,
        }}
      />

      {/* Spinning vinyl disk */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'relative',
          width: 240,
          height: 240,
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: `0 0 0 4px ${accentColor}60, 0 12px 48px rgba(0,0,0,0.18)`,
        }}
      >
        {/* Image or gradient fill */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `conic-gradient(from 0deg, ${accentColor}60, #F5E0C8, ${accentColor}60)`,
            }}
          />
        )}

        {/* Vinyl groove rings */}
        {[28, 52, 76, 100].map((inset) => (
          <div
            key={inset}
            style={{
              position: 'absolute',
              inset,
              borderRadius: '50%',
              border: '1px solid rgba(0,0,0,0.18)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Center hole */}
        <div
          style={{
            position: 'absolute',
            inset: '43%',
            borderRadius: '50%',
            background: '#FAF5EE',
            border: `2px solid ${accentColor}50`,
          }}
        />
      </motion.div>

      {/* Mood name */}
      <div style={{ textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="font-display"
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#3D2B1F',
            letterSpacing: '0.01em',
            marginBottom: 8,
          }}
        >
          {moodName}
        </motion.div>

        {moodInterpretation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ fontSize: 14, color: '#9B7B6A', fontStyle: 'italic' }}
          >
            {moodInterpretation}
          </motion.div>
        )}

        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 13, color: accentColor, marginTop: 12, fontWeight: 500 }}
        >
          ♫ finding the perfect tracks…
        </motion.div>
      </div>
    </motion.div>
  )
}
