import os, urllib.request, urllib.parse, time
UA = {"User-Agent": "PublicScout-asset-fetch/1.0 (github.com/austinheflin-star/hunt-atlas)"}
F = {"rub": "Buck Rubbing on Tree (15382183132).jpg", "deertrack": "White-tailed Deer track from the piedmont region of North Carolina.jpg",
     "droppings": "White-tailed Deer (Odocoileus virginianus) Feces - Guelph, Ontario.jpg", "rooting": "Wild Boar (Sus scrofa) rooting damage - Flickr - Jay Sturner.jpg",
     "hogwallow": "Wild boar wallow.jpg", "hogtrack": "Impronta di un cinghiale.jpg", "hog": "Wildschwein, Nähe Pulverstampftor (cropped).jpg", "deer": "White-tailed deer.jpg"}
os.makedirs("out/sign", exist_ok=True)
for k, f in F.items():
    u = "https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(f) + "?width=800"
    for i in range(5):
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60) as r: open(f"out/sign/{k}.jpg", "wb").write(r.read()); break
        except Exception as e: print("retry", k, e); time.sleep(30 * (i + 1))
    time.sleep(8)
print("done")
