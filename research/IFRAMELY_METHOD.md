# Iframely × Facebook embed method — verified research

Research date: **2026-11-08** (all live tests run today against production endpoints).
Mandated reference: <https://iframely.com/domains/facebook> — read in full, plus the linked developer docs.
Sibling reference project: `littleheavandaycare` (built with the same "Iframely-only media" rules).

---

## 1. TL;DR — the confirmed current method

1. **Iframely routes Facebook to Facebook's own native plugin/SDK markup — not to Iframely-hosted iframes.**
   Iframely's own Facebook embed generator (<https://iframely.com/domains/facebook>, read 2026-11-08) emits exactly this code for a video:

   ```html
   <div id="fb-root"></div>
   <script async="1" defer="1" crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v26.0"></script><div class="fb-video" data-href="https://www.facebook.com/watch/?v=835321340249928" data-app-id="887156172104257"></div>
   ```

   ("By copying this embed code, you agree to our Terms of Use.")
   So the current documented pattern is: one `#fb-root` div + **one** `connect.facebook.net` `sdk.js` load (v26.0) + one `<div class="fb-video" data-href="…">` per video. Posts use the same SDK with `<div class="fb-post" data-href="…">`. The `data-app-id` shown is Iframely's own public app id (887156172104257) from their generator.
   Multiple embeds on one page: the SDK loads once; each additional post/video is just another `fb-post`/`fb-video` div (for dynamically inserted widgets call `FB.XFBML.parse()`). Iframely's parallel rule for their own `embed.js`: "Multiple Iframely embed.js script tags on your page do not put a drag on user's bandwidth… Browsers will load it only once" (<https://iframely.com/docs/omit-script>).

2. **Iframely-hosted iframes are an opt-in wrapper, and they require a paid/starter API key.**
   `&iframe=1` (or `&omit_script=1`) makes Iframely wrap scripted widgets (explicitly "Twitter, Facebook, Instagram, TikToks and others" — <https://docs>: `/docs/parameters#omit_script=1`, `/docs/iframes`) into `cdn/iframe.ly`-served iframes. The JSON API itself is key-walled: `url` **and** `api_key` are documented as **required** (`/docs/iframely-api`, `/docs/oembed-api`); client-side use swaps `api_key` for the MD5-hash `key` param (`/docs/allow-origins`).

3. **Facebook retired automated Page embeds on November 3, 2025** — verbatim notice on <https://iframely.com/domains/facebook>:
   > "Facebook has retired automated page embeds on November 3, 2025."

   Do NOT plan on embedding `facebook.com/whitemind.education` (the Page itself). Embed **individual videos/posts** only.

---

## 2. Sources read (2026-11-08)

| Page | Notes |
|---|---|
| https://iframely.com/domains/facebook | FB SDK sample code; page-embed retirement notice |
| https://iframely.com/docs (+ `/docs.md`) | doc index; API flow |
| /docs/iframely-api, /docs/oembed-api | endpoints `iframe.ly/api/iframely`, `iframe.ly/api/oembed`; `url`+`api_key` required; CDN variants `iframely.net/api/…` for client-side |
| /docs/embedjs | `<script async src="https://iframely.net/embed.js?key={MD5_KEY}">`; HTML template `div.iframely-embed > div.iframely-responsive > a[data-iframely-url]`; `iframely.load()`; failed-embed handling (`&parent=`, `cancel` event, `&cancel=0`); **self-host: github.com/itteco/embedjs** |
| /docs/iframes | hosted-iframe helpers: why/when; `&iframe=1` activates; billing: "iFrames are part of APIs for billing purposes" |
| /docs/parameters | `iframe=1/0`, `omit_script=1` (→ Iframely iFrame for FB etc.), `lazy=1`, `card=1`, `click_to_play=1` |
| /docs/omit-script | embed.js required once even with omit_script; self-host note |
| /docs/lazy-load | responsive players lazy-load with thumbnail placeholder; viewport-triggered swap |
| /docs/allow-origins | private `api_key` (server) vs public MD5 `key` (client) |
| /docs/result-codes | `api.key.required` 403; `origin.http.401/403` → "Content is private or requires a login"; `origin.http.404` → gone |
| https://iframely.com/pricing | **Starter $0/mo — 2,000 hits/mo included**; overage $0.4/100 hits; credit card only needed "for usage auto-scaling" |
| https://github.com/itteco/iframely | self-host option: "This engine has powered Iframely in production since 2013. Use it if you'd like to self-host rather than rely on the cloud version." MIT license, active (pushed 2026-11-05), default branch `dev` |
| https://github.com/itteco/embedjs | self-hostable embed.js |

---

## 3. Cost / key requirements (tested live, 2026-11-08)

| Request (keyless) | Result |
|---|---|
| `https://cdn.iframe.ly/api/iframely?url=…` | **HTTP 404** `api.subdomain.invalid` — "cdn is not a valid subdomain" (the `cdn.` host from the task brief is no longer the API host) |
| `https://iframe.ly/api/iframely?url=https%3A%2F%2Fwww.facebook.com%2Fwhitemind.education` | **HTTP 403** `api.key.required` — "Valid api_key is required to access API." |
| `https://iframely.net/api/iframely?url=…` (client-side CDN host) | **HTTP 403** `api.key.required` |
| `https://iframe.ly/api/oembed?url=…` / `iframely.com/oembed?url=…` | **HTTP 404** HTML dashboard page — no JSON without key (confirms earlier sibling finding) |
| `https://iframe.ly/api/thumbnail?url=…` | **HTTP 403** `api.key.required` |
| `https://iframe.ly/api/iframe?url=<YouTube>&app=1` (hosted-iframe widget endpoint that embed.js calls) | **HTTP 200** but the returned hosted-iframe HTML is a *cancel card*: `"cancel":true`, a bare link back to the source — **no player, even for YouTube** |
| same for `<facebook.com/watch/?v=835321340249928>` | **HTTP 200** cancel card, `"cancel":true` |

Conclusions:

- **There is no documented free key.** The JSON API and real hosted iframes all require a key. The only $0 path is the **Starter plan** ($0/mo, 2,000 hits/mo included, pay-as-you-go overage) which requires signing up at iframely.com to get keys (nothing was signed up for here, per rules). Client-facing pages then use the MD5 `key` (public key) with origin allow-listing.
- **Keyless `embed.js` cannot render media**: its backend call `GET /api/iframe` returns a 200 *cancel widget* without a key, so embed.js hides/cancels the anchor. This matches and extends the sibling project's finding (they observed 404/403 for FB/IG; today the widget endpoint 200s but yields a cancel card for *any* provider, including YouTube).
- **Self-host** (github.com/itteco/iframely, MIT) exists — but it does **not** bypass Facebook: FB oEmbed requires a Meta app token (`graph.facebook.com/v27.0/oembed_video`, verified earlier by the sibling project), so self-hosting only removes Iframely's fee, not Meta's key requirement.
- **Keyless official Facebook plugin iframes** remain free and working (see §5).

---

## 4. Sibling project findings (littleheavandaycare)

- `site/assets/js/iframely.js` (and copy at `assets/js/iframely.js`) — header comment, quoted:
  > "LITTLE HEAVEN — social embed integration (no API key). Strategy (verified 2026-11-08):
  > 1. Iframely embed.js (https://iframely.net/embed.js) is tried first, per project spec — data-iframely-url = ORIGINAL post URL. NOTE: Iframely's free keyless service cannot resolve facebook.com / instagram.com media (their API 404s without an api_key), so step 2 handles the real rendering:
  > 2. OFFICIAL platform embeds (keyless, platform-approved): Facebook: plugins/video.php (reels/videos) or plugins/post.php (posts) …
  > 3. Source-link fallback card as last resort."

- **API key status: none exists.** `var API_KEY = null;` in both copies. A project-wide grep for `api[_-]?key` finds only comments/docs; no literal key string anywhere in either project.
- Facebook embeds there use **official FB plugin iframes** (`facebook.com/plugins/video.php?href=…&show_text=false&width=560`), NOT the FB SDK script and NOT Iframely-hosted iframes — chosen because it is keyless and platform-approved.
- Prior verification file `docs/research-sources/iframely-checks.txt` (2026-11-08) matches today's results exactly (embed.js HTTP 200; `cdn.iframe.ly` 404; `iframely.com/oembed` without key → dashboard HTML; FB exposes `graph.facebook.com/v27.0/oembed_video` but it "requires app token — not usable without key").

## 5. Whitemind project current state

- `whitemind/assets/js/iframely.js` **already exists** (verified 2026-11-08 header): same three-step chain as Little Heaven (embed.js attempt → `plugins/video.php` for videos/reels & `plugins/post.php` for posts/photos → source-link card), exposing `window.WM_FB` with an allow-list for `facebook.com/whitemind.education/(videos|posts|…)`, `watch/?v=…`, `reel/…`. `var API_KEY = null;` — no key locally, none in the project docs.
- It is **not wired into any page yet** (`whitemind/site/` is currently empty; `assets/data/videos.js` contains only verified YouTube data for the teacher's channel — no Facebook URLs recorded yet). The site's primary media is YouTube (see `research/YOUTUBE_RESEARCH.md`); Facebook embeds apply when the client supplies specific FB video/post links.

---

## 6. Live test log (2026-11-08, curl)

| # | Test | HTTP | Body evidence |
|---|---|---|---|
| 1 | `https://www.facebook.com/whitemind.education` (page, browser UA) | **400** | FB rejects non-browser fetches → page URL itself is not a scriptable embed target |
| 2 | Iframely generator: `https://iframely.com/domains/facebook?url=https%3A%2F%2Fwww.facebook.com%2Fwhitemind.education` | **200** | No `fb-video`/`fb-post`/`fb-page` markup emitted (page embeds retired — §1.3) |
| 3 | `https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fwhitemind.education&tabs=timeline` | **200** | Returns a `PagePluginTabContainer.react` shell; renderability unverified (no browser here) and deprecated per §1.3 — do not use |
| 4 | `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F%3Fv%3D835321340249928&show_text=false&width=560` (public Hobbiton video; no whitemind video URL is anonymously listable — mbasic/`/videos` return 400 to scripts) | **200** | 220 KB; contains the real player bootstrap (`VideoPlayerHTML5Api`, `VideoPlayerController`, 23 refs to the video id), **zero** login-wall phrases → keyless plugin iframe plays public videos |
| 5 | Keyless JSON API / thumbnail / widget endpoint matrix | see §3 | — |

No videos were downloaded; response bodies are saved under `/tmp` (`fb_plugin_video.html`, `fb_plugin_page.html`, `iframe_api_*.json`, `embedjs_src.js`).

---

## 7. Recommended implementation for whitemind

The repo already has the right engine (`assets/js/iframely.js`, `WM_FB.render(container, url, cb)` with 6 s Iframely-attempt timeout → official plugin iframe → link card). Two presentation patterns to use with it:

### A. Facebook VIDEO — responsive (recommended)

```html
<!-- per video; the plugin iframe is FB-approved and keyless -->
<div class="fb-embed" style="position:relative;width:100%;aspect-ratio:16/9;max-width:560px;">
  <iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwhitemind.education%2Fvideos%2FVIDEO_ID%2F&show_text=false&width=560&lazy=true"
          style="position:absolute;inset:0;width:100%;height:100%;border:none;overflow:hidden"
          scrolling="no" frameborder="0" allowfullscreen="true"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          loading="lazy" title="Facebook video embed"></iframe>
</div>
<a href="https://www.facebook.com/whitemind.education/videos/VIDEO_ID/" target="_blank" rel="noopener">View on Facebook</a>
```

- `lazy=true` is Facebook's own plugin attribute that sets `loading="lazy"` inside the plugin; `loading="lazy"` on our iframe element is a second belt. For full click-to-poster facades, use Iframely's `click_to_play=1`/`lazy=1` — but that requires a key + hosted iframes (§3), so keyless it is not available.

### B. Facebook VIDEO — fixed width

```html
<iframe src="https://www.facebook.com/plugins/video.php?href=VIDEO_URL_ENCODED&show_text=false&width=560"
        style="border:none;overflow:hidden;width:560px;height:auto" scrolling="no" frameborder="0"
        allowfullscreen="true" title="Facebook video embed"></iframe>
```

### C. Facebook POST (text+media) — fixed width only (height is dynamic; never aspect-ratio-wrap it)

```html
<iframe src="https://www.facebook.com/plugins/post.php?href=POST_URL_ENCODED&show_text=true&width=500"
        style="border:none;overflow:hidden;width:500px;height:auto" scrolling="no" frameborder="0"
        allowfullscreen="true" title="Facebook post embed"></iframe>
```

### D. If/when an Iframely Starter key is obtained (owner approval required)

1. Server/server: `GET https://iframe.ly/api/iframely?url={URL}&api_key={KEY}` → use `html` from JSON; cache 1–24 h (docs recommendation). Client-side: `key={MD5-of-key}` instead, with allowed origins configured.
2. Embed.js route (their documented template — quoted from /docs/embedjs):
   ```html
   <div class="iframely-embed">
     <div class="iframely-responsive">
       <a data-iframely-url href="https://www.facebook.com/whitemind.education/videos/…/"></a>
     </div>
   </div>
   <script async src="https://iframely.net/embed.js?key={MD5_KEY}"></script>
   ```
   Dynamic nodes: `iframely.load(containerElement)`. Failed/unavailable embeds: embed.js auto-cancels (hides) them; add `&parent={cssClass}` to hide the whole card, or listen to `iframely.on('cancel', fn)` / `&cancel=0` to keep a plain link. With a key, `WM_FB.API_KEY` can be set in `assets/js/iframely.js` to re-enable Iframely-first rendering with zero other changes.
   Note: even with a key, Iframely's `html` for Facebook is the FB-SDK/plugin markup (possibly wrapped in an Iframely iframe if `&iframe=1`/`&omit_script=1`) — Iframely adds responsive framing, CLS handling and cancel handling on top of Meta's own widgets.

### E. Fallback behavior (login-required / removed content)

- With a key, Iframely returns `origin.http.401`/`origin.http.403` → HTTP **403**, message "Content is private or requires a login" (/docs/result-codes) — treat as "don't render, show source link".
- Keyless plugin path: cross-origin iframes can't be introspected, and FB returns a 200 shell even for unavailable content (test #2/#3), so availability must be verified **at authoring time** (og-check the URL once, like the Little Heaven audit did) — never guess URLs. Always keep the visible "View on Facebook" source link under every embed, and keep `WM_FB.render`'s 6 s timeout → link-card chain for Iframely-side failures.

### F. Browser verification checklist (playback confirmation)

1. DevTools Network: `plugins/video.php` (or `sdk.js`) request → **200**, and the iframe's `src` host is `www.facebook.com`.
2. The iframe shows the FB video frame (poster with play button) — **HTTP 200 alone proves nothing**: login-gated content also 200s with an "isn't available" shell, so click ▶ and confirm the video actually starts.
3. No console errors from `connect.facebook.net` (SDK path) and the `fb-video` div is replaced by rendered markup.
4. Resize the window: responsive wrapper keeps 16:9 with no letterboxing/scrollbar inside the iframe.
5. Generator cross-check (keyless, dynamic): `https://iframely.com/domains/facebook?url={encodedVideoUrl}` should still show the widget code for that URL (HTTP 200).

---

## 8. Anti-patterns (do not do)

- Do **not** embed the Page (`facebook.com/whitemind.education`) — retired by Facebook on 2025-11-03 (§1.3); generator emits no code for it.
- Do **not** call `cdn.iframe.ly/...` — that host is dead (404 `api.subdomain.invalid`).
- Do **not** call `iframe.ly/api/{iframely,oembed,thumbnail}` from client or server without a key — 403 `api.key.required`; there is no documented free key.
- Do **not** expect keyless `embed.js` to render FB (or any) media — its `/api/iframe` backend returns a `"cancel":true` card keyless (§3).
- Do **not** aspect-ratio-wrap `post.php` embeds — post height is dynamic; fixed width + auto height only.
