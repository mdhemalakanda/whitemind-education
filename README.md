# Whitemind Education — personal teacher website demo

A premium, frontend-only personal brand website for **Md. Abdul Latif** (published as
"Md. A. Latif" on YouTube) — A Level Mathematics teacher (CAIE 9709, Pure Mathematics 3),
Senior Faculty at Glenrich International School. Content is sourced entirely from his two
official channels:

- Facebook page: https://www.facebook.com/whitemind.education/ (current display name
  **"Mathematics Learning Centre _MLC"** — same page, same address)
- YouTube channel: https://www.youtube.com/@MdALatif-wt7yo (13 recorded P3 lectures)

## Run it

```bash
node scripts/build.mjs      # compose site/ from templates/ + src/pages/
node scripts/qa.mjs         # links, external-host whitelist, media policy, embed policy
node scripts/fulltest.mjs   # Playwright: 6 pages × 9 viewports + 6 interaction tests
./scripts/serve.sh          # http://localhost:8140
```

(Playwright resolves through a symlink to `../piles-care/scripts/node_modules`.)

## Pages (6)

`index` · `about` · `videos` · `gallery` · `resources` · `contact` — built from
`templates/` + `src/pages/` fragments; English UI; Bangla/English source text kept as
published.

## Media policy (hard rules, enforced by qa.mjs)

1. **No source media is ever downloaded.** Facebook photos are hotlinked from their
   original `scontent*.fbcdn.net` URLs; YouTube thumbnails from `img.youtube.com`.
   qa.mjs fails the build if any raster/video file appears under `assets/`.
2. **Facebook videos** play through the Iframely-documented chain
   (`assets/js/iframely.js`, per research/IFRAMELY_METHOD.md): Iframely-generated
   FB SDK markup (sdk.js loaded once, app id `887156172104257`) → official
   `facebook.com/plugins/video.php|post.php` iframe → source-link fallback.
   Meta retired automated **page** embeds (2025-11-03), so only individual
   videos/posts are embedded.
3. **YouTube videos** use the official `youtube.com/embed/<id>` iframe, loaded
   click-to-poster (`assets/js/yt.js`) with the original thumbnails; a per-video
   verified poster URL is passed via `data-yt-poster` (hqdefault for the one video
   whose maxresdefault does not exist).
4. Signed Facebook share URLs expire — image tiles degrade to a graceful placeholder
   and every item keeps a source link. Refresh hotlinks by re-running the capture
   step in `research/` (see FACEBOOK_RESEARCH.md).

## Honest-content rules

Only facts published by the two official channels appear on the site, each attributed:
credentials ("B. Sc(Hon) M. Sc (Mathematics)" — syllabus video title; Glenrich /
Aga Khan / 20+ years — the page's own flyers), lecture stats (YouTube RSS), page
identity (Facebook page data). The contact form is frontend-only and says so; it
hands off to the verified phone number and Facebook page.

## Key docs

- `research/FACEBOOK_RESEARCH.md` — full page inventory + limitations
- `research/YOUTUBE_RESEARCH.md` — channel + all 13 videos, thumbnail verification
- `research/THEMEFOREST_RESEARCH.md` — 12 templates researched, design decision
- `research/IFRAMELY_METHOD.md` — embed method, tests, code patterns
- `docs/CONTENT_INVENTORY.md` — content-to-page mapping
- `docs/THEME_DECISION.md` — design rationale
