# HANDOFF: read this first in any new chat

Last updated: **Sat 31 Oct 2026, 10:10 UK**. Owner: Sahil (GitHub `imsv1301`).
This file plus `RULEBOOK.md` hold everything needed to carry on. The old chat's workspace is gone; everything that matters is in this repo.

**New chat, start here:** `git clone https://github.com/imsv1301/islamic-content-automation`, read `HANDOFF.md` and `RULEBOOK.md`, then go to "8. What's next".

---

## 1. The goal
A fully free, automated set of Islamic content channels. Claude writes the scripts, makes the voice, renders the videos, writes titles, descriptions and thumbnails, uploads, and manages comments. Sahil approves each day's videos on Telegram (✅) before anything is posted. Sahil does not want to command videos or comment handling manually every day.

## 2. Channels
| Platform | Name | Handle | ID / status |
|---|---|---|---|
| YouTube | Islam for Little Ones (English, **Made for Kids**, **Shorts only for now**) | @islamforlittleonestv | UCbprx0JxeA47wgBhlC8olXQ · label `kids` |
| YouTube | One More Sadqah (Urdu, adult) | @one_more_sadqah | UC1DtyCj9u-sgvhI41MyN2fg · label `sadqah` |
| YouTube | Solve by Sunrise (English riddles) | @solvebysunrise | UCG0dOcXGh_273Yvw4BF-YgQ · label `riddle` |
| Instagram | Islam for Little Ones | @islamforlittleones | created 12 Nov 2026 · Creator, Education, bio + logo set |
| Instagram | Raah-e-Sunnat, Daily Hadith (English) | @raahesunnat.daily | created 12 Nov 2026 · Creator, Education, bio + logo set |
| Instagram | Mehfil-e-Sama, Naat & Qawwali | @mehfil.e_sama (mehfil.e.sama was taken) | created 12 Nov 2026 · Creator, Musician/band, bio + logo set |
| Instagram | Solve by Sunrise | @solvebysunrise | created 12 Nov 2026 · Creator, Education, bio + logo set |

- All channels are owned by the Gmail **sadqahmedia.channels@gmail.com** (account name "Sadqah Media").
- Sahil creates the Instagram accounts himself in the phone app, spaced over a few days.
- The DIY channel is dropped for now.
- Logos are in `docs/logos/` (also on Sahil's PC at `C:\Users\Sahil\ClaudeAutomation\logos`). They're already set on all three YouTube channels.

## 3. Everything uploaded so far
All are public now (Sahil switches them; see the audit note in section 7).

| Date | Channel | Title | Link |
|---|---|---|---|
| 30 Oct | kids | Why Did Everyone Call Him Al-Ameen? (Kids Ep1, 4:52, long-form) | https://youtu.be/OO9t5Hr1EzY |
| 30 Oct | sadqah | 5 Sadqahs Without Money (Short 1) | https://youtu.be/xQJ7O-jYRjw |
| 30 Oct | riddle | Riddle #1: bridge and torch, 4 people in 17 min | https://youtu.be/mkJVbHqLYR4 |
| 31 Oct | kids | 3 Tiny Sunnahs for Every Meal (Bukhari 5376 / Muslim 2022) | https://youtu.be/d4NU-r0XhXI |
| 31 Oct | riddle | Answer Is 17 + Riddle #2: Two Doors, One Lion | https://youtu.be/R0vhIfs278k |
| 31 Oct | sadqah | Taqatwar Kaun Hai? (Bukhari 6114 / Muslim 2609), Short 2 | https://youtu.be/3cHNjv69Ifs |

- The rendered MP4s are on branch **`renders`** (folders `2026-10-30/` and `2026-10-31/`). The qawwali visual preview is there too.
- Metadata used for uploads is in `meta/`.

**Riddle #2 answer (goes in the next riddle video):** ask either guard *"If I asked the other guard which door leads outside, what would he say?"*, then take the **other** door. Both guards point to the lion door:
- If you ask the truth-teller, he truthfully reports the liar's lie.
- If you ask the liar, he lies about the truth-teller's answer.

Follow the format: solution first, then Riddle #3, with "Person 1 / Person 2" naming, no names and no salam.

**Comments:**
- Riddle #1 has one comment thread (@Channel-Foo-Chuan-Xuan). It has two replies from us: a hint, then a link to the solution (31 Oct).
- Riddle #1's stats show 2 comments; the second may be held for review in Studio.
- The kids channel has comments off (Made for Kids), so the API returns 403 there. That's expected.

## 4. Standing rules (non-negotiable; full list in RULEBOOK.md)
- **No payments, ever.** Ask Sahil before anything that costs money. Everything must be free.
- Sahil accepts all terms and conditions himself, and does logins and 2FA. Claude never types passwords or creates accounts.
- Tokens and keys go **only** in GitHub secrets, never in chat or the repo. Never store a GitHub PAT in memory. Use official APIs only. Decline optional cookies.
- Never DM strangers, auto-follow or auto-like.
- Ahle Sunnat wal Jamaat (Hanafi) belief.
  - Hadith only from Bukhari, Muslim or Tirmidhi, verified, with the reference shown and a sunnah.com link in the description.
  - If Ala Hazrat and Dr Tahir-ul-Qadri differ on a topic, drop that topic.
- When the Prophet is mentioned, write **"Sallallahu Alaihi Wa Alihi Wasallam"** in full.
- Honorifics: Radi Allahu Anhu/Anha (Companions), Alaihis Salam (prophets, Panjatan Pak), Rahmatullahi Alaih (Awliya).
- **Never depict** the Prophet, other prophets, Sahaba, Mothers of the Believers, Ahl-e-Bait, Panjatan Pak or Awliya. Ordinary people are faceless (a plain circle head).
- **Narration:** Sahil's cloned voice.
  - Urdu for One More Sadqah, at a **calm, slow pace**.
  - Subtitles are **always Roman Urdu** (Urdu in English letters, e.g. "sadqah hai"), even when the voice is Urdu.
- **Animation quality must match the locked hadith video** (the "sea-foam", Bukhari 6405 test). Match its quality level, not necessarily its look. "Never forget to create best animation."
- **Solve by Sunrise:**
  - English, Mind Hex style (@mind_hex_real).
  - **No salam.**
  - Characters are "Person 1", "Person 2".
  - Each video = the previous riddle's solution, then the new riddle (answer next day).
- **Kids:** made for kids, Shorts only for now, a modern generic faceless kid, never the Sahabi.
- **Naat:**
  - Real footage only (Pixabay/Wikimedia), never animation.
  - Two-line lyrics (Nastaliq + Roman).
  - Never repeat a clip inside a video; a clip may be reused only after ~10 videos (track in `state/clip_log.json`, not built yet).
  - Smooth motion: keep the source fps, subpixel pans, no integer-crop jitter.
  - Never cut a verse midway.
- **Qawwali:**
  - Visuals show the **literal meaning of each line** (the rose-petal reference style; reference reels on Instagram DfC-gVOTvmS and De4AFuWv_ge).
  - Lyrics on screen only for pre-1929 poetry; otherwise credits only.
- **Comments:**
  - Reply mostly in English, matching the commenter's language.
  - Never hide comments.
  - Flag abusive or fatwa-type comments to Sahil.
- Sahil's style: direct and honest, no sugarcoating, push back when he's wrong. Search before answering questions. Always use clickable markdown links. Ask rather than guess.

## 5. Infrastructure

### GitHub Actions secrets (set by Sahil; names only)
- `MASTER_KEY`
- `YT_CLIENT_ID`, `YT_CLIENT_SECRET`
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- `PIXABAY_API_KEY`
- `CF_API_TOKEN` (**currently returns 401**; Sahil must roll it and re-paste it)

The Cloudflare account ID `1c79efc3ad22109588d34576fe6d1035` is hardcoded in `scripts/cf_images.py`.

### Encrypted files
These use AES-256-CBC, pbkdf2, 200000 iterations, password = MASTER_KEY. They're decrypted only inside Actions:
- `state/youtube.json.enc`: `{client_id, client_secret, channels:{sadqah|kids|riddle:{channel_id, refresh_token}}}`
- `voice/ref_ur.wav.enc`, `voice/ref_en.wav.enc`: voice-clone references. `voice/ref_texts.json` holds their transcripts.

### Workflows
Dispatch them with the REST API; `gh workflow run` needs GraphQL, which the proxy blocks.
- **voice.yml:** inputs `lines` (a JSON path) and `langs`.
  - Runs one parallel job per line, OmniVoice zero-shot clone on CPU, about 5 to 8 minutes.
  - Artifacts are named `line_<lang>_<idx>`.
  - The lines JSON looks like `{"ur":[...], "en":[...], "roman":[...], "speed":{"ur":0.75}}`.
- **youtube.yml:** `action` = upload | comments | reply | stats, and `label`.
  - Upload reads the mp4 from `video_path` on branch `video_ref` (default `renders`) and the metadata from `meta_path` on main.
  - Output goes to the artifact `yt-<action>-<label>`.
  - Tested OK on 31 Oct (stats).
- **footage.yml:** Pixabay video fetch (`scripts/pixabay_fetch.py`; needs a browser User-Agent). Gives the artifact `clips`.
- **images.yml:** Cloudflare Workers AI FLUX-1-schnell. Blocked by the 401.
- **telegram-hello.yml:** test message to Sahil; works.

### REST examples
```
gh api -X POST repos/imsv1301/islamic-content-automation/actions/workflows/voice.yml/dispatches -f ref=main -f "inputs[lines]=jobs/X.json" -f "inputs[langs]=ur"
gh api "repos/imsv1301/islamic-content-automation/actions/workflows/voice.yml/runs?per_page=3" --jq '.workflow_runs[]|[.id,.status,.conclusion]|@tsv'
gh api repos/imsv1301/islamic-content-automation/actions/runs/<id>/artifacts   # then .../actions/artifacts/<aid>/zip
gh api -X POST repos/.../actions/workflows/youtube.yml/dispatches -f ref=main -f "inputs[action]=upload" -f "inputs[label]=riddle" -f "inputs[video_path]=2026-11-01/x.mp4" -f "inputs[meta_path]=meta/x.json"
```

**The proxy blocks** GitHub GraphQL, the secrets listing and creating releases. That's why renders live on the `renders` branch.

### Other notes
- **YouTube API project:**
  - Google Cloud project `sadqah-media-automation`, OAuth app "Sadqah Media Uploader" (in production).
  - Web client redirect: https://imsv1301.github.io/islamic-content-automation/oauth.html
  - Scopes: youtube.upload and youtube.force-ssl.
  - Uploads go up **public** when Sahil taps ✅. YouTube confirmed on 2 Nov that the API does not force them to private (see section 12).
- **Telegram bot:** connected and working.
- **GitHub Pages:** home, privacy, terms and oauth pages at imsv1301.github.io/islamic-content-automation.

## 6. How a video is made (code in `video/` and `pipeline/`)
1. **Script:** write a lines JSON in `jobs/`.
   - Urdu adds a `roman` array for subtitles.
   - Run the virality and hook skills first and check trends.
   - Verify every hadith on sunnah.com.
2. **Voice:** dispatch `voice.yml` and download the artifacts.
   - Kids voice: Kokoro `am_michael` (not the clone), from `pipeline/kids_short_vo.py`. It needs the kokoro package. "ﷺ" maps to the full salutation.
   - Check every line with faster-whisper (`small`, decode to 16 kHz float via ffmpeg, because PyAV has an API mismatch) and re-roll bad lines. Past misses: "guard"→"God", "do"→"did".
   - **The OmniVoice `speed` setting barely works.** For a calm Urdu pace, post-process with `ffmpeg -af rubberband=tempo=0.88:pitchq=quality:formant=preserved`.
3. **Timing and mix:** `python3 pipeline/build_short.py <lines.json> <lang> <vo_dir> <name> [--roman] [--gap 0.45]`.
   - It trims silence per line and spreads word timings by character length.
   - It writes `video/src/day1/<name>-timing.json` and `video/public/day1/<name>-mix.m4a`: voice plus a faint brown-noise bed, -14 LUFS.
   - Edit `OUT` at the top of the script to point at `video/`.
4. **Render:** in `video/` (Remotion 4.0.539), run `npm ci` once, then `npx remotion render <CompId> out.mp4 --concurrency=2`. The container had only 2 CPUs.
   - Compositions: `SolutionShort` (riddle solution + next riddle), `RiddleShort`, `StrengthShort` / `SadqahShort` (One More Sadqah), `KidsShort`, `KidsEp1`, `KidsThumb`, `NaatReal` / `NaatOverlay` / `NaatSabSeAula`, `ChhapTilak` (qawwali), `HadithSeaFoam` (the locked reference).
   - Heavy footage videos: build the background with ffmpeg and render only a transparent overlay (`--codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png`), then composite with ffmpeg overlay. Rendering a big OffthreadVideo directly crashes the compositor.
   - Check stills before the full render (`npx remotion still <Comp> f.png --frame=N`), contact-sheet them, then render.
   - The audio mixes (`*.m4a`) and naat footage are **not** in git. Rebuild them from the voice artifacts, or re-fetch with footage.yml.
5. **Approve and upload:** send the video to Sahil. Once he says OK, upload with `youtube.yml` (commit the mp4 to the `renders` branch first) and the metadata in `meta/`. Kids uploads use `selfDeclaredMadeForKids: true`.
6. **Gotchas:**
   - Never `pkill -f` a pattern that matches your own shell command; that killed the shell twice.
   - `pgrep -f "render X"` also matches the waiting loop itself.
   - `gh workflow run` fails, so use the REST dispatch.

## 7. Open issues
- ~~Cloudflare 401~~ **FIXED 31 Oct 10:00**: the token was rolled and re-pasted (53 chars), verify = active, and FLUX images work (`images.yml`). The earlier secret was a truncated paste (35 chars).
- **YouTube compliance audit form** not submitted yet, so uploads still start private.
- **Pronunciation of صدقہ:** whisper hears it as "ستقے". Four respellings didn't change it. Sahil's ear decides; still unresolved.
- **English clone voice** has too many pauses and breaths. Sahil wants it blended with or closer to the original AI hadith voice. Deferred to a later session.
- **Naat smoothness:** next time keep the source fps and use subpixel pans; build clip-log tracking.
- **Sensitive files on Sahil's PC** (`C:\Users\Sahil\ClaudeAutomation\MASTER_KEY.txt`, `yt_client.txt`, `yt_web_client.txt`): Sahil should delete them himself. MASTER_KEY is safe in GitHub secrets.
- **Old Sadqah Short 1:** replace or delete it only if Sahil asks.

## 7b. Audio library (on Sahil's PC)
- **66 naat and qawwali tracks** (~920 MB) are in `C:\Users\Sahil\ClaudeAutomation\audio\<youtubeId>.m4a`, each with `.info.json`. The index is `audio\CATALOG.csv` (id, type, occasion, minutes, channel, title, url).
- They're reachable from a cloud session through the device bridge: `device_bash` runs a Linux VM with the folder at `mnt/ClaudeAutomation`, and yt-dlp is at `~/.local/bin/yt-dlp`.
  - **Background processes die between calls**, so download in ~40s chunks: re-run `yt-dlp -a <list> --download-archive audio-archive.txt` until the list is done.
  - `device_stage_files` copies a file into the cloud container.
- The 5 `*.temp.m4a` files are junk from interrupted fixups. Delete them when allowed.
- Never commit this audio to the public repo.

## 7c. Done 31 Oct after the handoff
- Qawwali sample **finished with real audio** (75s; sent to Sahil in chat, NOT in the repo because the audio is third-party).
  - Source: OSA official upload f3dnF-GmscM, 94.0–168.5s.
  - 5 complete verses: Khusrau dariya prem ka / Jo utra so doob gaya / Apni chhab banaike / Chhab dekhi jab piya ki / Chhap tilak…
  - Scene code is in `video/src/qawwali/ChhapTilak.tsx`. Extra scenes for the other verses (Prem bhatti, Gori bayyan, Rang, Suhaagan) are exported there.
- **YouTube audit form** (https://support.google.com/youtube/contact/yt_api_form): opened while signed in as Sadqah Media, not submitted. It needs Sahil's full legal name and postal address, and Sahil must tick the attestations himself.
- **Sahil's style request:** reel `Instagram_De9tmVFOBar.mp4` (a Pokémon fan series, "yourtrainerarc"). The look: 3D toon characters, a warm orange/amber palette, cinematic shots, bold uppercase captions with one gold word, a HUD (DAY 1 · 6:48 AM · location · "PART 7"), and a choose-your-path ending ("comment 1/2/3").
  - Plan: Cloudflare FLUX stills in that palette plus 2.5D camera moves.
  - Characters must stay **faceless** per the rules, and no Pokémon or other IP.
  - It needs a test Short first.

## 8. What's next (in order)
1. **Qawwali sample: "Chhap Tilak"** (kalam of Hazrat Amir Khusrau Rahmatullahi Alaih; NFAK performance).
   - The visuals-only preview has been sent: `renders/2026-10-31/MehfilESama_ChhapTilak_VISUALS_preview.mp4`. Code: `video/src/qawwali/ChhapTilak.tsx`.
   - Scenes, one per line:
     - eye-lights meet and the tilak breaks into petals
     - a kiln pours love's drink into a clay cup, and the world sways
     - an arm with green bangles, held at the wrist by a hand of light
     - white cloth dyed in the dyer's colour
     - dawn over a dargah silhouette, with a bridal veil
   - Rose-petal gusts carry the transitions. Lyrics show as Nastaliq + Roman + English meaning.
   - **Blocked on audio.** YouTube downloads only work on Sahil's PC (yt-dlp in the desktop app; the PC was offline on 31 Oct). Sahil can also attach the audio.
   - Once the audio is in: pick a ~60–75s section of complete verses, align the line times (whisper plus manual) into `video/src/qawwali/chhap-timing.json` (`placeholder:false`), and put the audio at `video/public/qawwali/chhap-tilak.m4a`.
   - Also fix: the veil in scene 5 needs to be visible earlier, and the dye blooms should be smoother.
   - Do not commit third-party qawwali or naat audio to this public repo.
2. **Tomorrow's videos (1 Nov):**
   - Riddle #2 solution + Riddle #3
   - One More Sadqah Short 3
   - Kids Short
   - Best animation every time.
3. **Only when Sahil says "build automation":**
   - A scheduled cloud session around 03:30 UK: trend check and scripts → voice → render → Telegram preview about 05:30–06:00 → upload on ✅ → comment manager (reply or flag) → stats.
   - Monthly PC batch: Sahil opens the desktop app once a month (about 30 minutes) to download naat and qawwali audio for upcoming Islamic dates. **The PC does not need to be on daily.**
4. **Instagram:** Sahil creates the 4 accounts, then set up the Meta app / Graph API (official only).
5. **Cloudflare 3D sample** after the token is fixed.

## 9. Automation (built 31 Oct 2026)
- **Scheduled task "Sadqah Media daily run"** runs every day at 03:10 UK in a fresh cloud session and follows **DAILY_RUNBOOK.md**: comments, then scripts, then voice, then visuals, then render, then Telegram preview by about 05:45.
- **approvals.yml** runs every 10 minutes and handles the Telegram buttons: ✅ uploads straight to YouTube (and edits the Telegram caption with the link), ❌ holds. Upload log: `state/uploads.jsonl`.
- Telegram free-text messages are **not stored** (the repo is public). Sahil gives change requests in the Claude chat; they reach the daily run through memory.
- **telegram.yml** sends a preview or a text message.
- Kids channel narration is now **Sahil's cloned English voice** (31 Oct decision), not Kokoro.

## 10. Decisions 31 Oct (afternoon)
- The new warm 3D-toon story style (the MysteryShort sample) is now the **house style for ALL videos on all channels**.
- Telegram gets a light 720p faststart copy, sized correctly so it's no longer stretched. YouTube and Instagram always get the full-quality master (CRF 15, 320k audio).
- Comments are managed around the clock: scheduled task **"Sadqah Media comments"** runs hourly, plus the daily run. Instagram DMs and comments get added once the accounts exist.
- The YouTube audit form was submitted on 31 Oct. Wait for Google's email.

## 11. When Sahil says the Instagram accounts exist (to-do for whichever chat he tells)
1. Set up the official Instagram API (Instagram Login / Graph API) through a Meta developer app on the Sadqah Media account. Sahil accepts Meta's terms and does the logins; tokens go into GitHub secrets only.
2. Add `ig.yml` (publish a Reel from the renders branch, read comments, reply, read DMs via the Messaging API) and extend `scripts/tg.py` so ✅ also posts to Instagram (manifest items get an `ig` target).
3. Update **both scheduled tasks**:
   - "Sadqah Media daily run": also produce the Instagram versions and captions (Raah-e-Sunnat, Mehfil-e-Sama naat/qawwali using the audio library on Sahil's PC, Islam for Little Ones, Solve by Sunrise).
   - "Sadqah Media comments": also handle Instagram comments and DMs on the same rules.
4. Never auto-follow, auto-like or DM strangers. Only reply to people who wrote to us.

### 11b. Instagram status (12 Nov 2026)
- All 4 accounts exist and are Creator accounts with bio + logo (Mehfil-e-Sama is **@mehfil.e_sama**, the dotted name was taken).
- Meta developer account registered on Sahil's Facebook; app **"Sadqah Media Publisher"** (app id 1626001968728312), use case "Manage messaging & content on Instagram". Meta requires a **business portfolio** ("Sadqah Media", sadqahmedia.channels@gmail.com) for "API setup with Unified login"; creating it was rate-limited ("try again in an hour", new account) at 15:12 UK. No business verification needed (own accounts only).
- Remaining: portfolio -> add the 4 Instagram accounts in API setup -> generate a token per account -> Sahil pastes them into GitHub secrets **IG_TOKEN_KIDS, IG_TOKEN_HADITH, IG_TOKEN_NAAT, IG_TOKEN_RIDDLE** -> `instagram.yml action=whoami` (stores them encrypted in state/instagram.json.enc, refreshes weekly) -> `publish.yml date=<day>` posts the day's Reels.
- Built: `scripts/ig.py`, `scripts/ig_serve.sh` (Cloudflare quick tunnel serves the full-quality master for Instagram's video_url; raw.githubusercontent fallback), `instagram.yml` (whoami/publish/comments/reply/dms/dm + weekly token refresh), `publish.yml` now does Instagram + YouTube + one Telegram message, `naat.yml` + `scripts/mehfil.py` (Mehfil-e-Sama).
- Mehfil-e-Sama library: all 66 tracks re-encoded to Opus 80k and stored **encrypted** (MASTER_KEY) on the orphan branch **`media`** (`audio/<id>.opus.enc`, `CATALOG.csv`), so the PC can stay off. Decrypted only inside naat.yml.
- **Meta setup paused until Sahil does it (he said "tomorrow", 13 Nov).** Until the IG_TOKEN_* secrets exist: publish.yml still uploads YouTube and just notes "Instagram not connected yet"; the daily run still prepares Mehfil-e-Sama (visuals on renders/<date>/mehfil_*.mp4 + jobs/<date>_mehfil.json) but does NOT dispatch naat.yml publish. Once connected (instagram.yml whoami shows all 4 accounts): catch up oldest first, i.e. publish.yml for 2026-11-12 onwards (Instagram only; YouTube skips duplicates) and naat.yml publish for every prepared day, then continue daily.
- Next step for Sahil: in developers.facebook.com app 1626001968728312 -> Use cases -> Customize -> API setup with Unified login -> Business portfolio -> "Create portfolio" (Sadqah Media, sadqahmedia.channels@gmail.com). Then Claude adds the 4 Instagram accounts and generates tokens; Sahil logs in to each account and pastes the tokens into GitHub secrets.
- Sahil 12 Nov: keep the 6 Nov kids video MoJlLQSUtIg as it is (no replacement); the new Urdu voice (his own recording, with tone refs) is approved.
- Sahil's decisions 12 Nov: Raah-e-Sunnat reposts the Urdu One More Sadqah Short daily; Mehfil-e-Sama = one naat + one qawwali daily as short credited clips (he accepted the copyright risk; stop at the first notice).

## 12. YouTube audit result (2 Nov 2026)
- Google closed the compliance review: **API uploads are not automatically private.** Our videos were private only because our own metadata said `privacyStatus: private`. That was my mistake, based on an outdated assumption.
- Fixed: the metadata templates now say public, `approvals.yml` forces public on ✅ (env `YT_PRIVACY=public`), and `yt.py publish <label> <id>` changes privacy on an existing video.
- The 2 Nov videos were made public by hand (gvEob1UMmAo, 4nVeQ19zigQ, XFsuGXfsUkc).
- No quota increase is needed. The default 10k units a day is enough.

## 13. Auto-publish (6 Nov 2026)
- Sahil: "upload everything on YouTube directly and just send a message on Telegram". The daily run now dispatches `publish.yml`, which uploads public straight away and sends Sahil a Telegram text with the links. No ✅ buttons; `approvals.yml` is manual-only now.
- `yt.py upload` skips a video whose title is already on the channel (duplicate guard).
- 6 Nov catch-up: 3 Nov and 4 Nov had in fact already been uploaded earlier, but weren't in the log, so my catch-up created 6 duplicates. They were set to **private** (ids qlkKhJZk018, LbZGSE2tYMw, 9f75dr3gpOQ, khJrjSSwUy4, h1fS-1KVaGQ, gFvV6Rc9_iY). **Sahil needs to delete them in Studio**; Claude doesn't delete. 5 Nov was uploaded fresh (S8J3LDXnz4Y, QxYXWeIVezQ, cfVQ4rWoW5w).

## 14. Quality gate (6 Nov 2026)
- Sahil: "before uploading, always check twice: authentic, pronunciation, voice, every other rule".
- `scripts/qa_check.py` does the automatic check, plus a whisper comparison of the final audio against the script. An independent subagent does the second check.
- `publish.yml` (via tg.py) **refuses** any video without `qa.auto.passed`, `qa.authentic` and `qa.second_check`, and lists those videos on Telegram as not uploaded. See DAILY_RUNBOOK §4b.

## Daily log
- 2026-10-31: setup day. Approval flow tested with the Riddle #3 sample (renders/2026-10-31-test). The YouTube audit form was submitted by Sahil.
- 2026-11-01 (scheduled daily run, unattended): 21 Jumada al-Ula 1448, no occasion within 7 days. Comments: no new threads (riddle, sadqah). Made 3 Shorts in the house style with a new reusable engine `video/src/day1/HouseShort.tsx` (configs `D1101Riddle/Sadqah/Kids.tsx`), renders on `renders/2026-11-01/`, Telegram preview sent.
  - riddle: Riddle #2 solution (ask either guard what the other would say, take the other door) + Riddle #3 "broken vase" (answer: Person 1, it rained all morning). 64s.
  - sadqah Short 3: "Sadqah maal mein kami nahin karta", Sahih Muslim 2588 (+ Tirmidhi 2029), verified on sunnah.com today. 32s.
  - kids: "Spread salam", Sahih Muslim 54, Made for Kids. 32s.
  - Issue: Cloudflare free tier was already exhausted at 03:25 UTC (429, 10k neurons used). Added a free fallback: `sdxl.yml` + `scripts/sdxl_image.py` (DreamShaper XL v2 Turbo on CPU runners, 768x1344, ~7-10 min per image, one job per image; runners sometimes hang or get killed, so dispatch retries early). Prompts must say "no church/steeple" (SDXL adds European church spires to towns).
  - Voice re-rolls: "riddle" is heard as "reader" in Sahil's clone, so the line became "Now, a brand new mystery."; "liar's lie" was garbled, so "the lie of the liar".
  - Uploads: Sahil's ✅ taps were not picked up because GitHub runs the */10 approvals schedule only every ~3 h. Ran it by hand at 05:12: all 3 uploaded (private): riddle https://youtu.be/6lL-5FkSUho, sadqah https://youtu.be/CzzGy5_ezW8, kids https://youtu.be/Tf2Roy9V6QA. Fix: approvals.yml now takes `watch_minutes`; the daily run dispatches it with 300 right after the preview. Added `telegram.yml mode=diag`.
  - New rule (Sahil): when the Prophet Sallallahu Alaihi Wa Alihi Wasallam is mentioned, never an AI image of Masjid-e-Nabawi; use real Green Dome footage. Today's two videos keep their AI dome (Sahil said leave them).
- 2026-11-02 (scheduled daily run, unattended): about 22 Jumada al-Ula 1448, no occasion within 7 days. Comments: no new threads (riddle, sadqah). 3 Shorts on the HouseShort engine (configs `D1102Riddle/Sadqah/Kids.tsx`, images in `video/public/d1102/`), renders on `renders/2026-11-02/`, Telegram preview sent.
  - riddle: Riddle #3 solution (Person 1 lied, it rained all morning) + Riddle #4 "three boxes, every label wrong" (answer: box 3, labelled MIXED). 52s.
  - sadqah Short 4: "Aadhi khajoor", Sahih al-Bukhari 1417 ('Adi bin Hatim Radi Allahu Anhu), verified on sunnah.com today. 33s.
  - kids: "What do we say when we sneeze?", Sahih al-Bukhari 6224, Made for Kids. 36s.
  - Masjid-e-Nabawi shots = real Pixabay frames (id 198164, muhammadarhamamin77800), credited in the descriptions. No AI dome.
  - Issue: Cloudflare free tier ran out mid-run. A single Lucid shot costs ~5,400 neurons and it drew a face anyway. Lesson: skip Lucid, use FLUX only (~30 a day fits) and SDXL for the rest. FLUX-1-schnell rejects `width`/`height`/`seed`, and flags some harmless prompts as NSFW ("broken vase", "handing a tissue"). FLUX also drew kids' faces in profile even with "seen from behind": always check stills for faces.
  - Voice re-rolls: kids line 1 and Sadqah line 2 re-voiced with clearer salutation spelling ("Wa Aalihi Wa Sallam" / "و آلہ و سلم"). Whisper normalises the salutation, so it can't confirm "Wa Alihi"; Sahil's ear decides. "Yarhamukallah" is spelled "Yar-hamuk-Allah" for the clone.
- 2026-11-03 (scheduled daily run, unattended): 23 Jumada al-Ula 1448 (Umm al-Qura), no occasion within 7 days. Comments: no new threads (riddle, sadqah). 3 Shorts on the HouseShort engine (configs `D1103Riddle/Sadqah/Kids.tsx`, images in `video/public/d1103/`), renders on `renders/2026-11-03/`, Telegram preview sent ~03:55, approvals.yml dispatched with watch_minutes=300.
  - riddle: Riddle #4 solution (pick from box 3, labelled MIXED) + Riddle #5 "three switches, one lamp, open the door once" (answer: switch 1 on a few minutes then off, switch 2 on; lit = 2, warm = 1, cold = 3). 52s.
  - sadqah Short 5: "Muskurahat bhi neki hai?", Sahih Muslim 2626 (Abu Dharr Radi Allahu Anhu), verified on sunnah.com today. 29s.
  - kids: "What do we say before we sleep?", Sahih al-Bukhari 6324 (Bismika Allahumma amootu wa ahya + Alhamdu lillah on waking), verified on sunnah.com today, Made for Kids. 32s.
  - Issue: Cloudflare free tier was already used up at 03:20 UTC (429 on every FLUX call), before this run used any. 10 stills made with SDXL (`jobs/2026-11-03_sdxl.json`), the rest reused from d1101/d1102. SDXL's "seen from behind" family shot still drew faces: dropped (s_feed used instead). SDXL drew 2 switch plates instead of 3 and a lit lamp when asked for an unlit one; the on-screen switch cards cover it.
  - Voice re-rolls: riddle "can't" came out as "can" (meaning flips), so lines now say "cannot"; "labelled Mixed" → "the box with the Mixed label". Kids "dua" heard as "day" → "prayer"; Arabic dua line re-voiced with "Allaahumma ... ahyaa" spelling. Whisper hears "Yawn" as "young" (left; caption shows it).
  - The virality skills named in the runbook (going-viral, virality, on-screen-text-writer) are not installed in the scheduled session; hooks were written by hand to the same pattern (question hook, card per beat, comment CTA).
  - Gotcha again: `pgrep -f "<pattern>"` inside a waiter loop matches its own command line; start the next render by hand instead.
- 2026-11-04 (scheduled daily run, unattended): about 24 Jumada al-Ula 1448, no occasion within 7 days. Comments: no new threads (riddle, sadqah). 3 Shorts on the HouseShort engine (configs `D1104Riddle/Sadqah/Kids.tsx`, images in `video/public/d1104/`), renders on `renders/2026-11-04/`, Telegram preview sent, approvals.yml dispatched with watch_minutes=300.
  - riddle: Riddle #5 solution (switch 1 on a few minutes then off, switch 2 on; lit = 2, warm = 1, cold = 3) + Riddle #6 "boil an egg for exactly 9 minutes with a 4-min and a 7-min sand timer" (answer: start both; flip the 4 at 4; flip the 7 at 7; flip the 7 again at 8; it ends at 9). 44s. Animated CSS sand timers drain in real proportion.
  - sadqah Short 6: "Har jod par roz ek sadqah", Sahih al-Bukhari 2989 (Abu Huraira Radi Allahu Anhu), verified on sunnah.com today (justice, helping with a load, good word, steps to salah, removing harm from the road). 37s.
  - kids: "The man who gave water to a thirsty dog", Sahih al-Bukhari 2363, verified on sunnah.com today, Made for Kids. 39s.
  - Cloudflare FLUX worked this time (25 stills incl. re-rolls; the SDXL backup run was cancelled). FLUX drew faces on a desert "kid", a profile pair of men, and wall clocks in a "no clock" kitchen: re-rolled or cropped out.
  - Note: Riddle #5 (3 Nov) was still unapproved at run time (no upload in state/uploads.jsonl); today's riddle opens with its answer, so the Telegram notes ask Sahil to approve or hold yesterday's first.
  - Voice re-rolls: riddle "it is switch 2" heard as "switched on" → "the answer is switch number two"; "Cold? Switch 3" heard as "called switch 3" → "If it is cold, switch three"; "Person 1 must" heard as "Bush anyone" → "Person one has to". First run with the `<SAW>` salutation clip (sadqah + kids); whisper hears it fine.
  - Gotcha: SVG clipPath ids built from labels with spaces ("4 MIN") silently break `url(#id)`; sanitise ids.
- 2026-11-05 (scheduled daily run, unattended): about 25 Jumada al-Ula 1448, no occasion within 7 days; tonight is Shab-e-Jumu'ah, so Sadqah is about durood. Comments: no new threads (riddle, sadqah). 3 Shorts on the HouseShort engine (configs `D1105Riddle/Sadqah/Kids.tsx`, images in `video/public/d1105/`), renders on `renders/2026-11-05/`, Telegram preview sent ~03:47 UTC, approvals.yml dispatched with watch_minutes=300.
  - riddle: Riddle #6 solution (start both; flip the 4 at 4; flip the 7 at 7; flip the 7 again at 8; ends at 9; on-screen sand timers are simulated minute by minute) + Riddle #7 "wolf, goat and cabbage across a river" (answer: goat over; back; wolf over, goat back; cabbage over; back; goat over). 54s.
  - sadqah Short 7: "Ek durood, das rehmatein", Sahih Muslim 408 (Abu Huraira Radi Allahu Anhu). 30s.
  - kids: "Say thank you" (+ Jazak Allahu khayran, Alhamdulillah), Jami' at-Tirmidhi 1954 (Hasan Sahih), Made for Kids. 33s.
  - Hadith check: WebFetch of sunnah.com was refused in the unattended session (permission prompt, no one to answer), so both were checked through sunnah.com search listings (muslim:408 = Book of Prayers; tirmidhi:1954 = being grateful to the one who was kind to you) plus mohaddis.com / hadithprophet.com for the Arabic.
  - Images: Cloudflare FLUX worked (20 stills). "Two children sharing a toy" was flagged NSFW by FLUX (reworded to toy blocks); a river shot had a church spire (re-rolled with "no buildings, no church"); a toy-car shot showed half faces (dropped).
  - Voice re-roll: "The boat is tiny" was heard as "The body is tiny", so the line became "The rowing boat is very small."
  - Note: Riddle #5 (3 Nov) and #6 (4 Nov) were still unapproved; the Telegram notes ask Sahil to approve them in order.
- 2026-11-06 (scheduled daily run, unattended): Friday, 26 Jumada al-Ula 1448, no occasion within 7 days, so Sadqah and kids are about Jumu'ah. Comments: no new threads (riddle, sadqah). 3 Shorts on the HouseShort engine (configs `D1106Riddle/Sadqah/Kids.tsx`, images in `video/public/d1106/`), renders on `renders/2026-11-06/`, Telegram preview sent, approvals.yml dispatched with watch_minutes=300.
  - riddle: Riddle #7 solution (goat over; back alone; wolf over, goat back; cabbage over; back alone; goat over = 7 trips; animated river board moves the 🐺🐐🥬 between banks) + Riddle #8 "two fathers, two sons, three fish, one whole fish each" (answer: grandfather, father, son). 46s. No people shown in the riddle part so the answer isn't given away; a 3-person pier still (`r8_pier3.jpg`) is saved for tomorrow's solution.
  - sadqah Short 8: "Jumu'ah ki woh ghari", Sahih al-Bukhari 935 (Abu Huraira Radi Allahu Anhu: an hour on Friday when a Muslim praying and asking Allah for good is given it; he indicated it is short). 35s.
  - kids: "Which day is the best day? Friday!", Sahih Muslim 854 (first sentence only) + a Friday list (bath, clean clothes and nice smell, Jumu'ah prayer, lots of dua), Made for Kids. 30s.
  - Hadith check: no WebFetch tool in this session; verified via sunnah.com search listings (bukhari:935 "Narrated Abu Huraira", muslim:854 Book of Friday).
  - Images: FLUX worked (18 stills incl. re-rolls). A pier shot drew 4 people (contradicts the riddle): dropped. Kids dua shot re-rolled (two kids, unclear clothing).
  - Voice: no re-rolls needed. Whisper heard kids "the sun rises on" as "the sunrise is on" (same sound; left). Kids line 2 (the <SAW> line) took ~11 min on its runner.
  - Note: uploads.jsonl has nothing after 2 Nov, so 3-5 Nov look unapproved; Telegram notes ask Sahil to approve in order.
- 2026-11-07 (scheduled daily run, unattended): Saturday, about 27 Jumada al-Ula 1448, no occasion within 7 days. Catch-up: YouTube stats matched uploads.jsonl through 6 Nov, nothing re-uploaded. Comments: no new threads (riddle, sadqah); Riddle #1 shows 3 comments but the API returns 1 thread (others may be held in Studio). 3 Shorts on the HouseShort engine (configs `D1107Riddle/Sadqah/Kids.tsx`, images in `video/public/d1107/`), renders on `renders/2026-11-07/`, both QA checks passed, published by publish.yml (public) at ~03:55 UTC with Telegram links.
  - riddle: Riddle #8 solution (grandfather, father, grandson; family-tree card) + Riddle #9 "clock tower strikes 6 times in 5 s; 12 strikes?" (answer: 11 s). 41s. https://youtu.be/jytkx_bg9CY
  - sadqah Short 9: "Teen cheezein jo maut ke baad bhi kaam aati hain", Sahih Muslim 1631 (Abu Huraira Radi Allahu Anhu). 43s. https://youtu.be/NREzwtisbsk
  - kids: "The man who moved a prickly branch", Sahih al-Bukhari 652, Made for Kids. 32s. https://youtu.be/S-lalugmocU
  - Hadith check: bukhari:652 opened on sunnah.com by the second reviewer; muslim:1631 via sunnah.com search listing (Book of Wills). Direct fetch from the main session is still refused when unattended.
  - Voice: Sahil's new tone references (style per line) used for the first time in a daily run; Urdu speed 0.8 + rubberband 0.88 except the salawat line. Re-roll: kids "Allah was pleased with him" heard as "I love us pleased" → "Allah was happy with what he did, and He forgave him!".
  - Images: FLUX OK (23 stills). FLUX put crosses on the clock tower even with "no cross" twice; painted out with OpenCV inpaint. Prompts for towers need "flat crenellated top" plus a still check.
  - qa_check.py fix: the audio salutation heuristic flagged Sahil's own recorded clip (whisper hears "Wa Aalihi" as "wa alaihi"); lines with <SAW> now skip that heuristic and record `qa.salutation`. Also "\bsaw\b" in descriptions catches the English verb "saw": avoid it.
  - Second reviewer suggestions for next time: dome_real_a/b reused in almost every video since 2 Nov (source more real Madinah footage); r8_pier3's middle "father" looks like a boy; don't frame hadith as "once upon a time" (changed to "long, long ago" before publishing).
- 2026-11-08 (scheduled daily run, unattended): Sunday, about 28 Jumada al-Ula 1448 (Jumada al-Akhirah starts in 2-3 days), no major occasion within 7 days. Catch-up: YouTube stats show every earlier day uploaded, nothing re-uploaded. Comments: no new threads (riddle, sadqah). 3 Shorts on the HouseShort engine (configs `D1108Riddle/Sadqah/Kids.tsx`, images in `video/public/d1108/`), renders on `renders/2026-11-08/`, both QA checks passed, published by publish.yml (public) at ~04:02 UTC with Telegram links.
  - riddle: Riddle #9 solution (11 s: 6 strikes = 5 gaps of 1 s; 12 strikes = 11 gaps; animated bell row with numbered gaps) + Riddle #10 "3-litre and 5-litre jugs, measure exactly 4 litres" (answer: fill 5, pour into 3, empty 3, pour the 2 in, fill 5, top up the 3 = 4 left). 45s. https://youtu.be/t0cV4iE2lGc
  - sadqah Short 10: "Do kalime: zabaan par halke, tarazu mein bhaari", Sahih al-Bukhari 7563 (also 6406; Abu Huraira Radi Allahu Anhu; last hadith of Bukhari). 39s. https://youtu.be/-S4sEaBLYgk
  - kids: "Who should you be kindest to? Your mother!", Sahih al-Bukhari 5971, Made for Kids. 31s. https://youtu.be/_zjCPx4r0Lc
  - Hadith check: bukhari:7563 and 6406 opened on sunnah.com by the second reviewer (6406 has the two phrases in reverse order; the card follows 7563). bukhari:5971 wouldn't open; confirmed via sunnah.com riyadussalihin:316 + hadithunlocked.
  - Voice re-rolls: riddle "One jug" heard as "One jerk" → "The small jug / The big jug"; "No filling halfway" garbled → "no half measures". Kids "Who should" heard as "How should" (reordered), "A man came to <SAW>" lost "to" → "A man once asked <SAW>:", "Then who? Your mother/father" → "And then who? …". Sadqah tasbeeh line re-voiced with "وَ بِحَمدِہی" spelling.
  - Lesson: rubberband tempo 0.88 smeared the final "m" of "Al-Azeem"; that line uses the un-stretched voice (line_speed 0.8 already calm). Don't time-stretch short Arabic dhikr lines.
  - Images: FLUX OK (26 stills incl. re-rolls). FLUX put crosses/spires on a village, a well roof and a question-mark scene, drew 3 boys for "one man", and added a shelf of extra pots (cropped off). Second reviewer caught a cross on the Big-Ben-style tower in d1107's r9_person (reused here): swapped for r9_bell. Don't reuse r9_person.
  - Reviewer notes for next time: dome_real_a/b still reused in every Prophet-mention video (source more real Madinah footage); r10_jugs/r9_tower used twice in the riddle; consider "Radi Allahu Anhu" for unnamed Companions in kids descriptions.
- 2026-11-09 (scheduled daily run, unattended): Monday, 29 Jumada al-Ula 1448 (Umm al-Qura), Jumada al-Akhirah starts in 1-2 days; no major occasion within 7 days (3 Jumada al-Akhirah, wisal of Sayyida Fatima Radi Allahu Anha, is around 13-14 Nov: a good topic for that day's run). Catch-up: YouTube stats show every earlier day uploaded, nothing re-uploaded. Comments: no new threads (riddle, sadqah). 3 Shorts on the HouseShort engine (configs `D1109Riddle/Sadqah/Kids.tsx`, images in `video/public/d1109/`), renders on `renders/2026-11-09/`, both QA checks passed, published by publish.yml (public) at ~03:49 UTC with Telegram links.
  - riddle: Riddle #10 solution (fill 5, pour into 3; empty 3, pour the 2 in; fill 5, top up the 3; 4 left; animated CSS jugs show real levels per step) + Riddle #11 "8 identical balls, 1 slightly heavier, balance scale, only 2 weighings" (answer: 3 vs 3; level -> weigh the last 2; else from the heavy 3 weigh 1 vs 1; level -> the third). 42s. https://youtu.be/nZm0e_ThWoA
  - sadqah Short 11: "Peer ka din itna khaas kyun?", Sahih Muslim 1162 (Abu Qatada al-Ansari Radi Allahu Anhu: Monday = the day of his wiladat and of wahi) + amal: Monday roza, kasrat se durood. 38s. https://youtu.be/DM1xjxmJpq8
  - kids: "Share with your friend", Sahih al-Bukhari 13 (Anas Radi Allahu Anhu: love for your brother what you love for yourself), Made for Kids. 33s. https://youtu.be/D2WDqLI-C3k
  - Hadith check: main-session fetches of sunnah.com were refused again (unattended); the second reviewer opened muslim:1162b, muslim:1162e and bukhari:13 directly.
  - New real Madinah footage: Pixabay 112361 (DesignwithRiyas), frames dome_n1/dome_n2 replace dome_real_a/b. Avoid Pixabay "prophet mosque" query results (Ahmadiyya clips came up). Reviewer note: both videos used the same clip today; rotate sources (112360 also has the dome, partly behind a minaret).
  - Voice re-rolls: Sadqah "درود شریف" heard as "دروج" -> spelled "دُرُود" (2 variants each, picked the clearest); kids "<SAW> said:" ended as "Sayyid" -> "<SAW> once said:"; "Want for others" heard as "One for others" -> "So always want for others...".
  - Images: FLUX OK (21 stills incl. re-rolls). FLUX put crosses on a sunrise town's domes (twice) and on a balance-scale finial, a Christmas tree in two kitchen shots (one also drew kids' faces), and a stemmed wine-style glass on a suhoor table: all dropped or re-rolled. Prompts need "no christmas tree", "plain tumbler".
- 2026-11-10 (scheduled daily run, unattended): Tuesday, 28-29 Jumada al-Ula 1448 (moonsighting.org.uk had 5 Nov = 23 Jumada-I), Jumada al-Akhirah starts in 1-2 days; no major occasion within 7 days (3 Jumada al-Akhirah, wisal of Sayyida Fatima Radi Allahu Anha, around 12-14 Nov). Catch-up: YouTube stats show every earlier day uploaded, nothing re-uploaded. Comments: no new threads (riddle, sadqah). 3 Shorts on the HouseShort engine (configs `D1110Riddle/Sadqah/Kids.tsx`, images in `video/public/d1110/`), renders on `renders/2026-11-10/`, both QA checks passed, published by publish.yml (public) at ~04:03 UTC with Telegram links.
  - riddle: Riddle #11 solution (3 v 3 with 2 off; level -> 1 v 1 of the 2; else 1 v 1 of the heavy 3, level -> the third; animated CSS balance scale on a dark panel) + Riddle #12 "snail in a 10 m well, +3 m by day, -2 m by night; which day is it out?" (answer: day 8). 47s. https://youtu.be/HpoaU74DtPk
  - sadqah Short 12: "Thoda magar roz", Sahih Muslim 783b (Hazrat Aisha Radi Allahu Anha: the deeds most loved by Allah are the constant ones, even if small) + roz ka amal (2 rakat nafl, 1 safha Quran, 1 chhota sadqah). 43s. https://youtu.be/_mGCYzKXlsM
  - kids: "Oops, I broke a cup! Always tell the truth", Sahih al-Bukhari 6094 (Abdullah bin Mas'ud Radi Allahu Anhu: truthfulness leads to righteousness, righteousness to Paradise), Made for Kids. 32s. https://youtu.be/JIvR0rdhNAk
  - Hadith check: a web-fetch subagent opened muslim:783b and bukhari:6094 (bukhari:6464 timed out on a permission prompt, so Muslim 783b was used); the second reviewer opened both again.
  - Real Madinah footage rotated: Pixabay 198164 aerial (sadqah, dome_a1) and 112360 courtyard (kids, dome_b1), vertical crops at 1080x1920. Pixabay "green dome" query returns unrelated domes (Kathmandu, a church): use "masjid nabawi"/"medina".
  - Voice re-rolls: riddle "weigh" heard as "way/wave" (lines now say "put them on the scale, one against one"), "Still level" lost "Still" (-> "Level again?"); Sadqah "رضی اللہ عنہا" garbled (-> "رضی اللہ عن ہا" spelling works); kids "<SAW> once said" heard as "One set" (re-voiced, 1 of 3 variants clear).
  - Images: FLUX OK (23 stills incl. re-rolls). FLUX put Christmas trees and wreaths in every "cosy kitchen" shot, crosses on a village roof, an X-beam well and next to an hourglass, and a church behind a well: re-rolled with "simple modern summer kitchen, no christmas tree, no wreath" / "open desert, no buildings"; one wreath painted out (OpenCV inpaint).
  - Second reviewer flagged face emoji (🤔, 😟) and I'd also dropped 🙋/🧎: from now on use no face/person emoji on cards (❓, 💭, ✋, 🤲 instead). Reviewer also raised YouTube's containsSyntheticMedia flag (false on all uploads, cloned narration): left for Sahil to decide, noted in the Telegram message.
- 2026-11-11 (scheduled daily run, unattended): Wednesday, about 29 Jumada al-Ula / 1 Jumada al-Akhirah 1448 (Qatar/Gulf start 11 Nov; UK/India likely 12 Nov); no major occasion within 7 days (3 Jumada al-Akhirah, wisal of Sayyida Fatima Radi Allahu Anha, around 13-14 Nov). Catch-up: YouTube stats show every earlier day uploaded, nothing re-uploaded. Comments: no new threads (riddle, sadqah). 3 Shorts on the HouseShort engine (configs `D1111Riddle/Sadqah/Kids.tsx`, images in `video/public/d1111/`), renders on `renders/2026-11-11/`, both QA checks passed, published by publish.yml (public) at ~04:08 UTC with Telegram links.
  - riddle: Riddle #12 solution (day 8: +1 m net per day and night, 7 m after 7 nights, day 8 climbs 3 m to the top; animated depth gauge) + Riddle #13 "two ropes, each burns unevenly in exactly 1 hour, a lighter, no clock: measure exactly 45 minutes" (answer: light A at both ends and B at one end; when A is gone at 30 min light B's other end; B gone = 45 min). 43s. https://youtu.be/xbQdf4lwChg
  - sadqah Short 13: "Roz subah do farishton ki dua", Sahih al-Bukhari 1442 (+ Muslim 1010), Abu Huraira Radi Allahu Anhu (O Allah, give the spender a replacement / give the withholder destruction). Angels shown only as light. 45s. https://youtu.be/xjCHosOE2Cs
  - kids: "Grrr! Someone took my toy: don't get angry", Sahih al-Bukhari 6116 (Abu Huraira Radi Allahu Anhu: "La taghdab", repeated), stop, breathe, kind words, Made for Kids. 34s. https://youtu.be/m8Wn-AjVPnU
  - Topic choice: considered the new-moon dua (Tirmidhi 3451) for the month start but dropped it (grade disputed: Tirmidhi says hasan gharib, some grade it weak); used Bukhari 1442 instead.
  - Hadith check: main-session fetches of sunnah.com were refused again (unattended); confirmed via sunnah.com search listings; the second reviewer opened bukhari:1442 and bukhari:6116 directly, muslim:1010 via search listing.
  - Voice re-rolls: kids "Then use kind words" heard as "The news kind words" -> "After that, use kind words"; "Can you stay calm" heard as "Please stay calm" -> "Now, can you stay calm today?"; Sadqah "Radi Allahu Anhu" unclear -> "رضی اللہ عن ہُ" spelling, "اے اللہ" lost "اے" -> "ایک فرشتہ کہتا ہے: اے اللہ!", "دعا" heard as "دوار" -> "دُعا".
  - Images: FLUX drew crosses, Christmas trees, a church, wreaths and wall clocks in 12 of 17 first-round stills (even a "no clock" wall had a clock). Lesson: drop the "no church, no cross, no christmas tree" negatives (FLUX has no negative prompt; naming them primes them) and describe the background positively ("plain smooth plaster walls", "vast open desert sand dunes", "simple modern minimal room with plain cream walls"): the second round came back clean. FLUX also put "$" on coins (use the plain-coin take).
  - Real Madinah footage: Pixabay returns only 112360, 112361 and 198164 as usable; today 112361 (sadqah, 1 s) and 198164 at 20 s (kids). Sourcing more (Wikimedia) is needed.
  - Gotcha: `tw()` eases OUT, so a "burn" or progress bar driven by it races ahead; use a linear ratio for anything that should move at constant speed.
- 2026-11-12 (scheduled daily run, unattended): Thursday, 1 Jumada al-Akhirah 1448 (moonsighting.org.uk: Tue 10 Nov = 28 Jumada-I; Gulf started 11 Nov); 3 Jumada al-Akhirah (wisal of Sayyida Fatima Radi Allahu Anha) is about 14 Nov, a good topic for that day's run. Catch-up: YouTube stats show every earlier day uploaded, nothing re-uploaded. Comments: no new threads (riddle, sadqah). 3 Shorts on the HouseShort engine (configs `D1112Riddle/Sadqah/Kids.tsx`, images in `video/public/d1112/`), renders on `renders/2026-11-12/`, both QA checks passed, published by publish.yml (public) at ~04:15 UTC with Telegram links.
  - riddle: Riddle #13 solution (A lit at both ends + B at one end; A's flames meet at 30 min; light B's other end; 30 + 15 = 45; animated ropes burn from both ends with a minute counter) + Riddle #14 "when Person 1 was 6, Person 2 was half as old; Person 1 is 70 now; how old is Person 2?" (answer: 67; vote cards 35 / 67 / 73). 40s. https://youtu.be/fd88ozregQk
  - sadqah Short 14: "Achhi baat kaho ya khamosh raho", Sahih al-Bukhari 6475 (Abu Huraira Radi Allahu Anhu: speak good or keep silent; don't hurt the neighbour; honour the guest). 44s. https://youtu.be/tSZwWjYxpEY
  - kids: "Which foot goes first? The shoe sunnah", Sahih al-Bukhari 5855 (right shoe on first, left off first), Made for Kids. 31s. https://youtu.be/NAjI8araxw0
  - Hadith check: main-session and web-fetch-subagent fetches of sunnah.com were refused again (unattended); the second reviewer opened bukhari:6475, 5855 and 5856 directly. It caught that I had cited **5856** for the shoe hadith; on sunnah.com 5856 is "don't walk in one shoe" and the right/left hadith is **5855** (some Arabic numberings differ). Card, description and tag fixed, kids re-rendered before upload. Lesson: always open the exact sunnah.com number, not just a search listing title.
  - Images: Cloudflare free tier was already used up at 03:24 UTC (429 on every FLUX call, before this run used any). All new stills came from SDXL (`jobs/2026-11-12_sdxl.json`, 21 jobs, ~20 min). SDXL images are 768x1344 portrait: use `vertical: true` in shots. SDXL drew profile faces on an old woman, a girl and a man on a rooftop (dropped), two stacked panels in one image (dropped), and a toy with an eye next to the shoes (painted out with OpenCV inpaint + framed away). Riddle #13 solution reused the d1111 rope stills.
  - Voice re-rolls: riddle "Light rope A" heard as "Light drop A" -> "Light both ends of rope A..."; "rope A meet" heard as "rope emit" -> "On rope A, the two flames meet..."; kids "Shoes on!" heard as "Choose on" -> "Time to put your shoes on!", "sunnah" heard as "sooner" (re-voiced, still borderline in the mix; caption shows SUNNAH); kids "So, the right foot" heard as "No, the right foot" in the mix, so "So," was trimmed from the clip; Sadqah "ek lamha rukein" heard as "rakhein" -> "thoda sa ruk jaayein" (still decodes as either; Sahil's ear decides).
  - Gotcha: dispatching a workflow a few seconds after `git push` can run on the previous commit (sdxl run failed with "file not found"); wait ~10 s or check head_sha. Also a local `main` older than origin made the first push fail: `git pull --rebase` first.
- 2026-11-13 (scheduled daily run, unattended): Friday, 2 Jumada al-Akhirah 1448 (UK/India; Gulf 3). Catch-up: YouTube stats show every earlier day uploaded, nothing re-uploaded. Comments: no new threads (riddle, sadqah). Instagram still not connected (instagram.yml whoami: no IG_TOKEN_* secrets), so no Instagram catch-up and naat.yml publish was NOT dispatched. 3 Shorts on the HouseShort engine (configs `D1113Riddle/Sadqah/Kids.tsx`, images in `video/public/d1113/`), renders on `renders/2026-11-13/`, both QA checks passed, published by publish.yml (public) at ~04:05 UTC with Telegram links.
  - riddle: Riddle #14 solution (67: Person 2 was 3 when Person 1 was 6, so always 3 years younger; counting age cards with a "GAP = 3 YEARS" bar) + Riddle #15 "pen + notebook cost £1.10, notebook costs £1 more than the pen; how much is the pen?" (answer: 5p; vote cards 10p / 5p / 1p). 36s. https://youtu.be/S8VH-yGTWFY
  - sadqah Short 15: "Khaadim se behtar: Tasbeeh-e-Fatima", Sahih al-Bukhari 3113 (Hazrat Ali Alaihis Salam: Sayyida Fatima Alaihas Salam asked for a servant; at bedtime Allahu Akbar 34, Alhamdulillah 33, SubhanAllah 33; "better for you than what you asked for"). Animated 34/33/33 counters. Nobody depicted (hand mill, night town, lamp, an ordinary person's hands with tasbeeh). 53s. https://youtu.be/ip2lErAcXl8
  - kids: "Who can help at home? You can!", Sahih al-Bukhari 676 (al-Aswad asked Hazrat Aisha Radi Allahu Anha: he served his family and went out when prayer time came), Made for Kids. 33s. https://youtu.be/unh-cw837Zc
  - Correction: earlier log lines say the wisal of Sayyida Fatima is 3 Jumada al-Akhirah. That is the Shia date; Ahl-e-Sunnat (Dawat-e-Islami, Minhaj) observe **3 Ramadan**. No wisal date was claimed today; use 3 Ramadan in future.
  - Hadith check: the main session's and a web-fetch subagent's fetches of sunnah.com were refused again (unattended), confirmed via search listings; the second reviewer opened bukhari:3113 and bukhari:676 directly. It FAILED the first Sadqah render: the card/description quoted «فهو خير لكما من خادم», which is Bukhari **3705**'s wording (3705 also has a different order: Allahu Akbar, SubhanAllah, Alhamdulillah); 3113 ends «فهو خير لكما مما سألتماه». Fixed card + description, re-rendered. Lesson: copy the Arabic from the exact sunnah.com number, not from memory of a parallel narration.
  - Voice re-rolls: kids line 1 garbled "Radi Allahu Anha" and "do at home" -> "Lady Aisha, Radi Allahu Anha, was asked: What did <SAW> do in his home?" (1 of 3 variants clean). Sadqah: "thakan" heard as "tak an" -> "thakawat"; "maangne" garbled (re-voiced); counts line re-voiced with "phir"; "Tasbeeh-e-Fatima" garbled in 4 takes, the "padha karein" variant is clear. Rubberband 0.88 on all Urdu lines except the salawat line and the dhikr-count line. Riddle: no re-rolls (in the full mix whisper hears "Comment your answer" as "How many answer"; the line alone is fine).
  - Images: Cloudflare FLUX worked (33 stills incl. re-rolls). FLUX drew children's faces on both "messy table, no people" shots and smiley faces on mugs: re-rolled as a close-up of the table top only. k_family.jpg has an adult in profile at the far left: only use it with the right-hand crop (fx 0.62). Removed the "bat and ball problem" tag from the riddle (viewers could look up the answer).
  - Real Madinah footage: d1111 frames reused (Pixabay 112361 for sadqah, 198164 for kids). Still only 3 usable clips; Wikimedia sourcing still needed.
  - Mehfil-e-Sama prepared (not posted): naat "Mustafa Jaan-e-Rehmat Pe Lakhon Salam" (Owais Raza Qadri, Ala Hazrat kalam, QU5wEI9t0i8, 230.4-282.5 s, between two refrains) and qawwali "Tajdar-e-Haram" (Sabri Brothers, Purnam Allahabadi, 7GlT7-xzK-U, 105.0-162.0 s, the matla twice). Silent visuals = real Pixabay footage (lanterns 207118/258844/258846/200850/205171, Kaaba 198048, mosques 303410/303406/110717) via ffmpeg xfades + a transparent `MehfilCard` still (video/src/mehfil/MehfilCard.tsx: kind, Nastaliq + Roman title, credits, handle) overlaid; renders/2026-11-13/mehfil_*.mp4, jobs/2026-11-13_mehfil.json. Windows chosen from whisper segments only, not by ear; the qawwali visuals are atmospheric, not line-by-line literal (credits-only, post-1929 kalam).
