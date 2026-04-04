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
// Searches up to 5 results per query and prefers whichever has a preview_url.
async function searchSpotifyTrack(query) {
  try {
    const token = await getSpotifyToken();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(6_000),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '(unreadable)');
      console.error(`Spotify search failed for "${query}": ${response.status} ${response.statusText}\n  body: ${body}`);
      return null;
    }

    const data = await response.json();
    const items = data.tracks?.items ?? [];
    if (items.length === 0) {
      console.warn(`Spotify: no results for query "${query}"`);
      return null;
    }

    // Prefer the first result that has a preview_url; fall back to the top result
    const best = items.find((t) => t.preview_url) ?? items[0];
    console.log(`Spotify: "${query}" → "${best.name}" by ${best.artists?.[0]?.name} (preview: ${best.preview_url ? 'yes' : 'no'})`);

    return {
      title: best.name,
      artist: best.artists?.map((a) => a.name).join(', ') ?? '',
      album: best.album?.name ?? '',
      albumArt: best.album?.images?.[0]?.url ?? null,
      spotifyUrl: best.external_urls?.spotify ?? null,
      previewUrl: best.preview_url ?? null,
    };
  } catch (err) {
    console.error(`Spotify search error for "${query}":`, err?.message ?? err);
    return null;
  }
}

// ─── Claude recommendation ────────────────────────────────────────────────────
async function getClaudeRecommendations(moodInput) {
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a music curator. The user's mood or current moment is: "${moodInput}"

Respond ONLY with valid JSON. No markdown, no code fences, no explanations — just the raw JSON object.

Return exactly this structure:
{
  "mood_interpretation": "brief poetic 3-6 word description of this feeling",
  "recommendations": [
    { "title": "Exact Song Title", "artist": "Exact Artist Name", "reason": "One sentence on why this fits the mood." },
    { "title": "Exact Song Title", "artist": "Exact Artist Name", "reason": "One sentence on why this fits the mood." },
    { "title": "Exact Song Title", "artist": "Exact Artist Name", "reason": "One sentence on why this fits the mood." },
    { "title": "Exact Song Title", "artist": "Exact Artist Name", "reason": "One sentence on why this fits the mood." },
    { "title": "Exact Song Title", "artist": "Exact Artist Name", "reason": "One sentence on why this fits the mood." }
  ]
}

Rules:
- Exactly 5 recommendations
- Real, existing songs only
- reason: one evocative sentence explaining why this song fits the mood
- Return ONLY the JSON object, nothing else`,
      },
    ],
  });

  const text = message.content[0]?.type === 'text' ? message.content[0].text.trim() : '';
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

    // 1. Ask Claude for 5 recommendations (always the source of truth)
    const claudeResult = await getClaudeRecommendations(mood.trim());

    if (
      !claudeResult?.recommendations ||
      !Array.isArray(claudeResult.recommendations) ||
      claudeResult.recommendations.length === 0
    ) {
      return res.status(500).json({ error: 'Claude returned an unexpected response format.' });
    }

    // 2. Build base tracks from Claude output — these are always returned
    const baseTracks = claudeResult.recommendations.slice(0, 5).map((rec) => ({
      title: rec.title ?? '',
      artist: rec.artist ?? '',
      reason: rec.reason ?? '',
      album: null,
      albumArt: null,
      spotifyUrl: null,
      previewUrl: null,
    }));

    // 3. Attempt optional Spotify enrichment — failures never block the response
    let spotifyEnriched = false;
    const hasSpotifyCredentials = !!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET);

    if (hasSpotifyCredentials) {
      try {
        console.log('Attempting Spotify enrichment…');
        const spotifyResults = await Promise.all(
          baseTracks.map((t) => searchSpotifyTrack(`${t.title} ${t.artist}`))
        );

        let anyEnriched = false;
        spotifyResults.forEach((result, i) => {
          if (result) {
            baseTracks[i].album = result.album;
            baseTracks[i].albumArt = result.albumArt;
            baseTracks[i].spotifyUrl = result.spotifyUrl;
            baseTracks[i].previewUrl = result.previewUrl;
            anyEnriched = true;
          }
        });

        spotifyEnriched = anyEnriched;
        console.log(`Spotify enrichment: ${spotifyResults.filter(Boolean).length}/${baseTracks.length} tracks enriched`);
      } catch (spotifyErr) {
        console.warn('Spotify enrichment failed (non-fatal):', spotifyErr?.message ?? spotifyErr);
      }
    } else {
      console.log('Spotify credentials not set — returning Claude recommendations only.');
    }

    res.json({
      mood_interpretation: claudeResult.mood_interpretation ?? mood,
      tracks: baseTracks,
      spotifyEnriched,
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
