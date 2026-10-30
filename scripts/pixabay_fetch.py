"""Fetch free Pixabay videos for a list of queries. Writes clips/<slug>_<n>.mp4 and clips/manifest.json."""
import json, os, sys, urllib.request, urllib.parse, urllib.error, re
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) SadqahMedia/1.0"}
def get(u):
    try:
        return urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60)
    except urllib.error.HTTPError as e:
        print("HTTP", e.code, e.read()[:200].decode("utf8", "ignore")); raise
key = os.environ["PIXABAY_API_KEY"].strip()
print("key length", len(key))
queries = json.load(open(sys.argv[1]))["queries"]
per = int(sys.argv[2]) if len(sys.argv) > 2 else 4
os.makedirs("clips", exist_ok=True)
man = []
for q in queries:
    url = "https://pixabay.com/api/videos/?" + urllib.parse.urlencode({"key": key, "q": q, "per_page": 20, "safesearch": "true", "order": "popular"})
    hits = json.load(get(url)).get("hits", [])
    slug = re.sub(r"[^a-z0-9]+", "-", q.lower()).strip("-")
    n = 0
    for h in hits:
        v = h["videos"].get("large") or h["videos"].get("medium")
        if not v or not v.get("url") or v.get("height", 0) < 720: continue
        fn = f"clips/{slug}_{n}.mp4"
        open(fn, "wb").write(get(v["url"]).read())
        man.append({"file": fn, "query": q, "id": h["id"], "page": h["pageURL"], "user": h["user"], "tags": h["tags"], "duration": h["duration"], "w": v["width"], "h": v["height"]})
        n += 1
        if n >= per: break
    print(q, "->", n, "clips")
json.dump(man, open("clips/manifest.json", "w"), indent=1)
