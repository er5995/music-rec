import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Screen, Mood, RecommendationResult } from './types'
import LandingHero from './components/LandingHero'
import MoodGrid from './components/MoodGrid'
import LoadingScreen from './components/LoadingScreen'
import ResultsScreen from './components/ResultsScreen'

const easeInOut = [0.42, 0, 0.58, 1] as const

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeInOut } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.35, ease: easeInOut } },
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [results, setResults] = useState<RecommendationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // isLoading drives the loading screen; suppress unused lint warning
  void isLoading

  const handleMoodSelect = async (mood: Mood) => {
    setSelectedMood(mood)
    setIsCustomMode(false)
    setError(null)
    setScreen('loading')
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('mood', mood.name)
      formData.append('moodDescription', mood.description)

      const response = await fetch('/api/recommend', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error((errData as { error?: string }).error || 'Failed to fetch recommendations')
      }

      const data: RecommendationResult = await response.json()
      setResults(data)
      setScreen('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setScreen('mood-select')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTextInput = async (text: string) => {
    setIsCustomMode(true)
    setSelectedMood(null)
    setError(null)
    setScreen('loading')
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('customText', text)

      const response = await fetch('/api/recommend', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error((errData as { error?: string }).error || 'Failed to fetch recommendations')
      }

      const data: RecommendationResult = await response.json()
      setResults(data)
      setScreen('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setScreen('mood-select')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setScreen('mood-select')
    setResults(null)
    setError(null)
    setSelectedMood(null)
    setIsCustomMode(false)
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <motion.div key="landing" {...pageVariants}>
            <LandingHero onDiscover={() => setScreen('mood-select')} />
          </motion.div>
        )}

        {screen === 'mood-select' && (
          <motion.div key="mood-select" {...pageVariants}>
            <MoodGrid
              onMoodSelect={handleMoodSelect}
              onTextInput={handleTextInput}
              onBack={() => setScreen('landing')}
              error={error}
            />
          </motion.div>
        )}

        {screen === 'loading' && (
          <motion.div key="loading" {...pageVariants}>
            <LoadingScreen
              selectedMood={selectedMood}
              isCustomMode={isCustomMode}
            />
          </motion.div>
        )}

        {screen === 'results' && results && (
          <motion.div key="results" {...pageVariants}>
            <ResultsScreen
              results={results}
              selectedMood={selectedMood}
              onReset={handleReset}
              onBack={() => setScreen('landing')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
