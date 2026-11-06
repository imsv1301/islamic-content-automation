"""build_short.py <lines.json> <lang> <vo_dir> <name> [--roman] [--gap 0.45]
Tightens each line, lays them out, writes src/day1/<name>-timing.json and public/day1/<name>-mix.m4a (-14 LUFS)."""
import json, sys, subprocess, numpy as np, soundfile as sf, os
args = sys.argv[1:]; lines_f, lang, vo, name = args[:4]
roman = "--roman" in args
gap = float(args[args.index("--gap") + 1]) if "--gap" in args else 0.4
L = json.load(open(lines_f)); texts = L["roman"] if roman else L[lang]
SAW_TXT = "صلی اللہ تعالیٰ علیہ وآلہ وسلم" if (lang == "ur" and not roman) else "Sallallahu Ta'ala Alaihi Wa Aalihi Wasallam"  # matches Sahil's recorded clip
texts = [t.replace("<SAW>", SAW_TXT) for t in texts]
OUT = os.environ.get("VIDEO_DIR", os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "video")) + "/"
t = 0.35; lines = []; chunks = [np.zeros(int(48000 * 0.35))]
for i, text in enumerate(texts):
    src = f"{vo}/line_{lang}_{i}.wav"; tmp = f"/tmp/tight_{name}_{i}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af",
        "silenceremove=start_periods=1:start_threshold=-42dB:stop_periods=-1:stop_duration=0.2:stop_threshold=-36dB:stop_silence=0.1,areverse,silenceremove=start_periods=1:start_threshold=-42dB,areverse,aresample=48000,pan=mono|c0=c0", tmp], check=True)
    a, sr = sf.read(tmp, dtype="float32")
    dur = len(a) / sr; words = text.split()
    w = np.array([max(2, len(x)) for x in words], float); w /= w.sum()
    toks = []; c = t + 0.05; span = dur - 0.12
    for word, f in zip(words, w): toks.append([word, round(c, 3), round(c + f * span, 3)]); c += f * span
    lines.append({"id": f"l{i}", "start": round(t, 3), "end": round(t + dur, 3), "tokens": toks})
    chunks += [a, np.zeros(int(sr * gap))]; t += dur + gap
total = t + 2.0
audio = np.concatenate(chunks + [np.zeros(int(48000 * 2.0))])
wav = f"/tmp/{name}_vo.wav"; sf.write(wav, audio, 48000)
json.dump({"total": round(total, 3), "lines": lines}, open(OUT + f"src/day1/{name}-timing.json", "w"), ensure_ascii=False)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-f", "lavfi", "-t", str(total), "-i", "anoisesrc=c=brown:a=0.004:r=48000",
    "-filter_complex", "[1:a]lowpass=f=900[b];[0:a][b]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5,aresample=48000[o]",
    "-map", "[o]", "-ac", "2", "-c:a", "aac", "-b:a", "192k", OUT + f"public/day1/{name}-mix.m4a"], check=True)
print(name, round(total, 1))
