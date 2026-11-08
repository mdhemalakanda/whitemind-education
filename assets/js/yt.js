/* ============================================================
   WHITEMIND EDUCATION — YouTube integration (official embeds only)
   - Posters are ORIGINAL YouTube thumbnails (hotlinked); a per-video
     verified poster can be passed via data-yt-poster. Fallback chain
     maxres -> sddefault -> hqdefault, handler attached BEFORE src.
   - Click-to-load: the official youtube.com/embed iframe is injected
     only on click, filling the frame (CSS .yt-frame iframe).
   - Nothing is downloaded or re-hosted, ever.
   ============================================================ */
(function () {
  "use strict";

  function posterUrl(id) { return "https://img.youtube.com/vi/" + id + "/maxresdefault.jpg"; }
  function posterFallbacks(id) {
    return ["https://img.youtube.com/vi/" + id + "/sddefault.jpg",
            "https://img.youtube.com/vi/" + id + "/hqdefault.jpg"];
  }
  function embedUrl(id) {
    return "https://www.youtube.com/embed/" + id + "?autoplay=1&rel=0";
  }

  /* Card: poster + play overlay + "YouTube" chip; click loads the official iframe. */
  function mount(el) {
    var id = el.getAttribute("data-yt-id");
    var title = el.getAttribute("data-yt-title") || "YouTube video";
    if (!id || el.getAttribute("data-yt-ready")) return;
    el.setAttribute("data-yt-ready", "1");

    var img = document.createElement("img");
    img.alt = title;
    img.loading = "lazy";
    img.referrerpolicy = "no-referrer";
    var fbIndex = 0;
    img.onerror = function () {
      if (fbIndex < posterFallbacks(id).length) { img.src = posterFallbacks(id)[fbIndex++]; }
      else { img.onerror = null; }
    };
    img.src = el.getAttribute("data-yt-poster") || posterUrl(id);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "yt-play";
    btn.setAttribute("aria-label", "Play video: " + title);

    var link = document.createElement("a");
    link.href = "https://www.youtube.com/watch?v=" + id;
    link.target = "_blank";
    link.rel = "noopener";
    link.className = "yt-ext";
    link.setAttribute("aria-label", "Open on YouTube: " + title);
    link.textContent = "YouTube";

    function play() {
      var frame = document.createElement("iframe");
      frame.src = embedUrl(id);
      frame.title = title;
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.allowFullscreen = true;
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      el.classList.add("yt-playing");
      el.innerHTML = "";
      el.appendChild(frame);
    }

    btn.addEventListener("click", play);
    el.appendChild(img);
    el.appendChild(btn);
    el.appendChild(link);
  }

  function mountAll(root) {
    (root || document).querySelectorAll("[data-yt-id]").forEach(mount);
  }

  if (document.readyState === "complete") { mountAll(); }
  else { document.addEventListener("DOMContentLoaded", function () { mountAll(); }); }

  window.WM_YT = { mount: mount, mountAll: mountAll, posterUrl: posterUrl, embedUrl: embedUrl };
})();
