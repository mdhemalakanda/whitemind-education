#!/usr/bin/env node
/* ============================================================
   WHITEMIND EDUCATION — static page builder (zero dependencies)
   Composes final pages in site/ from templates/ + src/pages/.
   Run:  node scripts/build.mjs
   Serve: ./scripts/serve.sh  (http://localhost:8140)
   English-only UI (single language) — Bangla source text from the
   teacher's Facebook posts is embedded verbatim inside fragments.
   CANON is intentionally empty until a public URL is approved;
   canonical/OG-url/sitemap are skipped while it is empty.
   ============================================================ */
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const T = (p) => readFileSync(join(ROOT, "templates", p), "utf8");
const P = (p) => readFileSync(join(ROOT, "src", "pages", p), "utf8");

const BRAND = "Whitemind Education";
const CANON = ""; // e.g. "https://mdhemalakanda.github.io/whitemind-education/" — set only when a public URL is approved

/* Page registry — one entry per output page. nav: active nav item. */
const PAGES = {
  "index.html":     { nav: "home",     title: "Whitemind Education — Md. A. Latif | A Level Mathematics (CAIE 9709 P3)", desc: "Personal website of Md. A. Latif — A Level Mathematics teacher (CAIE 9709, Pure Mathematics 3). Watch his 13 recorded P3 lectures on YouTube and follow Whitemind Education on Facebook." },
  "about.html":     { nav: "about",    title: "About — Md. A. Latif | Whitemind Education", desc: "Who Md. A. Latif is: A Level Mathematics teacher (CAIE 9709 Pure Mathematics 3), B.Sc (Hons), M.Sc (Mathematics), and the educator behind Whitemind Education." },
  "videos.html":    { nav: "videos",   title: "Video Lectures — CAIE 9709 P3 | Md. A. Latif", desc: "All 13 recorded lectures by Md. A. Latif — CAIE A Level 9709 Pure Mathematics 3: algebra, logarithms, trigonometry and differentiation — with the official YouTube playlists." },
  "gallery.html":   { nav: "gallery",  title: "Gallery — Whitemind Education | Md. A. Latif", desc: "Photos and moments from Whitemind Education's official Facebook page and Md. A. Latif's teaching, linked to their original sources." },
  "resources.html": { nav: "resources",title: "Resources & Notes — Whitemind Education | Md. A. Latif", desc: "Educational posts, notes and guidance published by Whitemind Education — preserved with their original meaning and links to the source posts." },
  "contact.html":   { nav: "contact",  title: "Contact — Whitemind Education | Md. A. Latif", desc: "Reach Md. A. Latif and Whitemind Education through the official Facebook page and YouTube channel." },
};

function fill(tpl, map) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (map[k] !== undefined ? map[k] : `{{${k}}}`));
}

/* ---- build pages ---- */
for (const [file, cfg] of Object.entries(PAGES)) {
  const canonLink = CANON ? `<link rel="canonical" href="${CANON}${file === "index.html" ? "" : file}">` : "<!-- canonical pending public URL -->";
  const ogTags = [
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="' + BRAND + '">',
    '<meta property="og:title" content="' + cfg.title.replace(/"/g, "&quot;") + '">',
    '<meta property="og:description" content="' + cfg.desc.replace(/"/g, "&quot;") + '">',
    CANON ? '<meta property="og:url" content="' + CANON + (file === "index.html" ? "" : file) + '">' : "<!-- og:url pending public URL -->",
    '<meta name="twitter:card" content="summary">',
  ].join("\n");

  const head = fill(T("head.html"), { TITLE: cfg.title, DESC: cfg.desc, CANON_LINK: canonLink, OG_TAGS: ogTags });
  let header = T("header.html");
  header = header.replace(`data-nav="${cfg.nav}"`, `data-nav="${cfg.nav}" aria-current="page"`);
  const html = head + "\n" + header + "\n" + P(file) + "\n" + T("footer.html") + "\n" + T("scripts.html");
  writeFileSync(join(ROOT, "site", file), html);
  console.log("built", file);
}

/* ---- assets ---- */
rmSync(join(ROOT, "site", "assets"), { recursive: true, force: true });
mkdirSync(join(ROOT, "site", "assets"), { recursive: true });
for (const d of ["css", "js", "data", "images"]) {
  const src = join(ROOT, "assets", d);
  if (existsSync(src)) cpSync(src, join(ROOT, "site", "assets", d), { recursive: true });
}

/* ---- robots (no sitemap while CANON is empty) ---- */
writeFileSync(join(ROOT, "site", "robots.txt"), "User-agent: *\nAllow: /\n");

console.log(`done → site/  (pages: ${Object.keys(PAGES).length}, canon: ${CANON || "pending"})`);
