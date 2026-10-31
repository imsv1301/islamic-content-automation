"""Generate one narration line in Sahil's cloned voice (OmniVoice, CPU)."""
import json, sys, time, torch, soundfile as sf
from omnivoice import OmniVoice
lines_file, lang, idx, out = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
J = json.load(open(lines_file))
text = J[lang][idx]
speed = (J.get("speed") or {}).get(lang)
ref_text = json.load(open("voice/ref_texts.json"))[lang]
torch.set_num_threads(4)
m = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
t = time.time()
a = m.generate(text=text, language={"ur": "Urdu", "en": "English"}[lang],
               ref_audio=f"/tmp/ref_{lang}.wav", ref_text=ref_text, speed=speed)
sf.write(out, a[0], getattr(m, "sampling_rate", 24000))
print(f"{lang}[{idx}] {len(a[0])/getattr(m,'sampling_rate',24000):.1f}s audio in {time.time()-t:.0f}s")
