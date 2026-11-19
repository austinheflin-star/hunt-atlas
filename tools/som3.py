# Wider Somerville PHL mosaic (Esri World Imagery z16 + USGS topo z16) and data layers for spot analysis.
import math, json, io, os, urllib.request, urllib.parse, concurrent.futures as cf
from PIL import Image
OUT = "out/som3"; os.makedirs(OUT, exist_ok=True)
W_, S_, E_, N_ = -96.805, 30.275, -96.665, 30.372
Z = 16
def t(lon, lat, z): n = 2 ** z; x = (lon + 180) / 360 * n; y = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n; return x, y
def get(u, n=3):
    for i in range(n):
        try: return urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0 publicscout"}), timeout=30).read()
        except Exception as e: err = e
    print("fail", u, err); return None
x0, y0 = t(W_, N_, Z); x1, y1 = t(E_, S_, Z)
X0, Y0, X1, Y1 = int(x0), int(y0), int(x1), int(y1)
for name, url in (("sat", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"), ("topo", "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}")):
    im = Image.new("RGB", ((X1 - X0 + 1) * 256, (Y1 - Y0 + 1) * 256))
    jobs = {(x, y): url.format(z=Z, x=x, y=y) for x in range(X0, X1 + 1) for y in range(Y0, Y1 + 1)}
    with cf.ThreadPoolExecutor(8) as ex:
        for (x, y), b in zip(jobs, ex.map(get, jobs.values())):
            if b: im.paste(Image.open(io.BytesIO(b)).convert("RGB"), ((x - X0) * 256, (y - Y0) * 256))
    im.save(f"{OUT}/{name}.jpg", quality=88)
n = 2 ** Z
lon = lambda x: x / n * 360 - 180; lat = lambda y: math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / n))))
json.dump([lon(X0), lat(Y1 + 1), lon(X1 + 1), lat(Y0)], open(f"{OUT}/bbox.json", "w"))
def q(url, fields="*", where="1=1"):
    p = urllib.parse.urlencode({"where": where, "geometry": f"{W_},{S_},{E_},{N_}", "geometryType": "esriGeometryEnvelope", "inSR": 4326, "outSR": 4326, "spatialRel": "esriSpatialRelIntersects", "outFields": fields, "returnGeometry": "true", "f": "geojson"})
    b = get(url + "/query?" + p); return json.loads(b) if b else {}
T = "https://tpwd.texas.gov/arcgis/rest/services/Hunting/TPWD_PublicHuntLocatorMap/MapServer/"
for k, u in {"L7": T + "7", "L8": T + "8", "L9": T + "9", "flow": "https://hydro.nationalmap.gov/arcgis/rest/services/nhd/MapServer/6", "wb": "https://hydro.nationalmap.gov/arcgis/rest/services/nhd/MapServer/12",
             "roads6": "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Transportation/MapServer/6", "roads8": "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Transportation/MapServer/8",
             "pipe": "https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/Natural_Gas_Interstate_and_Intrastate_Pipelines_1/FeatureServer/0"}.items():
    json.dump(q(u), open(f"{OUT}/{k}.json", "w"))
# NLCD land cover for the box
w = 700; h = int(w * (N_ - S_) / (E_ - W_) / math.cos(math.radians(30.32)))
b = get("https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2021_Land_Cover_L48/wms?" + urllib.parse.urlencode({"service": "WMS", "version": "1.1.1", "request": "GetMap", "layers": "NLCD_2021_Land_Cover_L48", "styles": "", "srs": "EPSG:4326", "bbox": f"{W_},{S_},{E_},{N_}", "width": w, "height": h, "format": "image/png"}))
if b: open(f"{OUT}/nlcd.png", "wb").write(b)
# elevation (AWS terrarium z14)
ZE = 14; ex0, ey0 = t(W_, N_, ZE); ex1, ey1 = t(E_, S_, ZE); im = Image.new("RGB", ((int(ex1) - int(ex0) + 1) * 256, (int(ey1) - int(ey0) + 1) * 256))
for x in range(int(ex0), int(ex1) + 1):
    for y in range(int(ey0), int(ey1) + 1):
        b = get(f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{ZE}/{x}/{y}.png")
        if b: im.paste(Image.open(io.BytesIO(b)).convert("RGB"), ((x - int(ex0)) * 256, (y - int(ey0)) * 256))
im.save(f"{OUT}/dem.png"); n = 2 ** ZE
json.dump([int(ex0) / n * 360 - 180, math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (int(ey1) + 1) / n)))), (int(ex1) + 1) / n * 360 - 180, math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * int(ey0) / n))))], open(f"{OUT}/dem_bbox.json", "w"))
print(sorted(os.listdir(OUT)))
