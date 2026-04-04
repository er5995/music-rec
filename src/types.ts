// ─── Mood (preset card data) ──────────────────────────────────────────────────
export interface Mood {
  id: string
  name: string
  description: string
  image: string        // filename inside public/images/
  fallbackImage: string  // Unsplash URL if local file is missing
  accent: string       // accent hex color for this mood
}

// ─── Track (Spotify-enriched result) ─────────────────────────────────────────
export interface Track {
  title: string
  artist: string
  album: string
  albumArt: string | null
  spotifyUrl: string | null
  previewUrl: string | null
}

// ─── API response shape ───────────────────────────────────────────────────────
export interface RecommendResponse {
  mood_interpretation: string
  tracks: Track[]
}

// ─── App view states ──────────────────────────────────────────────────────────
export type View = 'home' | 'loading' | 'results'

// ─── Preset mood definitions ──────────────────────────────────────────────────
export const MOODS: Mood[] = [
  {
    id: 'morning-brew',
    name: 'Morning Brew',
    description: 'Ease into the day with gentle warmth',
    image: 'Morning_Brew.png',
    fallbackImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80',
    accent: '#C4825A',
  },
  {
    id: 'focus-mode',
    name: 'Focus Mode',
    description: 'Deep work, clear mind, flow state',
    image: 'Focus_Mode.png',
    fallbackImage: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=700&q=80',
    accent: '#6B95B0',
  },
  {
    id: 'workout-hype',
    name: 'Workout Hype',
    description: 'Maximum energy, maximum output',
    image: 'Workout_Hype.png',
    fallbackImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=700&q=80',
    accent: '#C06845',
  },
  {
    id: 'late-night-drive',
    name: 'Late Night Drive',
    description: 'City lights, open roads, no destination',
    image: 'Late_Night_Drive.png',
    fallbackImage: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=700&q=80',
    accent: '#5A7F95',
  },
  {
    id: 'motivation',
    name: 'Motivation',
    description: 'Rise, grind, conquer — no excuses',
    image: 'Motivation.png',
    fallbackImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80',
    accent: '#B87845',
  },
  {
    id: 'classical',
    name: 'Classical',
    description: 'Timeless masterpieces for refined moments',
    image: 'Classical.png',
    fallbackImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700&q=80',
    accent: '#9A7B5A',
  },
  {
    id: 'healing',
    name: 'Healing',
    description: 'Tender songs for tender moments',
    image: 'Healing.png',
    fallbackImage: 'https://images.unsplash.com/photo-1490750967868-88df5691cc35?w=700&q=80',
    accent: '#7A9E8E',
  },
]
