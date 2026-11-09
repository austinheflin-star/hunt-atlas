import sys, re, os, urllib.request, xml.etree.ElementTree as ET
UA = {"User-Agent": "Mozilla/5.0 PublicScout-research"}
pat = sys.argv[1]; out = sys.argv[2]
feeds = ["https://feed.podbean.com/theskinnypinehuntingco/feed.xml"]
url = None; title = None
for f in feeds:
    x = urllib.request.urlopen(urllib.request.Request(f, headers=UA), timeout=60).read()
    root = ET.fromstring(x)
    for it in root.iter("item"):
        t = it.findtext("title") or ""
        if re.search(pat, t, re.I):
            enc = it.find("enclosure"); url = enc.get("url"); title = t; break
    if url: break
print("EPISODE:", title, url, flush=True)
if not url: sys.exit(0)
os.makedirs("out/tx", exist_ok=True)
mp3 = "/tmp/ep.mp3"; open(mp3, "wb").write(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=600).read())
from faster_whisper import WhisperModel
m = WhisperModel("base.en", device="cpu", compute_type="int8", cpu_threads=4)
segs, info = m.transcribe(mp3, vad_filter=True, beam_size=1)
with open(f"out/tx/{out}.txt", "w") as fh:
    fh.write(f"# {title}\n# {url}\n")
    for s in segs:
        fh.write(f"[{int(s.start//60):02d}:{int(s.start%60):02d}] {s.text.strip()}\n")
print("done", out)
