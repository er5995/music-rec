import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Track, Mood } from '../types'

// ─── TrackItem ─────────────────────────────────────────────────────────────────
interface TrackItemProps {
  track: Track
  index: number
  accentColor: string
  isPlaying: boolean
  onPlayPause: () => void
}

function TrackItem({ track, index, accentColor, isPlaying, onPlayPause }: TrackItemProps) {
  const [imgError, setImgError] = useState(false)
  const hasPreview = Boolean(track.previewUrl)

  return (
    <motion.div
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4, ease: 'easeOut' }}
      style={{
        display: 'flex',
        gap: 14,
        padding: '14px 16px',
        borderRadius: 16,
        background: 'rgba(255,248,240,0.82)',
        border: isPlaying
          ? `1.5px solid ${accentColor}80`
          : '1.5px solid rgba(196,130,90,0.15)',
        boxShadow: isPlaying
          ? `0 4px 20px ${accentColor}18`
          : '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Track number */}
      <div
        style={{
          width: 22,
          paddingTop: 2,
          textAlign: 'center',
          fontSize: 13,
          fontWeight: 700,
          color: accentColor,
          flexShrink: 0,
        }}
      >
        {index + 1}
      </div>

      {/* Album art */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 10,
          overflow: 'hidden',
          flexShrink: 0,
          background: `linear-gradient(135deg, ${accentColor}35, rgba(200,160,120,0.2))`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
        }}
      >
        {track.albumArt && !imgError ? (
          <img
            src={track.albumArt}
            alt={track.album ?? ''}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span>♪</span>
        )}
      </div>

      {/* Track info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#2C1810',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {track.title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: '#7A5A48',
            marginTop: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {track.artist}
          {track.album ? ` · ${track.album}` : ''}
        </div>
      </div>

      {/* Action buttons — right side, vertically centred */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
        {/* Preview button — active if previewUrl exists, greyed-out icon otherwise */}
        {hasPreview ? (
          <motion.button
            onClick={onPlayPause}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            title={isPlaying ? 'Pause preview' : 'Play 30s preview'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 11px',
              borderRadius: 999,
              border: `1.5px solid ${accentColor}`,
              background: isPlaying ? accentColor : 'transparent',
              color: isPlaying ? 'white' : accentColor,
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: 9 }}>{isPlaying ? '⏸' : '▶'}</span>
            {isPlaying ? 'Pause' : 'Preview'}
          </motion.button>
        ) : (
          <div
            title="Preview unavailable"
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: '1.5px solid rgba(180,140,110,0.25)',
              color: 'rgba(150,110,85,0.3)',
              fontSize: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'default',
            }}
          >
            ▶
          </div>
        )}

        {/* Open in Spotify — only shown when we have a URL */}
        {track.spotifyUrl && (
          <motion.a
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            title="Open in Spotify"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 11px',
              borderRadius: 999,
              border: '1.5px solid rgba(30,215,96,0.55)',
              background: 'rgba(30,215,96,0.07)',
              color: '#1a7a3a',
              fontSize: 11,
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: 12 }}>♫</span>
            Open in Spotify
          </motion.a>
        )}
      </div>
    </motion.div>
  )
}

// ─── AudioPlayer ──────────────────────────────────────────────────────────────
interface AudioPlayerProps {
  previewUrl: string
  accentColor: string
}

function AudioPlayer({ previewUrl, accentColor }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = previewUrl
    audio.volume = 0.7
    audio.play().catch(() => {})
    return () => { audio.pause() }
  }, [previewUrl])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(253,245,235,0.96)',
        backdropFilter: 'blur(16px)',
        border: `1.5px solid ${accentColor}55`,
        borderRadius: 999,
        padding: '8px 20px',
        fontSize: 12,
        color: '#3D2B1F',
        fontWeight: 500,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: `0 8px 32px ${accentColor}20`,
        whiteSpace: 'nowrap',
      }}
    >
      <motion.span
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        style={{ color: accentColor }}
      >
        ♫
      </motion.span>
      Playing 30s preview
      <audio ref={audioRef} />
    </motion.div>
  )
}

// ─── ResultsView ──────────────────────────────────────────────────────────────
interface ResultsViewProps {
  moodName: string
  moodInterpretation: string
  tracks: Track[]
  selectedMood: Mood | null
  onBack: () => void
}

export function ResultsView({
  moodName,
  moodInterpretation,
  tracks,
  selectedMood,
  onBack,
}: ResultsViewProps) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const accentColor = selectedMood?.accent ?? '#C4825A'
  const currentTrack = playingIndex !== null ? tracks[playingIndex] : null

  function togglePlay(index: number) {
    setPlayingIndex((prev) => (prev === index ? null : index))
  }

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'relative',
        zIndex: 20,
        minHeight: '100vh',
        paddingBottom: 80,
      }}
    >
      {/* Hero header */}
      <div
        style={{
          position: 'relative',
          background: 'rgba(253,245,235,0.9)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(196,130,90,0.15)',
          padding: '56px 24px 32px',
          textAlign: 'center',
        }}
      >
        {/* Back button */}
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{
            position: 'absolute',
            top: 18,
            left: 18,
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(196,130,90,0.3)',
            borderRadius: 999,
            color: '#5C3D25',
            fontSize: 13,
            fontWeight: 500,
            padding: '7px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          ← Back
        </motion.button>

        {/* Mood avatar */}
        {selectedMood && (
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 14px',
              border: `2.5px solid ${accentColor}70`,
              boxShadow: `0 4px 16px ${accentColor}28`,
            }}
          >
            <img
              src={`/images/${selectedMood.image}`}
              alt={selectedMood.name}
              onError={(e) => { e.currentTarget.src = selectedMood.fallbackImage }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: accentColor,
            marginBottom: 8,
          }}
        >
          ♫ your playlist
        </div>

        <h1
          className="font-display"
          style={{ fontSize: 30, fontWeight: 700, color: '#2C1810', margin: '0 0 6px', lineHeight: 1.15 }}
        >
          {moodName}
        </h1>

        {moodInterpretation && (
          <p style={{ fontSize: 14, color: '#7A5A48', margin: '0 0 10px', fontStyle: 'italic' }}>
            {moodInterpretation}
          </p>
        )}

      </div>

      {/* Track list */}
      <div
        style={{
          maxWidth: 680,
          margin: '0 auto',
          padding: '24px 20px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {tracks.map((track, i) => (
          <TrackItem
            key={i}
            track={track}
            index={i}
            accentColor={accentColor}
            isPlaying={playingIndex === i}
            onPlayPause={() => togglePlay(i)}
          />
        ))}

      </div>

      {/* Sticky now-playing banner */}
      <AnimatePresence>
        {playingIndex !== null && currentTrack?.previewUrl && (
          <AudioPlayer
            key={playingIndex}
            previewUrl={currentTrack.previewUrl}
            accentColor={accentColor}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
