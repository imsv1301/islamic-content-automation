"""Pre-upload quality gate. Run by the daily session BEFORE publish.yml, for every video of the day.

  python3 scripts/qa_check.py <renders_dir> <date> <lines_dir>

<lines_dir> holds the day's voice-line JSONs as jobs/<date>_<label>.json (the exact text that was voiced).
For every manifest item it checks what a machine can check, then writes the result into
manifest.json -> items[i]["qa"]["auto"]. publish.yml refuses any item whose qa block is not fully passed:
  qa.auto.passed == true        (this script)
  qa.authentic == true          (hadith verified on sunnah.com, URL recorded in qa.hadith_urls)
  qa.second_check == true       (an independent second review, by a fresh subagent, of every rule)
"""
import json, os, re, subprocess, sys, difflib, unicodedata
import numpy as np

R, D, JOBS = sys.argv[1], sys.argv[2], sys.argv[3]
man_f = f"{R}/{D}/manifest.json"
M = json.load(open(man_f))

ARABIC_SALAWAT = ("صلی اللہ علیہ وآلہ وسلم", "صلى الله عليه وآله وسلم", "صلی اللہ تعالیٰ علیہ وآلہ وسلم")
BANNED = [r"\bpbuh\b", r"peace be upon him", r"\(s\.?a\.?w\.?\)", r"\bsaw\b", r"\bs\.a\.w\.s\b"]


def probe(f):
    j = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_type,width,height,r_frame_rate",
                                   "-of", "json", f], capture_output=True, text=True).stdout)
    return j


def norm(s):
    s = unicodedata.normalize("NFKC", s.lower())
    s = re.sub(r"<saw>", " ", s)
    return re.sub(r"[^\w\s]", " ", s)


_model = None


def transcribe(f, lang):
    global _model
    from faster_whisper import WhisperModel
    if _model is None:
        _model = WhisperModel("small", device="cpu", compute_type="int8")
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ar", "16000", "-ac", "1", "-f", "f32le", "-"], capture_output=True).stdout
    segs, _ = _model.transcribe(np.frombuffer(pcm, np.float32), language=lang, beam_size=5, vad_filter=True)
    return " ".join(s.text for s in segs)


all_ok = True
for i, it in enumerate(M["items"]):
    label = it["label"]
    issues, ok = [], True
    f = f"{R}/{D}/{it['video']}"
    meta = json.load(open(f"{R}/{D}/{it['meta']}"))
    sn, st = meta.get("snippet", {}), meta.get("status", {})
    title, desc = sn.get("title", ""), sn.get("description", "")

    # --- file / format
    p = probe(f)
    v = [s for s in p["streams"] if s["codec_type"] == "video"]
    a = [s for s in p["streams"] if s["codec_type"] == "audio"]
    dur = float(p["format"]["duration"])
    if not v or (v[0].get("width"), v[0].get("height")) != (1080, 1920): issues.append("video is not 1080x1920")
    if not a: issues.append("no audio track")
    if not (8 <= dur <= 180): issues.append(f"duration {dur:.0f}s outside 8–180s (Shorts)")
    if os.path.getsize(f) < 3_000_000: issues.append("file suspiciously small for a CRF-15 master (is this the Telegram copy?)")

    # --- metadata rules
    if len(title) > 100: issues.append("title over 100 characters")
    if st.get("privacyStatus") != "public": issues.append("privacyStatus is not public")
    if label == "kids" and st.get("selfDeclaredMadeForKids") is not True: issues.append("kids video not marked Made for Kids")
    if label != "kids" and st.get("selfDeclaredMadeForKids") is True: issues.append("non-kids video marked Made for Kids")
    blob = (title + "\n" + desc)
    for b in BANNED:
        if re.search(b, blob, re.I): issues.append(f"banned salutation form in title/description ({b}); write 'Sallallahu Alaihi Wa Alihi Wasallam' in full")
    if re.search(r"\b(prophet|rasool|rasul|nabi|muhammad)\b", blob, re.I) and not re.search(r"Sallallahu (Ta.ala )?Alaihi Wa A{1,2}lihi Wa ?sallam", blob, re.I) and not any(x in blob for x in ARABIC_SALAWAT):
        issues.append("Prophet mentioned in title/description without the full salutation")
    if label in ("sadqah", "kids") and re.search(r"(bukhari|muslim|tirmidhi|hadith|hadees)", blob, re.I):
        if "sunnah.com/" not in desc: issues.append("hadith referenced but no sunnah.com link in the description")
        for src in re.findall(r"(abu dawud|ibn majah|nasa'?i|ahmad|mustadrak|tabarani)", blob, re.I):
            issues.append(f"hadith source '{src}' is outside the allowed Bukhari/Muslim/Tirmidhi")
    if label == "riddle":
        if re.search(r"(assalam|as-salam|salam alaikum|السلام)", blob, re.I): issues.append("riddle video must not open with salam")

    # --- voice + pronunciation (script vs what was actually said)
    job = f"{JOBS}/{D}_{label}.json"
    if os.path.exists(job):
        J = json.load(open(job)); lang = "ur" if "ur" in J else "en"
        script = " ".join(J[lang])
        if label == "riddle" and re.search(r"(assalam|salam alaikum|السلام)", script, re.I): issues.append("riddle script contains salam")
        if label == "riddle" and re.search(r"\b(Adam|Zara|Omar|Ali|Ahmed|John|Sara)\b", script): issues.append("riddle uses names; use Person 1/2/3")
        if re.search(r"(Sallallahu|صلی اللہ|صلى الله|ﷺ)", script) : issues.append("salutation typed into a voice line; use <SAW> so the recorded clip is spliced")
        heard = transcribe(f, lang)
        if "<SAW>" in script or re.search(r"(prophet|rasool|رسول|nabi)", script, re.I):
            if re.search(r"(alaihi|alayhi|علیہ|علی)\W*(wa)?\s*(sallam|salam|سلم)", heard, re.I) and not re.search(r"(aalihi|alihi|aali|aale|ālihi|آلہ|والہ|والے|آلِہ|alih)", heard, re.I):
                issues.append("salutation in the audio sounds incomplete (no 'Wa Aalihi' heard); it must be 'Sallallahu Alaihi Wa Alihi Wasallam'")
        ratio = difflib.SequenceMatcher(None, norm(script).split(), norm(heard).split()).ratio()
        it.setdefault("qa", {})["heard"] = heard[:2000]
        if ratio < (0.55 if lang == "ur" else 0.7):
            issues.append(f"spoken audio matches the script only {ratio:.0%}; check pronunciation/voice and re-roll bad lines")
        it["qa"]["script_match"] = round(ratio, 3)
        if not J.get("voice_run_id"): issues.append("voice_run_id missing in the job file (narration must come from voice.yml = Sahil's clone)")
    else:
        issues.append(f"voice line file {job} not found, so voice and pronunciation can't be checked")

    ok = not issues
    all_ok &= ok
    it.setdefault("qa", {})["auto"] = {"passed": ok, "issues": issues}
    print(("PASS " if ok else "FAIL ") + f"{label}: " + ("; ".join(issues) or "all automatic checks passed"))

json.dump(M, open(man_f, "w"), ensure_ascii=False, indent=1)
sys.exit(0 if all_ok else 1)
