import json, os, time, urllib.request, urllib.parse
UA = {"User-Agent": "PublicScout-asset-fetch/1.0 (github.com/austinheflin-star/hunt-atlas)"}
def get(u):
    for i in range(5):
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60) as r: return r.read()
        except Exception as e:
            print("retry", e); time.sleep(30 * (i + 1))
Q = json.load(open("tools/queries.json"))
os.makedirs("out/photo2", exist_ok=True)
meta = {}
for key, q in Q.items():
    p = urllib.parse.urlencode({"action": "query", "format": "json", "generator": "search", "gsrsearch": q + " filetype:bitmap", "gsrnamespace": 6, "gsrlimit": 3, "prop": "imageinfo", "iiprop": "url|extmetadata", "iiurlwidth": 900})
    d = get("https://commons.wikimedia.org/w/api.php?" + p)
    if not d: continue
    pages = sorted(json.loads(d).get("query", {}).get("pages", {}).values(), key=lambda x: x.get("index", 9))
    out = []
    for n, pg in enumerate(pages):
        ii = pg.get("imageinfo", [{}])[0]; em = ii.get("extmetadata", {})
        img = get(ii.get("thumburl") or ii.get("url")); time.sleep(4)
        if not img: continue
        fn = f"{key}_{n}.jpg"; open("out/photo2/" + fn, "wb").write(img)
        out.append({"file": fn, "title": pg["title"], "page": ii.get("descriptionurl"), "artist": em.get("Artist", {}).get("value", ""), "license": em.get("LicenseShortName", {}).get("value", "")})
    meta[key] = out
    json.dump(meta, open("out/photo2/meta.json", "w"), indent=1)
    time.sleep(6)
print("done")
