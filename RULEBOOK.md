# Content automation rulebook (source of truth for every run)

## Channels
- YouTube (3): Islam for Little Ones @islamforlittleonestv (English, Made for Kids), One More Sadqah @one_more_sadqah (Urdu adult), Solve by Sunrise @solvebysunrise (English riddles).
- Instagram (4): @islamforlittleones (parent-facing), @raahesunnat.daily (hadith: reposts the Urdu One More Sadqah Short, Sahil 12 Nov), @mehfil.e_sama (naat + qawwali), @solvebysunrise (question). DIY dropped for now.
- Approval: Telegram message ~05:30–06:00 UK; post only after ✅. Never post without approval.
- Narration: Sahil's cloned voice (OmniVoice zero-shot, approved 30 Oct 2026) on ALL channels, including Islam for Little Ones (from 31 Oct 2026: no Kokoro/AI voice any more). Urdu for One More Sadqah, English for kids + riddles. Always the tightened version: silence trimmed per line by pipeline/build_short.py, short gaps. Voice reference kept encrypted, never in the repo in plain form.

## Religious rules
- Ahle Sunnat wal Jamaat, Hanafi. Sources: Ala Hazrat school (Dawat-e-Islami library) + Dr Tahir-ul-Qadri (Minhaj Books). If they differ → drop the topic.
- Hadith: Bukhari, Muslim, Tirmidhi only (Tirmidhi: graded Sahih/Hasan, no Da'if grader). Always show reference; sunnah.com link in description.
- Salutation always in full: "Sallallahu Alaihi Wa Alihi Wasallam".
- Honorifics: Sahaba Radi Allahu Anhu/Anha; prophets & Panjatan Pak Alaihis Salam; Awliya Rahmatullahi Alaih.
- When a video mentions the Prophet (Sallallahu Alaihi Wa Alihi Wasallam): NEVER an AI-generated image of Masjid-e-Nabawi / the Green Dome. Use REAL Green Dome footage or photos only (Pixabay/Wikimedia via footage.yml, credited in the description). (Sahil, 1 Nov 2026)
- Never depict: the Prophet ﷺ, any prophet, Sahaba, Mothers of the Believers, Ahl-e-Bait/Panjatan Pak, Awliya, angels. Use light, calligraphy, places, objects.
- Ordinary people: drawn characters WITH faces are allowed (Sahil, 13 Nov 2026), in the code-animated style (rig: hadith-v4-remotion src/qawwali/anim/Seeker.tsx). Still never the protected figures above; nothing haram is ever animated (no deity, idol, another faith's marks, wine); no halo-like light behind a character's head. No music in hadith/kids content.
- Lyrics on screen only for pre-1929 poetry (Ala Hazrat etc.). Naat clips never cut a verse.

## Formats (locked)
- Hadith reel: test-4 "sea foam" narrated style (hook example → hadith word-by-word → metaphor → how → ledger → why → save).
- Kids episode: Ep1 "Al-Ameen" 2D style, 7–8 min, quiz + salawat outro; rotation: Seerah, values, practice (wudu/salah/ghusl, boys/girls separate where Hanafi differs), belief, Jumu'ah, Quran stories, quiz.
- Naat (Sahil, 13 Nov 2026): Green Dome / Madina views (REAL footage, Pixabay/Wikimedia, credited) chosen to follow the lyrics line by line, no characters, no character animation; big beat-synced lyric words (same as qawwali) + two-line lyric (Nastaliq + Roman), only for pre-1929 poetry; credits; date-relevant choice.
- Qawwali (Sahil approved, 13 Nov 2026): fully code-animated story reel (hadith-v4-remotion src/qawwali/anim/QawwaliAnim.tsx): an ordinary young seeker with a face acts out each line in drawn, moving scenes; big lyric words land on the singer's syllables and pulse on the beat; Urdu + English line underneath; credit end card. The Beloved is only ever light. No rotating/spinning text, no tool branding. Lyrics only for pre-1929 poetry (e.g. Khusrau, Bulleh Shah).
- Footage: never repeat the same clip inside one video; a clip may be reused only after ~10 videos (track in state/clip_log.json). Vary shot styles and transitions. Motion must be smooth: keep source fps, subpixel Ken Burns, no integer-crop jitter.
- Narrated videos: subtitles always Roman Urdu (Urdu words in English letters), even when the voice is Urdu. Urdu voice at a calm pace. Animation must match the locked hadith video's quality level (not necessarily its look).
- Question (Solve by Sunrise): English, Mind Hex structure (mystery hook, labelled numbers, question card, answer in next reel). NO salam / Assalamu alaikum in question videos. Characters have no names: "Person 1", "Person 2", ...

## Ops
- Skills before every script: trend-spotter, ig-viral, hook-mining, virality, going-viral, contagious, explainer-video, ig-human, ig-caption, cover-thumbnail-brief, best-time-scheduler.
- Comments: reply mostly English, match commenter language; never hide comments; flag abusive/fatwa questions to Sahil.
- Everything free. Renders on GitHub Actions (public repo). PC only for monthly naat audio batch.

- Daily run: see DAILY_RUNBOOK.md. Telegram preview by ~05:30–06:00 UK; uploads only after Sahil taps ✅ (approvals.yml). Free-text Telegram messages are never stored (public repo).
- HOUSE STYLE FOR ALL VIDEOS, ALL CHANNELS (approved by Sahil 31 Oct 2026; replaces the older per-channel looks): warm amber 3D-toon stills (Cloudflare Workers AI) + camera moves, HUD (DAY · time · place · RIDDLE #), claim cards, big captions, "Comment 1·2·3" vote ending. Template: video/src/day1/MysteryShort.tsx. **Change (Sahil, 13 Nov 2026): YouTube videos move from still images to real code-drawn animation (characters with faces that move, blink, talk and walk; animated sets), same quality as the approved qawwali sample. Faces allowed. Until each channel's animated kit is approved, the old still-image style continues.**
- Quality: YouTube and Instagram always get the full-quality master (1080x1920, 30fps, H.264 CRF 15, 320k AAC). Only Telegram previews are a small 720p copy.
- Comments, DMs and messages are managed around the clock: an hourly check (scheduled task "Sadqah Media comments") covers YouTube comments plus Instagram comments and DMs on all 4 accounts, and the daily run does the same.
- Instagram (since 12 Nov 2026): every daily video also goes to Instagram as a Reel at full quality, through the official Instagram API (Meta app "Sadqah Media Publisher", free). kids -> @islamforlittleones, sadqah (Urdu hadith Short, same video) -> @raahesunnat.daily, riddle -> @solvebysunrise. publish.yml does YouTube + Instagram together and sends one Telegram message.
- Mehfil-e-Sama (@mehfil.e_sama): **one naat + one qawwali every day** (Sahil, 12 Nov). Short credited clips only (15-90 s, complete verses, never cut mid-verse), from the encrypted library on the `media` branch (naat.yml). Caption always credits the reciter/qawwal by name and the original upload. If Instagram gives any copyright notice, mute, or removal: stop Mehfil-e-Sama posting and tell Sahil on Telegram at once.
- Instagram DMs: only reply to people who wrote to us first (24 h window). Never follow, like, or message anyone first. Same tone and limits as comments; fatwa or sensitive questions are flagged to Sahil, not answered.

- QUALITY GATE (Sahil, 6 Nov 2026): every video is checked twice before upload (automatic qa_check.py + an independent second review) for 1) authenticity, 2) pronunciation, 3) voice, and 4) every other rule here. publish.yml refuses anything that hasn't passed both.

- SALUTATION (6 Nov 2026, Sahil): whenever the Prophet is mentioned in narration, use Sahil's own recording. English: the whole phrase "our Prophet Muhammad-e-Mustafa, Sallallahu Ta'ala Alaihi Wa Aalihi Wasallam" (voice/salawat.wav.enc). Urdu: his recording of the whole phrase "Hamare Nabi Muhammad-e-Mustafa Sallallahu Ta'ala Alaihi Wa Aalihi Wasallam" (voice/salawat_ur.wav.enc). Both are (encrypted) and spliced wherever a voice line has <SAW>. Never TTS it. Captions, titles and descriptions use exactly that wording.
- VOICE (6 Nov 2026): the Urdu voice is now Sahil's OWN recording. The earlier Urdu reference was a friend's voice and has been replaced. Tone references (calm, warm, excited, serious) for Urdu and English are in voice/ref_<lang>_<style>.wav.enc.
