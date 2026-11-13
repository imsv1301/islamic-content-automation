"""Generate images with Cloudflare Workers AI (FLUX-1 schnell). jobs/*.json: {"images":[{"name":..,"prompt":..,"steps":8}]}"""
import json, os, sys, base64, urllib.request, urllib.error
import re
acct, raw = os.environ["CF_ACCOUNT_ID"].strip(), os.environ["CF_API_TOKEN"]
# tolerate a pasted curl line / "Bearer x" / quotes: keep the longest token-like run
cands = re.findall(r"[A-Za-z0-9_\-]{30,}", raw)
tok = max(cands, key=len) if cands else raw.strip()
print("token chars:", len(raw), "-> using", len(tok), "chars")
try:
    v = json.load(urllib.request.urlopen(urllib.request.Request("https://api.cloudflare.com/client/v4/user/tokens/verify", headers={"Authorization": "Bearer " + tok})))
    print("verify:", v.get("success"), (v.get("result") or {}).get("status"))
except urllib.error.HTTPError as e:
    print("verify HTTP", e.code, e.read()[:200].decode("utf8", "ignore"))
job = json.load(open(sys.argv[1])); os.makedirs("images", exist_ok=True)
BASE = f"https://api.cloudflare.com/client/v4/accounts/{acct}/ai/run/"
for im in job["images"]:
    model = im.get("model", job.get("model", "@cf/black-forest-labs/flux-1-schnell"))
    payload = {"prompt": im["prompt"], "steps": im.get("steps", job.get("steps", 8))}
    for k in ("width", "height", "guidance", "seed", "negative_prompt"):
        if k in im or k in job: payload[k] = im.get(k, job.get(k))
    body = json.dumps(payload).encode()
    req = urllib.request.Request(BASE + model, data=body, headers={"Authorization": "Bearer " + tok, "Content-Type": "application/json"})
    try:
        raw = urllib.request.urlopen(req, timeout=180).read()
    except urllib.error.HTTPError as e:
        print(im["name"], "HTTP", e.code, e.read()[:300].decode("utf8", "ignore")); continue
    if not raw.lstrip().startswith(b"{"):
        open(f"images/{im['name']}.png", "wb").write(raw); print(im["name"], "ok (binary)"); continue
    r = json.loads(raw)
    res = r.get("result") or {}
    img = res.get("image") if isinstance(res, dict) else None
    if img:
        open(f"images/{im['name']}.jpg", "wb").write(base64.b64decode(img)); print(im["name"], "ok")
    else:
        print(im["name"], "no image", str(r)[:200])
