# DAILY RUNBOOK: the 03:10 UK scheduled run

The goal: by **05:30–06:00 UK** Sahil gets a Telegram message with today's 3 videos and ✅/❌ buttons. Nothing goes public without his ✅. `approvals.yml` uploads approved videos within 10 minutes.

Read first: `HANDOFF.md`, `RULEBOOK.md`, `state/riddles.json`, `state/uploads.jsonl`, `state/feedback.jsonl` (holds). Also check the memory file `/areas/islamic-yt-insta-channels.md`, because Sahil's latest decisions land there from his chats with Claude. **Later instructions in memory override this file.**

## 0. Setup (about 3 min)
```
git clone https://github.com/imsv1301/islamic-content-automation && cd islamic-content-automation
(cd video && npm ci)            # Remotion 4.0.539
pip install --break-system-packages faster-whisper soundfile numpy pillow
git fetch origin renders
```
- Only 2 CPUs: render with `--concurrency=2`.
- Never `pkill -f` a pattern that matches your own shell.
- Dispatch workflows with REST (`gh api -X POST repos/imsv1301/islamic-content-automation/actions/workflows/<wf>.yml/dispatches -f ref=main -f "inputs[x]=y"`). `gh workflow run` does not work here.

## 1. Comments (about 10 min)
- For `riddle` and `sadqah`: dispatch `youtube.yml` with `action=comments`, then download the artifact `yt-comments-<label>`. The kids channel has comments off.
- Reply to every top-level comment that doesn't already have a reply from our channel, using `youtube.yml` with `action=reply`, `parent_id`, `text`:
  - Mostly English; match the commenter's language (Urdu → Roman Urdu or Urdu).
  - Warm and short; no links except our own videos.
  - Riddle guesses: never reveal the answer before the solution video. Hint at whether they're close, then invite them to the next video.
- **Never hide or delete a comment.**
- Abusive comments, fatwa / religious-ruling questions, or anything sensitive: don't reply. Send Sahil a note through `telegram.yml` (`mode=text`) with the video and a short paraphrase. Don't quote abuse.

## 2. Pick today's content (about 15 min)
- Web-search today's Hijri date and any upcoming occasions within 7 days: Rajab (Khwaja Garib Nawaz 6 Rajab, Mawla Ali 13 Rajab, Miraj 27 Rajab), Shab-e-Barat, Ramadan, Milad, Gyarwi. Lean today's topics toward them.
- Run the **virality / hook skills** (`going-viral`, `virality`, `on-screen-text-writer`) before finalising each script. Check trends.
- **Solve by Sunrise:**
  - The previous riddle's **solution** comes first, then the **new riddle** (see `state/riddles.json`).
  - English. **No salam.** Characters are only "Person 1/2/3".
  - End: "Comment your answer… the answer drops tomorrow, at sunrise."
  - Update `state/riddles.json`.
- **One More Sadqah:**
  - An Urdu Short under 60s.
  - Hadith only from **Sahih al-Bukhari, Sahih Muslim or Jami' at-Tirmidhi**, verified on sunnah.com the same day. Put the reference on screen and the sunnah.com link in the description.
  - Write "Sallallahu Alaihi Wa Alihi Wasallam" in full.
  - Ahl-e-Sunnat wal Jama'at (Hanafi). If Ala Hazrat and Dr Tahir-ul-Qadri differ on a topic, skip the topic.
  - Subtitles in **Roman Urdu**.
- **Islam for Little Ones:**
  - An English Short under 60s, **Made for Kids**.
  - Topics: manners, sunnahs, duas, values, wudu/salah steps.
  - A modern generic faceless kid. **Never depict** the Prophet, any prophet, Sahaba, Ahl-e-Bait, the Mothers of the Believers or Awliya.
- Characters are always faceless (plain circle or egg head, back views, silhouettes).

## 3. Voice (about 10 min, in parallel)
- **Sahil's cloned voice for all three channels**, including kids. Never Kokoro or another AI voice.
- Write `jobs/<date>_<label>.json` (`{"en": [...]}`, or `{"ur": [...], "roman": [...], "speed": {"ur": 0.75}}`), commit, then dispatch `voice.yml` (`lines`, `langs`).
- Download the artifacts `line_<lang>_<i>`. Check each line with faster-whisper (decode to 16 kHz float32 via ffmpeg) and re-roll bad lines with a new job.
- Urdu: slow it down with `ffmpeg -af rubberband=tempo=0.88:pitchq=quality:formant=preserved`.
- Then `python3 pipeline/build_short.py <lines.json> <lang> <vo_dir> <name> [--roman] --gap 0.4`. This produces `video/src/day1/<name>-timing.json` and `video/public/day1/<name>-mix.m4a`.

## 4. Visuals: "best animation, every time" (the locked-hadith quality bar)
- Templates in `video/src/day1/`:
  - `MysteryShort.tsx` (riddle, warm 3D-toon story style)
  - `SolutionShort.tsx` (riddle solution + next riddle)
  - `StrengthShort.tsx` (One More Sadqah, cinematic canvas + Arabic card + Roman subs)
  - `KidsShort.tsx` (kids, bright 2D kit)
- Copy one to a new file per video, re-time it to the new timing JSON, and change the scenes so they show the script **literally**. Register it in `video/src/Composition.tsx`.
- Images: `images.yml` with a job JSON.
  - FLUX-1-schnell is free (about 80 a day). Keep faces out of it: back views and silhouettes.
  - `@cf/leonardo/lucid-origin` (1088x1920) is best for frontal faceless "egg head" shots, but costs about 5,400 neurons each, and the free tier is 10,000 a day. Use at most 1 a day.
  - Never pay: Cloudflare stays on the free plan.
- Always render stills first (`npx remotion still <Comp> x.png --frame=N`), make a contact sheet, look at it, fix it, then do the full render.

## 5. Package and send by 05:45 UK
- On the `renders` branch, make `renders/<date>/` with the 3 MP4s, a metadata JSON per video (`snippet` + `status`; kids: `selfDeclaredMadeForKids: true`), and `manifest.json`:
  `{"date": "<date>", "items": [{"label": "riddle", "video": "...mp4", "meta": "...json", "title": "<YouTube title>"}, ...], "notes": ["optional message to Sahil"]}`
- Commit and push the renders branch, then dispatch `telegram.yml` with `mode=preview` and `date=<date>`.
- If something failed, still send what's ready, plus a `notes` line explaining what's missing. Never upload anything yourself: uploads happen only through Sahil's ✅.

## 6. Wrap up
- Append a short entry under "Daily log" in `HANDOFF.md`: what was made, which hadith, the riddle number and answer, and any issues. Push to main.
- Do not commit third-party audio (naat/qawwali) or anything private to this public repo.
