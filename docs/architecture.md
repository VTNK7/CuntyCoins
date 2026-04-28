# CuntyCoins — Architecture

## Overview

CuntyCoins is a mobile-first single-page React app where users scan QR codes on physical stickers to collect them and earn points ("CuntyCoins"). The app has one main screen showing the user's collection and a floating button to scan new stickers.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | TailwindCSS v4 (custom theme) |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| QR Scanner | html5-qrcode |
| Hosting | Netlify (frontend) + Supabase (backend) |

## Project Structure

```
src/
├── main.tsx                 # Entry point, renders App
├── index.css                # Tailwind imports + design tokens + animations
├── App.tsx                  # Auth gate: shows AuthScreen or HomeScreen
├── lib/
│   ├── supabase.ts          # Supabase client (reads VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY)
│   └── types.ts             # TypeScript types: Sticker, UserScan, Tier
└── components/
    ├── AuthScreen.tsx        # Magic link email login form
    ├── HomeScreen.tsx        # Main page: balance + collection grid + scan flow
    ├── Photocard.tsx         # Sticker card component (adapts to tier: common/rare/ultra)
    ├── LockedCard.tsx        # Placeholder "?" card for undiscovered stickers
    ├── StarShape.tsx         # Decorative SVG star
    ├── Confetti.tsx          # Confetti burst animation (post-scan celebration)
    ├── ScanScreen.tsx        # Camera QR scanner overlay (uses html5-qrcode)
    └── ScanSuccess.tsx       # Post-scan success overlay with card + confetti
```

## Database Schema

### `stickers` table
Public catalog of all stickers available in the game.

| Column | Type | Description |
|---|---|---|
| id | UUID (PK) | Auto-generated |
| name | TEXT | Sticker display name (e.g. "soho pink wall") |
| location | TEXT | Where the sticker is (e.g. "le marais") |
| tier | TEXT | `common`, `rare`, or `ultra` |
| color | TEXT | Hex color for card background (e.g. "#ff2e93") |
| icon | TEXT | Emoji/symbol displayed on card (e.g. "♡") |
| points | INTEGER | CuntyCoins earned when scanned |
| created_at | TIMESTAMPTZ | Auto-set |

### `user_scans` table
Tracks which stickers each user has scanned. One scan per user per sticker.

| Column | Type | Description |
|---|---|---|
| id | UUID (PK) | Auto-generated |
| user_id | UUID (FK → auth.users) | The user who scanned |
| sticker_id | UUID (FK → stickers) | The sticker scanned |
| scanned_at | TIMESTAMPTZ | When it was scanned |
| | UNIQUE(user_id, sticker_id) | Prevents duplicate scans |

### Row Level Security (RLS)

- **stickers**: publicly readable by everyone (SELECT)
- **user_scans**: users can only SELECT and INSERT their own rows (`auth.uid() = user_id`)

## Authentication Flow

1. User enters email on `AuthScreen`
2. Supabase sends a magic link to that email
3. User clicks the link → redirected back to the app with a valid session
4. `App.tsx` detects the session via `onAuthStateChange` and shows `HomeScreen`

## Scan Flow

1. User taps "SCAN A STICKER" floating button
2. `ScanScreen` opens with camera via `html5-qrcode`
3. QR code is decoded → contains the sticker's UUID
4. `HomeScreen.handleScan()`:
   - Checks if the user already scanned this sticker (prevents duplicates)
   - Fetches the sticker info from `stickers` table
   - Inserts a row into `user_scans`
   - Shows `ScanSuccess` overlay with card flip animation + confetti
5. Collection and coin total are refreshed

## QR Code Format

Each physical sticker has a QR code containing **the UUID of the sticker** from the `stickers` table. Example:

```
ead1b200-5c31-4eae-8617-e8cd779e828b
```

That's it — just the raw UUID string.

## Design System

### Fonts
- **Bagel Fat One** (`font-display`): titles, buttons, card names
- **JetBrains Mono** (`font-mono`): labels, badges, tier tags
- **Caveat** (`font-hand`): handwriting/casual text
- **Space Grotesk** (`font-body`): body text

### Colors
| Token | Value | Usage |
|---|---|---|
| `--color-pink` | #ff2e93 | Primary accent, CTA buttons |
| `--color-pink-deep` | #d4006e | Section headers |
| `--color-lilac` | #c9a8ff | Rare cards, avatar |
| `--color-yellow` | #ffe600 | Stars, highlights |
| `--color-mint` | #6effc4 | Success badges |
| `--color-paper` | #fff8f0 | Background |
| `--color-ink` | #14110f | Text, borders, shadows |

### Card Tiers
- **Common**: solid color background, dashed inner border
- **Rare**: gradient background (lilac → pink)
- **Ultra**: animated holographic background + shimmer overlay

## Environment Variables

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

## Supabase Project

- **Project name**: CuntyCoins
- **Project ID**: `qhwmkifziclnegztuxls`
- **Region**: eu-west-2
- **URL**: https://qhwmkifziclnegztuxls.supabase.co

## Deployment

- **Frontend**: Netlify — config in `netlify.toml` (build: `npm run build`, publish: `dist`, SPA redirect)
- **Backend**: Supabase hosted PostgreSQL
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Netlify environment variables
