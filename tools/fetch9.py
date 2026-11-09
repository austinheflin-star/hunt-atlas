import os, urllib.request, urllib.parse, time, json
UA = {"User-Agent": "PublicScout-asset-fetch/1.0 (github.com/austinheflin-star/hunt-atlas)"}
def get(u):
    for i in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=120) as r: return r.read()
        except Exception as e: print("retry", u[:100], e); time.sleep(10)
O = "out/som/"; os.makedirs(O, exist_ok=True)
def save(n, d):
    if d: open(O + n, "wb").write(d); print(n, len(d))
R = json.load(open("tools/rings711.json"))
for nm, r in (("nails", R[0]), ("yegua", R[2])):
    xs = [p[0] for p in r]; ys = [p[1] for p in r]; pad = .006
    B = (min(xs) - pad, min(ys) - pad, max(xs) + pad, max(ys) + pad); b = ",".join(map(str, B)); json.dump(B, open(O + nm + "_bbox.json", "w"))
    ex = {"bbox": b, "bboxSR": 4326, "imageSR": 3857, "size": "2400,2000", "f": "image"}
    save(nm + "_sat.jpg", get("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?" + urllib.parse.urlencode(dict(ex, format="jpg"))))
    save(nm + "_topo.png", get("https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/export?" + urllib.parse.urlencode(dict(ex, format="png"))))
    save(nm + "_nhd.png", get("https://hydro.nationalmap.gov/arcgis/rest/services/nhd/MapServer/export?" + urllib.parse.urlencode(dict(ex, format="png32", transparent="true", layers="show:6,9,12"))))
    save(nm + "_lc.png", get("https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2021_Land_Cover_L48/wms?" + urllib.parse.urlencode({"service": "WMS", "version": "1.1.1", "request": "GetMap", "layers": "NLCD_2021_Land_Cover_L48", "styles": "", "srs": "EPSG:4326", "bbox": b, "width": 1200, "height": 1000, "format": "image/png"})))
    env = dict(geometry=b, geometryType="esriGeometryEnvelope", inSR="4326", spatialRel="esriSpatialRelIntersects", outSR="4326", f="geojson", returnGeometry="true", where="1=1", outFields="*")
    for L in (7, 8, 9):
        save(f"{nm}_L{L}.json", get(f"https://tpwd.texas.gov/server/rest/services/Wildlife/TPWD_PublicHuntLocatorMap/MapServer/{L}/query?" + urllib.parse.urlencode(env)))
    for k, url in (("roads8", "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Transportation/MapServer/8"), ("roads6", "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Transportation/MapServer/6")):
        save(f"{nm}_{k}.json", get(url + "/query?" + urllib.parse.urlencode(dict(env, outFields="NAME,MTFCC"))))
