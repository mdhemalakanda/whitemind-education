#!/usr/bin/env node
/* ============================================================
   WHITEMIND EDUCATION — QA gate (zero dependencies)
   Checks, in site/:
   1. every internal href/src resolves to a built file
   2. every external URL is on the approved host whitelist
   3. NO local copies of source media (raster/video files under
      assets/ are forbidden — all source media is hotlinked)
   4. retired/unapproved embeds banned (facebook PAGE plugin)
   5. exactly one h1 per page; exactly one nav aria-current
   6. forbidden copy scan (no invented guarantees)
   7. every Facebook URL in data files matches the embed whitelist
   Run after: node scripts/build.mjs
   ============================================================ */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = join(ROOT, "site");
const errors = [];
const warnings = [];

const pages = readdirSync(SITE).filter((f) => f.endsWith(".html"));
if (!pages.length) { console.error("No built pages found — run build first."); process.exit(1); }

/* 1+2: link/asset resolution + external host whitelist */
const ALLOWED_HOSTS = [
  /^(?:[a-z0-9-]+\.)*facebook\.com$/i,
  /^(?:[a-z0-9-]+\.)*fbcdn\.net$/i,
  /^connect\.facebook\.net$/i,
  /^(?:[a-z0-9-]+\.)*youtube\.com$/i,
  /^(?:[a-z0-9-]+\.)*youtu\.be$/i,
  /^(?:[a-z0-9-]+\.)*googleusercontent\.com$/i,
  /^(?:[a-z0-9-]+\.)*(iframely\.net|iframe\.ly)$/i,
  /^fonts\.googleapis\.com$/i,
  /^fonts\.gstatic\.com$/i,
  /^(?:[a-z0-9-]+\.)*(jsdelivr\.net|unpkg\.com)$/i,
  /^(?:[a-z0-9-]+\.)*cambridgeinternational\.org$/i,
];
function hostOk(host) {
  return ALLOWED_HOSTS.some((re) => re.test(host.replace(/\s/g, "")));
}

for (const pg of pages) {
  const html = readFileSync(join(SITE, pg), "utf8");
  /* internal refs */
  const refs = [...html.matchAll(/(?:href|src)="([^"#]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (/^(https?:)?\/\//i.test(ref) || ref.startsWith("data:") || ref.startsWith("mailto:") || ref.startsWith("tel:")) continue;
    const path = ref.split("#")[0].split("?")[0];
    if (!path) continue;
    const target = join(SITE, path);
    if (!existsSync(target)) errors.push(`${pg}: broken internal ref "${ref}"`);
  }
  /* external hosts */
  for (const m of html.matchAll(/(?:href|src)="(https?:\/\/[^"]+)"/g)) {
    try {
      const host = new URL(m[1]).hostname;
      if (!hostOk(host)) errors.push(`${pg}: external host not whitelisted: ${host}`);
    } catch { errors.push(`${pg}: malformed URL ${m[1]}`); }
  }
  /* h1 + nav */
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) errors.push(`${pg}: expected 1 h1, found ${h1s}`);
  const currents = (html.match(/aria-current="page"/g) || []).length;
  if (currents !== 1) errors.push(`${pg}: expected 1 aria-current, found ${currents}`);
  /* retired page plugin */
  if (/plugins\/page\.php/i.test(html)) errors.push(`${pg}: facebook PAGE plugin used (retired by Meta 2025-11-03)`);
  /* forbidden copy */
  for (const bad of ["guaranteed results", "100% success"]) {
    if (html.toLowerCase().includes(bad)) errors.push(`${pg}: forbidden phrase "${bad}"`);
  }
}

/* 3: no local source-media copies */
function walk(dir, cb) {
  if (!existsSync(dir)) return;
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, cb);
    else cb(p);
  }
}
const RASTER = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".mov", ".webm"];
walk(join(SITE, "assets"), (p) => {
  if (RASTER.includes(extname(p).toLowerCase())) errors.push(`local media file forbidden (hotlink policy): ${p.replace(SITE, "")}`);
});

/* 7: data-file URL whitelist + fb url shape */
for (const f of ["assets/data/videos.js", "assets/data/media.js"]) {
  const p = join(SITE, f);
  if (!existsSync(p)) { errors.push(`missing data file ${f}`); continue; }
  const src = readFileSync(p, "utf8");
  for (const m of src.matchAll(/"(https?:\/\/[^"]+)"/g)) {
    try {
      const u = new URL(m[1]);
      if (!hostOk(u.hostname)) errors.push(`${f}: non-whitelisted host ${u.hostname}`);
    } catch { errors.push(`${f}: malformed URL ${m[1]}`); }
  }
  for (const m of src.matchAll(/"url":\s*"(https?:\/\/[^"]*facebook\.com[^"]*)"/g)) {
    if (!/whitemind\.education|\/(reel|watch)\//.test(m[1])) warnings.push(`${f}: facebook URL outside teacher page/generic watch: ${m[1]}`);
  }
}

/* report */
if (warnings.length) { console.log("WARN"); for (const w of warnings) console.log("WARN " + w); }
if (errors.length) {
  console.log("FAIL");
  for (const e of errors) console.log("FAIL " + e);
  process.exit(1);
}
console.log(`QA PASSED — ${pages.length} pages, links/hosts/media-policy/embed-policy all green`);
