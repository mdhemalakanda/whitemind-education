# FACEBOOK PAGE RESEARCH — facebook.com/whitemind.education
Research date: 2026-11-08 (all fetches done live on this date)
Method: m.facebook.com + desktop www with full browser headers via curl; og: metadata extraction;
Page Transparency + About subpages; DuckDuckGo + Google-index searches. No login used. No media downloaded — URLs only.
NOTE: signed image URLs (fbcdn) carry an expiry token; the ones captured expire on/around 2026-11-11. Re-fetch pages to get fresh signed URLs.

## A. Page identity
| Item | Value | Status | Source |
|---|---|---|---|
| Vanity handle | whitemind.education | VERIFIED | canonical link + og:url on every fetched page |
| Canonical URL | https://www.facebook.com/whitemind.education/ | VERIFIED | og:url |
| CURRENT page name | "Mathematics Learning Centre _MLC" | VERIFIED | og:title, <title>, aria-labels, Google index ("Mathematics Learning Centre _MLC | Dhaka") |
| Category | Education (internal code EDUCATION_COMPANY) | VERIFIED | embedded page data (m.facebook main HTML) |
| Followers | 138 | VERIFIED | og:description / meta description ("…, Dhaka. 138 followers. …") |
| Likes | not separately shown | NOT PUBLIC | not in any fetched payload |
| Location | Dhaka, Bangladesh, 1230 (postcode in label) | VERIFIED | aria-label "  Dhaka, Bangladesh, 1230" (m.facebook main/about) |
| Hours | "Always open" | VERIFIED | aria-label (m.facebook) |
| Rating | "Not yet rated (0 reviews)" | VERIFIED | aria-label (m.facebook) |
| Intro / about line | "For any query.............." | VERIFIED | og:description + aria-label |
| Page ID (current format) | 113449997020138 | VERIFIED | Page Transparency field ("Page ID") |
| Legacy actor ID | 100054849576514 | VERIFIED | fb://profile deep links, embedded data (eud 100054849576514) |
| Page created | 3 May 2020 | VERIFIED | Page Transparency field_type "creation_date", text "3 May 2020" (https://www.facebook.com/whitemind.education/about_profile_transparency) |
| Admin info | "This Page doesn't have any other admins." (single-admin page) | VERIFIED | Page Transparency field_type "admin_info" |
| Ads status | "This Page isn't currently running ads." | VERIFIED | Page Transparency field_type "ad_status" |
| Email | none set on page (email: null in page contact data) | VERIFIED | embedded contact data (about_contact_and_basic_info payload) |
| Website field | none published | VERIFIED (absence) | no website string in any fetched payload |
| YouTube / other socials | no links to YouTube, WhatsApp, Telegram, etc. found anywhere on page | VERIFIED (absence) | grep of all fetched HTML |
| og:type quirk | "video.other" | VERIFIED | og:type meta tag |
| Former name "Whitemind Education" | NOT publicly visible anywhere; survives only in the vanity handle. Plausible per client brief but UNVERIFIED — treat as unconfirmed | UNVERIFIED | web search (DuckDuckGo, Google) found no indexed trace of "Whitemind Education" for this page |

## B. Teacher profile (ONLY what the page publicly states)
- Owner's name: NOT published. The page nowhere states the admin/owner's name. The "Md A Latif" attribution from the client brief (YouTube handle) does NOT appear anywhere on this Facebook page. Status: ABSENT from page.
- Professional title/identity: not published beyond page name/category ("Education" company; "Mathematics Learning Centre"). Subject area is implied only by the page NAME (mathematics) — the page does not list subjects.
- Qualifications / education background: NOT published (login-gated "Details about" may hold more; nothing public).
- Teaching experience, teaching philosophy, achievements: NOT published.
- Publicly verifiable identity signals only: single-admin page (no other admins); created 3 May 2020; English-language intro; COVID-era reel captions in English; located Dhaka 1230; phone 01715-339592.
- CONCLUSION FOR SITE BUILD: do not invent name, degrees, experience years, or achievements for this teacher from Facebook data — the page supplies none.

## C. Posts inventory (publicly accessible)
Total publicly visible feed posts: 1 (the feed renders one post without login; older posts login-gated).
1. Post fbid 1682442250260745
   - Permalink (full): https://www.facebook.com/whitemind.education/posts/pfbid0rzxaC7Np5eSgRX8bDSY3wdgUDtDiwXkPGNC4DEkM4S88uLb1MbpjNtMqrXXYWs5ul
   - Created: 2026-10-05 17:27:30 UTC (creation_time 1791221250) — VERIFIED
   - Text: "https://www.facebook.com/share/p/19Y69u63nw/" (post text is literally this share-link) — VERIFIED via message field + og:description of the post page
   - Type: photo post — attachment image fbid 1682428773595426 (upload 2026-10-05 17:08 UTC, loads HTTP 200 without login)
   - og:title of post page: "https://www.facebook.com... - Mathematics Learning Centre _MLC | Facebook"
   - Language: English — VERIFIED
   - Engagement: not publicly rendered — login-gated
   - Share link from post text: https://www.facebook.com/share/p/19Y69u63nw/ (returns 400 to plain curl; presumed to point to this post — UNVERIFIED target)
- Historical text posts: NOT accessible (login-gated). Facebook embeds only one post in the anonymous feed payload (1 pfbid, 1 creation_time in 970 KB of HTML).

## D. Photographs inventory
Permalinks (photo.php?fbid=…&id=100054849576514) are LOGIN-GATED. Direct CDN URLs below all verified HTTP 200 without login (curl -I). Resolution given = served crop; source approx size in parentheses.
1. PROFILE PICTURE — fbid 627477345757246; upload 2022-08-19 16:30:11 GMT (last-modified); served 960x960 crop (source up to 1080x1440); loads 200 image/jpeg; og:image of the whole page. URL captured in /tmp og payloads (signed, expires ~2026-11-11).
2. COVER PHOTO — fbid 1184673416704300 (474627928_1184673416704300_1803712229943337772_n.jpg); upload 2025-01-22 02:37:24 GMT; aspect 2.7016 (1440x535 crop rendered at 480x480 k-crop, 149,938 bytes full variant); VERIFIED as cover via aria-label "Cover photo of Mathematics Learning Centre _MLC" + <img src> adjacency.
3. Page photos strip (recent photos; roles beyond "page image" not labeled publicly) — all HTTP 200:
   - fbid 1276215820883392 — upload 2025-05-25 06:32 UTC
   - fbid 1277292464109061 — upload 2025-05-26 17:02 UTC
   - fbid 1298900295281611 — upload 2025-06-24 13:51 UTC
   - fbid 1596203632217941 — upload 2026-06-27 18:16 UTC
   - fbid 1596212418883729 — upload 2026-06-27 18:30 UTC
   - fbid 1669037938267843 — upload 2026-09-21 14:13 UTC
   - fbid 1669097584928545 — upload 2026-09-21 15:38 UTC
   - fbid 1672645481240422 — upload 2026-09-25 13:03 UTC
   - fbid 1682428773595426 — upload 2026-10-05 17:08 UTC (attachment of the 2026-10-05 post)
   (All signed URL variants saved during research; regenerate from live pages when needed.)
4. Reel thumbnails (3, see section E) — all HTTP 200, image/jpeg.
5. Albums: tab lists names "Profile pictures", "Cover photos", "Mobile uploads", "Mentions", page's photos — VERIFIED as labels only; the Photos collection itself returns "No photos to show" without login.

## E. Videos inventory
3 reels, ALL fully public (og metadata + engagement rendered without login). No non-reel videos found (videos tab shows no video IDs; desktop says "No reels to show" client-side but m. renders 3).
1. "Stay home, stay safe." — reel fbid 2591399764507088
   - Permalink: https://www.facebook.com/reel/2591399764507088/ (og:url VERIFIED)
   - Created: 2020-06-05 09:05 UTC (creation_time 1591347913; og:image last-modified 2020-06-05 09:05:24)
   - Visibility: Public. Engagement: 39 views, 3 reactions, 0 comments, 0 shares — VERIFIED
   - og:image (thumbnail): https://scontent.fdac11-2.fna.fbcdn.net/v/t15.5256-10/102890442_2591399947840403_3697711372906266624_n.jpg (HTTP 200)
   - Duration: not publicly shown
2. "Stay home, stay safe." — reel fbid 933559323756269
   - Permalink: https://www.facebook.com/reel/933559323756269/
   - Created: 2020-06-05 15:29 UTC (creation_time 1591370952)
   - Public. Engagement: 43 views, 0 reactions, 0 comments, 0 shares — VERIFIED
   - og:image: https://scontent.fdac11-2.fna.fbcdn.net/v/t15.5256-10/103067073_933560267089508_136319234023096320_n.jpg (HTTP 200)
   - og:video playable URL present (m412 o1 stream URL captured; URL only, not downloaded). Duration not shown.
3. "Hope the world becomes normal soon." — reel fbid 745272366119900
   - Permalink: https://www.facebook.com/reel/745272366119900/
   - Created: 2021-01-08 12:02 UTC (creation_time 1610107364)
   - Public. Engagement: 77 views, 1 reaction, 0 comments, 1 share — VERIFIED
   - og:image: https://scontent.fdac11-2.fna.fbcdn.net/v/t15.5256-10/121893043_745272509453219_3533397598226847670_n.jpg (HTTP 200)

## F. Contact + external links
- Phone: 01715-339592 — VERIFIED (aria-labels "Education ·  01715-339592" and "01715-339592"; contact-info payload)
- Address: Dhaka, Bangladesh, 1230 — VERIFIED (aria-label)
- Hours: Always open — VERIFIED
- Email: none set — VERIFIED absence
- Website: none published — VERIFIED absence
- Socials (YouTube etc.): none linked — VERIFIED absence
- Messaging: page has standard "Message" affordance (aria "Contact info" row) but no public email/WhatsApp link.

## G. Access limitations
1. Login-gated (recorded, not bypassed):
   - All timeline/post history beyond the single publicly-rendered post (feed payload contains exactly 1 pfbid).
   - Photo permalink pages (photo.php?fbid=… return 941-byte login shells).
   - Photos tab collection (renders "No photos to show" without login; only header strip images + album names leak).
   - mbasic.facebook.com (login wall / error page for both vanity and profile.php URLs).
   - Followers list, likes count, review content, Mentions album content, post comments, page owner's personal profile.
   - "See all" About details (education, bio blocks) beyond intro/category/address/hours/phone.
   - Page history / name-change records (no public name-history field; only current name + handle).
2. Tooling limits: webReader MCP returned 500 network errors on every facebook.com URL (used throughout); desktop www returns HTTP 400 to plain curl but 200 with full browser headers (Accept, Accept-Language, Sec-Fetch-*) — used for About, Transparency, Contact, main, photos, videos, reels tabs.
3. Search engines: no indexed trace of "Whitemind Education" as this page's name; Google/Bing only index the current "Mathematics Learning Centre _MLC | Dhaka" identity. One third-party Facebook group post (Higgs boson science club, 2026 batch) references "Mathematics Learning Centre (MLC), 2nd floor" in Dhaka — contextual only, UNVERIFIED relation to this page.
