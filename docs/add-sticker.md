# How to Add a New Sticker

## 1. Insert the sticker in the database

Run this SQL on the Supabase project (`qhwmkifziclnegztuxls`), either via the SQL Editor in the dashboard or via the MCP `execute_sql` tool:

```sql
INSERT INTO stickers (name, location, tier, color, icon, points, image_url)
VALUES (
  'sticker name',       -- lowercase display name (e.g. 'montmartre queen')
  'location label',     -- where it's found (e.g. 'montmartre')
  'common',             -- tier: 'common' (30pts), 'rare' (80pts), or 'ultra' (200pts)
  '#ff2e93',            -- hex color for card background (see palette below)
  '♡',                  -- emoji/symbol fallback (shown if no image)
  30,                   -- points awarded (match tier convention)
  NULL                  -- image URL (see "Adding an image" below), NULL = show icon instead
);
```

### Tier conventions

| Tier | Typical Points | Rarity |
|---|---|---|
| `common` | 30 | Easy to find |
| `rare` | 80 | Limited locations |
| `ultra` | 200 | Very hard to find, holographic card effect |

### Color palette

Use one of these to stay consistent with the design:

| Color | Hex | Card appearance |
|---|---|---|
| Pink | `#ff2e93` | Hot pink solid |
| Lilac | `#c9a8ff` | Pastel purple |
| Yellow | `#ffe600` | Bright yellow |
| Mint | `#6effc4` | Fresh green |

For **rare** stickers, the color doesn't matter much since they get a gradient overlay (lilac → pink).
For **ultra** stickers, the color is ignored — they always get the holographic animated background.

### Icon suggestions

Any single emoji or symbol works: `♡` `★` `✦` `✿` `♪` `☽` `♛` `⚡` `🔥`

## 2. Adding an image (optional)

Sticker images are stored in the **Supabase Storage** bucket `sticker-images` (public).

### Upload via Supabase Dashboard

1. Go to **Storage** in the Supabase dashboard
2. Open the `sticker-images` bucket
3. Upload your PNG (recommended: square, 400x400px or larger)
4. Name it something descriptive (e.g. `montmartre-queen.png`)
5. The public URL will be:
   ```
   https://qhwmkifziclnegztuxls.supabase.co/storage/v1/object/public/sticker-images/montmartre-queen.png
   ```

### Then update the sticker

```sql
UPDATE stickers
SET image_url = 'https://qhwmkifziclnegztuxls.supabase.co/storage/v1/object/public/sticker-images/montmartre-queen.png'
WHERE name = 'montmartre queen';
```

### Or insert with image directly

```sql
INSERT INTO stickers (name, location, tier, color, icon, points, image_url)
VALUES (
  'montmartre queen', 'montmartre', 'common', '#ff2e93', '♛', 30,
  'https://qhwmkifziclnegztuxls.supabase.co/storage/v1/object/public/sticker-images/montmartre-queen.png'
);
```

> If `image_url` is NULL, the card displays the `icon` emoji as fallback.

## 3. Get the sticker UUID

After inserting, retrieve the generated UUID:

```sql
SELECT id, name FROM stickers WHERE name = 'montmartre queen';
```

Example result: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

## 3. Generate the QR code

The QR code must encode **only the UUID** as plain text:

```
a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

You can generate QR codes with any tool:
- **CLI**: `qrencode -o sticker.png "a1b2c3d4-e5f6-7890-abcd-ef1234567890"`
- **Online**: any QR code generator, paste the UUID as text content
- **Batch**: use a script to generate QR codes for multiple stickers at once

## 4. Print and place the sticker

Print the QR code on a physical sticker and place it at the location specified in the `location` field.

## Example: Adding a full batch

```sql
INSERT INTO stickers (name, location, tier, color, icon, points) VALUES
  ('montmartre queen', 'montmartre', 'common', '#ff2e93', '♛', 30),
  ('seine sunset', 'pont des arts', 'rare', '#ffe600', '☽', 80),
  ('opera phantom', 'opéra garnier', 'ultra', '#c9a8ff', '★', 200);
```

Then retrieve all new IDs:

```sql
SELECT id, name FROM stickers WHERE name IN ('montmartre queen', 'seine sunset', 'opera phantom');
```

Generate a QR code for each UUID and print them.

## Notes

- A sticker can only be scanned **once per user** (enforced by UNIQUE constraint on `user_scans`)
- Stickers are **publicly readable** (no auth needed to fetch the catalog)
- There is no admin UI yet — sticker management is done via SQL
- The `/250` counter on cards is cosmetic for now (hardcoded in `Photocard.tsx`)
