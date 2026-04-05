import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SunsetBackground, Fireflies } from './components/Background'
import { MoodGrid } from './components/MoodGrid'
import { SpinningDisk } from './components/SpinningDisk'
import { ResultsView } from './components/ResultsView'
import { MOODS } from './types'
import type { Track, View, Mood, RecommendResponse } from './types'

// ─── API call ─────────────────────────────────────────────────────────────────
async function fetchRecommendations(mood: string): Promise<RecommendResponse> {
  const res = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mood }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error ?? `Server error ${res.status}`)
  }
  return res.json()
}

// Minimum display time for the loading disk (ms)
const MIN_SPIN_MS = 1800

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<View>('home')
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null)
  const [customText, setCustomText] = useState('')
  const [tracks, setTracks] = useState<Track[]>([])
  const [moodInterpretation, setMoodInterpretation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // The mood sent to the API: custom text takes priority over preset selection
  const selectedMood: Mood | null = MOODS.find((m) => m.id === selectedMoodId) ?? null
  const effectiveMood = customText.trim() || selectedMood?.name || ''
  const canSubmit = effectiveMood.length > 0

  // Card select: picking a preset clears custom text focus (but keeps any typed text)
  function handleSelectMood(id: string) {
    setSelectedMoodId(id)
    setError(null)
  }

  function handleCustomTextChange(text: string) {
    setCustomText(text)
    // Typing custom text deselects preset cards
    if (text.trim()) setSelectedMoodId(null)
    setError(null)
  }

  async function handleSubmit() {
    if (!canSubmit || isLoading) return
    setError(null)
    setIsLoading(true)
    setView('loading')

    try {
      const [result] = await Promise.all([
        fetchRecommendations(effectiveMood),
        new Promise<void>((resolve) => setTimeout(resolve, MIN_SPIN_MS)),
      ])
      setTracks(result.tracks)
      setMoodInterpretation(result.mood_interpretation)
      setView('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setView('home')
    } finally {
      setIsLoading(false)
    }
  }

  function handleBack() {
    setView('home')
    setTracks([])
    setMoodInterpretation('')
    setError(null)
  }

  // Display name for the loading disk
  const loadingMoodName = customText.trim()
    ? `"${customText.trim().slice(0, 40)}${customText.trim().length > 40 ? '…' : ''}"`
    : selectedMood?.name ?? ''

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Persistent cream sunset background — z=0 */}
      <SunsetBackground />

      {/* Persistent fireflies — z=10 */}
      <Fireflies />

      {/* View transitions — z=20+ */}
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'relative',
              zIndex: 20,
              minHeight: '100vh',
              padding: '52px 20px 80px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.55 }}
              style={{ textAlign: 'center', marginBottom: 44 }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#C4825A',
                  marginBottom: 12,
                  fontWeight: 600,
                }}
              >
                ✦ Vibe & Sounds ✦
              </div>

              <h1
                className="font-display"
                style={{
                  fontSize: 'clamp(32px, 5.5vw, 58px)',
                  fontWeight: 700,
                  color: '#2C1810',
                  margin: '0 0 14px',
                  lineHeight: 1.1,
                }}
              >
                Made for this moment.
              </h1>

              <p
                style={{
                  fontSize: 15,
                  color: '#7A5A48',
                  maxWidth: 400,
                  margin: '0 auto',
                  lineHeight: 1.65,
                }}
              >
                Choose a mood or describe your moment — we’ll find five tracks just for you.
              </p>
            </motion.div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  background: 'rgba(200,60,40,0.08)',
                  border: '1px solid rgba(200,60,40,0.25)',
                  borderRadius: 12,
                  padding: '12px 18px',
                  marginBottom: 20,
                  color: '#8B2A1A',
                  fontSize: 14,
                  maxWidth: 480,
                  textAlign: 'center',
                }}
              >
                ⚠ {error}
              </motion.div>
            )}

            {/* The 4x2 card grid + submit CTA */}
            <MoodGrid
              moods={MOODS}
              selectedMoodId={selectedMoodId}
              onSelectMood={handleSelectMood}
              customText={customText}
              onCustomTextChange={handleCustomTextChange}
              onSubmit={handleSubmit}
              canSubmit={canSubmit}
              isLoading={isLoading}
            />

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              style={{
                marginTop: 52,
                fontSize: 12,
                color: 'rgba(80,50,35,0.45)',
                letterSpacing: '0.05em',
                textAlign: 'center',
              }}
            >
              Made by Eman R.
            </motion.div>
          </motion.div>
        )}

        {view === 'loading' && (
          <SpinningDisk
            key="loading"
            moodName={loadingMoodName}
            moodInterpretation={moodInterpretation || undefined}
            accentColor={selectedMood?.accent ?? '#C4825A'}
            imageUrl={selectedMood ? `/images/${selectedMood.image}` : undefined}
          />
        )}

        {view === 'results' && (
          <ResultsView
            key="results"
            moodName={customText.trim() ? 'Your Moment' : selectedMood?.name ?? 'Your Playlist'}
            moodInterpretation={moodInterpretation}
            tracks={tracks}
            selectedMood={customText.trim() ? null : selectedMood}
            onBack={handleBack}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
