import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// ─── Inline Types ────────────────────────────────────────────────────────────
interface Song { title: string; artist: string }
interface Playlist {
  id: string; name: string; description: string
  image: string; accent: string; songs: Song[]
  isPreSelected?: boolean; isCustom?: boolean
}
type View = 'home' | 'spinning' | 'playlist'

// ─── Hardcoded Playlist Data (no API calls) ───────────────────────────────────
const PLAYLISTS: Playlist[] = [
  {
    id: 'morning-brew',
    name: 'Morning Brew',
    description: 'Ease into the day with gentle warmth',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80',
    accent: '#F4B942',
    isPreSelected: true,
    songs: [
      { title: 'Good Morning', artist: 'Kanye West' },
      { title: 'Slow Burn', artist: 'Kacey Musgraves' },
      { title: 'Golden', artist: 'Harry Styles' },
      { title: 'Here Comes the Sun', artist: 'The Beatles' },
      { title: 'Banana Pancakes', artist: 'Jack Johnson' },
      { title: 'Sunday Morning', artist: 'Maroon 5' },
      { title: 'Dog Days Are Over', artist: 'Florence + The Machine' },
    ],
  },
  {
    id: 'focus-mode',
    name: 'Focus Mode',
    description: 'Deep work, clear mind, flow state',
    image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=700&q=80',
    accent: '#7EA9C2',
    isPreSelected: true,
    songs: [
      { title: 'Weightless', artist: 'Marconi Union' },
      { title: 'Experience', artist: 'Ludovico Einaudi' },
      { title: "Comptine d'un autre été", artist: 'Yann Tiersen' },
      { title: 'Nuvole Bianche', artist: 'Ludovico Einaudi' },
      { title: 'Retrograde', artist: 'James Blake' },
      { title: 'Re: Stacks', artist: 'Bon Iver' },
      { title: 'Holocene', artist: 'Bon Iver' },
    ],
  },
  {
    id: 'motivation',
    name: 'Motivation',
    description: 'Rise, grind, conquer — no excuses',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80',
    accent: '#E8762F',
    isPreSelected: true,
    songs: [
      { title: 'Eye of the Tiger', artist: 'Survivor' },
      { title: 'Lose Yourself', artist: 'Eminem' },
      { title: 'Champion', artist: 'Kanye West' },
      { title: 'Stronger', artist: 'Kanye West' },
      { title: "Can't Hold Us", artist: 'Macklemore & Ryan Lewis' },
      { title: 'Hall of Fame', artist: 'The Script ft. will.i.am' },
      { title: 'Till I Collapse', artist: 'Eminem' },
    ],
  },
  {
    id: 'healing',
    name: 'Healing',
    description: 'Tender songs for tender moments',
    image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc35?w=700&q=80',
    accent: '#B8A9C9',
    isPreSelected: true,
    songs: [
      { title: 'Skinny Love', artist: 'Bon Iver' },
      { title: 'Breathe (2 AM)', artist: 'Anna Nalick' },
      { title: 'Fix You', artist: 'Coldplay' },
      { title: 'Slow Dancing in a Burning Room', artist: 'John Mayer' },
      { title: 'Flightless Bird', artist: 'Iron & Wine' },
      { title: 'Moon River', artist: 'Henry Mancini' },
      { title: 'To Build a Home', artist: 'The Cinematic Orchestra' },
    ],
  },
  {
    id: 'late-night-drive',
    name: 'Late Night Drive',
    description: 'City lights, open roads, no destination',
    image: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=700&q=80',
    accent: '#6B8FA0',
    songs: [
      { title: 'Midnight City', artist: 'M83' },
      { title: 'Drive', artist: 'The Cars' },
      { title: 'Night Owl', artist: 'Galimatias' },
      { title: 'After Dark', artist: 'Mr. Kitty' },
      { title: 'Intro', artist: 'The xx' },
      { title: 'Nightcall', artist: 'Kavinsky' },
      { title: 'Digital Love', artist: 'Daft Punk' },
    ],
  },
  {
    id: 'workout-hype',
    name: 'Workout Hype',
    description: 'Maximum energy, maximum output',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=700&q=80',
    accent: '#E84545',
    songs: [
      { title: 'Power', artist: 'Kanye West' },
      { title: 'Pump It', artist: 'Black Eyed Peas' },
      { title: 'Levels', artist: 'Avicii' },
      { title: 'Yeah!', artist: 'Usher' },
      { title: "Don't Stop the Music", artist: 'Rihanna' },
      { title: 'Jump', artist: 'Kris Kross' },
      { title: 'Run This Town', artist: 'JAY-Z' },
    ],
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Timeless tracks that defined generations',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700&q=80',
    accent: '#C9A534',
    songs: [
      { title: 'Bohemian Rhapsody', artist: 'Queen' },
      { title: 'Hotel California', artist: 'Eagles' },
      { title: 'Stairway to Heaven', artist: 'Led Zeppelin' },
      { title: 'Purple Rain', artist: 'Prince' },
      { title: 'Billie Jean', artist: 'Michael Jackson' },
      { title: 'Superstition', artist: 'Stevie Wonder' },
      { title: 'Imagine', artist: 'John Lennon' },
    ],
  },
  {
    id: 'custom',
    name: 'My Playlist',
    description: 'Your personal curated collection',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=700&q=80',
    accent: '#A88FE0',
    isCustom: true,
    songs: [
      { title: 'Song Title 1', artist: 'Artist Name' },
      { title: 'Song Title 2', artist: 'Artist Name' },
      { title: 'Song Title 3', artist: 'Artist Name' },
      { title: 'Song Title 4', artist: 'Artist Name' },
      { title: 'Song Title 5', artist: 'Artist Name' },
      { title: 'Song Title 6', artist: 'Artist Name' },
      { title: 'Song Title 7', artist: 'Artist Name' },
    ],
  },
]

// ─── SunsetBackground ─────────────────────────────────────────────────────────
// Persistent Ghibli-style painted sky with hills, fixed behind everything
function SunsetBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Main sky gradient — deep indigo at top, warm amber/cream at bottom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, #0c0820 0%, #1e0d4a 12%, #5c1e6e 25%, #9b3060 38%, #c94a38 50%, #e87432 63%, #f4a44a 75%, #fad06a 87%, #fde98a 100%)',
        }}
      />

      {/* Warm atmospheric glow near horizon */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 70%, rgba(244,164,74,0.15), transparent 60%)',
        }}
      />

      {/* Back hills — lighter, more distant */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '45%',
        }}
      >
        <path
          d="M0,220 C120,160 240,200 360,180 C480,160 600,140 720,160 C840,180 960,200 1080,175 C1200,150 1320,170 1440,185 L1440,320 L0,320 Z"
          fill="rgba(20,40,15,0.55)"
        />
      </svg>

      {/* Front hills — darker, closer */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '30%',
        }}
      >
        <path
          d="M0,260 C80,220 200,240 320,210 C440,180 560,230 680,215 C800,200 920,240 1040,220 C1160,200 1300,235 1440,215 L1440,320 L0,320 Z"
          fill="rgba(8,20,6,0.85)"
        />
      </svg>

      {/* Ground strip at the very bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '8%',
          background: 'rgba(4,12,3,0.95)',
        }}
      />
    </div>
  )
}

// ─── Fireflies ─────────────────────────────────────────────────────────────────
// 20 animated golden fireflies drifting upward, always on top of background
function Fireflies() {
  // Generate stable firefly data on mount using useRef so it doesn't re-randomize
  const firefliesRef = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,       // horizontal position 5–95%
      y: 35 + Math.random() * 55,       // start height 35–90% down the screen
      size: 2 + Math.random() * 3,      // diameter 2–5px
      delay: Math.random() * 6,         // stagger start times
      duration: 6 + Math.random() * 8,  // travel duration
      drift: -60 + Math.random() * 120, // horizontal drift amount
    }))
  )

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      {firefliesRef.current.map((ff) => (
        <motion.div
          key={ff.id}
          style={{
            position: 'absolute',
            left: `${ff.x}%`,
            top: `${ff.y}%`,
            width: ff.size,
            height: ff.size,
            borderRadius: '50%',
            background: '#FDE68A',
            boxShadow: `0 0 ${ff.size * 3}px ${ff.size}px rgba(253,230,138,0.6)`,
          }}
          animate={{
            y: [0, -80, -160],
            x: [0, ff.drift * 0.5, ff.drift],
            opacity: [0, 0.9, 0.7, 0.9, 0],
          }}
          transition={{
            duration: ff.duration,
            delay: ff.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── PlaylistCard ──────────────────────────────────────────────────────────────
// Individual card with full-bleed image, gradient overlay, hover effects
interface PlaylistCardProps {
  playlist: Playlist
  onSelect: (playlist: Playlist) => void
  customName: string
  onCustomNameChange: (name: string) => void
}

function PlaylistCard({ playlist, onSelect, customName, onCustomNameChange }: PlaylistCardProps) {
  const displayName = playlist.isCustom ? (customName || playlist.name) : playlist.name

  return (
    <motion.div
      onClick={(e) => {
        // Don't trigger card select when clicking the name input field
        if ((e.target as HTMLElement).tagName === 'INPUT') return
        onSelect(playlist)
      }}
      style={{
        position: 'relative',
        aspectRatio: '3/4',
        borderRadius: 24,
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundImage: `url(${playlist.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // Pre-selected cards get an accent border glow, others get a plain shadow
        boxShadow: playlist.isPreSelected
          ? `0 0 0 1.5px ${playlist.accent}60, 0 8px 32px rgba(0,0,0,0.4)`
          : '0 8px 32px rgba(0,0,0,0.35)',
      }}
      whileHover={{
        scale: 1.04,
        boxShadow: `0 0 0 2px ${playlist.accent}90, 0 16px 48px rgba(0,0,0,0.55), 0 0 32px ${playlist.accent}30`,
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {/* Gradient overlay — darkens bottom for text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 75%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* Featured badge for pre-selected playlists */}
      {playlist.isPreSelected && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: playlist.accent,
            color: '#000',
            fontSize: 10,
            fontWeight: 600,
            padding: '3px 9px',
            borderRadius: 999,
            letterSpacing: '0.04em',
          }}
        >
          ✦ featured
        </div>
      )}

      {/* Card content pinned to bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 14px 14px',
        }}
      >
        {/* Custom playlist: show editable name input */}
        {playlist.isCustom ? (
          <input
            value={customName}
            onChange={(e) => onCustomNameChange(e.target.value)}
            placeholder="Name your playlist…"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: `1px solid ${playlist.accent}60`,
              borderRadius: 8,
              color: 'white',
              fontSize: 13,
              padding: '6px 10px',
              width: '100%',
              marginBottom: 6,
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
          />
        ) : null}

        {/* Playlist name */}
        <div
          className="font-display"
          style={{
            fontSize: playlist.isCustom ? 18 : 22,
            fontWeight: 600,
            color: 'white',
            lineHeight: 1.2,
            marginBottom: 4,
          }}
        >
          {displayName}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.62)',
            lineHeight: 1.4,
          }}
        >
          {playlist.description}
        </div>
      </div>
    </motion.div>
  )
}

// ─── SpinningDisk ──────────────────────────────────────────────────────────────
// Full-screen overlay that plays a vinyl spin animation before showing the playlist
interface SpinningDiskProps {
  playlist: Playlist
  onComplete: () => void
}

function SpinningDisk({ playlist, onComplete }: SpinningDiskProps) {
  return (
    <motion.div
      key="spinning"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(8,4,20,0.85)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}
    >
      {/* Pulsing outer glow ring */}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${playlist.accent}22 0%, ${playlist.accent}08 50%, transparent 70%)`,
        }}
      />

      {/* Spinning vinyl record */}
      <motion.div
        animate={{ rotate: 360 * 4 }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
        onAnimationComplete={onComplete}
        style={{
          position: 'relative',
          width: 260,
          height: 260,
          borderRadius: '50%',
          backgroundImage: `url(${playlist.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'visible',
        }}
      >
        {/* Vinyl groove rings layered on top of the image */}
        {[30, 50, 70, 90, 110].map((inset) => (
          <div
            key={inset}
            style={{
              position: 'absolute',
              inset,
              borderRadius: '50%',
              border: '1px solid rgba(0,0,0,0.25)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Center hole */}
        <div
          style={{
            position: 'absolute',
            inset: 115,
            borderRadius: '50%',
            background: '#0c0820',
            border: '2px solid rgba(255,255,255,0.1)',
          }}
        />
      </motion.div>

      {/* Playlist name fades in below the disk */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="font-display"
        style={{
          marginTop: 32,
          fontSize: 28,
          fontWeight: 600,
          color: 'white',
          letterSpacing: '0.01em',
        }}
      >
        {playlist.name}
      </motion.div>
    </motion.div>
  )
}

// ─── PlaylistView ──────────────────────────────────────────────────────────────
// Full playlist detail page with image hero, back button, and song list
interface PlaylistViewProps {
  playlist: Playlist
  onBack: () => void
}

function PlaylistView({ playlist, onBack }: PlaylistViewProps) {
  return (
    <motion.div
      key="playlist"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'relative',
        zIndex: 20,
        minHeight: '100vh',
        background: 'rgba(6,3,16,0.7)',
      }}
    >
      {/* Hero image section — ~42vh */}
      <div style={{ position: 'relative', height: '42vh', overflow: 'hidden' }}>
        <img
          src={playlist.image}
          alt={playlist.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />

        {/* Gradient fading image into dark background below */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(6,3,16,0.0) 40%, rgba(6,3,16,0.95) 100%)',
          }}
        />

        {/* Back button — glassmorphism pill at top-left */}
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.2)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 999,
            color: 'white',
            fontSize: 13,
            fontWeight: 500,
            padding: '8px 18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          ← Back
        </motion.button>

        {/* Playlist title overlaid on hero bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 0,
            right: 0,
            padding: '0 32px',
          }}
        >
          {/* "now playing" label in accent color */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: playlist.accent,
              marginBottom: 6,
            }}
          >
            ♫ now playing
          </div>

          <div
            className="font-display"
            style={{ fontSize: 36, fontWeight: 700, color: 'white', lineHeight: 1.1 }}
          >
            {playlist.name}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
            {playlist.description}
          </div>
        </div>
      </div>

      {/* Song list */}
      <div
        style={{
          maxWidth: '672px', // ~max-w-2xl
          margin: '0 auto',
          padding: '24px 20px 48px',
        }}
      >
        {playlist.songs.map((song, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.07, duration: 0.4, ease: 'easeOut' }}
            whileHover={{ x: 4 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '14px 16px',
              borderRadius: 12,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onHoverStart={(e) => {
              ;(e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
            }}
            onHoverEnd={(e) => {
              ;(e.target as HTMLElement).style.background = 'transparent'
            }}
          >
            {/* Track number */}
            <div
              style={{
                width: 24,
                textAlign: 'center',
                fontSize: 13,
                fontWeight: 600,
                color: playlist.accent,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>

            {/* Small vinyl icon */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${playlist.accent}40, rgba(0,0,0,0.4))`,
                border: `1px solid ${playlist.accent}50`,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
              }}
            >
              ♪
            </div>

            {/* Title and artist */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'white',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {song.title}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                {song.artist}
              </div>
            </div>

            {/* Play button icon */}
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                border: `1px solid ${playlist.accent}50`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: playlist.accent,
                fontSize: 11,
                flexShrink: 0,
              }}
            >
              ▶
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── HomePage ──────────────────────────────────────────────────────────────────
// The main landing view with title, 8 playlist cards in a 4-column grid
interface HomePageProps {
  onCardSelect: (playlist: Playlist) => void
  customName: string
  onCustomNameChange: (name: string) => void
}

function HomePage({ onCardSelect, customName, onCustomNameChange }: HomePageProps) {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'relative',
        zIndex: 20,
        minHeight: '100vh',
        padding: '48px 24px 64px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Title section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: 48 }}
      >
        {/* Small label above */}
        <div
          style={{
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(253,230,138,0.7)',
            marginBottom: 12,
            fontWeight: 500,
          }}
        >
          ✦ Vibe & Sounds ✦
        </div>

        {/* Main heading */}
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 700,
            color: 'white',
            margin: '0 0 16px',
            lineHeight: 1.1,
          }}
        >
          What's your vibe right now?
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.55)',
            maxWidth: 420,
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Pick a mood and let the music find you
        </p>
      </motion.div>

      {/* 4-column responsive playlist grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16,
          maxWidth: 900,
          width: '100%',
        }}
        className="md:grid-cols-4"
      >
        {PLAYLISTS.map((playlist, i) => (
          <motion.div
            key={playlist.id}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: 'easeOut' }}
          >
            <PlaylistCard
              playlist={playlist}
              onSelect={onCardSelect}
              customName={playlist.isCustom ? customName : ''}
              onCustomNameChange={onCustomNameChange}
            />
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        style={{
          marginTop: 56,
          fontSize: 12,
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.06em',
        }}
      >
        Powered by Claude AI · Inspired by Studio Ghibli
      </motion.div>
    </motion.div>
  )
}

// ─── Root App Component ────────────────────────────────────────────────────────
// All state lives here. Renders the three views: home → spinning → playlist
export default function App() {
  const [view, setView] = useState<View>('home')
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [customName, setCustomName] = useState('')

  // When a card is clicked: resolve the display name for custom playlists, then spin
  const handleCardSelect = (playlist: Playlist) => {
    const resolved: Playlist = playlist.isCustom
      ? { ...playlist, name: customName.trim() || 'My Playlist' }
      : playlist
    setSelectedPlaylist(resolved)
    setView('spinning')
  }

  // Spin animation finished — show the playlist view
  const handleSpinComplete = () => {
    setView('playlist')
  }

  // Back button returns to homepage without page reload
  const handleBack = () => {
    setView('home')
    setSelectedPlaylist(null)
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Persistent background — always rendered, z=0 */}
      <SunsetBackground />

      {/* Persistent fireflies — always rendered, z=10 */}
      <Fireflies />

      {/* View transitions — z=20+ */}
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <HomePage
            key="home"
            onCardSelect={handleCardSelect}
            customName={customName}
            onCustomNameChange={setCustomName}
          />
        )}

        {view === 'spinning' && selectedPlaylist && (
          <SpinningDisk
            key="spinning"
            playlist={selectedPlaylist}
            onComplete={handleSpinComplete}
          />
        )}

        {view === 'playlist' && selectedPlaylist && (
          <PlaylistView
            key="playlist"
            playlist={selectedPlaylist}
            onBack={handleBack}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
