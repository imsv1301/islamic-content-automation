"""Instagram tool for the four accounts (official Instagram API with Instagram Login, graph.instagram.com).

State (decrypted state/instagram.json.enc, path $IG_STATE):
  {"accounts": {acct: {"token": "...", "user_id": "...", "username": "...", "refreshed": "ISO date"}}}
Accounts: kids (@islamforlittleones), hadith (@raahesunnat.daily), naat (@mehfil.e_sama), riddle (@solvebysunrise).
If an account has no token in the state yet, it is taken from env IG_TOKEN_<ACCT> (GitHub secret) once,
and its Instagram user id from env IG_USER_<ACCT> (or found through the token).

  ig.py whoami                                   # check every token, fill user_id/username, refresh tokens older than 7 days
  ig.py publish <renders_dir> <date> <video_url_base>   # post the day's manifest items as Reels (label -> account)
  ig.py reel <acct> <video_url> <caption_file>   # post one Reel
  ig.py comments <acct>                          # recent comments on our posts (JSON lines)
  ig.py reply <acct> <comment_id> <text>
  ig.py dms <acct>                               # recent DM conversations (JSON lines, newest message first)
  ig.py dm <acct> <recipient_id> <text>          # reply to someone who wrote to us (24 h window)

Rules baked in: never follow, like, or message anyone who has not written to us first.
"""
import datetime, json, os, pathlib, re, sys, time, urllib.error, urllib.parse, urllib.request

V = os.environ.get("IG_API_VERSION", "v23.0")
# New Meta apps use "Instagram API with Unified login": system-user access tokens (never expire) on graph.facebook.com,
# addressed by each account's Instagram user id. IG_HOST can switch back to graph.instagram.com for Instagram-Login tokens.
HOST = os.environ.get("IG_HOST", "graph.facebook.com")
API = f"https://{HOST}/{V}/"
STATE_F = os.environ.get("IG_STATE", "/tmp/ig_state.json")
ST = json.load(open(STATE_F)) if os.path.exists(STATE_F) else {"accounts": {}}
LABEL_TO_ACCT = {"kids": "kids", "sadqah": "hadith", "hadith": "hadith", "riddle": "riddle", "naat": "naat", "qawwali": "naat"}
NAMES = {"kids": "Islam for Little Ones", "hadith": "Raah-e-Sunnat", "naat": "Mehfil-e-Sama", "riddle": "Solve by Sunrise"}
CHANGED = False


def save():
    if CHANGED:
        json.dump(ST, open(STATE_F, "w"), indent=1)


def tok(acct):
    a = ST["accounts"].setdefault(acct, {})
    if not a.get("token"):
        t = os.environ.get("IG_TOKEN_" + acct.upper(), "").strip()
        if not t:
            raise RuntimeError(f"no Instagram token for {acct}")
        a["token"] = t; a["refreshed"] = datetime.date.today().isoformat()
        uid = os.environ.get("IG_USER_" + acct.upper(), "").strip()
        if uid:
            a["user_id"] = uid
        global CHANGED; CHANGED = True
    return a["token"]


def call(method, path, acct, **params):
    params["access_token"] = tok(acct)
    url = (path if path.startswith("http") else API + path)
    if method == "GET":
        req = urllib.request.Request(url + "?" + urllib.parse.urlencode(params))
    else:
        req = urllib.request.Request(url, data=urllib.parse.urlencode(params).encode(), method=method)
    try:
        return json.load(urllib.request.urlopen(req, timeout=120))
    except urllib.error.HTTPError as e:
        body = e.read()[:600].decode("utf8", "ignore").replace(params["access_token"], "***")
        raise RuntimeError(f"{method} {path} -> HTTP {e.code}: {body}")


def uid_of(acct):
    """Instagram user id for this account (needed on graph.facebook.com)."""
    tok(acct)
    a = ST["accounts"][acct]
    if a.get("user_id"):
        return a["user_id"]
    global CHANGED
    if HOST == "graph.instagram.com":
        a["user_id"] = call("GET", "me", acct, fields="user_id")["user_id"]
    else:  # system user token: look through the Instagram accounts it was given
        found = None
        for path, key in (("me/accounts", "instagram_business_account"),):
            try:
                for pg in call("GET", path, acct, fields="instagram_business_account{id,username}").get("data", []):
                    ig = pg.get(key) or {}
                    if ig.get("id"):
                        found = ig["id"]; break
            except RuntimeError:
                pass
        if not found:
            raise RuntimeError(f"no Instagram user id for {acct}: set the IG_USER_{acct.upper()} secret")
        a["user_id"] = found
    CHANGED = True
    return a["user_id"]


def whoami():
    global CHANGED
    for acct in ("kids", "hadith", "naat", "riddle"):
        try:
            tok(acct)
        except RuntimeError as e:
            print(acct, "-", e); continue
        a = ST["accounts"][acct]
        try:
            if HOST == "graph.instagram.com":
                me = call("GET", "me", acct, fields="user_id,username,account_type,media_count")
            else:
                u = uid_of(acct)
                me = call("GET", u, acct, fields="id,username,media_count")
                me["user_id"] = me.get("id")
        except RuntimeError as e:
            print(acct, "TOKEN PROBLEM", e); continue
        if a.get("user_id") != me.get("user_id") or a.get("username") != me.get("username"):
            a["user_id"], a["username"] = me.get("user_id"), me.get("username"); CHANGED = True
        age = (datetime.date.today() - datetime.date.fromisoformat(a.get("refreshed", "2000-01-01"))).days
        if HOST == "graph.instagram.com" and age >= 7:  # system-user tokens never expire  # long-lived tokens last 60 days; refresh weekly so they never expire
            try:
                r = call("GET", "https://graph.instagram.com/refresh_access_token", acct, grant_type="ig_refresh_token")
                a["token"] = r["access_token"]; a["refreshed"] = datetime.date.today().isoformat(); CHANGED = True
                print(acct, "token refreshed")
            except RuntimeError as e:
                print(acct, "refresh failed", e)
        print(acct, "@" + str(me.get("username")), me.get("account_type"), "posts:", me.get("media_count"))


def caption_from_meta(meta):
    sn = meta.get("snippet", meta)
    title = re.sub(r"\s*#shorts\b", "", sn.get("title", ""), flags=re.I).strip()
    desc = sn.get("description", "")
    desc = re.sub(r"#shorts\b", "#reels", desc, flags=re.I)
    if title.lower() in desc.lower()[:200]:
        cap = desc
    else:
        cap = title + "\n\n" + desc
    tags = re.findall(r"#\w+", cap)
    if len(tags) > 30:  # Instagram allows at most 30 hashtags
        for t in tags[30:]:
            cap = cap.replace(t, "", 1)
    return cap.strip()[:2200]


def recent_captions(acct, n=25):
    uid = uid_of(acct)
    r = call("GET", f"{uid}/media", acct, fields="id,caption,permalink,timestamp", limit=n)
    return r.get("data", [])


def reel(acct, video_url, caption, cover_url=None):
    uid = uid_of(acct)
    first = caption.split("\n", 1)[0].strip()
    for m in recent_captions(acct):  # duplicate guard: same first caption line already posted
        if (m.get("caption") or "").split("\n", 1)[0].strip() == first:
            print("skipped: already posted", m.get("permalink")); return m.get("permalink")
    p = dict(media_type="REELS", video_url=video_url, caption=caption, share_to_feed="true")
    if cover_url:
        p["cover_url"] = cover_url
    c = call("POST", f"{uid}/media", acct, **p)["id"]
    for _ in range(60):  # Instagram downloads and transcodes the video; wait up to ~10 min
        s = call("GET", c, acct, fields="status_code,status")
        if s.get("status_code") == "FINISHED":
            break
        if s.get("status_code") in ("ERROR", "EXPIRED"):
            raise RuntimeError(f"container {s}")
        time.sleep(10)
    else:
        raise RuntimeError("container never finished")
    mid = call("POST", f"{uid}/media_publish", acct, creation_id=c)["id"]
    link = call("GET", mid, acct, fields="permalink").get("permalink")
    print("posted", acct, mid, link)
    return link


def log_state(name, rec):
    with open(pathlib.Path("state") / name, "a", encoding="utf-8") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")


def publish(rdir, date, base):
    """Post every manifest item of the day to its Instagram account, if YouTube QA passed. Returns summary lines."""
    m = json.load(open(f"{rdir}/{date}/manifest.json"))
    done = pathlib.Path("state/ig_uploads.jsonl")
    logged = {json.loads(l)["key"] for l in done.read_text().splitlines() if l.strip()} if done.exists() else set()
    lines = []
    for i, it in enumerate(m["items"]):
        acct = it.get("ig") or LABEL_TO_ACCT.get(it["label"])
        if not acct or it.get("ig") is False:
            continue
        key = f"{date}|{i}|{acct}"
        if key in logged:
            lines.append(f"• {NAMES[acct]}: already on Instagram"); continue
        if not (ST["accounts"].get(acct, {}).get("token") or os.environ.get("IG_TOKEN_" + acct.upper(), "").strip()):
            lines.append(f"• {NAMES[acct]}: Instagram not connected yet (Meta setup pending); will be posted on catch-up"); continue
        qa = it.get("qa") or {}
        if not ((qa.get("auto") or {}).get("passed") and qa.get("authentic") and qa.get("second_check")):
            lines.append(f"• ⛔ {NAMES[acct]}: not posted (quality gate not passed)"); continue
        meta = json.load(open(f"{rdir}/{date}/{it['meta']}"))
        cap = it.get("ig_caption") or caption_from_meta(meta)
        url = base.rstrip("/") + "/" + urllib.parse.quote(f"{date}/{it['video']}")
        try:
            link = reel(acct, url, cap)
            log_state("ig_uploads.jsonl", {"key": key, "acct": acct, "url": link, "at": datetime.datetime.utcnow().isoformat(timespec="seconds")})
            lines.append(f"• 📸 {NAMES[acct]}: {link}")
        except Exception as e:
            print("FAILED", acct, e)
            lines.append(f"• ⚠️ {NAMES[acct]}: Instagram post failed, Claude will retry")
    return lines


def comments(acct):
    uid = uid_of(acct)
    for m in call("GET", f"{uid}/media", acct, fields="id,caption,comments_count,permalink,timestamp", limit=25).get("data", []):
        if not m.get("comments_count"):
            continue
        for c in call("GET", f"{m['id']}/comments", acct, fields="id,text,username,timestamp,replies{id,text,username,timestamp}", limit=50).get("data", []):
            replies = (c.get("replies") or {}).get("data", [])
            print(json.dumps({"media": m["id"], "post": (m.get("caption") or "")[:80], "permalink": m.get("permalink"), "id": c["id"], "user": c.get("username"),
                              "text": c.get("text"), "at": c.get("timestamp"),
                              "we_replied": any(r.get("username") == ST["accounts"][acct].get("username") for r in replies)}, ensure_ascii=False))


def reply(acct, cid, text):
    print(call("POST", f"{cid}/replies", acct, message=text))


def dms(acct):
    me = uid_of(acct)
    base = "me" if HOST == "graph.instagram.com" else me
    r = call("GET", f"{base}/conversations", acct, platform="instagram", fields="id,updated_time,participants,messages.limit(5){id,from,message,created_time}")
    for cv in r.get("data", []):
        msgs = (cv.get("messages") or {}).get("data", [])
        last = msgs[0] if msgs else {}
        other = [p for p in (cv.get("participants") or {}).get("data", []) if p.get("id") != me]
        print(json.dumps({"conversation": cv["id"], "with": other, "updated": cv.get("updated_time"),
                          "last_from_us": (last.get("from") or {}).get("id") == me, "messages": msgs}, ensure_ascii=False))


def dm(acct, rid, text):
    base = "me" if HOST == "graph.instagram.com" else uid_of(acct)
    print(call("POST", f"{base}/messages", acct, recipient=json.dumps({"id": rid}), message=json.dumps({"text": text})))


if __name__ == "__main__":
    cmd, a = sys.argv[1], sys.argv[2:]
    try:
        if cmd == "whoami":
            whoami()
        elif cmd == "publish":
            print("\n".join(publish(*a)))
        elif cmd == "reel":
            reel(a[0], a[1], open(a[2]).read())
        elif cmd == "comments":
            comments(a[0])
        elif cmd == "reply":
            reply(*a)
        elif cmd == "dms":
            dms(a[0])
        elif cmd == "dm":
            dm(*a)
        else:
            raise SystemExit("unknown command " + cmd)
    finally:
        save()
