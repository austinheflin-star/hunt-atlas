import os, math, urllib.request, urllib.parse, time
UA = {"User-Agent": "PublicScout-asset-fetch/1.0"}
def get(u):
    for i in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=90) as r: return r.read()
        except Exception as e: print("retry", e); time.sleep(10)
os.makedirs("out/stops", exist_ok=True)
kx = 111320 * math.cos(math.radians(30.28)); ky = 110570
S = {"s1": (30.26177, -96.74016), "s2": (30.26622, -96.73475), "s3": (30.26400, -96.72316), "s4": (30.27000, -96.71389), "s5": (30.28023, -96.70102), "s6": (30.28223, -96.69329)}
E = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?"
for k, (la, lo) in S.items():
    h = 250
    b = (lo - h / kx, la - h / ky, lo + h / kx, la + h / ky)
    d = get(E + urllib.parse.urlencode({"bbox": ",".join(map(str, b)), "bboxSR": 4326, "imageSR": 3857, "size": "1200,1200", "format": "jpg", "f": "image"}))
    if d: open(f"out/stops/{k}.jpg", "wb").write(d)
B = (-96.748, 30.252, -96.684, 30.297)
N = "https://geo.fas.usda.gov/arcgis2/rest/services/G_Land_Cover/NLCD/MapServer/export?"
d = get(N + urllib.parse.urlencode({"bbox": ",".join(map(str, B)), "bboxSR": 4326, "imageSR": 3857, "size": "2400,1700", "format": "png32", "transparent": "false", "layers": "show:2", "f": "image"}))
if d: open("out/stops/nlcd.png", "wb").write(d)
print("done")
