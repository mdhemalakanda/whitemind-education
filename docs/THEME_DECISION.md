# Theme decision — Whitemind Education

Research: `research/THEMEFOREST_RESEARCH.md` (12 templates evaluated, 6 live previews
visited, nothing purchased).

## Selected reference: **Warren** (Mikado-Themes) — with MaxCoach mechanics and
Everlead typography direction

Why Warren fits this teacher:

1. It is built around **one named person** — portrait-led hero, personal program cards,
   values grid, episodic "Live@" session block — exactly the shape of a personal teacher
   brand with a recorded lecture series.
2. Its section order (hero → trust stats → about/values → programs → live video →
   articles → contact) reads as personal-brand storytelling, not an institution site
   (explicitly required by the brief).
3. **EB Garamond + Mulish** delivers the scholarly-yet-modern feel appropriate to a
   mathematics teacher.

Elements borrowed (implemented originally, no licensed code):

- Split hero: eyebrow chips, oversized serif name, mission line, dual CTAs, social row;
  portrait card with soft amber blob and floating stat chips (13 lectures / 3,681 views /
  124 subscribers).
- Trust-stat bar with animated counters.
- Video cards: 16:9 hotlinked thumbnails, centered amber play button, duration badge,
  category chip, hover lift + zoom — MaxCoach's proven video-card mechanics, wired to
  click-to-load official embeds.
- Marquee strip as a section divider ("CAIE A Level 9709 · Pure Mathematics 3 · …").
- Qualification/quote cards with source attribution lines (an honesty extension of
  Warren's testimonial styling).
- Palette: warm ivory `#F7F3EB`, ink navy `#0F1D33`, single amber accent `#C2913B`,
  thin editorial rules.

Original implementation notes: no Bootstrap dependency (hand-rolled design system in
`assets/css/style.css`, ~570 lines); AOS + GLightbox via CDN; no jQuery needed;
vanilla JS modules (`main.js`, `yt.js`, `iframely.js`).
