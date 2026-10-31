"""Telegram helper for the daily approval flow (Bot API, official).

  tg.py text "<message>"                      send a plain message to Sahil
  tg.py preview <renders_dir> <date>          send every video in <renders_dir>/<date>/manifest.json with ✅ / ❌ buttons
  tg.py poll <renders_dir>                    handle button presses + text replies (called by approvals.yml)

Env: TOKEN (bot token), CHAT (Sahil's chat id), YT_STATE (decrypted YouTube state, for uploads in `poll`).
manifest.json: {"date": "...", "items": [{"label": "riddle", "video": "x.mp4", "meta": "x.json", "title": "..."}]}
"""
import json, os, sys, subprocess, urllib.error, urllib.parse, urllib.request, uuid, pathlib, datetime

TOKEN, CHAT = os.environ["TOKEN"], os.environ["CHAT"]
API = f"https://api.telegram.org/bot{TOKEN}/"


def call(method, **params):
    data = urllib.parse.urlencode({k: (json.dumps(v) if isinstance(v, (dict, list)) else v) for k, v in params.items()}).encode()
    try:
        return json.load(urllib.request.urlopen(API + method, data, timeout=60))
    except urllib.error.HTTPError as e:  # e.g. "query is too old" on a late button press: keep going
        print(method, "HTTP", e.code, e.read()[:200].decode("utf8", "ignore"))
        return {}


def tg_copy(path):
    """Small phone-friendly copy for Telegram: 720x1280, H.264, moov at the front (streams instantly).
    The full-quality file is still what gets uploaded to YouTube."""
    out = "/tmp/tg_" + os.path.basename(path)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-vf", "scale=720:1280:flags=lanczos,setsar=1", "-c:v", "libx264", "-preset", "veryfast", "-crf", "27",
                    "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", out], check=True)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out], capture_output=True, text=True).stdout.strip() or 0)
    return out, int(round(dur))


def send_video(path, caption, markup):
    small, dur = tg_copy(path)
    b = uuid.uuid4().hex
    parts = []
    path = small
    for k, v in (("chat_id", CHAT), ("caption", caption), ("reply_markup", json.dumps(markup)), ("supports_streaming", "true"), ("width", "720"), ("height", "1280"), ("duration", str(dur))):
        parts.append(f"--{b}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode())
    body = b"".join(parts) + f"--{b}\r\nContent-Disposition: form-data; name=\"video\"; filename=\"{os.path.basename(path)}\"\r\nContent-Type: video/mp4\r\n\r\n".encode() + open(path, "rb").read() + f"\r\n--{b}--\r\n".encode()
    req = urllib.request.Request(API + "sendVideo", data=body, headers={"Content-Type": f"multipart/form-data; boundary={b}"})
    return json.load(urllib.request.urlopen(req, timeout=300))


CH = {"sadqah": "One More Sadqah", "kids": "Islam for Little Ones", "riddle": "Solve by Sunrise"}


def preview(rdir, date):
    m = json.load(open(f"{rdir}/{date}/manifest.json"))
    call("sendMessage", chat_id=CHAT, text=f"Assalamu alaikum 🌅 Today's videos ({date}). Tap ✅ to upload or ❌ to hold. For changes, message Claude in the Claude app.")
    for i, it in enumerate(m["items"]):
        cap = f"{CH.get(it['label'], it['label'])}\n{it.get('title', '')}"[:1000]
        kb = {"inline_keyboard": [[{"text": "✅ Upload", "callback_data": f"ok|{date}|{i}"}, {"text": "❌ Hold", "callback_data": f"no|{date}|{i}"}]]}
        r = send_video(f"{rdir}/{date}/{it['video']}", cap, kb)
        print("sent", i, r.get("ok"))
    for n in m.get("notes", []):
        call("sendMessage", chat_id=CHAT, text=n)


def log_state(name, rec):
    p = pathlib.Path("state") / name
    with open(p, "a", encoding="utf-8") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")


def poll(rdir):
    ups = call("getUpdates", timeout=0).get("result", [])
    if not ups:
        print("no updates"); return
    call("getUpdates", offset=ups[-1]["update_id"] + 1, timeout=0)  # confirm first, so a crash never double-uploads
    for u in ups:
        if "callback_query" in u:
            q = u["callback_query"]
            if str(q["from"]["id"]) != str(CHAT) and str(q["message"]["chat"]["id"]) != str(CHAT):
                continue
            act, date, idx = q["data"].split("|"); idx = int(idx)
            done = pathlib.Path("state/uploads.jsonl")
            already = done.exists() and any(json.loads(l).get("key") == f"{date}|{idx}" for l in done.read_text().splitlines() if l.strip())
            msg = q["message"]
            if act == "ok" and not already:
                call("answerCallbackQuery", callback_query_id=q["id"], text="Uploading…")
                it = json.load(open(f"{rdir}/{date}/manifest.json"))["items"][idx]
                out = subprocess.run([sys.executable, "yt/yt.py", "upload", it["label"], f"{rdir}/{date}/{it['video']}", f"{rdir}/{date}/{it['meta']}"] + ([f"{rdir}/{date}/{it['thumb']}"] if it.get("thumb") else []), capture_output=True, text=True)
                print(out.stdout, out.stderr[-500:])
                link = next((w for w in out.stdout.split() if w.startswith("https://youtu.be/")), None)
                cap = (msg.get("caption") or "") + (f"\n\n✅ Uploaded: {link}" if link else "\n\n⚠️ Upload failed, Claude will retry next run")
                call("editMessageCaption", chat_id=CHAT, message_id=msg["message_id"], caption=cap[:1020])
                if link:
                    log_state("uploads.jsonl", {"key": f"{date}|{idx}", "label": it["label"], "url": link, "at": datetime.datetime.utcnow().isoformat()})
            elif act == "ok":
                call("answerCallbackQuery", callback_query_id=q["id"], text="Already uploaded ✓")
            else:
                call("answerCallbackQuery", callback_query_id=q["id"], text="Held ⏸")
                call("editMessageCaption", chat_id=CHAT, message_id=msg["message_id"], caption=((msg.get("caption") or "") + "\n\n⏸ Held. Tell Claude in the Claude app what to change.")[:1020])
                log_state("feedback.jsonl", {"date": date, "idx": idx, "type": "hold", "at": datetime.datetime.utcnow().isoformat()})
        elif "message" in u and str(u["message"]["chat"]["id"]) == str(CHAT) and u["message"].get("text"):
            t = u["message"]["text"]
            if t.startswith("/start"):
                continue
            # the repo is public, so free-text messages are never stored; changes go through the Claude chat
            call("sendMessage", chat_id=CHAT, text="Got it. To change a video, tell me in the Claude app chat (this bot only handles ✅ / ❌ so your messages never end up in the public repo).", reply_to_message_id=u["message"]["message_id"])


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "text":
        print(call("sendMessage", chat_id=CHAT, text=sys.argv[2]).get("ok"))
    elif cmd == "preview":
        preview(sys.argv[2], sys.argv[3])
    elif cmd == "poll":
        poll(sys.argv[2])
