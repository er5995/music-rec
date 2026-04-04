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
      transition={{ delay: 0.12 + index * 0.08, duration: 0.4, ease: 'easeOut' }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 14px',
        borderRadius: 14,
        background: 'rgba(255,248,240,0.75)',
        border: isPlaying
          ? `1.5px solid ${accentColor}80`
          : '1.5px solid rgba(196,130,90,0.15)',
        boxShadow: isPlaying
          ? `0 4px 20px ${accentColor}20`
          : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Track number */}
      <div
        style={{
          width: 22,
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
          width: 48,
          height: 48,
          borderRadius: 10,
          overflow: 'hidden',
          flexShrink: 0,
          background: `linear-gradient(135deg, ${accentColor}40, rgba(200,160,120,0.25))`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
        }}
      >
        {track.albumArt && !imgError ? (
          <img
            src={track.albumArt}
            alt={track.album}
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

      {/* Action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {/* Preview button — always shown (backend guarantees preview_url exists) */}
        {hasPreview && (
          <motion.button
            onClick={onPlayPause}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            title={isPlaying ? 'Pause preview' : 'Play 30s preview'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 12px',
              borderRadius: 999,
              border: `1.5px solid ${accentColor}`,
              background: isPlaying ? accentColor : 'transparent',
              color: isPlaying ? 'white' : accentColor,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: 10 }}>{isPlaying ? '⏸' : '▶'}</span>
            {isPlaying ? 'Pause' : 'Preview'}
          </motion.button>
        )}

        {/* Open in Spotify */}
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
              padding: '6px 12px',
              borderRadius: 999,
              border: '1.5px solid rgba(30,215,96,0.6)',
              background: 'rgba(30,215,96,0.08)',
              color: '#1a7a3a',
              fontSize: 12,
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: 13 }}>♫</span>
            Spotify
          </motion.a>
        )}
      </div>
    </motion.div>
  )
}

// ─── AudioPlayer ──────────────────────────────────────────────────────────────
// Manages a single global audio element for preview playback
interface AudioPlayerProps {
  previewUrl: string | null
  isPlaying: boolean
  accentColor: string
}

function AudioPlayer({ previewUrl, isPlaying, accentColor }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying && previewUrl) {
      audio.src = previewUrl
      audio.volume = 0.7
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [isPlaying, previewUrl])

  if (!previewUrl || !isPlaying) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(253,245,235,0.95)',
        backdropFilter: 'blur(16px)',
        border: `1.5px solid ${accentColor}60`,
        borderRadius: 999,
        padding: '8px 20px',
        fontSize: 12,
        color: '#3D2B1F',
        fontWeight: 500,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: `0 8px 32px ${accentColor}25`,
        whiteSpace: 'nowrap',
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        style={{ color: accentColor, fontSize: 14 }}
      >
        ♫
      </motion.div>
      Playing 30s preview
      <audio ref={audioRef} onEnded={() => {}} />
    </motion.div>
  )
}

// ─── ResultsView ──────────────────────────────────────────────────────────────
interface ResultsViewProps {
  moodName: string
  moodInterpretation: string
  tracks: Track[]
  selectedMood: Mood | null
  partialResults?: boolean
  onBack: () => void
}

export function ResultsView({
  moodName,
  moodInterpretation,
  tracks,
  selectedMood,
  partialResults = false,
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
          background: 'rgba(253,245,235,0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(196,130,90,0.18)',
          padding: '56px 24px 36px',
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

        {/* Mood hero image if available */}
        {selectedMood && (
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 16px',
              border: `3px solid ${accentColor}80`,
              boxShadow: `0 4px 20px ${accentColor}30`,
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

        {/* "now playing" label */}
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
          ♫ now playing
        </div>

        <h1
          className="font-display"
          style={{ fontSize: 32, fontWeight: 700, color: '#2C1810', margin: '0 0 6px', lineHeight: 1.15 }}
        >
          {moodName}
        </h1>

        {moodInterpretation && (
          <p style={{ fontSize: 14, color: '#7A5A48', margin: 0, fontStyle: 'italic' }}>
            {moodInterpretation}
          </p>
        )}
      </div>

      {/* Track list */}
      <div
        style={{
          maxWidth: 640,
          margin: '0 auto',
          padding: '28px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {tracks.length === 0 && (
          <div style={{ textAlign: 'center', color: '#7A5A48', padding: '40px 0', fontSize: 14 }}>
            No previewable tracks found for this mood. Try a different one!
          </div>
        )}

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

        {/* Partial results notice */}
        {partialResults && tracks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              textAlign: 'center',
              marginTop: 8,
              fontSize: 12,
              color: '#9B7B6A',
              fontStyle: 'italic',
            }}
          >
            Only {tracks.length} of 5 tracks had audio previews available — open them in Spotify for full playback.
          </motion.div>
        )}

        {/* Spotify attribution */}
        {tracks.some((t) => t.spotifyUrl) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{
              textAlign: 'center',
              marginTop: 16,
              fontSize: 12,
              color: '#9B7B6A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <span style={{ color: '#1DB954', fontSize: 14 }}>♫</span>
            Powered by Spotify · Click ♫ on any track to open in Spotify
          </motion.div>
        )}
      </div>

      {/* Sticky audio player for preview */}
      <AnimatePresence>
        {playingIndex !== null && currentTrack?.previewUrl && (
          <AudioPlayer
            previewUrl={currentTrack.previewUrl}
            isPlaying={true}
            accentColor={accentColor}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
