/* PublicScout: offline support.
   - The app itself opens with no signal (cached on first visit, refreshed whenever you're online).
   - Map pieces come from saved areas first, then the network; recently viewed pieces are kept too. */
const SHELL = "rrha-shell-v12", RECENT = "rrha-recent", RECENT_MAX = 3000;
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"];
let OFF = false, puts = 0;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => Promise.all(CORE.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith("rrha-shell-") && k !== SHELL) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener("message", e => { if (e.data && "offline" in e.data) OFF = !!e.data.offline; });

const isTile = u => /\/tile\/\d+\/\d+\/\d+|elevation-tiles-prod\/terrarium\/|tiles\.openfreemap\.org\/planet\/.+\.pbf|tile\.waymarkedtrails\.org\//.test(u);
const isLib = u => /^https:\/\/(unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com|www\.gstatic\.com\/firebasejs)\//.test(u);
const timeout = (p, ms) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error("timeout")), ms))]);
async function trim(){
  const c = await caches.open(RECENT), k = await c.keys();
  if (k.length > RECENT_MAX) for (const r of k.slice(0, k.length - RECENT_MAX)) await c.delete(r);
}

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = r.url;

  // The app page: network first (so updates arrive), saved copy when there's no signal
  if (r.mode === "navigate"){
    e.respondWith((async () => {
      if (!OFF) try {
        const n = await timeout(fetch(r), 6000);
        if (n.ok){ const cp = n.clone(); caches.open(SHELL).then(c => c.put("./index.html", cp)); }
        return n;
      } catch {}
      return (await caches.match("./index.html")) || (await caches.match("./")) || new Response("<h1>Offline</h1><p>Open the app once with signal so it can save itself.</p>", { headers: { "Content-Type": "text/html" } });
    })());
    return;
  }

  // Map pieces: saved copy first, then the network (kept as "recently viewed")
  if (isTile(u)){
    e.respondWith((async () => {
      const hit = await caches.match(u, { ignoreVary: true });
      if (hit) return hit;
      if (OFF) return new Response("", { status: 504 });
      try {
        const n = await fetch(u, { mode: "cors", credentials: "omit" });
        if (n.ok){ const cp = n.clone(); caches.open(RECENT).then(c => c.put(u, cp)).then(() => { if (++puts % 150 === 0) trim(); }); }
        return n;
      } catch {
        try { return await fetch(r); } catch { return new Response("", { status: 504 }); }
      }
    })());
    return;
  }

  // Trail tile index: fresh when online, saved copy when not
  if (u === "https://tiles.openfreemap.org/planet"){
    e.respondWith(timeout(fetch(r), 6000).then(n => { if (n.ok){ const cp = n.clone(); caches.open(RECENT).then(c => c.put(u, cp)); } return n; }).catch(async () => (await caches.match(u)) || Response.error()));
    return;
  }

  // Map library, fonts, sign-in library: saved copy right away, refreshed in the background
  if (isLib(u)){
    e.respondWith((async () => {
      const hit = await caches.match(r, { ignoreVary: true });
      const net = fetch(r).then(n => { if (n.ok || n.type === "opaque"){ const cp = n.clone(); caches.open(SHELL).then(c => c.put(r, cp)); } return n; }).catch(() => null);
      return hit || (await net) || Response.error();
    })());
    return;
  }

  // The app's own small files (icons, manifest)
  if (new URL(u).origin === self.location.origin){
    e.respondWith(caches.match(r).then(hit => hit || fetch(r)));
  }
});
