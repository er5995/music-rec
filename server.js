import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure multer for memory storage (photo uploads)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.use(cors());
app.use(express.json());

// Fetch iTunes artwork for a given artist + title
async function fetchItunesArtwork(artist, title) {
  try {
    const query = encodeURIComponent(`${artist} ${title}`);
    const url = `https://itunes.apple.com/search?term=${query}&entity=song&limit=1&country=US`;
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return null;
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const artwork = data.results[0].artworkUrl100;
      if (artwork) {
        // Upgrade from 100x100 to 600x600
        return artwork.replace('100x100bb', '600x600bb');
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Parse JSON from Claude's response (handles markdown code blocks)
function parseClaudeJSON(text) {
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();
  return JSON.parse(cleaned);
}

// POST /api/recommend
app.post('/api/recommend', upload.single('photo'), async (req, res) => {
  try {
    const { mood, moodDescription, customText } = req.body;
    const photo = req.file;

    let claudeResponse;

    if (customText) {
      // Free-text description of how the user feels
      const message = await anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `You are a thoughtful music curator with deep knowledge of existing songs across all genres and eras.

Someone describes their current feeling in their own words: "${customText}"

Interpret this feeling with empathy and depth. Provide a personalized music experience that perfectly honors what they're going through.

Respond in this EXACT JSON format with no other text:
{
  "detectedMood": "3-5 word poetic distillation of their feeling",
  "message": "A poetic, personal 2-3 sentence message that truly sees and honors this feeling. Make it evocative, warm, and beautiful — like a Miyazaki film finding words for an emotion. Speak directly to them.",
  "tracks": [
    {
      "title": "exact song title",
      "artist": "exact artist name",
      "album": "exact album name",
      "reason": "one evocative sentence on why this song fits perfectly"
    }
  ]
}

Recommend exactly 8 real, existing songs. Mix eras, genres, and cultures — all capturing the same emotional essence. Be specific and thoughtful, not generic.`,
          },
        ],
      });

      claudeResponse = message.content[0].type === 'text' ? message.content[0].text : '';
    } else if (photo) {
      // Vision-based recommendation from uploaded photo
      const base64Image = photo.buffer.toString('base64');
      const mediaType = photo.mimetype;

      const message = await anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: `Look at this photo carefully. What mood, feeling, or moment does it capture?

Provide a music experience perfectly matched to the atmosphere and emotion in this image.

Respond in this EXACT JSON format with no other text:
{
  "detectedMood": "3-5 word poetic description of the mood you detect",
  "message": "A poetic, personal 2-3 sentence message that honors what this photo feels like. Make it evocative and beautiful — speak to the feeling the image evokes.",
  "tracks": [
    {
      "title": "exact song title",
      "artist": "exact artist name",
      "album": "exact album name",
      "reason": "one evocative sentence on why this song fits perfectly"
    }
  ]
}

Recommend exactly 8 real, existing songs that match the mood of this photo.`,
              },
            ],
          },
        ],
      });

      claudeResponse = message.content[0].type === 'text' ? message.content[0].text : '';
    } else if (mood) {
      // Text-based recommendation from selected mood
      const message = await anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `You are a thoughtful music curator with deep knowledge of existing songs across all genres and eras.

Current mood: "${mood}"
Vibe: ${moodDescription || ''}

Provide a personalized music experience for someone feeling this exact way right now.

Respond in this EXACT JSON format with no other text:
{
  "message": "A poetic, personal 2-3 sentence message that honors this feeling. Make it evocative, warm, and beautiful — like a Miyazaki film finding words for an emotion. Speak directly to the listener.",
  "tracks": [
    {
      "title": "exact song title",
      "artist": "exact artist name",
      "album": "exact album name",
      "reason": "one evocative sentence on why this song fits perfectly"
    }
  ]
}

Recommend exactly 8 real, existing songs. Mix eras, genres, and cultures — all capturing the same emotional essence. Be specific and thoughtful, not generic.`,
          },
        ],
      });

      claudeResponse = message.content[0].type === 'text' ? message.content[0].text : '';
    } else {
      return res.status(400).json({ error: 'A mood, custom text, or photo is required' });
    }

    // Parse Claude's JSON response
    const parsed = parseClaudeJSON(claudeResponse);

    // Fetch artwork for each track in parallel
    const tracksWithArtwork = await Promise.all(
      (parsed.tracks || []).map(async (track) => {
        const artworkUrl = await fetchItunesArtwork(track.artist, track.title);
        return {
          title: track.title || '',
          artist: track.artist || '',
          album: track.album || '',
          reason: track.reason || '',
          artworkUrl,
        };
      })
    );

    const result = {
      message: parsed.message || '',
      tracks: tracksWithArtwork,
      ...(parsed.detectedMood ? { detectedMood: parsed.detectedMood } : {}),
    };

    res.json(result);
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to generate recommendations',
    });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🎵 Vibe & Sounds server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
