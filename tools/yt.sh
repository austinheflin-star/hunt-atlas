#!/bin/bash
# Fetch YouTube captions; if none, download audio and transcribe with faster-whisper.
set -x
ID=O4Eib99ax8k
mkdir -p out/yt
pip install -q yt-dlp faster-whisper >/dev/null 2>&1
yt-dlp --skip-download --write-auto-subs --write-subs --sub-langs "en.*,en" --sub-format json3 --print-to-file "%(title)s | %(channel)s | %(upload_date)s | %(duration)s" out/yt/meta.txt -o "out/yt/%(id)s.%(ext)s" "https://www.youtube.com/watch?v=$ID" 2>&1 | tail -5
yt-dlp --skip-download --print "%(description)s" "https://www.youtube.com/watch?v=$ID" > out/yt/desc.txt 2>/dev/null
ls out/yt
if ! ls out/yt/*.json3 >/dev/null 2>&1; then
  yt-dlp -f "ba[ext=m4a]/ba" -o "/tmp/a.%(ext)s" "https://www.youtube.com/watch?v=$ID" 2>&1 | tail -3
  A=$(ls /tmp/a.* 2>/dev/null | head -1)
  if [ -n "$A" ]; then python3 - "$A" <<'PY'
import sys
from faster_whisper import WhisperModel
m=WhisperModel("base.en",compute_type="int8"); segs,_=m.transcribe(sys.argv[1],vad_filter=True)
with open("out/yt/whisper.txt","w") as f:
    for s in segs: f.write(f"[{int(s.start//60)}:{int(s.start%60):02d}] {s.text.strip()}\n")
PY
  fi
fi
ls -la out/yt
