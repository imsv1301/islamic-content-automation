"""Mehfil-e-Sama (naat + qawwali) helper, run inside GitHub Actions only (the audio is third-party and never leaves the runner).

  mehfil.py prep <media_dir> <id,id,...> <out.json>
      decrypted audio must already be at <media_dir>/<id>.opus. Writes per-track whisper segments (start/end/text)
      and silence gaps so the daily run can choose a clip of complete verses (45-90 s) without ever hearing the file.
  mehfil.py build <media_dir> <renders_dir> <job.json> <out_dir>
      for each item {type, id, start, end, video, caption}: cut the clip (0.4 s fade in, 1.5 s fade out), mux it onto the
      silent house-style render <renders_dir>/<video> as 320k AAC, write <out_dir>/<n>.mp4 (full quality) + list.json.
"""
import json, os, subprocess, sys


def sh(*a):
    return subprocess.run(a, check=True, capture_output=True, text=True).stdout


def dur(f):
    return float(sh("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f).strip())


def prep(md, ids, out):
    from faster_whisper import WhisperModel
    import numpy as np
    model = WhisperModel("small", device="cpu", compute_type="int8")
    res = {}
    for i in ids.split(","):
        f = f"{md}/{i}.opus"
        pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ar", "16000", "-ac", "1", "-f", "f32le", "-"], capture_output=True).stdout
        segs, info = model.transcribe(np.frombuffer(pcm, np.float32), language="ur", beam_size=3, vad_filter=False)
        segs = [{"s": round(s.start, 2), "e": round(s.end, 2), "t": s.text.strip()} for s in segs]
        sil = subprocess.run(["ffmpeg", "-v", "info", "-i", f, "-af", "silencedetect=noise=-32dB:d=0.6", "-f", "null", "-"], capture_output=True, text=True).stderr
        gaps = [float(l.split("silence_end: ")[1].split()[0]) for l in sil.splitlines() if "silence_end" in l]
        res[i] = {"duration": round(dur(f), 1), "segments": segs, "silence_ends": gaps}
        print(i, len(segs), "segments", res[i]["duration"], "s")
    json.dump(res, open(out, "w"), ensure_ascii=False, indent=0)


def clipinfo(md, clips, out):
    """For the animated reels: word timings (whisper) + beats (librosa) of each chosen clip window, times relative to the clip.
    clips = "id:start:end,id:start:end". Only timings leave the job, never audio."""
    from faster_whisper import WhisperModel
    import numpy as np, librosa
    model = WhisperModel("small", device="cpu", compute_type="int8")
    res = {}
    for c in clips.split(","):
        i, a, b = c.split(":"); a, b = float(a), float(b)
        pcm = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(a), "-t", str(b - a), "-i", f"{md}/{i}.opus", "-ar", "16000", "-ac", "1", "-f", "f32le", "-"], capture_output=True).stdout
        y = np.frombuffer(pcm, np.float32)
        words = []
        for lang in ("ur", "hi"):
            segs, _ = model.transcribe(y, language=lang, vad_filter=False, condition_on_previous_text=False, word_timestamps=True)
            ws = [{"w": w.word.strip(), "s": round(w.start, 2), "e": round(w.end, 2), "p": round(w.probability, 2)} for sg in segs for w in sg.words]
            words.append({"lang": lang, "words": ws})
        tempo, bt = librosa.beat.beat_track(y=y.astype(np.float32), sr=16000)
        beats = [round(float(x), 3) for x in librosa.frames_to_time(bt, sr=16000)]
        res[c] = {"id": i, "start": a, "end": b, "tempo": float(np.atleast_1d(tempo)[0]), "beats": beats, "transcripts": words}
        print(c, len(beats), "beats", [len(w["words"]) for w in words], "words")
    json.dump(res, open(out, "w"), ensure_ascii=False, indent=0)


def build(md, rd, job_f, od):
    os.makedirs(od, exist_ok=True)
    job = json.load(open(job_f)); out = []
    for n, it in enumerate(job["items"]):
        a, b = float(it["start"]), float(it["end"])
        L = b - a
        if not (15 <= L <= 90):
            raise SystemExit(f"clip {it['id']} is {L:.1f}s; keep it 15-90 s")
        vid = f"{rd}/{it['video']}"
        vd = dur(vid)
        clip = f"/tmp/clip{n}.wav"
        sh("ffmpeg", "-v", "error", "-y", "-ss", str(a), "-t", str(L), "-i", f"{md}/{it['id']}.opus",
           "-af", f"afade=t=in:d=0.4,afade=t=out:st={max(0, L - 1.5)}:d=1.5,loudnorm=I=-14:TP=-1.0:LRA=11", "-ar", "48000", "-ac", "2", clip)
        o = f"{od}/{n}_{it['type']}.mp4"
        # the silent render is made to the clip length; whichever is shorter decides the end
        sh("ffmpeg", "-v", "error", "-y", "-i", vid, "-i", clip, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy",
           "-c:a", "aac", "-b:a", "320k", "-shortest", "-movflags", "+faststart", o)
        out.append({"file": os.path.basename(o), "type": it["type"], "id": it["id"], "caption": it["caption"], "video_s": round(vd, 1), "clip_s": round(L, 1)})
        print("built", o, round(L, 1), "s")
    json.dump(out, open(f"{od}/list.json", "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    {"prep": lambda: prep(*sys.argv[2:5]), "clipinfo": lambda: clipinfo(*sys.argv[2:5]), "build": lambda: build(*sys.argv[2:6])}[sys.argv[1]]()
