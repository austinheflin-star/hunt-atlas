import os, urllib.request, urllib.parse, time, json, math
UA = {"User-Agent": "PublicScout-asset-fetch/1.0 (github.com/austinheflin-star/hunt-atlas)"}
def get(u):
    for i in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=120) as r: return r.read()
        except Exception as e: print("retry", u[:100], e); time.sleep(10)
O = "out/trip1/"; os.makedirs(O, exist_ok=True)
def save(n, d):
    if d: open(O + n, "wb").write(d); print(n, len(d))
for nm, B, sz in (("near", (-95.7700, 30.5860, -95.7420, 30.6060), "2400,1960"), ("wide", (-95.8200, 30.5350, -95.7200, 30.6150), "2400,2200")):
    b = ",".join(map(str, B)); ex = {"bbox": b, "bboxSR": 4326, "imageSR": 3857, "size": sz, "f": "image"}
    save(nm + "_sat.jpg", get("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?" + urllib.parse.urlencode(dict(ex, format="jpg"))))
    save(nm + "_topo.png", get("https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/export?" + urllib.parse.urlencode(dict(ex, format="png"))))
    save(nm + "_nhd.png", get("https://hydro.nationalmap.gov/arcgis/rest/services/nhd/MapServer/export?" + urllib.parse.urlencode(dict(ex, format="png32", transparent="true", layers="show:6,9,12"))))
    save(nm + "_lc.png", get("https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2021_Land_Cover_L48/wms?" + urllib.parse.urlencode({"service": "WMS", "version": "1.1.1", "request": "GetMap", "layers": "NLCD_2021_Land_Cover_L48", "styles": "", "srs": "EPSG:4326", "bbox": b, "width": 1200, "height": int(sz.split(",")[1]) // 2, "format": "image/png"})))
    json.dump(B, open(O + nm + "_bbox.json", "w"))
    env = dict(geometry=b, geometryType="esriGeometryEnvelope", inSR="4326", spatialRel="esriSpatialRelIntersects", outSR="4326", f="geojson", returnGeometry="true")
    for k, url, w, fl in (("own", "https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_BasicOwnership_02/MapServer/0", "1=1", "*"),
                          ("rx", "https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_HazardousFuelsTreatments_01/MapServer/3", "1=1", "date_completed,treatment_type,gis_acres"),
                          ("harv", "https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_TimberHarvest_01/MapServer/0", "1=1", "activity_name,fy_completed,date_completed"),
                          ("roads", "https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_RoadBasic_01/MapServer/0", "1=1", "*"),
                          ("rec", "https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_RecreationSites_01/MapServer/0", "1=1", "*"),
                          ("tpwd9", "https://tpwd.texas.gov/server/rest/services/Wildlife/TPWD_PublicHuntLocatorMap/MapServer/9", "1=1", "*"),
                          ("tpwd7", "https://tpwd.texas.gov/server/rest/services/Wildlife/TPWD_PublicHuntLocatorMap/MapServer/7", "1=1", "*"),
                          ("tpwd8", "https://tpwd.texas.gov/server/rest/services/Wildlife/TPWD_PublicHuntLocatorMap/MapServer/8", "1=1", "*")):
        d = get(url + "/query?" + urllib.parse.urlencode(dict(env, where=w, outFields=fl)))
        if d: save(f"{nm}_{k}.json", d)
# Whole Sam Houston: TPWD camp points and FS rec sites
B = "-95.85,30.30,-95.05,30.85"
for k, url in (("sh_tpwd7", "https://tpwd.texas.gov/server/rest/services/Wildlife/TPWD_PublicHuntLocatorMap/MapServer/7"), ("sh_rec", "https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_RecreationSites_01/MapServer/0")):
    d = get(url + "/query?" + urllib.parse.urlencode(dict(geometry=B, geometryType="esriGeometryEnvelope", inSR="4326", spatialRel="esriSpatialRelIntersects", outSR="4326", f="geojson", where="1=1", outFields="*", returnGeometry="true")))
    if d: save(k + ".json", d)
