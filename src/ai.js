
/* ===================== AI scan: Claude looks at the map and picks the spots =====================
   The app builds a package (pictures + facts) for the legal ground in view. A separate Claude page (AI_URL) reads it on the
   hunter's own Claude account and sends ranked picks back. Nothing here runs automatically, and nothing is sent anywhere by this app. */
const AI_URL = "https://claude.ai/artifact/9tsb3Ca6qodaaH6HmcNs1L";
const AI_SIZES = { small: { name: "Small", blocks: 8, look: 4, topo: false }, medium: { name: "Medium", blocks: 16, look: 7, topo: true }, full: { name: "Full", blocks: 24, look: 10, topo: true } };
const AI_FOCUS = [["bottoms", "Hardwood bottoms and acorns"], ["thick", "Thickets and bedding cover"], ["pockets", "Low-pressure pockets away from access"], ["creek", "Creek bends, crossings and benches"], ["edges", "Fence lines and field edges"]];
const AI_NLCD = { 11: "open water", 21: "developed", 22: "developed", 23: "developed", 24: "developed", 31: "bare ground", 41: "hardwoods", 42: "pines", 43: "mixed pine-hardwood", 52: "brush/young growth", 71: "grass", 81: "pasture", 82: "crops", 90: "wet bottomland woods", 95: "marsh" };
let AI = store.get("rrha_ai", null) || { scans: [], log: [], cal: {} }, aiPkg = null;
const aiSave = () => store.set("rrha_ai", AI);
const aiPins = L.layerGroup().addTo(map);
// ----- small geometry helpers (metres on a local flat grid) -----
const aiK = lat => [111320 * Math.cos(lat * Math.PI / 180), 110570];
function aiNear(lat, lng, lines){ const [kx, ky] = aiK(lat); let best = 1e9, bx = 0, by = 0, hit = null;
  for (const ln of lines){ const g = ln.g; for (let i = 0; i < g.length; i++){ const a = g[i], b = g[i + 1] || g[i];
    const ax = (a[0] - lng) * kx, ay = (a[1] - lat) * ky, dx = (b[0] - lng) * kx - ax, dy = (b[1] - lat) * ky - ay, L2 = dx * dx + dy * dy;
    const t = L2 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / L2)) : 0, px = ax + t * dx, py = ay + t * dy, d = Math.hypot(px, py); if (d < best){ best = d; bx = px; by = py; hit = ln; } } }
  return hit ? { d: best, brg: (Math.atan2(bx, by) * 180 / Math.PI + 360) % 360, p: hit.p || {} } : null; }
const aiLines = fts => fts.flatMap(f => { const g = f.geometry; if (!g) return []; const parts = g.type === "LineString" ? [g.coordinates] : g.type === "MultiLineString" ? g.coordinates : g.type === "Polygon" ? g.coordinates : g.type === "MultiPolygon" ? g.coordinates.flat() : g.type === "Point" ? [[g.coordinates]] : [];
  return parts.map(p => ({ g: p, p: f.properties || {} })); });
const aiIn = (lat, lng, f) => { const g = f.geometry; if (!g) return false; const polys = g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];
  return polys.some(poly => inRing([lat, lng], poly[0]) && !poly.slice(1).some(h => inRing([lat, lng], h))); };
const aiYd = m => Math.round(m * 1.0936 / 10) * 10, aiDD = (d, brg) => `${aiYd(d)} yd ${srD16(brg)}`;
const aiQ = async (url, b, fields, where) => { const p = new URLSearchParams({ where: where || "1=1", geometry: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()].map(v => v.toFixed(5)).join(","), geometryType: "esriGeometryEnvelope", inSR: "4326", outSR: "4326",
    spatialRel: "esriSpatialRelIntersects", outFields: fields || "*", returnGeometry: "true", f: "geojson", geometryPrecision: "5", resultRecordCount: "500" });
  const c = new AbortController(), t = setTimeout(() => c.abort(), 20000);
  try { const j = await (await fetch(url + "/query?" + p, { signal: c.signal })).json(); if (!j.features) throw new Error("no data"); return j.features; } finally { clearTimeout(t); } };
// ----- usage estimate: what is measured (pictures, pixels, characters) and what is estimated (tokens) -----
const aiImgTok = (w, h) => Math.min(1600, Math.round(w * h / 750));
function aiEstimate(size, pkg){ const S = AI_SIZES[size], n = pkg ? pkg.blocks.length : S.blocks, look = Math.min(S.look, n);
  const ov = pkg ? aiImgTok(pkg.ovW, pkg.ovH) : 1400, cu = pkg ? aiImgTok(pkg.cuW, pkg.cuH) : 350, topo = S.topo ? ov : 0;
  const lineTok = pkg ? Math.round(pkg.blocks.reduce((a, b) => a + b.line.length, 0) / n / 3.6) : 110, baseTok = 900;
  const pics = 1 + (S.topo ? 1 : 0) + 1 + look, tokIn = Math.round(baseTok + ov + topo + n * lineTok + baseTok + ov + look * (cu + lineTok + 60)), tokOut = 250 + look * 130;
  return { blocks: n, look, pics, calls: 2, tokIn, tokOut, tok: tokIn + tokOut }; }
const aiFmtTok = t => t >= 1000 ? (t / 1000).toFixed(t >= 10000 ? 0 : 1) + "k" : String(t);
function aiTotals(){ const now = Date.now(), day = new Date(); day.setHours(0, 0, 0, 0); const done = AI.log.filter(e => e.sent);
  const sum = arr => arr.reduce((a, e) => a + (e.sent.tok || 0), 0), d = done.filter(e => e.t >= day.getTime()), w = done.filter(e => e.t >= now - 7 * 864e5);
  return { dayN: d.length, dayTok: sum(d), weekN: w.length, weekTok: sum(w), allN: done.length }; }
function aiPredict(size){ const c = AI.cal || {}, e = aiEstimate(size);
  if (!(c.after > c.before) || !c.tok) return null; const pctPerTok = (c.after - c.before) / c.tok, per = pctPerTok * e.tok, budget = c.budget || 10;
  return { per, perWeek: Math.floor(budget / per), budget }; }
// ----- tiles stitched into one picture, with a lat/lng -> pixel function -----
async function aiStitch(urlFn, s, w, n, e, maxPx, maxZ){ let z = maxZ;
  for (; z > 8; z--){ const a = proj(n, w, z), b = proj(s, e, z); if (Math.max(b.x - a.x, b.y - a.y) <= maxPx * 2 && (Math.floor(b.x / 256) - Math.floor(a.x / 256) + 1) * (Math.floor(b.y / 256) - Math.floor(a.y / 256) + 1) <= 36) break; }
  const a = proj(n, w, z), b = proj(s, e, z), W0 = b.x - a.x, H0 = b.y - a.y, k = Math.min(1, maxPx / Math.max(W0, H0)), W = Math.round(W0 * k), H = Math.round(H0 * k);
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H; const g = cv.getContext("2d"); g.fillStyle = "#333"; g.fillRect(0, 0, W, H);
  const jobs = []; for (let ty = Math.floor(a.y / 256); ty <= Math.floor((b.y - .01) / 256); ty++) for (let tx = Math.floor(a.x / 256); tx <= Math.floor((b.x - .01) / 256); tx++)
    jobs.push(loadImg(urlFn(z, tx, ty)).then(im => g.drawImage(im, (tx * 256 - a.x) * k, (ty * 256 - a.y) * k, 256 * k + .6, 256 * k + .6)).catch(() => {}));
  await Promise.all(jobs);
  return { cv, g, W, H, z, xy: (lat, lng) => { const p = proj(lat, lng, z); return [(p.x - a.x) * k, (p.y - a.y) * k]; }, mpp: 40075016.686 * Math.cos((s + n) / 2 * Math.PI / 180) / (256 * 2 ** z) / k }; }
const AI_SAT = (z, x, y) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
const AI_TOPO = (z, x, y) => `https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/${z}/${y}/${x}`;
function aiDraw(im, D, opt){ const g = im.g, path = (ln, close) => { g.beginPath(); ln.forEach((c, i) => { const [x, y] = im.xy(c[1], c[0]); i ? g.lineTo(x, y) : g.moveTo(x, y); }); if (close) g.closePath(); };
  g.lineJoin = "round"; g.lineCap = "round";
  if (!opt.topo){ g.strokeStyle = "rgba(90,200,255,.85)"; g.lineWidth = opt.close ? 1.2 : 1.6; D.streams.forEach(l => { path(l.g); g.stroke(); });
    g.setLineDash([5, 4]); g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 1.2; D.roads.forEach(l => { path(l.g); g.stroke(); }); g.setLineDash([]);
    g.strokeStyle = "#ff9f1c"; g.lineWidth = 2; D.mvum.forEach(l => { path(l.g); g.stroke(); }); }
  g.strokeStyle = "#ffe600"; g.lineWidth = opt.close ? 2 : 2.5; D.pubRings.forEach(r => { path(r, true); g.stroke(); });
  g.strokeStyle = "#ff2d2d"; g.lineWidth = 2; D.noRings.forEach(r => { path(r, true); g.stroke(); });
  const label = (t, x, y, sz, col) => { g.font = `700 ${sz}px sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.lineWidth = 3.5; g.strokeStyle = "rgba(0,0,0,.85)"; g.strokeText(t, x, y); g.fillStyle = col || "#fff"; g.fillText(t, x, y); };
  (opt.blocks || []).forEach(b => { const [x0, y0] = im.xy(b.n, b.w), [x1, y1] = im.xy(b.s, b.e); g.setLineDash(opt.close ? [6, 5] : []); g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 1.3; g.strokeRect(x0, y0, x1 - x0, y1 - y0); g.setLineDash([]);
    if (!opt.close) label(b.id, (x0 + x1) / 2, (y0 + y1) / 2, Math.max(11, Math.min(20, (x1 - x0) * .3))); });
  D.pts.forEach(p => { const [x, y] = im.xy(p.lat, p.lng); if (x < 0 || y < 0 || x > im.W || y > im.H) return; label(p.glyph, x, y, 13, p.col); });
  D.wps.forEach(wp => { const [x, y] = im.xy(wp.lat, wp.lng); if (x < 0 || y < 0 || x > im.W || y > im.H) return; g.beginPath(); g.arc(x, y, 6, 0, 7); g.fillStyle = "#ff3df2"; g.fill(); g.lineWidth = 1.5; g.strokeStyle = "#000"; g.stroke(); label(String(wp.n), x, y - 13, 12, "#ff9cf8"); });
  // scale bar and north mark
  const yd = opt.close ? 100 : 500, px = yd * .9144 / im.mpp; g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(6, im.H - 24, px + 12, 18); g.fillStyle = "#fff"; g.fillRect(12, im.H - 12, px, 3);
  g.font = "600 10px sans-serif"; g.textAlign = "left"; g.textBaseline = "alphabetic"; g.fillText(yd + " yd", 12, im.H - 14); label("N↑", im.W - 16, 12, 12); }
const aiJpg = (cv, q) => cv.toDataURL("image/jpeg", q);
// ----- forecast for the sit -----
async function aiForecast(lat, lng, date, session){ const hrs = { Morning: [6, 10], Midday: [10, 15], Evening: [15, 18], "All day": [6, 18] }[session] || [6, 18];
  const q = new URLSearchParams({ latitude: lat.toFixed(3), longitude: lng.toFixed(3), hourly: "temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation_probability", wind_speed_unit: "mph", temperature_unit: "fahrenheit", timezone: "auto", start_date: date, end_date: date });
  const j = await (await fetch("https://api.open-meteo.com/v1/forecast?" + q)).json(), h = j.hourly; if (!h || !h.time) return null;
  const ix = h.time.map((t, i) => [+t.slice(11, 13), i]).filter(x => x[0] >= hrs[0] && x[0] <= hrs[1]).map(x => x[1]); if (!ix.length || h.wind_direction_10m[ix[0]] == null) return null;
  let sx = 0, sy = 0; ix.forEach(i => { const r = h.wind_direction_10m[i] * Math.PI / 180; sx += Math.sin(r); sy += Math.cos(r); }); const mm = k => [Math.round(Math.min(...ix.map(i => h[k][i]))), Math.round(Math.max(...ix.map(i => h[k][i])))];
  const dirs = [...new Set(ix.map(i => srD16(h.wind_direction_10m[i])))];
  return { from: srD16((Math.atan2(sx, sy) * 180 / Math.PI + 360) % 360), fromDeg: Math.round((Math.atan2(sx, sy) * 180 / Math.PI + 360) % 360), dirs, mph: mm("wind_speed_10m"), gust: mm("wind_gusts_10m")[1], temp: mm("temperature_2m"), rain: Math.max(...ix.map(i => h.precipitation_probability[i] || 0)), steady: Math.hypot(sx, sy) / ix.length > .85 }; }
// ----- build the package -----
async function aiBuild(size, sit, focus, notes, onProg){
  const S = AI_SIZES[size], vb = map.getBounds(), c = vb.getCenter(), missing = [], say = t => onProg && onProg(t);
  const wM = map.distance([c.lat, vb.getWest()], [c.lat, vb.getEast()]), hM = map.distance([vb.getSouth(), c.lng], [vb.getNorth(), c.lng]);
  if (Math.max(wM, hM) > 7000) throw new Error("This view is too big for an AI scan. Zoom in until one block of land fills the screen (about 4 miles across at most).");
  say("Loading boundaries, creeks, roads, forest type, burns, cuts and the forecast…");
  const b = vb.pad(.08), soft = (p, name, d) => p.catch(() => { missing.push(name); return d; });
  const inTX = c.lat > 25.8 && c.lat < 36.6 && c.lng > -106.7 && c.lng < -93.5;
  const [pad, tpB, osm, burns, cuts, mv, tpPts, nl, fc] = await Promise.all([
    fetchPad(b), soft(fetchTpwdBounds(b).then(x => x || []), "TPWD unit boundaries", []), soft(overpass(b), "roads and creeks", { elements: [] }),
    soft(aiQ(HAZ, b, "date_completed,treatment_type,gis_acres", `date_completed >= DATE '${rxSince}'`), "prescribed burns", []),
    soft(aiQ(HARVEST_URL, b, "activity_name,fy_completed", "fy_completed >= '2008'"), "timber cuts", []),
    soft(aiQ("https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_MVUM_01/MapServer/1", b, "name,id,symbol"), "open Forest Service roads", []),
    inTX ? soft(aiQ(TPWD + "TPWD_PublicHuntLocatorMap/MapServer/7", b, "Class,LocName"), "TPWD parking and gates", []) : [],
    soft(aiNlcd(b), "forest type", null), soft(aiForecast(c.lat, c.lng, sit.date, sit.session), "forecast", null)]);
  const pubF = pad.features.filter(f => scanPublic(f.properties)), tpOk = tpB.filter(f => /property boundary|hunt area|hunting compartment/i.test(f.properties.Class || "") && !/waterfowl/i.test(f.properties.Class || "")),
    tpNo = tpB.filter(f => /no hunt|no public access|in-?holding/i.test(f.properties.Class || ""));
  // Texas: Corps lakes, state parks and river-authority land are closed outside TPWD's units, so there only TPWD units and non-Corps federal land count
  const padOk = inTX ? pubF.filter(f => f.properties.Mang_Type === "FED" && !/COE|USACE|CORPS/i.test(f.properties.Mang_Name || "") && huntClass(f.properties) === "yes") : pubF;
  const legal = (lat, lng) => !tpNo.some(f => aiIn(lat, lng, f)) && (tpOk.some(f => aiIn(lat, lng, f)) || padOk.some(f => aiIn(lat, lng, f)));
  const el = osm.elements || [], asLine = e => ({ g: e.geometry.map(p => [p.lon, p.lat]), p: e.tags });
  const D = { streams: el.filter(e => e.tags.waterway).map(asLine), ponds: el.filter(e => e.tags.natural).map(asLine), roads: el.filter(e => e.tags.highway).map(asLine), mvum: aiLines(mv),
    pubRings: aiLines(padOk.concat(tpOk)).map(l => l.g), noRings: aiLines(tpNo).map(l => l.g),
    pts: tpPts.filter(f => f.geometry && /park|access|entrance|gate|camp|info|registration/i.test(f.properties.Class || "")).map(f => { const k = f.properties.Class || ""; return { lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0], cls: k, glyph: /camp/i.test(k) ? "⛺" : /gate/i.test(k) ? "G" : "P", col: /gate/i.test(k) ? "#ff6b6b" : "#7cc4ff" }; }),
    wps: wpts.filter(w => b.contains([w.lat, w.lng])).map((w, i) => Object.assign({ n: i + 1 }, w)) };
  // blocks: tile the legal ground; grow the block size until the count fits the scan size
  const [kx, ky] = aiK(c.lat); let blocks = [], bm = 300, dropped = 0;
  for (const m of [300, 350, 400, 500]){ bm = m; blocks = []; const nx = Math.max(1, Math.round(wM / m)), ny = Math.max(1, Math.round(hM / m)), dLng = (vb.getEast() - vb.getWest()) / nx, dLat = (vb.getNorth() - vb.getSouth()) / ny;
    for (let r = 0; r < ny; r++) for (let q = 0; q < nx; q++){ const n = vb.getNorth() - r * dLat, w = vb.getWest() + q * dLng, lat = n - dLat / 2, lng = w + dLng / 2, o = m / 3;
      const ok = [[o, o], [o, -o], [-o, o], [-o, -o]].filter(([dx, dy]) => legal(lat + dy / ky, lng + dx / kx)).length;
      if (legal(lat, lng) && ok >= 2) blocks.push({ id: String.fromCharCode(65 + r % 26) + (q + 1), lat, lng, n, s: n - dLat, w, e: w + dLng }); }
    if (blocks.length <= S.blocks) break; }
  if (!blocks.length) throw new Error("No ground open to public hunting fills a block in this view. Pan to a hunting unit and try again.");
  if (blocks.length > S.blocks){ blocks.sort((p, q) => map.distance([p.lat, p.lng], c) - map.distance([q.lat, q.lng], c)); dropped = blocks.length - S.blocks; blocks = blocks.slice(0, S.blocks); blocks.sort((p, q) => p.id.localeCompare(q.id, undefined, { numeric: true })); }
  // facts for each block, from data already loaded (no per-block requests)
  const anyRoads = D.roads.concat(D.mvum), walkPts = D.pts.filter(p => p.glyph !== "⛺");
  for (const B of blocks){ const f = [], near = (ls) => aiNear(B.lat, B.lng, ls);
    if (nl){ const t = aiNlcdMix(nl, B); if (t) f.push("Cover: " + t); }
    const st = near(D.streams), pd = near(D.ponds); if (st && st.d < 800) f.push("creek " + aiDD(st.d, st.brg)); else f.push("no mapped creek within 800 yd"); if (pd && pd.d < 400) f.push("pond " + aiDD(pd.d, pd.brg));
    const rd = near(anyRoads), mo = near(D.mvum); if (rd) f.push("nearest road or trail " + aiDD(rd.d, rd.brg)); if (mo && mo.d < 3000) f.push(`open Forest Service road${mo.p.name ? " " + mo.p.name : mo.p.id ? " " + mo.p.id : ""} ${aiDD(mo.d, mo.brg)}`);
    const pk = walkPts.map(p => ({ p, d: map.distance([B.lat, B.lng], [p.lat, p.lng]) })).sort((x, y) => x.d - y.d)[0]; if (pk && pk.d < 4000) f.push(`${/gate/i.test(pk.p.cls) ? "gate" : "parking/access"} ${aiDD(pk.d, brg(L.latLng(B.lat, B.lng), L.latLng(pk.p.lat, pk.p.lng)))}`);
    let edge = null; for (let d = 60; d <= 600 && !edge; d += 60) for (let a = 0; a < 360; a += 45){ const la = B.lat + d * Math.cos(a * Math.PI / 180) / ky, ln = B.lng + d * Math.sin(a * Math.PI / 180) / kx; if (!legal(la, ln)){ edge = { d, a, what: nl ? AI_NLCD[aiNlcdAt(nl, la, ln)] : null }; break; } }
    f.push(edge ? `non-public land ${aiDD(edge.d, edge.a)}${edge.what ? " (" + edge.what + ")" : ""}` : "600+ yd inside public land on all sides");
    const bn = burns.filter(x => aiIn(B.lat, B.lng, x)).map(x => new Date(x.properties.date_completed).getFullYear()).sort().pop(); if (bn) f.push("prescribed burn " + bn);
    const ct = cuts.filter(x => aiIn(B.lat, B.lng, x)).map(x => `${(x.properties.activity_name || "timber activity").toLowerCase()} ${x.properties.fy_completed || ""}`.trim())[0]; if (ct) f.push(ct);
    const ws = D.wps.map(w => ({ w, d: map.distance([B.lat, B.lng], [w.lat, w.lng]) })).filter(x => x.d < bm * .9).sort((x, y) => x.d - y.d).slice(0, 5);
    if (ws.length) f.push("Hunter's own marks: " + ws.map(x => { const lg = hlog.filter(e => e.wid === x.w.id).slice(0, 3).map(e => `${e.t.slice(5, 10)} ${e.ses} wind ${e.wind}: ${e.seen} seen${e.males ? ", " + e.males + " bucks" : ""}`).join("; ");
      return `#${x.w.n} "${x.w.name}" (${(WTYPES[x.w.type] || ["mark"])[0]}${x.w.notes ? "; " + String(x.w.notes).slice(0, 80) : ""}) ${aiDD(x.d, brg(L.latLng(B.lat, B.lng), L.latLng(x.w.lat, x.w.lng)))}${lg ? " [sits: " + lg + "]" : ""}`; }).join(" | "));
    B.line = f.join("; "); }
  // pictures
  say(`Drawing ${blocks.length + 1 + (S.topo ? 1 : 0)} pictures…`);
  const ov = await aiStitch(AI_SAT, vb.getSouth(), vb.getWest(), vb.getNorth(), vb.getEast(), 1024, 17); aiDraw(ov, D, { blocks });
  let topo = null; if (S.topo){ topo = await aiStitch(AI_TOPO, vb.getSouth(), vb.getWest(), vb.getNorth(), vb.getEast(), 1024, 16); aiDraw(topo, D, { blocks, topo: true }); }
  let cuW = 0, cuH = 0;
  for (let i = 0; i < blocks.length; i += 4) await Promise.all(blocks.slice(i, i + 4).map(async B => { const mLat = (B.n - B.s) * .2, mLng = (B.e - B.w) * .2;
    const im = await aiStitch(AI_SAT, B.s - mLat, B.w - mLng, B.n + mLat, B.e + mLng, 512, 18); aiDraw(im, D, { blocks: [B], close: true }); B.img = aiJpg(im.cv, .62); cuW = im.W; cuH = im.H; }));
  const unit = (padOk.find(f => aiIn(c.lat, c.lng, f)) || padOk[0] || { properties: {} }).properties.Unit_Nm || "", tpName = (tpOk[0] || { properties: {} }).properties.LocName || "";
  const sun = sunTimes(new Date(sit.date + "T12:00"), c.lat, c.lng), tm = d => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), se = proSeason(new Date(sit.date + "T12:00"), c.lat, c.lng);
  const pkg = { kind: "publicscout-ai-package", v: 1, id: uid() + uid(), made: new Date().toISOString(), app: APP_VERSION, area: tpName || unit || "Public land", center: [+c.lat.toFixed(5), +c.lng.toFixed(5)], county: (typeof hereCounty !== "undefined" && hereCounty) || "",
    size, look: Math.min(S.look, blocks.length), blockYd: aiYd(bm), dropped,
    sit: { date: sit.date, session: sit.session, weapon: sit.weapon, wx: fc, sunrise: tm(sun.rise), sunset: tm(sun.set) }, season: se ? `${se.name} (${se.region}; TPWD peak breeding about ${se.peak.toLocaleDateString([], { month: "short", day: "numeric" })})` : "", focus, notes: String(notes || "").slice(0, 400), missing,
    marks: D.wps.map(w => `#${w.n} "${w.name}" (${(WTYPES[w.type] || ["mark"])[0]})`).join("; "),
    overview: aiJpg(ov.cv, .68), topo: topo ? aiJpg(topo.cv, .68) : null, ovW: ov.W, ovH: ov.H, cuW, cuH,
    blocks: blocks.map(B => ({ id: B.id, lat: +B.lat.toFixed(5), lng: +B.lng.toFixed(5), line: B.line, img: B.img })) };
  pkg.est = aiEstimate(size, pkg); return pkg; }
// forest type: one NLCD picture for the whole view, read back into classes
async function aiNlcd(b){ const w = Math.min(400, Math.max(40, Math.round(map.distance([b.getCenter().lat, b.getWest()], [b.getCenter().lat, b.getEast()]) / 30))), h = Math.round(w * (b.getNorth() - b.getSouth()) / (b.getEast() - b.getWest()) / Math.cos(b.getCenter().lat * Math.PI / 180));
  const im = await loadImg("https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2021_Land_Cover_L48/wms?" + new URLSearchParams({ service: "WMS", version: "1.1.1", request: "GetMap", layers: "NLCD_2021_Land_Cover_L48", styles: "", srs: "EPSG:4326", bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()].join(","), width: w, height: h, format: "image/png" }));
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; const g = cv.getContext("2d", { willReadFrequently: true }); g.drawImage(im, 0, 0, w, h); const d = g.getImageData(0, 0, w, h).data, cls = new Uint8Array(w * h), ks = Object.keys(NLCD_RGB);
  for (let i = 0; i < w * h; i++){ let best = 0, bd = 1e9; for (const k of ks){ const c = NLCD_RGB[k], dd = (d[i * 4] - c[0]) ** 2 + (d[i * 4 + 1] - c[1]) ** 2 + (d[i * 4 + 2] - c[2]) ** 2; if (dd < bd){ bd = dd; best = +k; } } cls[i] = bd < 900 ? best : 0; }
  return { cls, w, h, W: b.getWest(), E: b.getEast(), S: b.getSouth(), N: b.getNorth() }; }
const aiNlcdAt = (nl, lat, lng) => { const x = Math.floor((lng - nl.W) / (nl.E - nl.W) * nl.w), y = Math.floor((nl.N - lat) / (nl.N - nl.S) * nl.h); return x < 0 || y < 0 || x >= nl.w || y >= nl.h ? 0 : nl.cls[y * nl.w + x]; };
function aiNlcdMix(nl, B){ const cnt = {}; let n = 0; for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++){ const k = aiNlcdAt(nl, B.s + (B.n - B.s) * (i + .5) / 12, B.w + (B.e - B.w) * (j + .5) / 12); if (!k) continue; const nm = AI_NLCD[k] || "other"; cnt[nm] = (cnt[nm] || 0) + 1; n++; }
  return n ? Object.entries(cnt).sort((a, b) => b[1] - a[1]).filter(x => x[1] / n >= .05).slice(0, 4).map(x => `${x[0]} ${Math.round(x[1] / n * 100)}%`).join(", ") : ""; }
// ----- picks coming back from the Claude page -----
const aiB64 = { enc: s => btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), dec: b => new TextDecoder().decode(Uint8Array.from(atob(b.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b.length + 3) % 4)), ch => ch.charCodeAt(0))) };
function aiImport(text){ let t = String(text || "").trim().replace(/^.*#ai=/, ""); let o = null; try { o = JSON.parse(t); } catch { try { o = JSON.parse(aiB64.dec(t)); } catch {} }
  if (!o || o.kind !== "publicscout-ai-picks" || !Array.isArray(o.picks)) return false;
  let sc = AI.scans.find(s => s.id === o.id); if (!sc){ sc = { id: o.id, t: Date.now(), area: o.area || "AI scan", size: o.size || "", sit: o.sit || null, center: o.picks[0] ? [o.picks[0].lat, o.picks[0].lng] : null }; AI.scans.unshift(sc); }
  sc.res = { t: o.t || Date.now(), verdict: o.verdict || "", note: o.note || "", nothing: !!o.nothing, picks: o.picks.filter(p => isFinite(p.lat) && isFinite(p.lng)).slice(0, 12), skipped: o.skipped || "" };
  if (o.usage){ let e = AI.log.find(x => x.id === o.id); if (!e){ e = { id: o.id, t: Date.now(), size: sc.size, area: sc.area }; AI.log.unshift(e); } e.sent = o.usage; }
  AI.scans = AI.scans.slice(0, 20); AI.log = AI.log.slice(0, 200); AI.show = sc.id; aiSave(); return sc; }
function aiShow(){ aiPins.clearLayers(); const sc = AI.scans.find(s => s.id === AI.show && s.res), box = $("#aiPicks"); if (!box) return;
  if (!sc){ box.innerHTML = ""; return; } const r = sc.res, when = new Date(r.t).toLocaleDateString([], { month: "short", day: "numeric" });
  r.picks.forEach((p, i) => { const mk = L.marker([p.lat, p.lng], { icon: L.divIcon({ className: "", html: `<div class="pin aipin">${i + 1}</div>`, iconSize: [28, 28], iconAnchor: [14, 14] }), title: `Claude pick ${i + 1}` })
    .bindPopup(`<h4>Claude pick ${i + 1} · ${esc(p.g || "")}${p.s != null ? " · " + p.s + "/100" : ""}</h4><div>${esc(p.why || "")}</div>${p.sit ? `<div style="margin-top:4px"><b>Setup:</b> ${esc(p.sit)}</div>` : ""}${p.chk ? `<div class="meta" style="margin-top:4px">Check on foot: ${esc(p.chk)}</div>` : ""}<div class="meta">${p.lat.toFixed(5)}, ${p.lng.toFixed(5)} · block ${esc(p.b || "")}</div>`); aiPins.addLayer(mk); p._mk = mk; });
  box.innerHTML = `<div class="aibox"><b>Claude's picks</b> <span class="meta">${esc(sc.area || "")}${sc.sit ? " · for " + esc(sc.sit.date + " " + sc.sit.session) : ""} · read ${when} · saved on this device</span>
    ${r.nothing ? `<p class="now"><b>Nothing strong here.</b> ${esc(r.note || "")}</p>` : r.note ? `<p>${esc(r.note)}</p>` : ""}
    ${r.picks.map((p, i) => `<div class="aipick" data-i="${i}"><span class="grade ${esc(p.g || "C")}">${esc(p.g || "?")}</span><b>Pick ${i + 1}</b> <span class="meta">${p.s != null ? p.s + "/100 · " : ""}block ${esc(p.b || "")}</span><div>${esc(p.why || "")}</div>${p.sit ? `<div><b>Setup:</b> ${esc(p.sit)}</div>` : ""}${p.chk ? `<div class="meta">Check on foot: ${esc(p.chk)}</div>` : ""}
      <div class="row" style="margin:4px 0 0"><button class="btn sm ghost" data-ai="go">Show</button><button class="btn sm ghost" data-ai="save">Save as waypoint</button><button class="btn sm ghost" data-ai="route">Route in</button></div></div>`).join("")}
    ${r.skipped ? `<p class="meta">Looked at and passed over: ${esc(r.skipped)}</p>` : ""}<p class="meta">Claude judged these from satellite pictures and map facts. It can't see acorns, fresh sign or other hunters, so walk a pick before you trust it.</p>
    <div class="row"><button class="btn sm ghost" id="aiHide">Hide picks</button>${AI.scans.filter(s => s.res).length > 1 ? `<select id="aiOld">${AI.scans.filter(s => s.res).map(s => `<option value="${s.id}" ${s.id === sc.id ? "selected" : ""}>${esc((s.area || "Scan") + " · " + new Date(s.res.t).toLocaleDateString([], { month: "short", day: "numeric" }))}</option>`).join("")}</select>` : ""}</div></div>`;
  box.querySelectorAll(".aipick").forEach(el => { const p = r.picks[+el.dataset.i], ll = L.latLng(p.lat, p.lng); el.querySelectorAll("[data-ai]").forEach(bt => bt.onclick = () => { const a = bt.dataset.ai;
    if (a === "go"){ map.setView(ll, Math.max(map.getZoom(), 16)); p._mk.openPopup(); if (isPhone()) sheetTo(0); }
    else if (a === "save"){ wpts.push({ id: uid(), lat: p.lat, lng: p.lng, type: "stand", name: `Claude pick ${+el.dataset.i + 1}`, notes: [p.why, p.sit].filter(Boolean).join(" Setup: ") }); saveAll(); drawWpts(); toast("Saved as a waypoint."); }
    else if (a === "route" && typeof spotAction === "function") spotAction({ ll: [p.lat, p.lng], name: `Claude pick ${+el.dataset.i + 1}`, mk: p._mk }, "route"); }); });
  $("#aiHide").onclick = () => { AI.show = null; aiSave(); aiShow(); }; const od = $("#aiOld"); if (od) od.onchange = () => { AI.show = od.value; aiSave(); aiShow(); }; }
// ----- the panel -----
function aiPanel(){ const el = $("#aiPanel"); if (!el) return; const t = new Date(Date.now() + 864e5), iso = d => new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10), tt = aiTotals(), c = AI.cal || {};
  const prev = AI.scans.find(s => s.res && s.center && map.getBounds().contains(s.center));
  el.hidden = false; el.innerHTML = `<div class="aibox"><b>AI scan</b> <span class="meta">Claude looks at pictures of this view and picks the spots. It runs on your own Claude account, only when you press the buttons.</span>
    ${prev ? `<p class="now">You already have picks in this view from ${new Date(prev.res.t).toLocaleDateString([], { month: "short", day: "numeric" })}. <button class="btn sm ghost" id="aiReuse">Show them (no usage)</button></p>` : ""}
    <div class="aigrid"><label>Sit date<input type="date" id="aiDate" value="${iso(t)}"></label><label>When<select id="aiSes"><option>Morning</option><option>Midday</option><option>Evening</option><option>All day</option></select></label>
      <label>Weapon<select id="aiWpn"><option>Bow</option><option>Rifle</option></select></label></div>
    <div class="meta" style="margin-top:6px">Look especially for</div><div class="aifocus">${AI_FOCUS.map(f => `<label class="check"><input type="checkbox" value="${f[0]}" checked> ${f[1]}</label>`).join("")}</div>
    <label>Notes for Claude (optional)<input type="text" id="aiNotes" maxlength="400" placeholder="e.g. hunting alone, climber stand, saw does on the east fence"></label>
    <div class="meta" style="margin-top:6px">Scan size (estimated usage)</div>
    <div class="aisz">${Object.entries(AI_SIZES).map(([k, s]) => { const e = aiEstimate(k), pr = aiPredict(k); return `<label class="check"><input type="radio" name="aiSize" value="${k}" ${k === (PREF.aiSize || "small") ? "checked" : ""}> <b>${s.name}</b>: up to ${s.blocks} blocks mapped, ${s.look} looked at closely, ${e.pics} pictures, about ${aiFmtTok(e.tok)} tokens${pr ? ` (about ${pr.per.toFixed(1)}% of your weekly limit; ${pr.perWeek} per week inside your ${pr.budget}% budget)` : ""}</label>`; }).join("")}</div>
    <button class="btn" id="aiGo">Build the package</button><div class="status" id="aiStatus"></div><div id="aiOut"></div>
    <details class="hp"><summary>Bring picks back by hand</summary><p class="meta">If the "Send picks to the map" button on the Claude page opens a different browser than this one, tap "Copy picks" there and paste here.</p><textarea id="aiPaste" rows="2" placeholder="Paste picks here"></textarea><button class="btn sm" id="aiPasteGo">Load picks</button></details>
    <details class="hp"><summary>Usage log (${tt.dayN} today, ${tt.weekN} in 7 days)</summary>
      <p class="meta"><b>Measured:</b> scans run, pictures and characters sent. <b>Estimated:</b> tokens (about 1 per 3.6 characters, picture width × height ÷ 750). The app can't see your Claude limit.</p>
      <p>Today: ${tt.dayN} scans, about ${aiFmtTok(tt.dayTok)} tokens. Last 7 days: ${tt.weekN} scans, about ${aiFmtTok(tt.weekTok)} tokens.</p>
      ${AI.log.length ? `<div class="tw"><table><thead><tr><th>When</th><th>Size</th><th>Pictures</th><th>Tokens (est.)</th></tr></thead><tbody>${AI.log.slice(0, 15).map(e => `<tr><td>${new Date(e.t).toLocaleDateString([], { month: "short", day: "numeric" })} ${new Date(e.t).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</td><td>${esc(e.size || "")}</td><td class="n">${e.sent ? e.sent.pics : "(" + (e.est ? e.est.pics : "?") + ")"}</td><td class="n">${e.sent ? aiFmtTok(e.sent.tok) : "built, not run" + (e.est ? " (" + aiFmtTok(e.est.tok) + ")" : "")}</td></tr>`).join("")}</tbody></table></div>` : `<p class="meta">No scans yet.</p>`}
      <p class="meta" style="margin-top:8px"><b>To predict scans per week:</b> open Claude's Settings &gt; Usage, note the weekly percent before one scan and after it, and type them here.</p>
      <div class="aigrid"><label>Before %<input type="number" id="aiCb" step="0.1" value="${c.before ?? ""}"></label><label>After %<input type="number" id="aiCa" step="0.1" value="${c.after ?? ""}"></label><label>Weekly % for scans<input type="number" id="aiCw" value="${c.budget ?? 10}"></label></div>
      <button class="btn sm ghost" id="aiCalGo">Save (uses your most recent scan)</button></details></div>`;
  const ru = $("#aiReuse"); if (ru) ru.onclick = () => { AI.show = prev.id; aiSave(); aiShow(); $("#aiPicks").scrollIntoView({ behavior: "smooth", block: "nearest" }); };
  el.querySelectorAll('[name="aiSize"]').forEach(r => r.onchange = () => savePref({ aiSize: r.value }));
  $("#aiPasteGo").onclick = () => { const sc = aiImport($("#aiPaste").value); if (sc){ aiShow(); aiPanel(); toast("Picks loaded."); } else toast("That doesn't look like picks from the Claude page."); };
  $("#aiCalGo").onclick = () => { const last = AI.log.find(e => e.sent); if (!last){ toast("Run one scan first."); return; } AI.cal = { before: +$("#aiCb").value, after: +$("#aiCa").value, budget: +$("#aiCw").value || 10, tok: last.sent.tok }; aiSave(); aiPanel(); };
  $("#aiGo").onclick = async () => { const st = $("#aiStatus"), bt = $("#aiGo"), size = (el.querySelector('[name="aiSize"]:checked') || {}).value || "small";
    if (map.getZoom() < 13){ st.textContent = "Zoom in first: one block of land should fill the screen."; return; }
    bt.disabled = true; $("#aiOut").innerHTML = "";
    try { aiPkg = await tracked("scan", aiBuild(size, { date: $("#aiDate").value, session: $("#aiSes").value, weapon: $("#aiWpn").value }, [...el.querySelectorAll(".aifocus input:checked")].map(i => AI_FOCUS.find(f => f[0] === i.value)[1]), $("#aiNotes").value, t2 => st.textContent = t2));
      const json = JSON.stringify(aiPkg), e = aiPkg.est, vb = map.getBounds();
      AI.scans.unshift({ id: aiPkg.id, t: Date.now(), area: aiPkg.area, size, sit: { date: aiPkg.sit.date, session: aiPkg.sit.session }, center: aiPkg.center, blocks: aiPkg.blocks.map(b => ({ id: b.id, lat: b.lat, lng: b.lng })) });
      AI.log.unshift({ id: aiPkg.id, t: Date.now(), size, area: aiPkg.area, est: e }); AI.scans = AI.scans.slice(0, 20); aiSave();
      st.textContent = ""; const fx = aiPkg.sit.wx;
      $("#aiOut").innerHTML = `<div class="now"><b>Package ready: ${esc(aiPkg.area)}</b><br>${aiPkg.blocks.length} blocks of about ${aiPkg.blockYd} yd${aiPkg.dropped ? ` (${aiPkg.dropped} more blocks farther from the center were left out; zoom in so the tract fills the screen, or pick a bigger scan)` : ""}. Claude will look closely at ${e.look}.
        <br>Forecast for the sit: ${fx ? `wind from the ${fx.from} at ${fx.mph[0]}–${fx.mph[1]} mph, ${fx.temp[0]}–${fx.temp[1]}°F, rain chance ${fx.rain}%` : "not available yet for that date"}.
        <br><b>What gets sent:</b> ${e.pics} pictures and about ${Math.round((json.length - aiPkg.blocks.reduce((a, b) => a + b.img.length, 0) - aiPkg.overview.length - (aiPkg.topo || "").length) / 1000)}k characters of facts, in 2 requests. Estimated ${aiFmtTok(e.tok)} tokens.
        ${aiPkg.missing.length ? `<br><span class="meta">Couldn't load: ${esc(aiPkg.missing.join(", "))}. Claude is told these are missing.</span>` : ""}
        <br><span class="meta">File size ${(json.length / 1048576).toFixed(1)} MB. Nothing has been sent yet.</span></div>
        <ol class="aisteps"><li><button class="btn sm" id="aiFile">Save the package file</button> <button class="btn sm ghost" id="aiCopy">or copy it</button></li>
        <li><a class="btn sm" id="aiOpen" href="${AI_URL}" target="_blank" rel="noopener">Open the Claude scout page</a> and load the file (or paste) there.</li><li>On that page, tap "Send picks to the map."</li></ol>`;
      $("#aiFile").onclick = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([json], { type: "application/json" })); a.download = `publicscout-scan-${aiPkg.sit.date}-${aiPkg.id.slice(0, 4)}.json`; a.click(); };
      $("#aiCopy").onclick = async () => { try { await navigator.clipboard.writeText(json); toast("Package copied. Paste it on the Claude scout page."); } catch { toast("This browser wouldn't allow the copy. Use the file instead."); } };
      // One-tap hand-off: if the scout page opens in a tab of this browser, pass the package straight to it and take the picks back the same way
      $("#aiOpen").onclick = () => { const w = window.open(AI_URL, "ps_scout"); if (!w) return true; aiWin = w; let n = 0; clearInterval(aiHello);
        const hail = (x, d) => { try { x.postMessage({ kind: "publicscout-ai-hello" }, "*"); } catch {} if (d < 3) try { for (let i = 0; i < x.length; i++) hail(x[i], d + 1); } catch {} };
        aiHello = setInterval(() => { if (++n > 120 || w.closed) return clearInterval(aiHello); hail(w, 0); }, 1500); return false; };
    } catch (err){ console.error(err); st.textContent = err.message || "Couldn't build the package. Check your connection."; } finally { bt.disabled = false; } }; }
let aiWin = null, aiHello = null;
window.addEventListener("message", ev => { const d = ev.data; if (!d || typeof d !== "object" || !aiWin) return;
  if (d.kind === "publicscout-ai-ready" && aiPkg && ev.source){ clearInterval(aiHello); try { ev.source.postMessage(aiPkg, "*"); toast("Package handed to the Claude scout page."); } catch {} }
  else if (d.kind === "publicscout-ai-picks" && AI.scans.some(s => s.id === d.id)){ const sc = aiImport(JSON.stringify(d)); if (sc){ showTab("scan"); aiShow(); aiPanel(); toast(sc.res.nothing ? "Claude found nothing strong in that view." : `Loaded ${sc.res.picks.length} picks from Claude.`); } } });
function aiFromHash(){ const m = location.hash.match(/^#ai=(.+)$/); if (!m) return false; const sc = aiImport(m[1]); try { history.replaceState(null, "", location.pathname + location.search); } catch {}
  if (sc){ setTimeout(() => { showTab("scan"); aiShow(); const p = sc.res.picks[0]; if (p) map.setView([p.lat, p.lng], 15); else if (sc.center) map.setView(sc.center, 14); toast(sc.res.nothing ? "Claude found nothing strong in that view." : `Loaded ${sc.res.picks.length} picks from Claude.`); if (isPhone()) sheetTo(1); }, 400); }
  else setTimeout(() => toast("Couldn't read the picks in that link."), 400); return true; }
// PSBENCH
// ----- test bench: do picks land near things the hunter really found, more often than random public ground would? -----
window.psBench = async function(picks, pts, radiusYd){ const R = (radiusYd || 150) * .9144, b = map.getBounds(), pad = await fetchPad(b.pad(.08)), pubF = pad.features.filter(f => scanPublic(f.properties)), tpB = (await fetchTpwdBounds(b).catch(() => null)) || [];
  const tpOk = tpB.filter(f => /property boundary|hunt area|hunting compartment/i.test(f.properties.Class || "")), legal = (la, lo) => tpOk.some(f => aiIn(la, lo, f)) || pubF.some(f => aiIn(la, lo, f));
  const hits = ps => pts.filter(p => ps.some(q => map.distance([p[1], p[2]], [q[0], q[1]]) <= R)).length, rnd = []; let tries = 0;
  while (rnd.length < 400 && tries++ < 40000){ const la = b.getSouth() + Math.random() * (b.getNorth() - b.getSouth()), lo = b.getWest() + Math.random() * (b.getEast() - b.getWest()); if (legal(la, lo)) rnd.push([la, lo]); }
  let tot = 0; const T = 500, dist = []; for (let t = 0; t < T; t++){ const s = []; for (let i = 0; i < picks.length; i++) s.push(rnd[Math.floor(Math.random() * rnd.length)]); const h = hits(s); tot += h; dist.push(h); }
  const got = hits(picks), better = dist.filter(h => h >= got).length / T;
  return { picks: picks.length, points: pts.length, radiusYd: radiusYd || 150, hits: got, chanceHits: +(tot / T).toFixed(2), shareOfRandomSetsAsGood: +better.toFixed(2),
    nearest: pts.map(p => [p[0], Math.round(Math.min(...picks.map(q => map.distance([p[1], p[2]], [q[0], q[1]]))) * 1.0936)]) }; };
window.psSelfTest = function(){ try { const e = aiEstimate("medium"), enc = aiB64.enc(JSON.stringify({ kind: "publicscout-ai-picks", id: "selftest", picks: [{ b: "A1", lat: 30.6, lng: -95.75, g: "B", s: 70, why: "test é" }] }));
    const keep = JSON.stringify(AI), ok = !!aiImport(enc) && e.tok > 1000 && e.pics === 10; AI = JSON.parse(keep); aiSave(); return { ok, medTok: e.tok }; } catch (err){ return { ok: false, err: String(err) }; } };
(function aiStart(){ const sb = $("#scanBtn"); if (!sb) return;
  sb.insertAdjacentHTML("afterend", ` <button class="btn ghost" id="aiBtn">AI scan: Claude picks</button><div id="aiPanel" hidden></div><div id="aiPicks"></div>`);
  $("#aiBtn").onclick = () => { const el = $("#aiPanel"); if (el.hidden || !el.innerHTML) aiPanel(); else el.hidden = true; };
  if (!aiFromHash()) aiShow(); window.addEventListener("hashchange", aiFromHash); })();
