import json, soundfile as sf, numpy as np, subprocess
L = json.load(open('/home/claude/automation/videos/day1/lines_final.json'))
OUT = '/home/claude/automation/videos/remotion/hadith-v4-remotion/'
for lang, name, gap, lead in [('ur','sadqah',0.42,0.35),('en','riddle',0.32,0.15)]:
    t = lead; lines=[]; chunks=[np.zeros(int(48000*lead))]
    for i, text in enumerate(L[lang]):
        a, sr = sf.read(f'tight_{lang}_{i}.wav', dtype='float32')
        if a.ndim > 1: a = a.mean(1)
        dur = len(a)/sr
        words = text.split(); w = np.array([max(2,len(x)) for x in words], float); w /= w.sum()
        toks=[]; c = t + 0.05; span = dur - 0.12
        for word, f in zip(words, w):
            toks.append([word, round(c,3), round(c+f*span,3)]); c += f*span
        lines.append({'id':f'l{i}','start':round(t,3),'end':round(t+dur,3),'tokens':toks})
        chunks += [a, np.zeros(int(sr*gap))]; t += dur + gap
    total = t + 2.2
    audio = np.concatenate(chunks + [np.zeros(int(48000*2.2))])
    sf.write(f'/home/claude/automation/videos/day1/{name}_vo.wav', audio, 48000)
    json.dump({'total':round(total,3),'lines':lines}, open(OUT+f'src/day1/{name}-timing.json','w'), ensure_ascii=False)
    # mix: voice + very soft room-tone bed, loudness -14 LUFS
    subprocess.run(['ffmpeg','-v','error','-y','-i',f'/home/claude/automation/videos/day1/{name}_vo.wav','-f','lavfi','-t',str(total),'-i','anoisesrc=c=brown:a=0.004:r=48000',
        '-filter_complex','[1:a]lowpass=f=900[b];[0:a][b]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5,aresample=48000[o]','-map','[o]','-ac','2','-c:a','aac','-b:a','192k',OUT+f'public/day1/{name}-mix.m4a'],check=True)
    print(name, round(total,1))
