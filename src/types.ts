export interface Mood {
  id: string;
  name: string;
  description: string;
  image: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface Track {
  title: string;
  artist: string;
  album: string;
  reason: string;
  artworkUrl: string | null;
}

export interface RecommendationResult {
  message: string;
  tracks: Track[];
  detectedMood?: string;
}

export type Screen = 'landing' | 'mood-select' | 'loading' | 'results';
