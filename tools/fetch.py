import json, os, math, time, urllib.request, urllib.parse
UA = {"User-Agent": "PublicScout-asset-fetch/1.0 (github.com/austinheflin-star/hunt-atlas)"}
def get(u, tries=5):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60) as r: return r.read()
        except Exception as e:
            print("retry", u[:120], e); time.sleep(8)
    return None
os.makedirs("out/sat", exist_ok=True); os.makedirs("out/photo", exist_ok=True)
# Nails Creek compartment boundary (TPWD unit 711, simplified)
s = "-96.7018,30.2921 -96.6908,30.2838 -96.6918,30.2824 -96.7,30.281 -96.7167,30.2678 -96.7211,30.2678 -96.7218,30.2637 -96.7399,30.2612 -96.7396,30.256 -96.7419,30.2579 -96.7401,30.2612 -96.742,30.2628 -96.7384,30.2684 -96.7313,30.2658 -96.7349,30.2722 -96.7331,30.2703 -96.7294,30.2718 -96.7262,30.2773 -96.7202,30.2758 -96.7136,30.2779 -96.7041,30.2838 -96.7071,30.2863 -96.7047,30.2921 -96.7018,30.2921"
P = [tuple(map(float, p.split(","))) for p in s.split()]
ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?"
def exp(name, b, w, h):
    q = urllib.parse.urlencode({"bbox": ",".join(map(str, b)), "bboxSR": 4326, "imageSR": 3857, "size": f"{w},{h}", "format": "jpg", "f": "image"})
    d = get(ESRI + q)
    if d: open(f"out/sat/{name}.jpg", "wb").write(d)
if not os.environ.get("SKIPSAT"):
    exp("overview", (-96.748, 30.252, -96.684, 30.297), 2400, 1700)
    def inside(x, y):
        c = False
        for (x1, y1), (x2, y2) in zip(P, P[1:]):
            if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1: c = not c
        return c
    kx = 111320 * math.cos(math.radians(30.28)); ky = 110570
    step = 450; half = 300
    chips = []
    y = 30.254
    while y < 30.295:
        x = -96.745
        while x < -96.689:
            if inside(x, y):
                n = f"chip_{y:.4f}_{x:.4f}"
                exp(n, (x - half / kx, y - half / ky, x + half / kx, y + half / ky), 1200, 1200)
                chips.append({"name": n, "lat": y, "lon": x})
            x += step / kx
        y += step / ky
    json.dump(chips, open("out/sat/chips.json", "w"))
# Ground photos from Wikipedia (lead image) with license credits
TITLES = json.load(open("tools/titles.json"))
meta = json.load(open("out/photo/meta.json")) if os.path.exists("out/photo/meta.json") else {}
TITLES = [t for t in TITLES if t not in meta or meta[t].get("missing")]
for t in TITLES:
    q = urllib.parse.urlencode({"action": "query", "format": "json", "redirects": 1, "prop": "pageimages|info", "piprop": "thumbnail|name", "pithumbsize": 900, "inprop": "url", "titles": t})
    d = get("https://en.wikipedia.org/w/api.php?" + q)
    if not d: continue
    pg = list(json.loads(d)["query"]["pages"].values())[0]
    th = pg.get("thumbnail"); fn = pg.get("pageimage")
    if not th: meta[t] = {"missing": True}; continue
    img = get(th["source"]); slug = "".join(ch if ch.isalnum() else "_" for ch in t)
    if img: open(f"out/photo/{slug}.jpg", "wb").write(img)
    lic = {}
    if fn:
        q2 = urllib.parse.urlencode({"action": "query", "format": "json", "prop": "imageinfo", "iiprop": "extmetadata|url", "titles": "File:" + fn})
        d2 = get("https://commons.wikimedia.org/w/api.php?" + q2)
        if d2:
            ii = list(json.loads(d2)["query"]["pages"].values())[0].get("imageinfo", [{}])[0]
            em = ii.get("extmetadata", {})
            lic = {"artist": em.get("Artist", {}).get("value", ""), "license": em.get("LicenseShortName", {}).get("value", ""), "file": ii.get("descriptionurl", "")}
    meta[t] = {"slug": slug, "page": pg.get("fullurl"), "file": fn, **lic}
    time.sleep(2)
json.dump(meta, open("out/photo/meta.json", "w"), indent=1)
print("done", len(chips), "chips", len(meta), "photos")
