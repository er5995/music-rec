# Music Vibe Agent

Select a mood or type how you're feeling. You get a playlist and something to keep you going.

That's it. But the interesting part is what's happening under the hood.

---

## Why I built this

I'm a Technical Program Manager with a deep interest in AI systems and AI governance. I've always believed that the best TPMs don't just coordinate work, they actually understand the systems they're responsible for. System design, tradeoffs, what breaks and why. And what better way to understand an AI system than to build one yourself?

This is what a weekend of curiosity turned into.

---

## How it works

User types a mood or picks one of 8 preset cards, Claude interprets it and returns a motivation message plus 5 track recommendations as structured JSON, Spotify fetches the real track data (album art, links), results render.

Two API calls, sequential, about 2 seconds end to end.


mood input (free text or card)
    |
Claude -- interprets mood, returns { message, tracks[] }
    |
Spotify -- searches each track, returns metadata
    |
UI -- motivation message + 5 track cards with album art


Claude isn't doing retrieval here. It's doing interpretation and structured reasoning. The Spotify call is just fulfillment. That's the pattern I wanted to validate.

---

## Decisions I made and why

1) Free text over photo upload:
I originally planned multimodal input where you upload a photo of your environment and the AI infers the vibe. Cut it. Text is lower friction, works everywhere, and actually gives Claude better signal. A photo of a desk tells you less than "I've been heads down on this problem all day and need a reset." Multimodal is a v2 consideration if there's a clear user need.

2) Client Credentials for Spotify, not OAuth:
No user login. That removes personalization from listening history but keeps the demo frictionless. The tradeoff was worth it for a portfolio project. Adding OAuth would triple the complexity for a feature that doesn't demonstrate what I'm trying to demonstrate.

3) Strict JSON output from Claude:
Claude is prompted to return only JSON, no prose wrapping. Explicit format, explicit failure. This is the part most people skip in demos and then wonder why their parsing breaks in production. The system prompt includes output schema, genre diversity instructions, and a fallback instruction for when the mood is ambiguous.

4) Sequential API calls, not parallel:
Claude runs first, Spotify second. Could parallelize Spotify lookups once Claude returns the track list, that would shave around 400ms. Kept it sequential for now because the logic is easier to trace and debug. Worth revisiting if latency becomes a UX issue.

---

## Security and governance

This is an area I care about a lot, so I wanted to be intentional about it even in a side project.

1) API key handling:
All credentials stay server-side. The Anthropic and Spotify keys are never exposed to the browser. This is table stakes for any production AI app but it's worth stating explicitly because a lot of demos get this wrong.

2) Data privacy:
No user input is stored or logged. What you type stays in the session and disappears when you close the tab. For an app that's asking how you're feeling, that matters.

3) Model transparency:
The app makes it clear that recommendations are AI-generated. Users aren't meant to think this is a human curator or a Spotify algorithm. Knowing what kind of system you're interacting with is a basic expectation I think AI products should meet.

4) Output boundaries:
Claude is prompted with explicit instructions on what it should and shouldn't do. It's not a general assistant in this context, it's a scoped tool with a defined job. Keeping the model on task is both a product decision and a responsible AI decision.

---

## What I'd change if this were a real product

1) Latency:
Two sequential calls with no caching means every request pays full cost. Common moods like "focus" or "hype" could be clustered and cached. Claude only needs to run for genuinely novel input.

2) Cost:
At any real volume, calling Claude per request for a mood that's been seen a thousand times is wasteful. A lightweight classifier in front of Claude would route common inputs to cached responses and reserve the LLM for the long tail.

3) Observability:
Right now there's no way to know if Claude's output quality is degrading over time. In production I'd want to trace each request end to end and track things like: did the JSON parse cleanly, did Spotify find the track, did the user actually engage with the result.

---

## Stack

React and Vite for the frontend, fast to set up, easy to iterate on, no overhead for a project this size. Tailwind keeps the styling consistent without writing a lot of custom CSS.

The Anthropic JS SDK handles the Claude integration. I'm using it server-side to keep the API key out of the browser. Anything that touches credentials shouldn't be client-facing.

Spotify Web API with Client Credentials flow for track data. This gives access to search and metadata without requiring users to log in, which was the right call for a demo that needs to be frictionless.

No database. State lives in the session. For a v1 this is fine. There's nothing to persist that's worth the infrastructure cost.

```bash
git clone <repo>
cd vibe-agent
npm install
cp .env.example .env
npm run dev
```

You'll need a free Spotify developer account and an Anthropic API key.

---

## The 8 moods

Late night drive, morning coffee, deep focus, rainy day in, workout hype, nostalgic, motivation, healing.

Or skip them and just type whatever's actually going on in your life.

---

*Eman R. - Technical Program Manager*
