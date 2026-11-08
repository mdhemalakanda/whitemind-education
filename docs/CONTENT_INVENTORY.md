# Content inventory & page mapping — Whitemind Education

Full research detail lives in `research/` (FACEBOOK_RESEARCH.md,
YOUTUBE_RESEARCH.md, THEMEFOREST_RESEARCH.md, IFRAMELY_METHOD.md — every item
carries a verification status and source URL). This file maps verified content to
website pages.

## Teacher identity (all verified, all attributed on-site)

| Fact | Source | Site placement |
|---|---|---|
| Name: Md. Abdul Latif (page flyer) / "Md. A. Latif" (YouTube) | FB flyer photo; YT channel | Hero h1, About, footer |
| B. Sc(Hon) M. Sc (Mathematics) | YT syllabus-video title, Jan 2021 | Index qualification card, About |
| Senior Faculty, Glenrich International School; former teacher, The Aga Khan School | FB Study Hub flyer, May 2025 | Hero chip, About, page-hero lede |
| 20+ years of teaching experience | FB Cambridge Math poster, Jun 2025 | Index stats bar (*), About |
| CAIE 9709 P3 focus; IGCSE 0580/0606; 9709 P1/P2 + Mechanics + Statistics | YT content; FB flyers | Subjects sections, Resources |
| Study Hub coaching (Uttara) — Grade 9–10 Cambridge, Sun/Tue/Thu; assessments, booklets, past-paper practice | FB schedule flyer, Jun 2026 | Subjects card, About, Contact |
| Phone 01715-339592 | FB page contact info | Contact (tel link) |
| Location Dhaka, Bangladesh | FB page | Hero chip, Contact |
| NOT published: address, email, further degrees, achievements | verified absences | nowhere on site |

## Facebook → pages

| Item | Page | Implementation |
|---|---|---|
| Profile photo (960px, verified 200) | index + about hero portrait; gallery | hotlinked `<img>`, monogram fallback |
| Cover photo — group gathering | gallery | hotlinked, lightbox |
| 9 page photos (Study Hub flyers, session poster, schedule, IGCSE/AL flyers, Oct-2026 post attachment) | gallery | masonry + GLightbox on original URLs |
| 3 public reels (2020–2021) | index + videos | poster-less branded card → Iframely-documented FB SDK embed → plugin iframe fallback |
| 1 public post (Oct 2026, share link + flyer photo) | resources | link card to original permalink |

## YouTube → pages

| Item | Page | Implementation |
|---|---|---|
| Channel identity (124 subs, 13 videos, 3,681 views, avatar) | index band, videos band | hotlinked s160 avatar; subscribe button → `sub_confirmation=1` |
| 13 lectures (titles/dates/durations/views from RSS + page) | videos grid, index featured + latest | click-to-load official `youtube.com/embed` iframes, original thumbnails |
| 4 playlists | videos playlists strip, resources route, footer | external links |
| Syllabus overview (most viewed) | index "Start here", resources step 0 | click-to-load card |

## External reference

- CAIE 9709 official page (cambridgeinternational.org, verified 200) → resources (labelled external).

## Content that could NOT be accessed (recorded, not bypassed)

- FB post history beyond 1 public post; photo permalinks; Photos-tab collection;
  About details; comments; follower list — all login-gated.
- Reel thumbnail URLs return 403 outside Facebook — reels render with branded
  placeholder cards and play via the official embed.
- Signed FB image URLs expire (~3 days after capture) — regenerate via the capture
  steps in research/FACEBOOK_RESEARCH.md; tiles degrade gracefully meanwhile.
