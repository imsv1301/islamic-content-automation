"""Generate one narration line in Sahil's cloned voice (OmniVoice, CPU).

The salutation is never left to the TTS: write it as <SAW> in the line, e.g.
  "Our beloved Prophet, <SAW>, said:"   /   "رسول اللہ <SAW> نے فرمایا:"
The text around it is generated, and Sahil's own recorded salutation (voice/salawat.wav.enc,
decrypted with MASTER_KEY inside the job) is spliced in. If that clip is missing, a carefully
voweled spelling is synthesised instead as a fallback.
"""
import json, os, re, subprocess, sys, time
import numpy as np, soundfile as sf, torch
from omnivoice import OmniVoice

lines_file, lang, idx, out = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
J = json.load(open(lines_file))
text = J[lang][idx]
speed = (J.get("speed") or {}).get(lang)
ref_text = json.load(open("voice/ref_texts.json"))[lang]
FALLBACK = {"ur": "صَلَّی اللہُ عَلَیْہِ وَآلِہٖ وَسَلَّم", "en": "Sallal-laahu alaihi, wa aalihi, wa sallam"}

torch.set_num_threads(4)
m = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
SR = getattr(m, "sampling_rate", 24000)


def tts(t):
    a = m.generate(text=t, language={"ur": "Urdu", "en": "English"}[lang], ref_audio=f"/tmp/ref_{lang}.wav", ref_text=ref_text, speed=speed)
    return np.asarray(a[0], dtype=np.float32)


def salawat():
    enc = "voice/salawat.wav.enc"
    if os.path.exists(enc) and os.environ.get("MASTER_KEY"):
        open("/tmp/k", "w").write(os.environ["MASTER_KEY"])
        subprocess.run(["openssl", "enc", "-d", "-aes-256-cbc", "-pbkdf2", "-iter", "200000", "-in", enc, "-out", "/tmp/salawat.wav", "-pass", "file:/tmp/k"], check=True)
        os.remove("/tmp/k")
        a, sr0 = sf.read("/tmp/salawat.wav", dtype="float32")
        os.remove("/tmp/salawat.wav")
        if a.ndim > 1: a = a.mean(1)
        if sr0 != SR:  # no ffmpeg on the runner: resample with torchaudio
            import torchaudio.functional as AF
            a = AF.resample(torch.from_numpy(a), sr0, SR).numpy()
        # match the loudness of the generated speech roughly
        a = a / (np.abs(a).max() + 1e-9) * 0.9
        print("using recorded salutation")
        return a
    print("no recorded salutation yet; synthesising fallback spelling")
    return tts(FALLBACK[lang])


t0 = time.time()
parts = re.split(r"\s*<SAW>\s*", text)
pause = np.zeros(int(SR * 0.08), dtype=np.float32)
chunks = []
for k, p in enumerate(parts):
    if re.search(r"\w", p):
        chunks.append(tts(p.strip(" ,،")))
    if k < len(parts) - 1:
        chunks += [pause, salawat(), pause]
a = np.concatenate(chunks) if chunks else np.zeros(SR // 2, dtype=np.float32)
sf.write(out, a, SR)
print(f"{lang}[{idx}] {len(a)/SR:.1f}s audio in {time.time()-t0:.0f}s")
