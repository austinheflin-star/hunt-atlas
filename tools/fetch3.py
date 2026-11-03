import os, math, urllib.request, urllib.parse, time
UA = {"User-Agent": "PublicScout-asset-fetch/1.0"}
def get(u):
    for i in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=90) as r: return r.read()
        except Exception as e: print("retry", e); time.sleep(10)
os.makedirs("out/yegua", exist_ok=True)
kx = 111320 * math.cos(math.radians(30.33)); ky = 110570
S = {"y1": (30.32803, -96.76299), "y2": (30.33358, -96.74754), "y3": (30.31447, -96.75938), "y4": (30.33981, -96.75861), "y5": (30.34292, -96.74676), "y6": (30.32091, -96.77226)}
E = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?"
def ex(name, b, w, h, base=E, extra=None):
    p = {"bbox": ",".join(map(str, b)), "bboxSR": 4326, "imageSR": 3857, "size": f"{w},{h}", "format": "jpg", "f": "image"}
    if extra: p.update(extra)
    d = get(base + urllib.parse.urlencode(p))
    if d: open(f"out/yegua/{name}", "wb").write(d)
for k, (la, lo) in S.items():
    h = 250; ex(k + ".jpg", (lo - h / kx, la - h / ky, lo + h / kx, la + h / ky), 1200, 1200)
B = (-96.786, 30.305, -96.734, 30.359)
ex("overview.jpg", B, 2000, 2000)
ex("nlcd.png", B, 2000, 2000, "https://geo.fas.usda.gov/arcgis2/rest/services/G_Land_Cover/NLCD/MapServer/export?", {"format": "png32", "transparent": "false", "layers": "show:2"})
print("done")
