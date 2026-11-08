#!/usr/bin/env node
/* ============================================================
   WHITEMIND EDUCATION — full Playwright suite
   All pages × 9 viewports (1920/1440/1366/1280/768 tablet/430/390/375/360):
   console+page errors, horizontal overflow, single h1, nav aria-current,
   broken hotlinked images (naturalWidth===0), failed network responses.
   Interactions: drawer (390), video filter, YouTube click-to-load,
   Facebook embed click (SDK→plugin iframe chain), gallery lightbox,
   form validation. Screenshots to qa/shots/.
   Run: node scripts/build.mjs && node scripts/qa.mjs && node scripts/fulltest.mjs
   ============================================================ */
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const PROJ = join(dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = join(PROJ, "site");
const PORT = 8141;
const PAGES = ["index.html", "about.html", "videos.html", "gallery.html", "resources.html", "contact.html"];
const VIEWPORTS = [
  { name: "1920", width: 1920, height: 1080 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1366", width: 1366, height: 768 },
  { name: "1280", width: 1280, height: 800 },
  { name: "768", width: 768, height: 1024 },
  { name: "430", width: 430, height: 932 },
  { name: "390", width: 390, height: 844 },
  { name: "375", width: 375, height: 812 },
  { name: "360", width: 360, height: 740 },
];
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".json": "application/xml", ".txt": "text/plain" };

const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const file = join(ROOT, p);
  if (existsSync(file)) {
    res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
    res.end(readFileSync(file));
  } else {
    res.writeHead(404); res.end("not found");
  }
});
await new Promise((r) => server.listen(PORT, r));

mkdirSync(join(PROJ, "qa", "shots"), { recursive: true });
const browser = await chromium.launch();
const results = [];
let failures = 0;

function primeScroll(page) {
  return page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0;
      const step = () => {
        y += 350; window.scrollTo(0, y);
        if (y < document.body.scrollHeight + 350) setTimeout(step, 90);
        else { setTimeout(res, 300); } /* stay at the bottom so bottom-of-page lazy images trigger */
      };
      step();
    });
  });
}

for (const vp of VIEWPORTS) {
  for (const pg of PAGES) {
    const row = { vp: vp.name, page: pg, errors: 0, overflow: 0, h1s: 0, current: 0, imgBad: 0, netBad: 0 };
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const consoleErrs = [];
    const netBad = [];
    page.on("console", (m) => { if (m.type() === "error") consoleErrs.push(m.text().slice(0, 160)); });
    page.on("pageerror", (e) => consoleErrs.push("pageerror: " + String(e).slice(0, 160)));
    page.on("response", (r) => {
      if (r.status() < 400) return;
      /* maxres/sd thumbnail 404s are by-design fallback triggers (hqdefault always exists) */
      if (r.status() === 404 && /img\.youtube\.com\/vi\/[^/]+\/(maxres|sd)default\.jpg/.test(r.url())) return;
      netBad.push(r.status() + " " + r.url().slice(0, 120));
    });
    page.on("requestfailed", (r) => { if (!/data:|favicon/.test(r.url())) netBad.push("FAILED " + r.url().slice(0, 120)); });
    try {
      await page.goto(`http://localhost:${PORT}/${pg}`, { waitUntil: "load", timeout: 45000 });
      await primeScroll(page);
      /* wait for every image (incl. lazily triggered ones) to finish, then settle */
      await page.waitForFunction(() => Array.from(document.images).every((i) => i.complete), null, { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(800);
      const checks = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        h1s: document.querySelectorAll("h1").length,
        current: document.querySelectorAll('[aria-current="page"]').length,
        imgBad: Array.from(document.images).filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src.slice(0, 110)),
      }));
      row.errors = consoleErrs.length;
      row.overflow = checks.overflow > 0 ? checks.overflow : 0;
      row.h1s = checks.h1s;
      row.current = checks.current;
      row.imgBad = checks.imgBad.length;
      row.netBad = netBad.length;
      row.detail = [...consoleErrs.slice(0, 3), ...checks.imgBad.slice(0, 3), ...netBad.slice(0, 4)];
      if (consoleErrs.length || row.overflow > 0 || checks.h1s !== 1 || checks.current !== 1 || checks.imgBad.length || netBad.length) failures++;
    } catch (e) {
      row.errors = 1; row.detail = [String(e).slice(0, 150)]; failures++;
    }
    results.push(row);
    if (vp.name === "1440" || vp.name === "390") {
      try { await page.screenshot({ path: join(PROJ, "qa", "shots", pg.replace(".html", "") + "-" + vp.name + ".png"), fullPage: true }); } catch {}
    }
    await page.close();
  }
}

/* ---------------- interactions (desktop + mobile) ---------------- */
const interactions = [];
async function interact(name, fn, shot) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    const ok = await fn(page);
    interactions.push({ name, ok: !!ok });
    if (!ok) failures++;
    if (shot) await page.screenshot({ path: join(PROJ, "qa", "shots", shot) });
  } catch (e) {
    interactions.push({ name, ok: false, err: String(e).slice(0, 140) });
    failures++;
  }
  await page.close();
}

await interact("drawer open/close (mobile)", async () => {
  const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(`http://localhost:${PORT}/index.html`, { waitUntil: "load" });
  await p.click("[data-drawer-open]");
  await p.waitForTimeout(450);
  const open = await p.evaluate(() => document.querySelector("#drawer").classList.contains("open") && !document.querySelector("#drawer").hidden);
  await p.click("[data-drawer-close]");
  await p.waitForTimeout(450);
  const closed = await p.evaluate(() => document.querySelector("#drawer").classList.contains("open") === false);
  await p.close();
  return open && closed;
});

await interact("video filter (videos page)", async (p) => {
  await p.goto(`http://localhost:${PORT}/videos.html`, { waitUntil: "load" });
  await p.waitForTimeout(600);
  const before = await p.evaluate(() => document.querySelectorAll("[data-role='video-grid'] .vcard:not(.hide)").length);
  const chip = await p.$("[data-role='video-filters'] .fchip[data-cat='algebra']");
  if (!chip) return false;
  await chip.click();
  const after = await p.evaluate(() => ({
    visible: document.querySelectorAll("[data-role='video-grid'] .vcard:not(.hide)").length,
    allAlgebra: Array.from(document.querySelectorAll("[data-role='video-grid'] .vcard:not(.hide)")).every((c) => c.getAttribute("data-cat") === "algebra"),
  }));
  return before === 13 && after.visible === 6 && after.allAlgebra;
});

await interact("youtube click-to-load plays (videos page)", async (p) => {
  await p.goto(`http://localhost:${PORT}/videos.html`, { waitUntil: "load" });
  await p.waitForTimeout(800);
  const btn = await p.$(".yt-frame .yt-play");
  if (!btn) return false;
  await btn.click();
  await p.waitForTimeout(1200);
  return p.evaluate(() => {
    const f = document.querySelector(".yt-frame iframe");
    return !!f && /youtube\.com\/embed\//.test(f.src);
  });
});

await interact("facebook embed chain (if FB cards present)", async (p) => {
  await p.goto(`http://localhost:${PORT}/videos.html`, { waitUntil: "load" });
  await p.waitForTimeout(800);
  const btn = await p.$(".fb-frame .fb-open");
  if (!btn) return "no-fb-cards";
  await btn.click();
  await p.waitForTimeout(2500);
  return p.evaluate(() => {
    const f = document.querySelector(".fb-frame iframe");
    return !!f && /facebook\.com/.test(f.src);
  });
});

await interact("gallery lightbox", async (p) => {
  await p.goto(`http://localhost:${PORT}/gallery.html`, { waitUntil: "load" });
  await p.waitForTimeout(900);
  const item = await p.$(".g-item a.glightbox");
  if (!item) return "no-gallery-items";
  await item.click();
  await p.waitForTimeout(900);
  return p.evaluate(() => !!document.querySelector(".glightbox-container"));
});

await interact("form validation + honest handoff", async (p) => {
  await p.goto(`http://localhost:${PORT}/contact.html`, { waitUntil: "load" });
  await p.waitForTimeout(500);
  await p.click("[data-role='contact-form'] button[type='submit']");
  const invalid = await p.evaluate(() => document.querySelectorAll(".field.invalid").length > 0);
  await p.fill("input[name='name']", "Test Person");
  await p.fill("textarea[name='message']", "Salam, I want to join the P3 class.");
  await p.click("[data-role='contact-form'] button[type='submit']");
  await p.waitForTimeout(400);
  const okShown = await p.evaluate(() => { const ok = document.querySelector(".form-ok"); return ok && ok.classList.contains("show"); });
  return invalid && okShown;
});

await browser.close();
server.close();

/* ---------------- report ---------------- */
console.log("\nPAGES (page × viewport)");
for (const r of results) {
  const flag = (r.errors || r.overflow > 0 || r.h1s !== 1 || r.current !== 1 || r.imgBad || r.netBad) ? "FAIL" : "ok  ";
  console.log(`${flag} ${r.vp.padStart(4)} ${r.page.padEnd(15)} errs:${r.errors} ovf:${r.overflow} h1:${r.h1s} cur:${r.current} imgBad:${r.imgBad} netBad:${r.netBad}${r.detail && r.detail.length ? "  → " + r.detail.join(" | ").slice(0, 220) : ""}`);
}
console.log(`\npages×viewports: ${results.length}, failing rows: ${results.filter((r) => r.errors || r.overflow > 0 || r.h1s !== 1 || r.current !== 1 || r.imgBad || r.netBad).length}`);
console.log("\nINTERACTIONS");
for (const i of interactions) console.log(`${i.ok ? "ok  " : "FAIL"} ${i.name}${i.ok === "no-fb-cards" ? " (no FB cards in data — skipped)" : ""}${i.err ? " → " + i.err : ""}`);
const skipped = interactions.filter((i) => i.ok === "no-fb-cards").length;
console.log(`\nFULLTEST: ${failures === 0 ? "ALL GREEN" : failures + " FAILURES"}${skipped ? ` (${skipped} FB check(s) skipped — no FB cards in data yet)` : ""}`);
writeFileSync(join(PROJ, "qa", "fulltest.json"), JSON.stringify({ results, interactions }, null, 2));
process.exit(failures === 0 ? 0 : 1);
