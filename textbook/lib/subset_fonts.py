"""글꼴 서브셋: 쓰는 글자만 남겨 woff2 base64 로 돌려준다.

입력(stdin 한 줄 JSON): [{ "family", "src", "text", "wght"? }, ...]
출력(stdout JSON): { family: base64 }
필요: Python 3.11+, fontTools, brotli (pip install fonttools brotli)
서브셋은 OFL 상 수정본이라 이름을 WZH 접두사로 바꾼다(D2Coding 은 예약 이름이 있어 필수).
같은 입력이면 같은 바이트가 나오도록 저장 시각을 새로 쓰지 않는다.
"""
import base64
import io
import json
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

sys.stdin.reconfigure(encoding="utf-8")  # Windows 기본 인코딩(cp949)으로 읽지 않게
sys.stdout.reconfigure(encoding="utf-8")
FEATURES = ["kern", "liga", "calt", "tnum", "locl", "ccmp"]

jobs = json.loads(sys.stdin.readline())
out = {}
for job in jobs:
    font = TTFont(job["src"], lazy=False, recalcTimestamp=False)
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = FEATURES
    options.name_IDs = ["*"]
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=job["text"])
    subsetter.subset(font)
    if job.get("wght") and "fvar" in font:
        font = instancer.instantiateVariableFont(font, {"wght": tuple(job["wght"])})
    name = font["name"]
    for rec in list(name.names):
        if rec.nameID in (1, 4, 16, 21):
            name.setName(job["family"], rec.nameID, rec.platformID, rec.platEncID, rec.langID)
        elif rec.nameID == 6:
            name.setName(job["family"].replace(" ", ""), rec.nameID, rec.platformID, rec.platEncID, rec.langID)
    font.flavor = "woff2"
    buffer = io.BytesIO()
    font.save(buffer)
    out[job["family"]] = base64.b64encode(buffer.getvalue()).decode("ascii")
print(json.dumps(out))
