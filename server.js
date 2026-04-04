import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback to .env

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ─── Anthropic client ─────────────────────────────────────────────────────────
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── Spotify token cache ──────────────────────────────────────────────────────
let _spotifyToken = null;
let _spotifyTokenExpiry = 0;

async function getSpotifyToken() {
  if (_spotifyToken && Date.now() < _spotifyTokenExpiry - 60_000) {
    return _spotifyToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Spotify token request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  _spotifyToken = data.access_token;
  _spotifyTokenExpiry = Date.now() + data.expires_in * 1000;
  return _spotifyToken;
}

// ─── Spotify track search ─────────────────────────────────────────────────────
async function searchSpotifyTrack(query) {
  try {
    const token = await getSpotifyToken();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(6_000),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const track = data.tracks?.items?.[0];
    if (!track) return null;

    return {
      title: track.name,
      artist: track.artists?.map((a) => a.name).join(', ') ?? '',
      album: track.album?.name ?? '',
      albumArt: track.album?.images?.[0]?.url ?? null,
      spotifyUrl: track.external_urls?.spotify ?? null,
      previewUrl: track.preview_url ?? null,
    };
  } catch {
    return null;
  }
}

// ─── Claude recommendation ────────────────────────────────────────────────────
async function getClaudeRecommendations(moodInput) {
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1536,
    messages: [
      {
        role: 'user',
        content: `You are a music curator. The user's mood or current moment is: "${moodInput}"

Respond ONLY with valid JSON. No markdown, no code fences, no explanations — just the raw JSON object.

Return exactly this structure:
{
  "mood_interpretation": "brief poetic 3-6 word description of this feeling",
  "recommendations": [
    { "query": "Song Title - Artist Name" },
    { "query": "Song Title - Artist Name" },
    { "query": "Song Title - Artist Name" },
    { "query": "Song Title - Artist Name" },
    { "query": "Song Title - Artist Name" },
    { "query": "Song Title - Artist Name" },
    { "query": "Song Title - Artist Name" },
    { "query": "Song Title - Artist Name" },
    { "query": "Song Title - Artist Name" },
    { "query": "Song Title - Artist Name" }
  ]
}

Rules:
- Exactly 10 recommendations (we need extras in case some lack audio previews)
- Each query must be a real, existing song good for Spotify search
- Format: "Exact Song Title - Exact Artist Name"
- Prefer well-known songs from major artists — these are more likely to have audio previews
- Return ONLY the JSON object, nothing else`,
      },
    ],
  });

  const text = message.content[0]?.type === 'text' ? message.content[0].text.trim() : '';

  // Strip any accidental markdown fences
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
  return JSON.parse(cleaned);
}

// ─── POST /api/recommend ──────────────────────────────────────────────────────
app.post('/api/recommend', async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood || typeof mood !== 'string' || !mood.trim()) {
      return res.status(400).json({ error: 'A mood or description is required.' });
    }

    // 1. Ask Claude for structured JSON recommendations
    const claudeResult = await getClaudeRecommendations(mood.trim());

    if (
      !claudeResult?.recommendations ||
      !Array.isArray(claudeResult.recommendations) ||
      claudeResult.recommendations.length === 0
    ) {
      return res.status(500).json({ error: 'Claude returned an unexpected response format.' });
    }

    // 2. Search Spotify for all candidates in parallel, then keep only those
    //    with a valid preview_url, up to 5 playable tracks.
    const candidates = claudeResult.recommendations;
    const spotifyResults = await Promise.all(
      candidates.map((rec) => searchSpotifyTrack(rec.query))
    );

    const tracks = spotifyResults
      .filter((t) => t !== null && t.previewUrl !== null)
      .slice(0, 5);

    res.json({
      mood_interpretation: claudeResult.mood_interpretation ?? mood,
      tracks,
      partialResults: tracks.length < 5,
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to generate recommendations.',
    });
  }
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🎵 Vibe & Sounds server running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
