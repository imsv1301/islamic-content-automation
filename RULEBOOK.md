# Content automation rulebook (source of truth for every run)

## Channels
- YouTube (3): Islam for Little Ones @islamforlittleonestv (English, Made for Kids), One More Sadqah @one_more_sadqah (Urdu adult), Solve by Sunrise @solvebysunrise (English riddles).
- Instagram (4): @islamforlittleones (parent-facing), @raahesunnat.daily (hadith, English), @mehfil.e_sama (naat + qawwali), @solvebysunrise (question). DIY dropped for now.
- Approval: Telegram message ~05:30–06:00 UK; post only after ✅. Never post without approval.
- Narration: Sahil's cloned voice (OmniVoice zero-shot, approved 30 Oct 2026) on ALL channels, including Islam for Little Ones (from 31 Oct 2026: no Kokoro/AI voice any more). Urdu for One More Sadqah, English for kids + riddles. Always the tightened version: silence trimmed per line by pipeline/build_short.py, short gaps. Voice reference kept encrypted, never in the repo in plain form.

## Religious rules
- Ahle Sunnat wal Jamaat, Hanafi. Sources: Ala Hazrat school (Dawat-e-Islami library) + Dr Tahir-ul-Qadri (Minhaj Books). If they differ → drop the topic.
- Hadith: Bukhari, Muslim, Tirmidhi only (Tirmidhi: graded Sahih/Hasan, no Da'if grader). Always show reference; sunnah.com link in description.
- Salutation always in full: "Sallallahu Alaihi Wa Alihi Wasallam".
- Honorifics: Sahaba Radi Allahu Anhu/Anha; prophets & Panjatan Pak Alaihis Salam; Awliya Rahmatullahi Alaih.
- When a video mentions the Prophet (Sallallahu Alaihi Wa Alihi Wasallam): NEVER an AI-generated image of Masjid-e-Nabawi / the Green Dome. Use REAL Green Dome footage or photos only (Pixabay/Wikimedia via footage.yml, credited in the description). (Sahil, 1 Nov 2026)
- Never depict: the Prophet ﷺ, any prophet, Sahaba, Mothers of the Believers, Ahl-e-Bait/Panjatan Pak, Awliya, angels. Use light, calligraphy, places, objects.
- Common people: faceless, plain circle heads. No music in hadith/kids content. Nothing haram.
- Lyrics on screen only for pre-1929 poetry (Ala Hazrat etc.). Naat clips never cut a verse.

## Formats (locked)
- Hadith reel: test-4 "sea foam" narrated style (hook example → hadith word-by-word → metaphor → how → ledger → why → save).
- Kids episode: Ep1 "Al-Ameen" 2D style, 7–8 min, quiz + salawat outro; rotation: Seerah, values, practice (wudu/salah/ghusl, boys/girls separate where Hanafi differs), belief, Jumu'ah, Quran stories, quiz.
- Naat: REAL footage only (Pixabay/Wikimedia, credited; Pexels keys paused); two-line lyric (Nastaliq + Roman); credits; date-relevant choice.
- Qawwali: visuals show the literal meaning of each line (rose-petal reference style).
- Footage: never repeat the same clip inside one video; a clip may be reused only after ~10 videos (track in state/clip_log.json). Vary shot styles and transitions. Motion must be smooth: keep source fps, subpixel Ken Burns, no integer-crop jitter.
- Narrated videos: subtitles always Roman Urdu (Urdu words in English letters), even when the voice is Urdu. Urdu voice at a calm pace. Animation must match the locked hadith video's quality level (not necessarily its look).
- Question (Solve by Sunrise): English, Mind Hex structure (mystery hook, labelled numbers, question card, answer in next reel). NO salam / Assalamu alaikum in question videos. Characters have no names: "Person 1", "Person 2", ...

## Ops
- Skills before every script: trend-spotter, ig-viral, hook-mining, virality, going-viral, contagious, explainer-video, ig-human, ig-caption, cover-thumbnail-brief, best-time-scheduler.
- Comments: reply mostly English, match commenter language; never hide comments; flag abusive/fatwa questions to Sahil.
- Everything free. Renders on GitHub Actions (public repo). PC only for monthly naat audio batch.

- Daily run: see DAILY_RUNBOOK.md. Telegram preview by ~05:30–06:00 UK; uploads only after Sahil taps ✅ (approvals.yml). Free-text Telegram messages are never stored (public repo).
- HOUSE STYLE FOR ALL VIDEOS, ALL CHANNELS (approved by Sahil 31 Oct 2026; replaces the older per-channel looks): warm amber 3D-toon stills (Cloudflare Workers AI) + camera moves, HUD (DAY · time · place · RIDDLE #), claim cards, big captions, "Comment 1·2·3" vote ending. Faceless only: back views, silhouettes, blank egg-shaped heads. Template: video/src/day1/MysteryShort.tsx.
- Quality: YouTube and Instagram always get the full-quality master (1080x1920, 30fps, H.264 CRF 15, 320k AAC). Only Telegram previews are a small 720p copy.
- Comments, DMs and messages are managed around the clock: an hourly comment check (scheduled task "Sadqah Media comments") plus the daily run. Instagram DMs and comments get added once the Instagram accounts and Meta API exist.

- QUALITY GATE (Sahil, 6 Nov 2026): every video is checked twice before upload (automatic qa_check.py + an independent second review) for 1) authenticity, 2) pronunciation, 3) voice, and 4) every other rule here. publish.yml refuses anything that hasn't passed both.

- SALUTATION (6 Nov 2026, Sahil): whenever the Prophet is mentioned in narration, use Sahil's own recording. English: the whole phrase "our Prophet Muhammad-e-Mustafa, Sallallahu Ta'ala Alaihi Wa Aalihi Wasallam" (voice/salawat.wav.enc). Urdu: his recording of the whole phrase "Hamare Nabi Muhammad-e-Mustafa Sallallahu Ta'ala Alaihi Wa Aalihi Wasallam" (voice/salawat_ur.wav.enc). Both are (encrypted) and spliced wherever a voice line has <SAW>. Never TTS it. Captions, titles and descriptions use exactly that wording.
- VOICE (6 Nov 2026): the Urdu voice is now Sahil's OWN recording. The earlier Urdu reference was a friend's voice and has been replaced. Tone references (calm, warm, excited, serious) for Urdu and English are in voice/ref_<lang>_<style>.wav.enc.
