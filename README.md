# Made for Your Moments: AI Music Recommender

Select a mood or describe how you're feeling, and the app turns that input into five personalized song recommendations.

Simple on the surface. More interesting under the hood.

Link to demo: https://drive.google.com/file/d/1feSEeXV1eNFvFVT9etYLlJSMNccJSd7I/view?usp=share_link

## Why I built this

I'm a Technical Program Manager with a deep interest in AI systems and AI governance. I've always believed that the best TPMs do more than coordinate execution, they understand the systems they're responsible for. How they work, where they break, what tradeoffs shape them, and how those tradeoffs affect the user experience.

This project came from that mindset. I wanted to build a small but complete AI system end to end: user input, model interpretation, structured output, external API fulfillment, and a polished interface on top.

## How it works

A user selects one of seven preset mood cards or enters their own mood or moment. Claude interprets that input and returns five structured track recommendations. The app then attempts to enrich those recommendations through Spotify, adding album art, track metadata, and preview links where available.

At a high level, the flow looks like this:

`mood input → Claude interprets intent and returns structured JSON → Spotify resolves tracks and metadata → UI renders final recommendations`

Claude is the source of truth. The five recommendations are always shown, regardless of whether Spotify enrichment succeeds. Spotify is treated as an optional enhancement layer, not a dependency.

The core pattern I wanted to validate was simple: Claude handles interpretation, not retrieval. Spotify handles fulfillment. That separation keeps the model scoped to the part it is best at, turning ambiguous human input into structured intent, while a deterministic API handles the rest.

## A note on Spotify previews

The playback infrastructure is fully implemented. Each track card includes a Preview button that plays a 30-second clip in-app when a preview URL is available.

In practice, Spotify has been deprecating `preview_url` across much of their catalogue, and their Web API now restricts audio features, including preview access, to apps with Spotify Premium API access. The logic is there and works when previews are returned. Whether a given track includes one depends on Spotify's current availability and the access tier of the registered developer app.

For full playback, a Spotify Premium account and OAuth-based user authentication would be required, which was outside the scope of this MVP.

## Decisions I made and why

**Free text over photo upload**  
I originally considered multimodal input, where a user could upload a photo and the model would infer the vibe. I cut it. Text is lower friction, works everywhere, and actually gives the model better signal. A photo of a desk says less than "I've been heads down all day and need a reset." Multimodal could be a useful v2, but it did not earn its complexity in the first version.

**Spotify Client Credentials instead of OAuth**  
I chose not to require login. That means no personalization based on listening history, but it keeps the experience frictionless and makes the demo immediately usable. For this project, that tradeoff was worth it. Adding OAuth would have introduced significantly more complexity without strengthening the part of the system I actually wanted to demonstrate.

**Claude as the fallback, not Spotify**  
Earlier versions of this app blocked the response if Spotify returned nothing. That was the wrong dependency model. Claude generates the recommendations. Spotify enriches them. If enrichment fails, the recommendations still ship. This matters for resilience and for being honest about what each part of the system is actually responsible for.

**Strict structured output from Claude**  
Claude is prompted to return JSON only, with an explicit schema and clear output boundaries. No prose wrapping, no loose formatting, no guesswork in parsing. This is one of those implementation details that seems small in demos and becomes critical the moment reliability matters.

**Sequential API calls over a more optimized pipeline**  
Claude runs first, Spotify second. There is room to reduce latency by parallelizing some of the fulfillment work once the track list is available, but I kept the flow sequential because it is easier to reason about, easier to debug, and sufficient for the current scope. If latency became a real UX issue, this would be one of the first places I'd optimize.

## Security and governance

This is an area I care about a lot, so I wanted to be intentional about it even in a side project.

**API key handling**  
All credentials stay server-side. Anthropic and Spotify keys are never exposed to the browser.

**Data privacy**  
User input is not persisted. What a user types stays in the session and disappears when the tab closes. For a product centered on mood and emotion, that matters.

**Model transparency**  
The app makes it clear that recommendations are AI-generated. Users should know what kind of system they are interacting with.

**Output boundaries**  
Claude is not used here as a general-purpose assistant. It is scoped to a single job: interpret user input and return structured music recommendations. Keeping the model tightly constrained is both a product decision and a responsible AI decision.

## What I'd change if this were a real product

**Latency**  
Right now, every request pays the full cost of two sequential API calls. In production, I'd cluster and cache common moods like "focus" or "hype" and reserve Claude for genuinely novel or ambiguous input.

**Cost**  
At any real volume, calling Claude for the same mood patterns over and over would be wasteful. I'd add a lightweight classifier or routing layer in front of the LLM so common inputs could map to cached recommendations, while Claude handles the long tail.

**Observability**  
There is currently no real measurement layer around recommendation quality or system health. In production, I'd want end-to-end tracing and metrics such as parse success rate, Spotify match rate, preview availability, click-through, and downstream engagement.

**UI/UX refinement**  
For an MVP, I prioritized getting the full loop working. In a production version, I'd spend more time refining loading states, playback behavior, recommendation scanning, and the transition from mood selection to listening.

## Stack

**Frontend:** React + Vite  
Fast to iterate on, minimal overhead, and a good fit for a project of this size.

**Styling:** Tailwind CSS  
Useful for moving quickly while keeping the UI consistent.

**LLM integration:** Anthropic JavaScript SDK  
Used server-side so the API key never touches the browser.

**Music data:** Spotify Web API with Client Credentials  
Used for track search and metadata enrichment. Preview playback is supported when Spotify returns a preview URL, which depends on catalogue availability and Spotify Premium API access.

**Persistence:** None  
State lives in the session. For this version, there was nothing worth persisting relative to the added infrastructure cost.

## Running it locally

You'll need an Anthropic API key. Spotify credentials are optional — the app returns Claude's recommendations regardless, and Spotify enrichment is attempted when credentials are present.

```bash
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY (required)
# Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET (optional)
npm install
npm start
```

Open `http://localhost:5173`.

## The 7 moods

Morning Brew, Focus Mode, Workout Hype, Late Night Drive, Motivation, Classical, and Healing.

Or skip them and type whatever is actually going on in your life.
