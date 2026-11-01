"""Free fallback image generator (no Cloudflare): DreamShaper XL v2 Turbo (SDXL, open licence) on a CPU GitHub runner.
usage: sdxl_image.py <job.json> <index>   job: {"images":[{"name","prompt","seed"?, "w"?, "h"?}], "negative": "..."}"""
import json, os, sys, time, torch
from diffusers import AutoPipelineForText2Image, DPMSolverMultistepScheduler
job = json.load(open(sys.argv[1])); im = job["images"][int(sys.argv[2])]
torch.set_num_threads(os.cpu_count() or 4)
M = job.get("model", "Lykon/dreamshaper-xl-v2-turbo")
try:
    pipe = AutoPipelineForText2Image.from_pretrained(M, torch_dtype=torch.float32, variant="fp16")
except Exception as e:
    print("no fp16 variant:", str(e)[:120]); pipe = AutoPipelineForText2Image.from_pretrained(M, torch_dtype=torch.float32)
pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config, use_karras_sigmas=True, algorithm_type="sde-dpmsolver++")
t0 = time.time()
img = pipe(prompt=im["prompt"], negative_prompt=job.get("negative", ""), num_inference_steps=job.get("steps", 7), guidance_scale=job.get("cfg", 2.0),
           width=im.get("w", 768), height=im.get("h", 1344), generator=torch.Generator().manual_seed(im.get("seed", 1234))).images[0]
os.makedirs("images", exist_ok=True); img.save(f"images/{im['name']}.png")
print(im["name"], "ok", img.size, round(time.time() - t0), "s")
