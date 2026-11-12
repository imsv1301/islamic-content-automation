#!/usr/bin/env bash
# Serve <dir> over a temporary public HTTPS URL so Instagram can fetch the full-quality video (video_url).
# Uses a free Cloudflare quick tunnel (no account). Writes the base URL to /tmp/ig_base.
# Falls back to raw.githubusercontent.com (renders branch) if the tunnel can't start.
set -u
DIR="$1"
PROBE="${2:-}"   # a file (relative to DIR) to check through the tunnel; default: newest day's manifest.json
python3 -m http.server 8088 --directory "$DIR" >/tmp/http.log 2>&1 &
curl -sSL -o /tmp/cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 && chmod +x /tmp/cloudflared
nohup /tmp/cloudflared tunnel --no-autoupdate --url http://localhost:8088 >/tmp/cf.log 2>&1 &
BASE=""
for i in $(seq 1 45); do
  BASE=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' /tmp/cf.log | head -1)
  [ -n "$BASE" ] && break; sleep 2
done
if [ -n "$BASE" ]; then
  [ -z "$PROBE" ] && PROBE="$(cd "$DIR" && ls -d 20*/ | tail -1)manifest.json"
  for i in $(seq 1 20); do curl -sfI "$BASE/$PROBE" >/dev/null && break; sleep 3; done
fi
if [ -z "$BASE" ] || ! curl -sfI "$BASE/$PROBE" >/dev/null; then
  if [ -n "${NO_FALLBACK:-}" ]; then echo "tunnel not ready and no public fallback allowed"; exit 1; fi
  echo "tunnel not ready, falling back to raw.githubusercontent.com"
  BASE="https://raw.githubusercontent.com/${GITHUB_REPOSITORY}/renders"
fi
echo "$BASE" > /tmp/ig_base
echo "serving videos at $BASE"
