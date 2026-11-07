import os, urllib.request, urllib.parse, time
UA = {"User-Agent": "PublicScout-asset-fetch/1.0 (github.com/austinheflin-star/hunt-atlas)"}
def get(u):
    for i in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=120) as r: return r.read()
        except Exception as e: print("retry", u[:90], e); time.sleep(15)
os.makedirs("out/gloss2", exist_ok=True)
B = "-95.09168150422306,30.419250248711222,-95.00831849577693,30.480749751288776"
def save(n, d):
    if d: open("out/gloss2/" + n, "wb").write(d); print(n, len(d))
save("eastB_topo.png", get("https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/export?" + urllib.parse.urlencode({"bbox": B, "bboxSR": 4326, "imageSR": 3857, "size": "2400,2040", "format": "png", "f": "image"})))
save("eastB_nhd.png", get("https://hydro.nationalmap.gov/arcgis/rest/services/nhd/MapServer/export?" + urllib.parse.urlencode({"bbox": B, "bboxSR": 4326, "imageSR": 3857, "size": "2400,2040", "format": "png32", "transparent": "true", "f": "image"})))
w, s, e, n = map(float, B.split(","))
import math
def merc(lat): return math.log(math.tan(math.pi/4 + math.radians(lat)/2)) * 6378137
x0, x1 = w * math.pi/180 * 6378137, e * math.pi/180 * 6378137
save("eastB_nlcd.png", get("https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2021_Land_Cover_L48/wms?" + urllib.parse.urlencode({"service": "WMS", "version": "1.1.1", "request": "GetMap", "layers": "NLCD_2021_Land_Cover_L48", "styles": "", "srs": "EPSG:3857", "bbox": f"{x0},{merc(s)},{x1},{merc(n)}", "width": 2400, "height": 2040, "format": "image/png"})))
# close-ups at ~0.6 m/px
ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?"
for nm, (lo, la, km) in {"z_thin": (-95.0490, 30.4775, .6), "z_cut": (-95.0820, 30.4510, .7), "z_row": (-95.0380, 30.4720, .5), "z_hw": (-95.0800, 30.4720, .6)}.items():
    dx = km / (111.32 * math.cos(math.radians(la))); dy = km / 110.57
    save(nm + ".jpg", get(ESRI + urllib.parse.urlencode({"bbox": f"{lo-dx},{la-dy},{lo+dx},{la+dy}", "bboxSR": 4326, "imageSR": 3857, "size": "1600,1600", "format": "jpg", "f": "image"})))
