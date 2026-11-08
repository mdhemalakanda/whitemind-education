/* ============================================================
   WHITEMIND EDUCATION — interactions
   Classic script (no modules). Data from assets/data/*.js.
   ============================================================ */
(function () {
  "use strict";

  var D = window.WM_DATA || {};
  D.videos = D.videos || [];
  D.channel = D.channel || {};
  D.playlists = D.playlists || [];
  D.fbVideos = D.fbVideos || [];
  D.fbPosts = D.fbPosts || [];
  D.fbPhotos = D.fbPhotos || [];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------------- drawer ---------------- */
  var drawer = $("#drawer"), overlay = $("#drawerOverlay"), burger = $("[data-drawer-open]");
  function setDrawer(open) {
    if (!drawer || !overlay || !burger) return;
    if (open) { drawer.hidden = false; overlay.hidden = false; }
    requestAnimationFrame(function () {
      drawer.classList.toggle("open", open);
      overlay.classList.toggle("open", open);
    });
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    if (!open) { window.setTimeout(function () { drawer.hidden = true; overlay.hidden = true; }, 300); }
  }
  if (burger) burger.addEventListener("click", function () { setDrawer(true); });
  var dclose = $("[data-drawer-close]");
  if (dclose) dclose.addEventListener("click", function () { setDrawer(false); });
  if (overlay) overlay.addEventListener("click", function () { setDrawer(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setDrawer(false); });

  /* ---------------- to-top ---------------- */
  var toTop = $("#toTop");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("show", window.scrollY > 500);
    }, { passive: true });
    toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  /* ---------------- AOS ---------------- */
  function initAos() {
    if (!window.AOS) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.AOS.init({ once: true, duration: 650, offset: 60, disable: reduce });
  }

  /* ---------------- lightbox ---------------- */
  function initLightbox() {
    if (!window.GLightbox) return;
    window.GLightbox({ selector: ".glightbox", touchNavigation: true, loop: false });
  }

  /* ---------------- video card renderers ---------------- */
  /* ---------------- hero introduction video ---------------- */
  function renderHeroVideo() {
    var el = $("[data-role='hero-video']");
    if (!el || !window.WM_YT) return;
    WM_YT.mount(el);
  }

  function ytCardHtml(v, extraCls) {
    return '<article class="vcard' + (extraCls ? " " + extraCls : "") + '" data-cat="' + esc(v.cat) + '" data-aos="fade-up">' +
      '<div class="yt-frame" data-yt-id="' + esc(v.id) + '" data-yt-title="' + esc(v.t) + '" data-yt-poster="' + esc(v.thumb) + '">' +
      '<span class="dur-badge">' + esc(v.dur || "") + "</span></div>" +
      '<div class="vc-body"><h3>' + esc(v.t) + "</h3>" +
      '<div class="vc-meta"><span class="cat-chip">' + esc((D.catLabels && D.catLabels[v.cat]) || v.cat) + "</span>" +
      "<span>" + esc(v.date) + "</span><span>" + esc(v.views) + " views</span></div></div></article>";
  }

  function renderFeatured() {
    var el = $("[data-role='featured-video']");
    if (!el || !D.videos.length) return;
    var v = D.videos[0]; // syllabus overview — the channel's most-viewed lecture
    el.innerHTML = ytCardHtml(v);
    if (window.WM_YT) window.WM_YT.mountAll(el);
  }

  function renderLatest() {
    var el = $("[data-role='latest-videos']");
    if (!el || !D.videos.length) return;
    var latest = D.videos.slice(-3).reverse();
    el.innerHTML = latest.map(function (v) { return ytCardHtml(v); }).join("");
    if (window.WM_YT) window.WM_YT.mountAll(el);
  }

  function renderAllVideos() {
    var el = $("[data-role='video-grid']");
    if (!el) return;
    el.innerHTML = D.videos.map(function (v) { return ytCardHtml(v); }).join("");
    if (window.WM_YT) window.WM_YT.mountAll(el);
    wireFilters(el);
  }

  function wireFilters(grid) {
    var bar = $("[data-role='video-filters']");
    if (!bar) return;
    $all(".fchip", bar).forEach(function (chip) {
      chip.addEventListener("click", function () {
        var cat = chip.getAttribute("data-cat");
        $all(".fchip", bar).forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
        $all(".vcard", grid).forEach(function (card) {
          card.classList.toggle("hide", cat !== "all" && card.getAttribute("data-cat") !== cat);
        });
      });
    });
  }

  /* ---------------- facebook video cards ---------------- */
  function fbCardHtml(v) {
    return '<article class="vcard" data-aos="fade-up">' +
      '<div class="fb-frame' + (v.thumb ? "" : " no-thumb") + '" data-fb-url="' + esc(v.url) + '">' +
      (v.thumb ? '<img src="' + esc(v.thumb) + '" alt="' + esc(v.t) + '" loading="lazy" referrerpolicy="no-referrer">' : "") +
      '<button type="button" class="fb-open" aria-label="Play Facebook video: ' + esc(v.t) + '"></button>' +
      "</div>" +
      '<div class="vc-body"><h3>' + esc(v.t) + "</h3>" +
      '<div class="vc-meta"><span>' + esc(v.date || "") + "</span></div>" +
      '<p class="fb-note">Plays via the official Facebook embed. <a href="' + esc(v.url) + '" target="_blank" rel="noopener">Open on Facebook</a></p>' +
      "</div></article>";
  }

  function wireFbFrames(root) {
    $all(".fb-frame[data-fb-url]", root).forEach(function (frame) {
      var url = frame.getAttribute("data-fb-url");
      var img = frame.querySelector("img");
      if (img) {
        img.onerror = function () { img.remove(); frame.classList.add("no-thumb"); };
      }
      var btn = frame.querySelector(".fb-open");
      if (!btn) return;
      btn.addEventListener("click", function () {
        btn.remove();
        if (img) img.remove();
        frame.classList.remove("no-thumb");
        if (window.WM_FB) {
          WM_FB.renderSdk(frame, url, function (ok) {
            if (ok) {
              /* FB sets inline width/height on its iframe — force frame fill */
              var fi = frame.querySelector("iframe");
              if (fi) {
                fi.style.position = "absolute";
                fi.style.inset = "0";
                fi.style.width = "100%";
                fi.style.height = "100%";
                fi.style.border = "0";
              }
              return;
            }
            var html = WM_FB.platformEmbedHtml(url, Math.max(320, Math.floor(frame.clientWidth || 560)));
            if (html) { frame.innerHTML = html; }
            else {
              frame.innerHTML = '<p class="fb-note">This embed could not load. <a href="' + esc(url) + '" target="_blank" rel="noopener">Watch on Facebook</a></p>';
            }
          });
        } else {
          var html2 = '<iframe src="https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(url) + '&show_text=false&width=560" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" title="Facebook video"></iframe>';
          frame.innerHTML = html2;
        }
      });
    });
  }

  function renderFbVideos() {
    var el = $("[data-role='fb-videos']");
    if (!el || !D.fbVideos.length) return;
    el.innerHTML = D.fbVideos.map(fbCardHtml).join("");
    wireFbFrames(el);
  }

  /* ---------------- facebook post cards (resources) ---------------- */
  function renderFbPosts() {
    var el = $("[data-role='fb-posts']");
    if (!el || !D.fbPosts.length) return;
    el.innerHTML = D.fbPosts.map(function (p) {
      return '<article class="card rcard" data-aos="fade-up">' +
        '<div class="rc-meta"><span class="cat-chip">' + esc(p.type || "Facebook post") + "</span><span>" + esc(p.date || "") + "</span></div>" +
        "<h3>" + esc(p.t) + "</h3><p>" + esc(p.d || "") + "</p>" +
        '<a class="more" href="' + esc(p.url) + '" target="_blank" rel="noopener">View the original post <svg class="bi" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6-1.4-1.4L12.2 12 7.6 7.4z"/></svg></a>' +
        "</article>";
    }).join("");
  }

  /* ---------------- gallery ---------------- */
  function renderGallery() {
    var el = $("[data-role='gallery-grid']");
    if (!el || !D.fbPhotos.length) return;
    el.innerHTML = D.fbPhotos.map(function (p) {
      return '<figure class="g-item" data-aos="fade-up">' +
        '<a class="glightbox" href="' + esc(p.full || p.thumb) + '" data-gallery="wm">' +
        '<img src="' + esc(p.thumb) + '" alt="' + esc(p.t) + '" loading="lazy" referrerpolicy="no-referrer">' +
        "</a>" +
        "<figcaption>" + esc(p.t) + (p.src ? "<small>Source: " + esc(p.src) + "</small>" : "") + "</figcaption>" +
        "</figure>";
    }).join("");
    $all("img", el).forEach(function (img) {
      img.onerror = function () {
        var fig = img.closest(".g-item");
        if (fig) {
          fig.style.background = "linear-gradient(135deg,#EFE7D6,#E2D5BB)";
          fig.style.aspectRatio = "4/3";
          img.remove();
        }
      };
    });
  }

  /* ---------------- profile photo ---------------- */
  function renderProfile() {
    var img = $("[data-role='profile-photo']");
    if (!img) return;
    var p = D.fbPhotos.find(function (x) { return x.id === "profile"; });
    if (p && p.thumb) {
      img.src = p.thumb;
      img.addEventListener("error", function () { img.remove(); });
    } else {
      img.remove();
    }
  }

  /* ---------------- counters ---------------- */
  function initCounters() {
    var els = $all("[data-count]");
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = target.toLocaleString("en-US") + suffix; return; }
        var start = null, dur = 1100;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString("en-US") + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- contact form (honest frontend-only) ---------------- */
  function initForm() {
    var form = $("[data-role='contact-form']");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $all(".field", form).forEach(function (f) {
        var input = f.querySelector("input,textarea");
        if (!input) return;
        var v = input.value.trim();
        var bad = false;
        if (input.required && !v) bad = true;
        if (v && input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) bad = true;
        f.classList.toggle("invalid", bad);
        if (bad) ok = false;
      });
      var okBox = $(".form-ok", form.parentNode);
      if (ok && okBox) {
        form.setAttribute("data-valid", "1");
        okBox.classList.add("show");
        form.querySelector("button[type='submit']").disabled = true;
        okBox.setAttribute("tabindex", "-1");
        okBox.focus();
      }
    });
    $all("input,textarea", form).forEach(function (input) {
      input.addEventListener("input", function () {
        var f = input.closest(".field");
        if (f) f.classList.remove("invalid");
      });
    });
  }

  /* ---------------- boot ---------------- */
  function boot() {
    renderProfile();
    renderHeroVideo();
    renderFeatured();
    renderLatest();
    renderAllVideos();
    renderFbVideos();
    renderFbPosts();
    renderGallery();
    initCounters();
    initForm();
    initAos();
    initLightbox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
