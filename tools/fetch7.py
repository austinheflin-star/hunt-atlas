import os, json, urllib.request, urllib.parse, time, math
UA = {"User-Agent": "PublicScout-asset-fetch/1.0 (github.com/austinheflin-star/hunt-atlas)"}
def get(u, tries=3):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=120) as r: return r.read()
        except Exception as e: print("retry", u[:100], e); time.sleep(10)
O = "out/plan2/"; os.makedirs(O, exist_ok=True)
def save(n, d):
    if d: open(O + n, "wb").write(d); print(n, len(d))
T = "https://tpwd.texas.gov/server/rest/services/Wildlife/TPWD_PublicHuntLocatorMap/MapServer/"
def q(layer, **kw):
    p = {"where": "1=1", "outFields": "*", "returnGeometry": "true", "outSR": "4326", "f": "geojson"}; p.update(kw)
    d = get(T + f"{layer}/query?" + urllib.parse.urlencode(p)); return json.loads(d) if d else None
units = {"lum": "LoName LIKE '%Luminant%'", "ala": "LoName LIKE '%Alabama Creek%'"}
for k, w in units.items():
    g = q(1, where=w)
    if not g or not g.get("features"): print("no unit", k, g and str(g)[:300]); continue
    json.dump(g, open(O + k + "_unit.json", "w")); print(k, [f["properties"].get("LoName") for f in g["features"]])
    xs, ys = [], []
    for f in g["features"]:
        geo = f["geometry"]; polys = geo["coordinates"] if geo["type"] == "MultiPolygon" else [geo["coordinates"]]
        for p in polys:
            for r in p:
                for x, y in r: xs.append(x); ys.append(y)
    pad = .01; B = (min(xs) - pad, min(ys) - pad, max(xs) + pad, max(ys) + pad); json.dump(B, open(O + k + "_bbox.json", "w"))
    env = dict(geometry=",".join(map(str, B)), geometryType="esriGeometryEnvelope", inSR="4326", spatialRel="esriSpatialRelIntersects")
    for L in (7, 8, 9): 
        r = q(L, **env); 
        if r: json.dump(r, open(O + f"{k}_L{L}.json", "w")); print(k, L, len(r.get("features", [])))
    W = 2400; Hh = int(W * (B[3] - B[1]) / ((B[2] - B[0]) * math.cos(math.radians((B[1] + B[3]) / 2))))
    Hh = max(600, min(3200, Hh))
    ex = {"bbox": ",".join(map(str, B)), "bboxSR": 4326, "imageSR": 3857, "size": f"{W},{Hh}", "f": "image"}
    save(k + "_sat.jpg", get("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?" + urllib.parse.urlencode(dict(ex, format="jpg"))))
    save(k + "_topo.png", get("https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/export?" + urllib.parse.urlencode(dict(ex, format="png"))))
    save(k + "_nhd.png", get("https://hydro.nationalmap.gov/arcgis/rest/services/nhd/MapServer/export?" + urllib.parse.urlencode(dict(ex, format="png32", transparent="true", layers="show:6,9,12"))))
    for nm, url, extra in (("harv", "https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_TimberHarvest_01/MapServer/0", {}), ("rx", "https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_HazardousFuelsTreatments_01/MapServer/3", {})):
        d = get(url + "/query?" + urllib.parse.urlencode(dict(env, where="1=1", outFields="*", returnGeometry="true", outSR="4326", f="geojson")))
        if d: save(f"{k}_{nm}.json", d)
    c = ((B[0] + B[2]) / 2, (B[1] + B[3]) / 2)
    for o, (lo, la) in {"tomball": (-95.6161, 30.0972), "cstat": (-96.3344, 30.6280)}.items():
        d = get(f"https://router.project-osrm.org/route/v1/driving/{lo},{la};{c[0]},{c[1]}?overview=false")
        if d: save(f"{k}_route_{o}.json", d)
