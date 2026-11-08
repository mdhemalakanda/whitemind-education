# Project requirements — Whitemind Education (status)

Sources: facebook.com/whitemind.education + youtube.com/@MdALatif-wt7yo (per client
brief). Frontend-only; no backend, no CMS, no purchases, no deployment.

| Requirement | Status |
|---|---|
| Deep Facebook research (profile, posts, photos, videos) | Done — research/FACEBOOK_RESEARCH.md (login-gated items recorded, not bypassed) |
| Deep YouTube research (channel, all videos, playlists, thumbnails verified) | Done — research/YOUTUBE_RESEARCH.md |
| ThemeForest research (8–12 templates, live previews, no purchase) | Done — research/THEMEFOREST_RESEARCH.md (Warren + MaxCoach + Everlead composite) |
| Iframely Facebook embed method studied and implemented | Done — research/IFRAMELY_METHOD.md; assets/js/iframely.js implements Iframely's actual generated output (FB SDK once + app id) with keyless plugin fallback |
| Pages: Home, About, Videos, Gallery, Resources, Contact | Done — 6 pages (empty/thin pages deliberately avoided) |
| Authentic teacher info only, attributed | Enforced — every claim carries a source line |
| External-only source images (no downloads, no base64, no re-hosting) | Enforced — qa.mjs fails on any local raster/video file |
| YouTube official embeds + original thumbnails + click-to-load | Done — assets/js/yt.js |
| FB videos via Iframely method, page-plugin avoided | Done — chain in iframely.js; page plugin (retired) banned by qa.mjs |
| Contact form honest (no fake send) | Done — validates, then explains demo status + hands off to phone/FB |
| SEO meta (titles, descriptions, OG) | Done — per page; canonical/og:url/sitemap intentionally pending a public URL |
| Responsive: 1920/1440/1366/1280/768/430/390/375/360 | Tested — fulltest covers all 9 widths per page |
| Accessibility: skip link, focus-visible, aria nav/drawer, semantic headings, alt text | Implemented |
| Browser testing with evidence | Done — qa/fulltest.json + qa/shots/*.png (54 rows, 0 failures; 6/6 interactions) |
| Local URL for review | http://localhost:8140 (scripts/serve.sh) |
| Deployment | NOT performed — requires explicit approval |
