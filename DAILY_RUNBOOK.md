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
- **Emotion (Sahil, 6 Nov):** give the voice feeling where the line needs it.
  - Per line, set `"style": {"<lang>": {"<idx>": "calm|warm|excited|serious"}}`. It uses Sahil's matching tone recording when one exists.
    - excited: hooks, kids' fun moments, riddle reveals
    - serious: a hadith's warning or weight
    - warm: duas, kindness, the closing line
    - calm: everything else
  - `"line_speed": {"<lang>": {"<idx>": 0.85}}` slows key lines.
  - Write with emotional punctuation (… ! ?).
  - OmniVoice non-verbal tags like `[sigh]` or `[laughter]` are allowed **rarely**, in kids and riddle videos only, never inside a hadith or around the Prophet's mention.
  - The second check confirms the emotion fits and isn't overdone.
- **Mentioning the Prophet: always write `<SAW>`** in every voice line, in the `en`, `ur` and `roman` arrays alike.
  - `<SAW>` becomes the **whole phrase**, so **don't** write "Prophet", "Nabi" or "Rasool Allah" before it:
    - English: Sahil's recording, "our Prophet Muhammad-e-Mustafa, Sallallahu Ta'ala Alaihi Wa Aalihi Wasallam"
    - Urdu: Sahil's recording, "ہمارے نبی محمدِ مصطفیٰ صلی اللہ تعالیٰ علیہ وآلہ وسلم" 
  - Write e.g. `"<SAW> said: …"`, `"Do you know what <SAW> taught us?"`, `"<SAW> نے فرمایا:"`.
  - Never type the salutation itself into a voice line.
  - `voice_line.py` splices Sahil's own recorded salutation (`voice/salawat.wav.enc`) at that spot, so it's always pronounced correctly.
  - `build_short.py` writes the full "Sallallahu Alaihi Wa Alihi Wasallam" into the captions.
  - Don't re-roll the salutation part; it's a fixed recording.
- **Sahil's cloned voice for all three channels**, including kids. Never Kokoro or another AI voice.
- Write `jobs/<date>_<label>.json` (`{"en": [...]}`, or `{"ur": [...], "roman": [...], "speed": {"ur": 0.75}}`), commit, then dispatch `voice.yml` (`lines`, `langs`).
- Download the artifacts `line_<lang>_<i>`. Check each line with faster-whisper (decode to 16 kHz float32 via ffmpeg) and re-roll bad lines with a new job.
- Urdu: slow it down with `ffmpeg -af rubberband=tempo=0.88:pitchq=quality:formant=preserved`.
- Then `python3 pipeline/build_short.py <lines.json> <lang> <vo_dir> <name> [--roman] --gap 0.4`. This produces `video/src/day1/<name>-timing.json` and `video/public/day1/<name>-mix.m4a`.

## 4. Visuals: "best animation, every time"
**House style for every channel (approved by Sahil, 31 Oct):**
- Warm amber/orange cinematic 3D-toon stills from Cloudflare Workers AI, with slow camera pushes and pans and cut flashes.
- A HUD (DAY · time · place · tag) and big uppercase captions with one gold keyword.
- Claim or info cards, a vote or CTA ending, rain/particle overlays and grain.
- Base every video on `video/src/day1/MysteryShort.tsx`. Adapt the HUD per channel:
  - kids: "DAY n · Lesson", gentle and bright, no scary scenes
  - Sadqah: hadith card with Arabic + Roman Urdu
  - riddle: as in the sample
- Faceless characters only.
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
- **Master render quality (YouTube/Instagram):** `npx remotion render <Comp> out.mp4 --concurrency=2 --codec=h264 --crf=15 --x264-preset=medium --audio-bitrate=320k --pixel-format=yuv420p`. Never upload the Telegram preview copy.
- Images: generate at the highest size the model allows. Prefer Lucid (1088x1920, about 1 a day free) for the hero shot. FLUX shots are 1024² and get cropped and upscaled; keep the camera zoom at 1.2 or less on them so they stay sharp.
- Always render stills first (`npx remotion still <Comp> x.png --frame=N`), make a contact sheet, look at it, fix it, then do the full render.

## 4b. QUALITY GATE: check twice before anything is uploaded (Sahil, 6 Nov 2026)
Nothing is published unless **both** checks pass for that video. `publish.yml` refuses items without a full `qa` block and tells Sahil on Telegram.

**Check 1 (you, automatic + manual):**
- After voice.yml, write the run id into the job file: `"voice_run_id": <id>` in `jobs/<date>_<label>.json`. That proves the narration is Sahil's clone.
- Run `python3 scripts/qa_check.py renders <date> jobs`. It checks:
  - format: 1080x1920, audio present, 8–180s, a master-size file
  - title ≤100 characters, public, the kids flag
  - the salutation is in full form (no PBUH/SAW), and `<SAW>` is used in voice lines
  - hadith: sunnah.com link present, and the source is only Bukhari, Muslim or Tirmidhi
  - riddles: no salam, no names
  - **pronunciation and voice:** a whisper transcript of the final video compared with the script (writes `qa.heard` and `qa.script_match`)
- Fix everything it flags, re-render, re-run it until PASS.

**Check 2 (a fresh subagent that hasn't seen the work):** give it RULEBOOK.md, memory `/areas/islamic-yt-insta-channels.md`, the manifest, the metadata, the job files, `qa.heard` and a contact sheet of about 12 frames per video. It must confirm independently:
1. **Authentic:** open each sunnah.com URL, and check that the hadith number, narrator, wording and grade (Sahih/Hasan) match what the video and description say. Nothing fabricated or weak. Ahl-e-Sunnat wal Jama'at (Hanafi). Topics where Ala Hazrat and Dr Tahir-ul-Qadri differ are skipped. Honorifics are correct. Then set `qa.authentic: true` and record `qa.hadith_urls`.
2. **Pronunciation:** read `qa.heard` against the script. Arabic, Urdu and Islamic terms are said correctly, the salutation is the recorded clip, and there are no garbled words. Riddle logic is correct and the answer is right.
3. **Voice:** Sahil's clone on every channel (kids included), the calm pace (Urdu slowed), no AI voice, no music clash.
4. **Every other rule:**
   - no faces, and never the Prophet, prophets, Sahaba, Ahl-e-Bait, the Mothers of the Believers or Awliya
   - house style
   - Roman Urdu subtitles (Sadqah)
   - Person 1/2/3 and no salam (riddle)
   - Made for Kids (kids)
   - real footage only for Masjid/Madinah shots
   - nothing haram, and no copyrighted music
   - correct Islamic date or occasion if mentioned

   Then set `qa.second_check: true` and `qa.second_check_notes`.

If either check fails, fix and re-check. If it can't be fixed in time, publish only the videos that passed, and put the reason in `notes`.

## 5. Package and publish (auto, since 6 Nov 2026), done by about 05:45 UK
- On the `renders` branch, make `renders/<date>/` with the 3 full-quality MP4s, a metadata JSON per video (`snippet` + `status` with `privacyStatus: "public"`; kids: `selfDeclaredMadeForKids: true`; titles of 100 characters or less), and `manifest.json`:
  `{"date": "<date>", "items": [{"label": "riddle", "video": "...mp4", "meta": "...json", "title": "<YouTube title>"}, ...], "notes": ["optional info line for Sahil"]}`
- **Check each video before publishing:** 1080x1920, it has audio, the duration is right, you've watched the contact sheet, the hadith reference is correct, the kids flag is set, and there are no faces.
- Push the renders branch, then dispatch **`publish.yml`** with `date=<date>`. It uploads all 3 straight to YouTube as **public** (with a duplicate-title guard), logs them in `state/uploads.jsonl`, and texts Sahil the links on Telegram. **There is no approval step any more** (Sahil's decision, 6 Nov).
- Before rendering, check YouTube (`yt.py stats` via `youtube.yml`) and `state/uploads.jsonl` for any earlier day that never went up, and publish those first, oldest first.
- If something failed, publish what's ready and put a `notes` line in the manifest saying what's missing.

## 6. Wrap up
- Append a short entry under "Daily log" in `HANDOFF.md`: what was made, which hadith, the riddle number and answer, and any issues. Push to main.
- Do not commit third-party audio (naat/qawwali) or anything private to this public repo.

## Hourly comment check (scheduled task "Sadqah Media comments")
1. Dispatch `youtube.yml` `action=comments` for `riddle` and `sadqah`, then read the artifacts.
2. A thread is **new** if it has no reply from our own channel and its id is not in `state/comments_handled.jsonl`.
3. Reply following the Section 1 rules. Riddle guesses: never reveal the answer before the solution video.
4. Flag abusive, fatwa-type or sensitive comments to Telegram (`telegram.yml` `mode=text`) once, without quoting abuse.
5. Append `{"id": thread_id, "action": "replied" | "flagged" | "skipped", "at": ...}` for every thread to `state/comments_handled.jsonl` (ids only, never comment text), then push.
6. If nothing is new, stop quickly. Don't touch videos, and never upload.
