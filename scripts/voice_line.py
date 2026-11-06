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
URDU_PREFIX = "ہمارے نبی محمدِ مصطفیٰ"
FALLBACK = {"ur": "صَلَّی اللہُ عَلَیْہِ وَآلِہٖ وَسَلَّم", "en": "Sallal-laahu alaihi, wa aalihi, wa sallam"}

torch.set_num_threads(4)
m = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
SR = getattr(m, "sampling_rate", 24000)


def tts(t):
    a = m.generate(text=t, language={"ur": "Urdu", "en": "English"}[lang], ref_audio=f"/tmp/ref_{lang}.wav", ref_text=ref_text, speed=speed)
    return np.asarray(a[0], dtype=np.float32)


def _decrypt(enc):
    open("/tmp/k", "w").write(os.environ["MASTER_KEY"])
    subprocess.run(["openssl", "enc", "-d", "-aes-256-cbc", "-pbkdf2", "-iter", "200000", "-in", enc, "-out", "/tmp/clip.wav", "-pass", "file:/tmp/k"], check=True)
    os.remove("/tmp/k")
    a, sr0 = sf.read("/tmp/clip.wav", dtype="float32"); os.remove("/tmp/clip.wav")
    if a.ndim > 1: a = a.mean(1)
    if sr0 != SR:  # no ffmpeg on the runner: resample with torchaudio
        import torchaudio.functional as AF
        a = AF.resample(torch.from_numpy(a), sr0, SR).numpy()
    return a / (np.abs(a).max() + 1e-9) * 0.9


def salawat():
    """English: Sahil's recording of the whole phrase "our Prophet Muhammad-e-Mustafa, Sallallahu Ta'ala Alaihi Wa Aalihi Wasallam".
    Urdu: "ہمارے نبی محمدِ مصطفیٰ" in his cloned voice + his recorded "Sallallahu Ta'ala Alaihi Wa Aalihi Wasallam"."""
    if os.environ.get("MASTER_KEY") and os.path.exists("voice/salawat.wav.enc"):
        if lang == "ur" and os.path.exists("voice/salawat_core.wav.enc"):
            print("using Urdu prefix + recorded salutation")
            pre = tts(URDU_PREFIX)
            return np.concatenate([pre, np.zeros(int(SR * 0.06), dtype=np.float32), _decrypt("voice/salawat_core.wav.enc")])
        print("using recorded full phrase")
        return _decrypt("voice/salawat.wav.enc")
    print("no recorded salutation available; synthesising fallback spelling")
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
