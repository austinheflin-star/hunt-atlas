import os, urllib.request, urllib.parse, time, math
UA = {"User-Agent": "PublicScout-asset-fetch/1.0 (github.com/austinheflin-star/hunt-atlas)"}
def get(u):
    for i in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=120) as r: return r.read()
        except Exception as e: print("retry", e); time.sleep(20)
os.makedirs("out/gloss", exist_ok=True)
ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?"
NLCD = "https://geo.fas.usda.gov/arcgis2/rest/services/G_Land_Cover/NLCD/MapServer/export?"
BOX = {"thinA": (30.540, -95.545, 2.5), "thinB": (30.606, -95.340, 2.5), "salv": (30.480, -95.600, 2.5),
 "eastA": (30.800, -95.150, 4), "eastB": (30.450, -95.050, 4), "crockett": (31.300, -95.150, 4), "angelina": (31.200, -94.300, 4),
 "creekA": (30.650, -95.450, 3), "creekB": (30.560, -95.250, 3)}
for n, (la, lo, hk) in BOX.items():
    dx = hk / (111.32 * math.cos(math.radians(la))); dy = hk / 110.57 * 0.85
    b = ",".join(map(str, (lo - dx, la - dy, lo + dx, la + dy)))
    for src, url, fmt, ext in (("sat", ESRI, "jpg", "jpg"), ("nlcd", NLCD, "png32", "png")):
        if src == "nlcd" and not n.startswith(("creek", "thin")): continue
        q = {"bbox": b, "bboxSR": 4326, "imageSR": 3857, "size": "2400,2040", "format": fmt, "f": "image"}
        if src == "nlcd": q.update({"layers": "show:2", "transparent": "false"})
        d = get(url + urllib.parse.urlencode(q))
        if d: open(f"out/gloss/{n}_{src}.{ext}", "wb").write(d); print(n, src, len(d))
    open(f"out/gloss/{n}.bbox", "w").write(b)
