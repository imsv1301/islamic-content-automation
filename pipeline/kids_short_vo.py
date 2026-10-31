import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
K = Kokoro('/home/claude/automation/tools/kokoro/kokoro-v1.0.onnx', '/home/claude/automation/tools/kokoro/voices-v1.0.bin')
V, SPEED, SR = "am_michael", 0.9, 24000
SAL = ("ph", "sˌɑlɐllˈɑːhu ɐlˈeɪhi wɐ ˈɑːlihi wɐsˈɑlləm")
BISM = ("ph", "bɪsmɪllˈɑː")
LINES = [
 ["Three tiny rules that make every meal special!"],
 ["Our beloved Prophet,", SAL, ", taught a young boy these at the table."],
 ["Number one.", ".", "Say", BISM, "!"],
 ["Number two.", ".", "Eat with your right hand."],
 ["Number three.", ".", "Eat from the food that's near you."],
 [BISM, ".", "Right hand.", ".", "Near you."],
 ["Can you do all three at your next meal?"],
]
CAPS = ["Three tiny rules that make every meal special!",
 "Our beloved Prophet ﷺ taught a young boy these at the table.",
 "Number one. Say Bismillah!", "Number two. Eat with your right hand.",
 "Number three. Eat from the food that's near you.", "Bismillah. Right hand. Near you.",
 "Can you do all three at your next meal?"]
POLISH = ("silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,"
          "highpass=f=70,equalizer=f=160:t=q:w=1:g=2,equalizer=f=3000:t=q:w=1.2:g=2.5,equalizer=f=7500:t=q:w=1:g=-2,"
          "acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=3")
def speak(parts):
    out = []
    for p in parts:
        if isinstance(p, tuple): a, _ = K.create(p[1], voice=V, speed=0.85, is_phonemes=True)
        else:
            t = p.strip()
            if t in (",", ".", "!", "?", ""): out.append(np.zeros(int(0.14 * SR), np.float32)); continue
            a, _ = K.create(t, voice=V, speed=SPEED, lang="en-us")
        out.append(a.astype(np.float32)); out.append(np.zeros(int(0.05 * SR), np.float32))
    return np.concatenate(out)
t = 0.3; lines = []; chunks = [np.zeros(int(48000 * 0.3))]
for i, parts in enumerate(LINES):
    sf.write(f"raw{i}.wav", speak(parts), SR)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"raw{i}.wav", "-af", POLISH, "-ar", "48000", "-ac", "1", f"l{i}.wav"], check=True)
    a, sr = sf.read(f"l{i}.wav", dtype="float32"); d = len(a) / sr
    words = CAPS[i].split(); w = np.array([max(2, len(x)) for x in words], float); w /= w.sum()
    toks = []; c = t + 0.05
    for word, f in zip(words, w): toks.append([word, round(c, 3), round(c + f * (d - 0.1), 3)]); c += f * (d - 0.1)
    lines.append({"id": f"l{i}", "start": round(t, 3), "end": round(t + d, 3), "tokens": toks})
    chunks += [a, np.zeros(int(48000 * 0.45))]; t += d + 0.45
total = t + 2.2
sf.write("vo.wav", np.concatenate(chunks + [np.zeros(int(48000 * 2.2))]), 48000)
P = "/home/claude/automation/videos/remotion/hadith-v4-remotion/"
json.dump({"total": round(total, 3), "lines": lines}, open(P + "src/day1/kidsshort-timing.json", "w"), ensure_ascii=False)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "vo.wav", "-af", "loudnorm=I=-14:TP=-1.5", "-ac", "2", "-c:a", "aac", "-b:a", "192k", P + "public/day1/kidsshort-mix.m4a"], check=True)
print("total", round(total, 1))
