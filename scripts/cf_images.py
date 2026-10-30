"""Generate images with Cloudflare Workers AI (FLUX-1 schnell). jobs/*.json: {"images":[{"name":..,"prompt":..,"steps":8}]}"""
import json, os, sys, base64, urllib.request, urllib.error
acct, tok = os.environ["CF_ACCOUNT_ID"].strip(), os.environ["CF_API_TOKEN"].strip()
job = json.load(open(sys.argv[1])); os.makedirs("images", exist_ok=True)
url = f"https://api.cloudflare.com/client/v4/accounts/{acct}/ai/run/@cf/black-forest-labs/flux-1-schnell"
for im in job["images"]:
    body = json.dumps({"prompt": im["prompt"], "steps": im.get("steps", 8)}).encode()
    req = urllib.request.Request(url, data=body, headers={"Authorization": "Bearer " + tok, "Content-Type": "application/json"})
    try:
        r = json.load(urllib.request.urlopen(req, timeout=120))
    except urllib.error.HTTPError as e:
        print(im["name"], "HTTP", e.code, e.read()[:300].decode("utf8", "ignore")); continue
    img = (r.get("result") or {}).get("image")
    if img:
        open(f"images/{im['name']}.jpg", "wb").write(base64.b64decode(img)); print(im["name"], "ok")
    else:
        print(im["name"], "no image", str(r)[:200])
