# media (encrypted)
Encrypted audio library for Mehfil-e-Sama (naat + qawwali). Every file is AES-256-CBC (pbkdf2, 200000 iterations)
with the repository's MASTER_KEY, so nothing here is playable or redistributable. Decrypted only inside GitHub Actions
(naat.yml) to cut a short credited clip that is posted to Instagram. Never commit decrypted audio anywhere.
audio/<youtubeId>.opus.enc = full track (Opus 80 kbps); CATALOG.csv = id, type, occasion, minutes, channel, title, url.
