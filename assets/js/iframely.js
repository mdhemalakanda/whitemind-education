/* ============================================================
   WHITEMIND EDUCATION — Facebook embed integration (no API key)
   Method per research/IFRAMELY_METHOD.md (verified 2026-11-08):
   Iframely routes Facebook media to Meta's own native widget markup —
   its generator emits: fb-root + ONE connect.facebook.net sdk.js load
   (#xfbml=1&version=v26.0) + <div class="fb-video" data-href="…"
   data-app-id="887156172104257"> (fb-post for posts). Hosted Iframely
   iframes for facebook.com are key-gated (keyless API → 403), so the
   keyless chain below implements Iframely's actual generated output:
   1. FB SDK XFBML embed (Iframely-generated markup; SDK loaded once,
      lazily on first click).
   2. Official plugins/video.php | post.php iframe (same Meta widget,
      keyless, platform-approved).
   3. Source-link fallback card (caller-provided; login-gated posts).
   NOTE (important): Meta retired automated PAGE embeds on 2025-11-03 —
   only individual videos/posts/photos are embedded, never the page.
   Public generator URL kept for QA/preview links:
   https://iframely.com/domains/facebook?url=<original>
   ============================================================ */
(function () {
  "use strict";

  var GENERATOR_BASE = "https://iframely.com/domains/facebook?url=";
  var SDK_APP_ID = "887156172104257"; // app id emitted by Iframely's Facebook generator
  var SDK_VERSION = "v26.0";

  /* Only legitimate Facebook URLs (teacher's page or generic watch/reel) may be embedded. */
  var ALLOWED = [
    /^https:\/\/([a-z0-9-]+\.)*(facebook\.com)\/(reel\/[0-9]+|watch\/?(\?v=[0-9]+)?|whitemind\.education\/(videos|posts|photos|reels?|watch)\/?[^\s]*)/i
  ];

  function isAllowed(url) {
    return typeof url === "string" && ALLOWED.some(function (re) { return re.test(url); });
  }

  function generatorUrl(originalUrl) {
    return originalUrl ? GENERATOR_BASE + encodeURIComponent(originalUrl) : null;
  }

  /* ---- Iframely embed.js markup (attempt 0 — only used when a real API key is set) ---- */
  function embedHtml(originalUrl, titleText) {
    if (!isAllowed(originalUrl)) return null;
    var t = (titleText || "Facebook video").replace(/"/g, "&quot;");
    return '<div class="iframely-embed"><div class="iframely-responsive">' +
      '<a href="' + originalUrl + '" data-iframely-url="' + originalUrl + '" title="' + t + '"></a>' +
      '</div></div>';
  }

  /* ---- Iframely-generated FB SDK markup (attempt 1) ---- */
  var sdkRequested = false;
  function ensureSdk(onReady) {
    if (window.FB && window.FB.XFBML) { onReady(true); return; }
    if (sdkRequested) { onReady(!!window.FB); return; }
    sdkRequested = true;
    var s = document.createElement("script");
    s.id = "wm-fb-sdk";
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=" + SDK_VERSION + "&appId=" + SDK_APP_ID;
    s.onload = function () { onReady(!!window.FB); };
    s.onerror = function () { onReady(false); };
    document.head.appendChild(s);
  }

  function sdkEmbedHtml(url) {
    if (!isAllowed(url)) return null;
    var cls = /\/posts\/|\/photos\//.test(url) ? "fb-post" : "fb-video";
    return '<div class="' + cls + '" data-href="' + url + '" data-app-id="' + SDK_APP_ID + '"' +
      (cls === "fb-video" ? ' data-allowfullscreen="true" data-show-text="false"' : '') + '></div>';
  }

  function renderSdk(container, url, onDone) {
    ensureSdk(function (ok) {
      if (!ok) { onDone(false); return; }
      var html = sdkEmbedHtml(url);
      if (!html) { onDone(false); return; }
      container.innerHTML = html;
      var done = false;
      var finish = function (ok2) { if (!done) { done = true; onDone(ok2); } };
      var poll = window.setInterval(function () {
        if (container.querySelector("iframe")) { window.clearInterval(poll); finish(true); }
      }, 250);
      window.setTimeout(function () { window.clearInterval(poll); finish(!!container.querySelector("iframe")); }, 8000);
      try { window.FB.XFBML.parse(container); } catch (e) { window.setTimeout(function () { finish(!!container.querySelector("iframe")); }, 1200); }
    });
  }

  /* ---- Official plugin iframe (attempt 2 — keyless, platform-approved) ----
     width = measured container width, so the player fills its frame. */
  function platformEmbedHtml(url, width) {
    if (!isAllowed(url)) return null;
    var isPost = /\/posts\//.test(url);
    var isPhoto = /\/photos\//.test(url);
    var plugin = isPost || isPhoto ? "post.php" : "video.php";
    var w = Math.max(320, Math.min(1200, parseInt(width, 10) || 560));
    var extra = plugin === "post.php" ? "&show_text=true&width=" + w : "&show_text=false&width=" + w + "&height=" + Math.round(w * 1.34);
    var title = isPost || isPhoto ? "Facebook post embed" : "Facebook video embed";
    return '<iframe src="https://www.facebook.com/plugins/' + plugin + '?href=' + encodeURIComponent(url) + extra + '" ' +
      'style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" ' +
      'allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" title="' + title + '"></iframe>';
  }

  /* ---- legacy API kept for spec parity (Iframely embed.js attempt) ---- */
  function render(container, originalUrl, titleText, onDone) {
    var html = embedHtml(originalUrl, titleText);
    if (!html) { if (onDone) onDone(false); return; }
    container.innerHTML = html;
    var done = false;
    var finish = function (ok) { if (!done) { done = true; if (onDone) onDone(ok); } };
    var timer = window.setTimeout(function () { finish(!!container.querySelector("iframe")); }, 6000);
    if (window.iframely && typeof window.iframely.load === "function") {
      try { window.iframely.load(container); } catch (e) { /* handled by timeout */ }
      window.setTimeout(function () { window.clearTimeout(timer); finish(!!container.querySelector("iframe")); }, 2500);
    }
  }

  /* Set to a real Iframely api_key to make Iframely embed.js the first renderer. */
  var API_KEY = null;
  function iframelyFirst() { return !!API_KEY; }

  window.WM_FB = {
    iframelyFirst: iframelyFirst,
    isAllowed: isAllowed,
    generatorUrl: generatorUrl,
    embedHtml: embedHtml,
    sdkEmbedHtml: sdkEmbedHtml,
    renderSdk: renderSdk,
    platformEmbedHtml: platformEmbedHtml,
    render: render
  };
})();
